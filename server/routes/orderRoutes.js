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
    .post(addOrderItems)
    .get(getOrders);

router.get('/myorders', getMyOrders);
router.put('/:id/status', updateOrderStatus);

export default router;
