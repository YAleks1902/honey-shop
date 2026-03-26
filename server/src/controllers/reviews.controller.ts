import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const createReviewSchema = z.object({
  authorName: z.string().min(1, 'Укажите имя'),
  authorCity: z.string().optional(),
  comment: z.string().min(3, 'Отзыв слишком короткий'),
});

/**
 * GET /api/reviews/:productId
 */
export async function getProductReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/reviews/:productId
 */
export async function createReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const product = await prisma.product.findUnique({ where: { id: req.params.productId } });
    if (!product) return next(new AppError(404, 'Товар не найден'));

    const review = await prisma.review.create({
      data: {
        productId: req.params.productId,
        userId: req.userId ?? null,
        ...parsed.data,
      },
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
}
