import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from './auth';
import { AppError } from './errorHandler';

const prisma = new PrismaClient();

export async function requireAdmin(req: AuthRequest, _res: Response, next: NextFunction) {
  if (!req.userId) return next(new AppError(401, 'Необходима авторизация'));
  const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { isAdmin: true } });
  if (!user?.isAdmin) return next(new AppError(403, 'Доступ запрещён'));
  next();
}
