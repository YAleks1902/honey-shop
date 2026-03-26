import { Router } from 'express';
import { getBlogPosts, getBlogPost } from '../controllers/blog.controller';

const router = Router();
router.get('/', getBlogPosts);
router.get('/:slug', getBlogPost);

export default router;
