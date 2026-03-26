import path from 'path';
import { spawnSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

function shouldRunMigrations(): boolean {
  if (process.env.SKIP_PRISMA_MIGRATE === '1') return false;
  const onRailway = typeof process.env.RAILWAY_ENVIRONMENT !== 'undefined';
  const prod = process.env.NODE_ENV === 'production';
  return prod || onRailway;
}

function spawnMigrateDeploy(serverRoot: string, prismaBin: string): number {
  const result = spawnSync(prismaBin, ['migrate', 'deploy'], {
    cwd: serverRoot,
    stdio: 'inherit',
    env: process.env,
  });
  return result.status ?? 1;
}

/** True if core tables exist (not only _prisma_migrations). */
async function categoriesTableExists(prisma: PrismaClient): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'categories'
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

/**
 * Runs migrate deploy. If Prisma says "done" but public.categories is missing (ghost
 * _prisma_migrations / wrong DB / partial failure), drop migration history and redeploy.
 */
export async function runMigrationsOnStartup(): Promise<void> {
  if (!shouldRunMigrations()) return;

  const serverRoot = path.join(__dirname, '..');
  const prismaBin = path.join(serverRoot, 'node_modules', '.bin', 'prisma');

  console.log('[startup] prisma migrate deploy…');
  let code = spawnMigrateDeploy(serverRoot, prismaBin);
  if (code !== 0) {
    console.error('[startup] prisma migrate deploy failed (exit', code, ')');
    process.exit(code);
  }

  let prisma = new PrismaClient();
  try {
    let hasCategories = await categoriesTableExists(prisma);
    if (!hasCategories) {
      console.warn(
        '[startup] No public.categories after migrate — dropping _prisma_migrations and redeploying…',
      );
      await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "_prisma_migrations" CASCADE');
      await prisma.$disconnect();

      code = spawnMigrateDeploy(serverRoot, prismaBin);
      if (code !== 0) {
        console.error('[startup] second prisma migrate deploy failed (exit', code, ')');
        process.exit(code);
      }

      prisma = new PrismaClient();
      hasCategories = await categoriesTableExists(prisma);
      if (!hasCategories) {
        console.error(
          '[startup] categories table still missing. Check DATABASE_URL on the API service matches this Postgres plugin (same project, referenced variable).',
        );
        process.exit(1);
      }
      console.log('[startup] Migrations repaired; tables created.');
    }
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}
