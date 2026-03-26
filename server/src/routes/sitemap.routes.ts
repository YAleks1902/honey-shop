import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/catalog', priority: '0.9', changefreq: 'daily' },
  { url: '/blog', priority: '0.8', changefreq: 'weekly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/delivery', priority: '0.7', changefreq: 'monthly' },
  { url: '/contacts', priority: '0.6', changefreq: 'monthly' },
];

router.get('/', async (_req: Request, res: Response) => {
  const baseUrl = process.env.CLIENT_URL ?? 'http://localhost:5173';

  const [products, blogPosts] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const urls = [
    ...STATIC_PAGES.map((p) => `
  <url>
    <loc>${baseUrl}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
    ...products.map((p) => `
  <url>
    <loc>${baseUrl}/catalog/${p.slug}</loc>
    <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`),
    ...blogPosts.map((p) => `
  <url>
    <loc>${baseUrl}/blog/${p.slug}</loc>
    <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`),
  ].join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  res.header('Content-Type', 'application/xml').send(xml);
});

export default router;
