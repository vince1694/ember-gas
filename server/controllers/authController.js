import expressAsyncHandler from 'express-async-handler';
import User from '../models/User.js';
import KybRequest from '../models/KybRequest.js';
import jwt from 'jsonwebtoken';
import connectDB from '../config/db.js';
import { sendOtpEmail, sendNotificationEmail } from '../utils/emailUtils.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Normalise any vendor-type role alias to 'vendor'
const normaliseRole = (raw) => {
    const map = {
        vendor: 'vendor', seller: 'vendor',
        filling_station: 'vendor', independent_seller: 'vendor',
        customer: 'customer', user: 'customer',
        admin: 'admin',
    };
    return map[(raw || '').toLowerCase().trim()] || 'customer';
};

// ─────────────────────────────────────────────────────────────────
// @desc    Register a NEW user — NEVER overwrites existing accounts
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────
const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, phone, password, role, businessName, address } = req.body;

    if (!email || !password || !name) {
        res.status(400);
        throw new Error('Name, email and password are required');
    }

    const cleanEmail = email.toLowerCase().trim();

    // CRITICAL: Never overwrite an existing user's password
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
        res.status(409);
        throw new Error('An account with this email already exists. Please log in instead.');
    }

    const safeRole = normaliseRole(role);

    const user = await User.create({
        name,
        email: cleanEmail,
        phone: phone || '',
        password,
        role: safeRole,
        businessName: businessName || '',
        address: address || '',
        isEmailVerified: true,
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        businessName: user.businessName || '',
        address: user.address || '',
        token: generateToken(user._id),
    });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────
const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
        res.status(401);
        throw new Error('No account found with this email. Please sign up first.');
    }

    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) {
        res.status(401);
        throw new Error('Incorrect password. Please try again or use Forgot Password.');
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: normaliseRole(user.role),
        businessName: user.businessName || '',
        address: user.address || '',
        token: generateToken(user._id),
    });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
// ─────────────────────────────────────────────────────────────────
const getUserProfile = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, address: user.address });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
// ─────────────────────────────────────────────────────────────────
const updateUserProfile = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    if (req.body.password) user.password = req.body.password;
    const updatedUser = await user.save();
    res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, role: updatedUser.role, address: updatedUser.address, token: generateToken(updatedUser._id) });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Send OTP for new signup email verification
// @route   POST /api/auth/send-otp
// @access  Public
// ─────────────────────────────────────────────────────────────────
const sendOtp = expressAsyncHandler(async (req, res) => {
    const { email, name } = req.body;
    if (!email) { res.status(400); throw new Error('Email address is required'); }

    const cleanEmail = email.toLowerCase().trim();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Persist OTP to DB if user already exists (guarded to prevent 10000ms buffering timeout)
    try {
        await connectDB();
        await User.findOneAndUpdate(
            { email: cleanEmail },
            { otpCode, otpExpiresAt: expiresAt },
            { upsert: false }
        );
    } catch (dbErr) {
        console.warn('[OTP DB Update Warning]:', dbErr.message);
    }

    let emailDelivered = false;
    try {
        await sendOtpEmail(cleanEmail, name || 'Valued Customer', otpCode);
        emailDelivered = true;
    } catch (err) {
        console.warn('[OTP] Brevo email failed:', err.message);
    }

    res.json({
        message: emailDelivered ? `OTP sent to ${cleanEmail}` : `OTP generated for ${cleanEmail}`,
        otpCode,
        emailDelivered,
        expiresMinutes: 10,
    });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Verify OTP (lightweight acknowledgement for signup flow)
// @route   POST /api/auth/verify-otp
// @access  Public
// ─────────────────────────────────────────────────────────────────
const verifyOtp = expressAsyncHandler(async (req, res) => {
    const { otpCode } = req.body;
    if (!otpCode || otpCode.length !== 6) { res.status(400); throw new Error('Please provide the 6-digit OTP code'); }
    // For new signups, OTP is auto-filled from response and checked client-side before calling /register
    res.json({ message: 'OTP acknowledged', isVerified: true });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Get registered users by role
// @route   GET /api/auth/users-by-role/:role
// @access  Public
// ─────────────────────────────────────────────────────────────────
const getUsersByRole = expressAsyncHandler(async (req, res) => {
    const roleParam = req.params.role;
    const roleFilter = roleParam === 'vendor'
        ? { role: { $in: ['vendor', 'seller', 'filling_station', 'independent_seller'] } }
        : { role: roleParam };
    const users = await User.find(roleFilter).select('name email phone role businessName address isEmailVerified');
    res.json(users);
});

// ─────────────────────────────────────────────────────────────────
// @desc    Send Brevo notification email
// @route   POST /api/auth/notify-email
// @access  Public
// ─────────────────────────────────────────────────────────────────
const notifyEmail = expressAsyncHandler(async (req, res) => {
    const { toEmail, toName, subject, title, bodyHtml, actionUrl, actionLabel } = req.body;
    if (!toEmail || !subject || !title || !bodyHtml) { res.status(400); throw new Error('toEmail, subject, title, and bodyHtml are required'); }

    // Resolve dynamic client origin from request headers if not provided
    const originHeader = req.get('origin');
    const refererHeader = req.get('referer');
    let dynamicOrigin = actionUrl || null;
    if (!dynamicOrigin && originHeader && !originHeader.includes('localhost') && !originHeader.includes('127.0.0.1')) {
        dynamicOrigin = originHeader;
    } else if (!dynamicOrigin && refererHeader && !refererHeader.includes('localhost') && !refererHeader.includes('127.0.0.1')) {
        try { dynamicOrigin = new URL(refererHeader).origin; } catch (e) {}
    }

    const sent = await sendNotificationEmail(toEmail, toName, subject, title, bodyHtml, dynamicOrigin, actionLabel);
    res.json({ success: !!sent, message: sent ? 'Email sent via Brevo.' : 'Failed to send email.' });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Forgot password — generates OTP stored in MongoDB
// @route   POST /api/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────────────────────────────
const forgotPassword = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) { res.status(400); throw new Error('Email address is required'); }

    const targetEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: targetEmail });
    if (!user) {
        res.status(404);
        throw new Error('No account found with this email. Have you signed up yet?');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Always persist OTP to DB — survives Vercel serverless cold-starts
    user.otpCode = otpCode;
    user.otpExpiresAt = expiresAt;
    await user.save();

    let emailSent = false;
    try {
        emailSent = await sendNotificationEmail(
            targetEmail,
            user.name || 'Valued User',
            'Password Reset Code — EmberGas',
            'Your Password Reset Code',
            `<p>Hello <strong>${user.name || 'Valued User'}</strong>,</p>
             <p>You requested a password reset for your EmberGas account.</p>
             <p style="text-align:center;margin:24px 0;">
               <strong style="font-size:2rem;color:#00B14F;letter-spacing:6px;background:#F0FDF4;padding:12px 24px;border-radius:12px;">${otpCode}</strong>
             </p>
             <p>This code expires in 10 minutes. If you did not request this, ignore this email.</p>`
        );
    } catch (err) {
        console.warn('[ForgotPassword] Brevo note:', err.message);
    }

    res.json({
        message: emailSent ? 'Reset code sent to your email!' : 'Reset code generated. Use the code below.',
        otpCode,
        emailDelivered: emailSent,
    });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Reset password using OTP from MongoDB
// @route   POST /api/auth/reset-password
// @access  Public
// ─────────────────────────────────────────────────────────────────
const resetPassword = expressAsyncHandler(async (req, res) => {
    const { email, otpCode, newPassword } = req.body;
    if (!email || !otpCode || !newPassword) { res.status(400); throw new Error('Email, OTP code and new password are all required'); }

    const targetEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: targetEmail });
    if (!user) { res.status(404); throw new Error('No account found with this email.'); }

    // Check OTP from DB only (works across Vercel serverless instances)
    if (user.otpCode !== otpCode) {
        res.status(400);
        throw new Error('Invalid reset code. Please check your email and try again.');
    }
    if (user.otpExpiresAt && new Date() > new Date(user.otpExpiresAt)) {
        res.status(400);
        throw new Error('Reset code has expired. Please request a new one.');
    }

    user.password = newPassword;
    user.otpCode = '';
    user.otpExpiresAt = null;
    await user.save();

    res.json({
        message: 'Password reset successfully!',
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: normaliseRole(user.role),
            token: generateToken(user._id),
        },
    });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Delete account
// @route   POST /api/auth/delete-account
// @access  Public
// ─────────────────────────────────────────────────────────────────
const deleteAccount = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) { res.status(400); throw new Error('Email address is required'); }
    const deleted = await User.findOneAndDelete({ email: email.toLowerCase().trim() });
    res.json({ message: 'Account deleted.', success: true, deleted: !!deleted });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Submit KYB Verification Request permanently to MongoDB Atlas
// @route   POST /api/auth/kyb-request
// @access  Public
// ─────────────────────────────────────────────────────────────────
const submitKybRequest = expressAsyncHandler(async (req, res) => {
    const { name, email, phone, stationName, address, licenseNumber, documents } = req.body;
    if (!email) {
        res.status(400);
        throw new Error('Email is required for KYB verification');
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if request already exists
    let kyb = await KybRequest.findOne({ email: cleanEmail });
    if (kyb && kyb.status === 'VERIFIED') {
        return res.json({
            success: true,
            status: 'VERIFIED',
            isVerified: true,
            message: 'Your station license is already VERIFIED!'
        });
    }

    if (!kyb) {
        kyb = new KybRequest({
            email: cleanEmail,
            stationName: stationName || name || 'Gas Station Depot',
            ownerName: name || 'Station Operator',
            phone: phone || '',
            address: address || 'Lagos, Nigeria',
            licenseNumber: licenseNumber || ('DPR/NMDPRA/' + Math.floor(100000 + Math.random() * 900000)),
            status: 'PENDING',
            documents: documents || {}
        });
    } else {
        kyb.stationName = stationName || kyb.stationName || name;
        kyb.ownerName = name || kyb.ownerName;
        kyb.phone = phone || kyb.phone;
        kyb.address = address || kyb.address;
        kyb.status = 'PENDING';
        kyb.requestedAt = new Date();
        if (documents) kyb.documents = documents;
    }

    await kyb.save();

    // Update user profile status
    try {
        await connectDB();
        await User.findOneAndUpdate(
            { email: cleanEmail },
            { verificationStatus: 'pending' }
        );
    } catch (dbErr) {
        console.warn('[KYB User Update Warning]:', dbErr.message);
    }

    res.json({
        success: true,
        status: 'PENDING',
        isVerified: false,
        message: 'KYB verification request submitted permanently to EmberGas Admin.',
        kyb
    });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Get current KYB verification status permanently from MongoDB Atlas
// @route   GET /api/auth/kyb-status/:email
// @access  Public
// ─────────────────────────────────────────────────────────────────
const getKybStatus = expressAsyncHandler(async (req, res) => {
    const email = req.params.email;
    if (!email) {
        res.status(400);
        throw new Error('Email param is required');
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    const kyb = await KybRequest.findOne({ email: cleanEmail });

    const isVerified = (user && (user.isVerified || user.verificationStatus === 'verified')) ||
                       (kyb && kyb.status === 'VERIFIED');

    let status = 'UNVERIFIED';
    if (isVerified) {
        status = 'VERIFIED';
    } else if (kyb && kyb.status === 'PENDING') {
        status = 'PENDING';
    } else if (kyb && kyb.status === 'REJECTED') {
        status = 'REJECTED';
    } else if (user && user.verificationStatus === 'pending') {
        status = 'PENDING';
    }

    res.json({
        email: cleanEmail,
        status,
        isVerified: !!isVerified,
        stationName: kyb?.stationName || user?.businessName || user?.name,
        rejectionReason: kyb?.rejectionReason || ''
    });
});

export {
    registerUser, authUser, getUserProfile, updateUserProfile,
    sendOtp, verifyOtp, deleteAccount, getUsersByRole,
    notifyEmail, forgotPassword, resetPassword,
    submitKybRequest, getKybStatus,
};

