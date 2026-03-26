import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendOrderConfirmation } from '../utils/email';

const prisma = new PrismaClient();

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().positive(),
    priceCents: z.number().int().positive(),
  })).min(1, 'Корзина пуста'),
  shippingMethod: z.enum(['courier', 'warehouse', 'store']),
  paymentMethod: z.enum(['card', 'qiwi', 'apple_pay']),
  shippingName: z.string().min(1, 'Укажите имя'),
  shippingPhone: z.string().min(1, 'Укажите телефон'),
  shippingAddress: z.string().optional(),
  orderComment: z.string().optional(),
});

const DELIVERY_PRICES: Record<string, number> = {
  courier: 30000,
  warehouse: 0,
  store: 0,
};

/**
 * POST /api/orders
 */
export async function createOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.data ? 'Ошибка валидации' : parsed.error.errors[0].message));
    }

    const { items, shippingMethod, paymentMethod, shippingName, shippingPhone, shippingAddress, orderComment } = parsed.data;
    const deliveryCents = DELIVERY_PRICES[shippingMethod] ?? 0;
    const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0) + deliveryCents;

    const order = await prisma.order.create({
      data: {
        userId: req.userId ?? null,
        totalCents,
        deliveryCents,
        shippingMethod,
        paymentMethod,
        shippingName,
        shippingPhone,
        shippingAddress,
        orderComment,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            priceCents: item.priceCents,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: { select: { name: true, imageUrl: true } },
            variant: { select: { volume: true } },
          },
        },
      },
    });

    // Send confirmation email if user has email on file
    if (req.userId) {
      try {
        const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { email: true } });
        if (user?.email) {
          await sendOrderConfirmation(user.email, {
            orderId: order.id,
            items: order.items.map((i) => ({
              name: i.product.name,
              volume: i.variant?.volume,
              quantity: i.quantity,
              priceCents: i.priceCents,
            })),
            totalCents: order.totalCents,
            deliveryCents: order.deliveryCents,
            shippingMethod: order.shippingMethod,
          });
        }
      } catch (emailErr) {
        console.error('Failed to send order confirmation email:', emailErr);
      }
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders
 */
export async function getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return next(new AppError(401, 'Необходима авторизация'));

    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true, slug: true } },
            variant: { select: { volume: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id
 */
export async function getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true, slug: true } },
            variant: { select: { volume: true } },
          },
        },
      },
    });

    if (!order) return next(new AppError(404, 'Заказ не найден'));
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}
