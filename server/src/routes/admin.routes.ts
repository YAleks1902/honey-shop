import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import {
  getDashboard,
  adminListProducts, adminGetProduct, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminListOrders, adminUpdateOrderStatus,
  adminListCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  adminListBlogPosts, adminCreateBlogPost, adminUpdateBlogPost, adminDeleteBlogPost,
  adminListUsers,
} from '../controllers/admin.controller';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboard);

router.get('/products', adminListProducts);
router.get('/products/:id', adminGetProduct);
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

router.get('/orders', adminListOrders);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

router.get('/categories', adminListCategories);
router.post('/categories', adminCreateCategory);
router.put('/categories/:id', adminUpdateCategory);
router.delete('/categories/:id', adminDeleteCategory);

router.get('/blog', adminListBlogPosts);
router.post('/blog', adminCreateBlogPost);
router.put('/blog/:id', adminUpdateBlogPost);
router.delete('/blog/:id', adminDeleteBlogPost);

router.get('/users', adminListUsers);

export default router;
