import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

/**
 * GET /api/favorites
 */
export async function getFavorites(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return next(new AppError(401, 'Необходима авторизация'));

    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      include: {
        product: {
          select: {
            id: true, name: true, slug: true, imageUrl: true, shortDescription: true,
            variants: { select: { id: true, volume: true, priceCents: true, oldPriceCents: true, discountPercent: true }, orderBy: { priceCents: 'asc' as const }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: favorites.map((f) => f.product) });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/favorites/:productId
 */
export async function addFavorite(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return next(new AppError(401, 'Необходима авторизация'));

    const { productId } = req.params;
    await prisma.favorite.upsert({
      where: { userId_productId: { userId: req.userId, productId } },
      create: { userId: req.userId, productId },
      update: {},
    });

    res.json({ success: true, data: { productId } });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/favorites/:productId
 */
export async function removeFavorite(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return next(new AppError(401, 'Необходима авторизация'));

    const { productId } = req.params;
    await prisma.favorite.deleteMany({ where: { userId: req.userId, productId } });

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
