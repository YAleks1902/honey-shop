import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/orders.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);

export default router;
