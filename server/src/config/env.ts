import dotenv from 'dotenv';
dotenv.config();

const defaultClientUrl = 'http://localhost:5173';

/**
 * Origins allowed for CORS. Includes both http and https for the same host when not localhost,
 * so CLIENT_URL=http://….vercel.app still works when the site is served over https.
 */
export function getCorsAllowedOrigins(): Set<string> {
  const set = new Set<string>();
  const add = (raw: string) => {
    const base = raw.trim().replace(/\/$/, '');
    if (!base) return;
    set.add(base);
    try {
      const u = new URL(base);
      if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return;
      if (u.protocol === 'http:') {
        set.add(`https://${u.host}`);
      } else if (u.protocol === 'https:') {
        set.add(`http://${u.host}`);
      }
    } catch {
      /* ignore malformed */
    }
  };
  add(process.env.CLIENT_URL ?? defaultClientUrl);
  for (const part of (process.env.CLIENT_URLS ?? '').split(',')) add(part);
  return set;
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'fallback-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
  PORT: parseInt(process.env.PORT ?? '3001', 10),
  CLIENT_URL: process.env.CLIENT_URL ?? defaultClientUrl,
  SMTP_HOST: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT ?? '587', 10),
  SMTP_USER: process.env.SMTP_USER ?? '',
  SMTP_PASS: process.env.SMTP_PASS ?? '',
  EMAIL_FROM: process.env.EMAIL_FROM ?? 'Мёд из Кадымки <noreply@kadmed.ru>',
};
