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
    notifyEmail
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
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

export default router;


