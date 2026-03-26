import { Router } from 'express';
import { getProductReviews, createReview } from '../controllers/reviews.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/:productId', getProductReviews);
router.post('/:productId', optionalAuth, createReview);

export default router;
