import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

const productSelect = {
  id: true,
  name: true,
  slug: true,
  shortDescription: true,
  imageUrl: true,
  harvestDate: true,
  state: true,
  crystalSize: true,
  isFeatured: true,
  stock: true,
  category: { select: { id: true, name: true, slug: true } },
  variants: {
    select: { id: true, volume: true, priceCents: true, oldPriceCents: true, discountPercent: true },
    orderBy: { priceCents: 'asc' as const },
  },
};

/**
 * GET /api/products
 */
export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, search, sort, minPrice, maxPrice, page = '1', limit = '9' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const where: Record<string, unknown> = { isActive: true };
    if (category) where.category = { slug: category };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch all matching products (price sort and filter require in-memory processing)
    const isPriceSort = sort === 'price_asc' || sort === 'price_desc';
    const hasPriceFilter = minPrice || maxPrice;
    const needsInMemory = isPriceSort || hasPriceFilter;

    type ProductResult = Awaited<ReturnType<typeof prisma.product.findMany<{ select: typeof productSelect }>>>[number];

    let products: ProductResult[];
    let total: number;

    if (needsInMemory) {
      const all = await prisma.product.findMany({
        where,
        select: productSelect,
        orderBy: sort === 'name_asc' ? { name: 'asc' } : { createdAt: 'desc' },
      });

      const minPriceNum = minPrice ? parseInt(minPrice as string, 10) : null;
      const maxPriceNum = maxPrice ? parseInt(maxPrice as string, 10) : null;

      const filtered = all.filter((p) => {
        if (!p.variants.length) return true;
        const min = Math.min(...p.variants.map((v) => v.priceCents));
        if (minPriceNum !== null && min < minPriceNum) return false;
        if (maxPriceNum !== null && min > maxPriceNum) return false;
        return true;
      });

      if (sort === 'price_asc') {
        filtered.sort((a, b) => {
          const aMin = a.variants.length ? Math.min(...a.variants.map((v) => v.priceCents)) : 0;
          const bMin = b.variants.length ? Math.min(...b.variants.map((v) => v.priceCents)) : 0;
          return aMin - bMin;
        });
      } else if (sort === 'price_desc') {
        filtered.sort((a, b) => {
          const aMin = a.variants.length ? Math.min(...a.variants.map((v) => v.priceCents)) : 0;
          const bMin = b.variants.length ? Math.min(...b.variants.map((v) => v.priceCents)) : 0;
          return bMin - aMin;
        });
      }

      total = filtered.length;
      products = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    } else {
      const orderBy: Record<string, unknown> = sort === 'name_asc' ? { name: 'asc' } : { createdAt: 'desc' };
      [products, total] = await Promise.all([
        prisma.product.findMany({ where, select: productSelect, orderBy, skip: (pageNum - 1) * limitNum, take: limitNum }),
        prisma.product.count({ where }),
      ]) as [ProductResult[], number];
    }

    res.json({
      success: true,
      data: {
        products,
        pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/featured
 */
export async function getFeaturedProducts(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      select: productSelect,
      take: 6,
    });
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/popular
 */
export async function getPopularProducts(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: productSelect,
      take: 3,
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:slug
 */
export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      select: {
        ...productSelect,
        fullDescription: true,
        reviews: {
          select: {
            id: true,
            authorName: true,
            authorCity: true,
            comment: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) return next(new AppError(404, 'Товар не найден'));
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}
