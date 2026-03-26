import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorites.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getFavorites);
router.post('/:productId', authenticate, addFavorite);
router.delete('/:productId', authenticate, removeFavorite);

export default router;
