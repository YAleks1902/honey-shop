import { Router } from 'express';
import { getProfile, updateProfile, updateAddress } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/address', authenticate, updateAddress);

export default router;
