import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { runMigrationsOnStartup } from './runMigrations';

import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import categoriesRoutes from './routes/categories.routes';
import ordersRoutes from './routes/orders.routes';
import favoritesRoutes from './routes/favorites.routes';
import reviewsRoutes from './routes/reviews.routes';
import usersRoutes from './routes/users.routes';
import adminRoutes from './routes/admin.routes';
import blogRoutes from './routes/blog.routes';
import sitemapRoutes from './routes/sitemap.routes';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);

app.use('/sitemap.xml', sitemapRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

async function main() {
  await runMigrationsOnStartup();
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

export default app;
