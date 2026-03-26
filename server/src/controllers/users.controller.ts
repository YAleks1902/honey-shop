import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { hashPassword, comparePassword } from '../utils/password';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

const updateAddressSchema = z.object({
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  courierComment: z.string().optional(),
});

/**
 * GET /api/users/profile
 */
export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return next(new AppError(401, 'Необходима авторизация'));

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, country: true, city: true, address: true,
        courierComment: true, createdAt: true,
      },
    });

    if (!user) return next(new AppError(404, 'Пользователь не найден'));
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/users/profile
 */
export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return next(new AppError(401, 'Необходима авторизация'));

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const { currentPassword, newPassword, ...fields } = parsed.data;

    const updateData: Record<string, unknown> = { ...fields };

    if (newPassword) {
      if (!currentPassword) return next(new AppError(400, 'Укажите текущий пароль'));
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (!user) return next(new AppError(404, 'Пользователь не найден'));
      const valid = await comparePassword(currentPassword, user.passwordHash);
      if (!valid) return next(new AppError(400, 'Неверный текущий пароль'));
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, country: true, city: true, address: true, courierComment: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/users/address
 */
export async function updateAddress(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return next(new AppError(401, 'Необходима авторизация'));

    const parsed = updateAddressSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: parsed.data,
      select: {
        id: true, phone: true, country: true, city: true, address: true, courierComment: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
