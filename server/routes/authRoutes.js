import express from 'express';
import {
    registerUser,
    authUser,
    getUserProfile,
    updateUserProfile,
    sendOtp,
    verifyOtp,
    deleteAccount,
    getUsersByRole,
    notifyEmail,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/delete-account', deleteAccount);
router.get('/users-by-role/:role', getUsersByRole);
router.post('/notify-email', notifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

export default router;


