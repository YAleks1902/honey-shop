import path from 'path';
import { spawnSync } from 'child_process';

/**
 * Runs `prisma migrate deploy` from the server package root (parent of dist/).
 * Ensures tables exist on Railway when preDeploy does not run (wrong cwd / monorepo layout).
 */
export function runMigrationsIfProduction(): void {
  if (process.env.SKIP_PRISMA_MIGRATE === '1') return;
  const onRailway = typeof process.env.RAILWAY_ENVIRONMENT !== 'undefined';
  const prod = process.env.NODE_ENV === 'production';
  if (!prod && !onRailway) return;

  const serverRoot = path.join(__dirname, '..');
  const prismaBin = path.join(serverRoot, 'node_modules', '.bin', 'prisma');

  console.log('[startup] prisma migrate deploy…');
  const result = spawnSync(prismaBin, ['migrate', 'deploy'], {
    cwd: serverRoot,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    console.error('[startup] prisma migrate deploy failed (exit', result.status, ')');
    process.exit(result.status ?? 1);
  }
}
