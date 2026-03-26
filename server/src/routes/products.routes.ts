import { Router } from 'express';
import { getProducts, getFeaturedProducts, getPopularProducts, getProductBySlug } from '../controllers/products.controller';

const router = Router();

router.get('/featured', getFeaturedProducts);
router.get('/popular', getPopularProducts);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

export default router;
