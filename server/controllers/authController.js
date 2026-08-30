import expressAsyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendOtpEmail, sendNotificationEmail } from '../utils/emailUtils.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        phone,
        password,
        role: role || 'user',
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            address: user.address,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            address: user.address,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            address: user.address,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            address: updatedUser.address,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// ─── In-Memory OTP Store (works for new signups before user exists in DB) ─────
// Map<email, { code: string, expiresAt: Date }>
const otpStore = new Map();

// @desc    Send OTP to user email/phone
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = expressAsyncHandler(async (req, res) => {
    const { email, phone, name } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Email address is required to send OTP');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Always store in memory — works for both new & existing users
    otpStore.set(email.toLowerCase(), { code: otpCode, expiresAt });

    // Also persist to DB if user already exists
    const user = await User.findOne({ email });
    if (user) {
        user.otpCode = otpCode;
        user.otpExpiresAt = expiresAt;
        await user.save();
    }

    // Send OTP email via Brevo REST API v3 to the user-provided email
    const recipientName = name || user?.name || 'Valued Customer';
    try {
        await sendOtpEmail(email, recipientName, otpCode);
        console.log(`[OTP] Brevo email dispatched to: ${email}`);
    } catch (err) {
        console.error('[OTP] Brevo email dispatch failed:', err.message);
        otpStore.delete(email.toLowerCase());
        res.status(500);
        throw new Error(`OTP email could not be delivered to ${email}. Please check the email address and try again.`);
    }

    res.json({ message: `OTP sent successfully to ${email}`, expiresMinutes: 10 });
});

// @desc    Verify 6-digit OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = expressAsyncHandler(async (req, res) => {
    const { email, phone, otpCode } = req.body;

    if (!otpCode || otpCode.length !== 6) {
        res.status(400);
        throw new Error('Please provide the 6-digit OTP code');
    }

    const key = email?.toLowerCase();
    const stored = otpStore.get(key);

    // Check in-memory store first (covers new signups + existing users)
    if (stored) {
        if (new Date() > stored.expiresAt) {
            otpStore.delete(key);
            res.status(400);
            throw new Error('OTP code has expired. Please request a new one.');
        }
        if (stored.code !== otpCode) {
            res.status(400);
            throw new Error('Incorrect OTP code. Check your email and try again.');
        }
        // Valid — clear from store
        otpStore.delete(key);

        // Mark user as verified in DB if they exist
        const user = await User.findOne({ email });
        if (user) {
            user.isEmailVerified = true;
            user.otpCode = '';
            await user.save();
        }

        return res.json({ message: 'OTP verified successfully', isVerified: true });
    }

    // Fallback: check DB (legacy path)
    let user = await User.findOne({ email });
    if (!user && phone) user = await User.findOne({ phone });

    if (user && user.otpCode === otpCode) {
        user.isEmailVerified = true;
        user.otpCode = '';
        await user.save();
        return res.json({ message: 'OTP verified successfully', isVerified: true });
    }

    res.status(400);
    throw new Error('Invalid or expired OTP code. Request a new one.');
});

// @desc    Delete user account permanently
// @route   POST /api/auth/delete-account
// @access  Public
const deleteAccount = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Email address is required to delete account');
    }

    const targetEmail = email.toLowerCase();
    const deletedUser = await User.findOneAndDelete({ email: targetEmail });
    otpStore.delete(targetEmail);

    res.json({
        message: `Account ${email} has been permanently deleted from database.`,
        success: true,
        deleted: !!deletedUser
    });
});

// @desc    Get registered users by role (e.g. vendors, riders)
// @route   GET /api/auth/users-by-role/:role
// @access  Public
const getUsersByRole = expressAsyncHandler(async (req, res) => {
    const roleParam = req.params.role;
    const users = await User.find({ role: roleParam }).select('name email phone role isEmailVerified');
    res.json(users);
});

// @desc    Send notification email via Brevo REST API v3
// @route   POST /api/auth/notify-email
// @access  Public
const notifyEmail = expressAsyncHandler(async (req, res) => {
    const { toEmail, toName, subject, title, bodyHtml } = req.body;
    if (!toEmail || !subject || !title || !bodyHtml) {
        res.status(400);
        throw new Error('toEmail, subject, title, and bodyHtml are required');
    }

    const sent = await sendNotificationEmail(toEmail, toName, subject, title, bodyHtml);
    res.json({ success: !!sent, message: sent ? 'Email notification sent via Brevo.' : 'Failed to send email.' });
});

export { registerUser, authUser, getUserProfile, updateUserProfile, sendOtp, verifyOtp, deleteAccount, getUsersByRole, notifyEmail };


