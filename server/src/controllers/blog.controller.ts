import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export async function getBlogPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, createdAt: true,
        author: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
}

export async function getBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: req.params.slug, isPublished: true },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
    if (!post) return next(new AppError(404, 'Статья не найдена'));
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}
