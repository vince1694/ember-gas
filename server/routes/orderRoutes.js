import express from 'express';
import {
    addOrderItems,
    getMyOrders,
    getOrders,
    updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, vendor, getOrders);

router.get('/myorders', protect, getMyOrders);
router.put('/:id/status', protect, vendor, updateOrderStatus);

export default router;
