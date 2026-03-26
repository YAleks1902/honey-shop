import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// ───────────────────────────── Dashboard ──────────────────────────────

export async function getDashboard(_req: Request, res: Response, next: NextFunction) {
  try {
    const [totalOrders, totalProducts, totalUsers, recentOrders, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: { select: { name: true } } } } },
      }),
      prisma.order.aggregate({ _sum: { totalCents: true } }),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenueCents: revenue._sum.totalCents ?? 0,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ───────────────────────────── Products ───────────────────────────────

const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  slug: z.string().min(1, 'Slug обязателен').regex(/^[a-z0-9-]+$/, 'Только строчные буквы, цифры и дефисы'),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  imageUrl: z.string().optional(),
  categoryId: z.string().min(1, 'Выберите категорию'),
  harvestDate: z.string().optional(),
  state: z.string().optional(),
  crystalSize: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  stock: z.number().int().min(0).optional().default(0),
  variants: z.array(z.object({
    id: z.string().optional(),
    volume: z.string().min(1),
    priceCents: z.number().int().positive(),
    oldPriceCents: z.number().int().positive().optional(),
    discountPercent: z.number().int().min(0).max(100).optional(),
  })).min(1, 'Добавьте хотя бы один вариант'),
});

export async function adminListProducts(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { name: true, slug: true } },
        variants: { orderBy: { priceCents: 'asc' } },
        _count: { select: { orderItems: true, reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function adminGetProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, variants: { orderBy: { priceCents: 'asc' } } },
    });
    if (!product) return next(new AppError(404, 'Товар не найден'));
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function adminCreateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const { variants, ...productData } = parsed.data;
    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (existing) return next(new AppError(409, 'Товар с таким slug уже существует'));

    const product = await prisma.product.create({
      data: { ...productData, variants: { create: variants } },
      include: { variants: true, category: true },
    });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));

    const { variants, ...productData } = parsed.data;

    await prisma.productVariant.deleteMany({ where: { productId: req.params.id } });
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { ...productData, variants: { create: variants.map(({ id: _id, ...v }) => v) } },
      include: { variants: true, category: true },
    });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

// ───────────────────────────── Orders ─────────────────────────────────

export async function adminListOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const where = status ? { status: status as string } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          items: { include: { product: { select: { name: true, imageUrl: true } }, variant: { select: { volume: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: { orders, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } },
    });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, paymentStatus } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) return next(new AppError(400, 'Недопустимый статус'));

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
    });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

// ───────────────────────────── Categories ─────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  imageUrl: z.string().optional(),
});

export async function adminListCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function adminCreateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));
    const category = await prisma.category.create({ data: parsed.data });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));
    const category = await prisma.category.update({ where: { id: req.params.id }, data: parsed.data });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

// ───────────────────────────── Blog ───────────────────────────────────

const blogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
  isPublished: z.boolean().optional().default(false),
});

export async function adminListBlogPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
}

export async function adminCreateBlogPost(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  try {
    const parsed = blogPostSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));
    const post = await prisma.blogPost.create({ data: { ...parsed.data, authorId: req.userId ?? null } });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = blogPostSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError(400, parsed.error.errors[0].message));
    const post = await prisma.blogPost.update({ where: { id: req.params.id }, data: parsed.data });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

// ───────────────────────────── Users ──────────────────────────────────

export async function adminListUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, email: true, firstName: true, lastName: true, isAdmin: true, createdAt: true, _count: { select: { orders: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.user.count(),
    ]);
    res.json({ success: true, data: { users, pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) } } });
  } catch (err) {
    next(err);
  }
}
