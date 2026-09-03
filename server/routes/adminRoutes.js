import express from 'express';
import {
    getAdminOverview,
    getKybRequests,
    reviewKybRequest,
    getAdminUsers,
    updateAdminUser,
    deleteAdminUser,
    getAdminOrders,
    updateAdminOrder,
    getAdminSettings,
    updateAdminSettings
} from '../controllers/adminController.js';

const router = express.Router();

// Overview & live website progress
router.get('/overview', getAdminOverview);

// KYB Verification management
router.get('/kyb', getKybRequests);
router.post('/kyb/:id/review', reviewKybRequest);

// Platform User Registry
router.get('/users', getAdminUsers);
router.put('/users/:id', updateAdminUser);
router.delete('/users/:id', deleteAdminUser);

// Order Dispatch Stream
router.get('/orders', getAdminOrders);
router.put('/orders/:id', updateAdminOrder);

// Platform Global Settings & Store
router.get('/settings', getAdminSettings);
router.post('/settings', updateAdminSettings);

export default router;
