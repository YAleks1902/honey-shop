import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { hashPassword, comparePassword } from '../utils/password';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendPasswordReset } from '../utils/email';
import crypto from 'crypto';

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль не менее 6 символов'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
  rememberMe: z.boolean().optional(),
});

function generateTokens(userId: string) {
  const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
  const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
  return { accessToken, refreshToken };
}

/**
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const { email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return next(new AppError(409, 'Пользователь с таким email уже существует'));
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, isVerified: true },
    });

    const { accessToken, refreshToken } = generateTokens(user.id);
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, parsed.error.errors[0].message));
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError(401, 'Неверный email или пароль'));
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return next(new AppError(401, 'Неверный email или пароль'));
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 */
export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (req.userId) {
      await prisma.user.update({ where: { id: req.userId }, data: { refreshToken: null } });
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 */
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError(401, 'Refresh token не предоставлен'));
    }

    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError(401, 'Недействительный refresh token'));
    }

    const tokens = generateTokens(user.id);
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

    res.json({ success: true, data: tokens });
  } catch {
    next(new AppError(401, 'Недействительный refresh token'));
  }
}

/**
 * POST /api/auth/forgot-password
 */
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError(400, 'Укажите email'));

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      });
      const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;
      await sendPasswordReset(email, resetUrl);
    }
    // Always return success to prevent email enumeration
    res.json({ success: true, data: { message: 'Ссылка на восстановление пароля отправлена на вашу почту' } });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/reset-password
 */
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body;
    if (!token || !password) return next(new AppError(400, 'Токен и пароль обязательны'));

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });
    if (!user) return next(new AppError(400, 'Ссылка недействительна или устарела'));

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(password), resetToken: null, resetTokenExpiry: null },
    });
    res.json({ success: true, data: { message: 'Пароль успешно изменён' } });
  } catch (err) {
    next(err);
  }
}
