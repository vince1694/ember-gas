import expressAsyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Seller from '../models/Seller.js';
import KybRequest from '../models/KybRequest.js';
import PlatformSettings from '../models/PlatformSettings.js';
import { sendNotificationEmail } from '../utils/emailUtils.js';

// Helper to get or init platform settings
const getOrCreateSettings = async () => {
    let settings = await PlatformSettings.findOne({ key: 'global_config' });
    if (!settings) {
        settings = await PlatformSettings.create({
            key: 'global_config',
            ceilingPricePerKg: 1250,
            platformCommissionPercent: 4.5,
            storeProducts: [
                { name: 'Standard 12.5kg Steel Cylinder', price: 28500, image: 'cooking_gas_image_v3.png', desc: 'Heavy duty certified ISO LPG cylinder with safety valve.', category: 'Cylinders', stock: 45, isAvailable: true },
                { name: 'Compact 6kg Camping Cylinder', price: 16500, image: 'new_cylinder.png', desc: 'Portable cooking cylinder ideal for kitchenettes or backup.', category: 'Cylinders', stock: 30, isAvailable: true },
                { name: 'Smart High-Precision Gas Regulator', price: 7800, image: 'new_cylinder.png', desc: 'Zero-leak regulator with integrated pressure gauge display.', category: 'Regulators', stock: 65, isAvailable: true },
                { name: 'Wireless Smart LPG Leak Detector', price: 14500, image: 'new_cylinder.png', desc: 'Instant audible siren & smartphone alarm trigger for gas leaks.', category: 'Safety', stock: 22, isAvailable: true },
                { name: 'Industrial Grade Reinforced Gas Hose (2m)', price: 4200, image: 'cooking_gas_image_v3.png', desc: 'Anti-burst rubber hose with stainless steel tightening clips.', category: 'Accessories', stock: 90, isAvailable: true }
            ],
            auditLogs: [
                { action: 'Platform Initialization', detail: 'Enterprise admin control center initialized with live Atlas sync.', performedBy: 'System' }
            ]
        });
    }
    return settings;
};

// ─────────────────────────────────────────────────────────────────
// @desc    Get real-time permanent website overview & progress KPIs
// @route   GET /api/admin/overview
// @access  Public / Admin Protected
// ─────────────────────────────────────────────────────────────────
export const getAdminOverview = expressAsyncHandler(async (req, res) => {
    // 1. Permanent User Counts
    const allUsers = await User.find({}).select('role isVerified verificationStatus createdAt');
    const totalUsers = allUsers.length;
    
    let customersCount = 0;
    let vendorsCount = 0;
    let verifiedVendorsCount = 0;

    allUsers.forEach(u => {
        const r = (u.role || '').toLowerCase();
        if (r === 'vendor' || r === 'seller' || r === 'filling_station' || r === 'independent_seller') {
            vendorsCount++;
            if (u.isVerified || u.verificationStatus === 'verified') {
                verifiedVendorsCount++;
            }
        } else if (r !== 'admin') {
            customersCount++;
        }
    });

    // 2. Permanent Orders & Revenue
    const allOrders = await Order.find({}).sort({ createdAt: -1 });
    const totalOrders = allOrders.length;

    let totalGmv = 0;
    let deliveredOrdersCount = 0;
    let inTransitCount = 0;
    let pendingOrdersCount = 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let todayOrdersCount = 0;
    let todayRevenue = 0;

    allOrders.forEach(o => {
        const amt = Number(o.totalAmount || 0);
        totalGmv += amt;

        const st = (o.status || '').toUpperCase();
        if (st === 'DELIVERED') deliveredOrdersCount++;
        else if (st === 'ON_THE_WAY' || st === 'RIDER_PICKING_UP' || st === 'READY_FOR_PICKUP') inTransitCount++;
        else pendingOrdersCount++;

        if (o.createdAt && new Date(o.createdAt) >= startOfToday) {
            todayOrdersCount++;
            todayRevenue += amt;
        }
    });

    // 3. KYB Requests from MongoDB
    const allKybReqs = await KybRequest.find({});
    const pendingKybCount = allKybReqs.filter(k => k.status === 'PENDING').length;
    const verifiedKybCount = allKybReqs.filter(k => k.status === 'VERIFIED').length;

    // 4. Platform Settings
    const settings = await getOrCreateSettings();
    const commissionRate = settings.platformCommissionPercent || 4.5;
    const netPlatformRevenue = Math.round(totalGmv * (commissionRate / 100));

    // 5. Website Progress towards targets
    const vendorTarget = 25; // Milestone: 25 verified stations
    const orderTarget = 100; // Milestone: 100 platform orders
    const gmvTarget = 1500000; // Milestone: ₦1.5m GMV

    const vendorProgressPct = Math.min(100, Math.round(((verifiedVendorsCount || 1) / vendorTarget) * 100));
    const orderProgressPct = Math.min(100, Math.round((Math.max(totalOrders, 1) / orderTarget) * 100));
    const gmvProgressPct = Math.min(100, Math.round((Math.max(totalGmv, 10000) / gmvTarget) * 100));
    const deliveryRatePct = totalOrders > 0 ? Math.round((deliveredOrdersCount / totalOrders) * 100) : 100;

    res.json({
        success: true,
        metrics: {
            totalUsers,
            customersCount,
            vendorsCount,
            verifiedVendorsCount,
            pendingKybCount,
            verifiedKybCount,
            totalOrders,
            deliveredOrdersCount,
            inTransitCount,
            pendingOrdersCount,
            totalGmv,
            netPlatformRevenue,
            todayOrdersCount,
            todayRevenue,
            ceilingPricePerKg: settings.ceilingPricePerKg,
            commissionRate,
        },
        progress: {
            vendorProgressPct,
            vendorTarget,
            orderProgressPct,
            orderTarget,
            gmvProgressPct,
            gmvTarget,
            deliveryRatePct,
        },
        recentOrders: allOrders.slice(0, 8),
        dbConnected: true,
        timestamp: new Date().toISOString(),
    });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Get all permanent KYB verification requests
// @route   GET /api/admin/kyb
// @access  Public / Admin Protected
// ─────────────────────────────────────────────────────────────────
export const getKybRequests = expressAsyncHandler(async (req, res) => {
    // Read from permanent KybRequest collection
    let requests = await KybRequest.find({}).sort({ createdAt: -1 });

    // Ensure all vendor users who submitted verification are synced
    const vendorUsers = await User.find({
        role: { $in: ['vendor', 'seller', 'filling_station', 'independent_seller'] }
    });

    for (const v of vendorUsers) {
        const cleanEmail = (v.email || '').toLowerCase().trim();
        const exists = requests.find(r => r.email && r.email.toLowerCase() === cleanEmail);
        if (!exists) {
            // Auto-create a tracked KYB record if user is marked verified or pending
            const initialStatus = (v.isVerified || v.verificationStatus === 'verified') ? 'VERIFIED' : 'PENDING';
            const newReq = await KybRequest.create({
                vendor: v._id,
                stationName: v.businessName || v.name || 'Station Depot',
                ownerName: v.name || 'Owner',
                email: cleanEmail,
                phone: v.phone || '',
                address: v.address || 'Lagos, Nigeria',
                status: initialStatus,
                documents: v.documents || {},
                licenseNumber: 'DPR/NMDPRA/' + Math.floor(100000 + Math.random() * 900000),
                requestedAt: v.createdAt || new Date(),
            });
            requests.unshift(newReq);
        }
    }

    res.json(requests);
});

// ─────────────────────────────────────────────────────────────────
// @desc    Review (Approve or Reject) a vendor KYB request permanently
// @route   POST /api/admin/kyb/:id/review
// @access  Public / Admin Protected
// ─────────────────────────────────────────────────────────────────
export const reviewKybRequest = expressAsyncHandler(async (req, res) => {
    const { status, reason, reviewer } = req.body;
    const reqId = req.params.id;

    if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status. Must be VERIFIED, REJECTED, or PENDING');
    }

    let kyb = await KybRequest.findById(reqId).catch(() => null);
    if (!kyb) {
        // Fallback: search by email if passed
        kyb = await KybRequest.findOne({ email: reqId.toLowerCase().trim() });
    }

    if (!kyb) {
        res.status(404);
        throw new Error('KYB Verification Request not found');
    }

    kyb.status = status;
    kyb.reviewedAt = new Date();
    kyb.reviewedBy = reviewer || 'Super Admin';
    if (reason) kyb.rejectionReason = reason;
    await kyb.save();

    // PERMANENTLY UPDATE USER IN MONGODB ATLAS
    const isApproved = status === 'VERIFIED';
    const cleanEmail = kyb.email.toLowerCase().trim();

    const updatedUser = await User.findOneAndUpdate(
        { email: cleanEmail },
        {
            isVerified: isApproved,
            verificationStatus: status.toLowerCase(),
        },
        { new: true }
    );

    // Also update any Seller collection entry if exists
    await Seller.updateMany(
        { phone: kyb.phone },
        { isVerified: isApproved }
    );

    // Record in Audit Log
    const settings = await getOrCreateSettings();
    settings.auditLogs.unshift({
        action: isApproved ? 'KYB License Approved' : 'KYB License Rejected',
        detail: `Station "${kyb.stationName}" (${kyb.email}) marked as ${status}. ${reason ? 'Reason: ' + reason : ''}`,
        performedBy: reviewer || 'Super Admin',
        timestamp: new Date()
    });
    if (settings.auditLogs.length > 50) settings.auditLogs = settings.auditLogs.slice(0, 50);
    await settings.save();

    // Trigger notification email via Brevo if approved/rejected
    try {
        if (isApproved) {
            await sendNotificationEmail(
                cleanEmail,
                kyb.ownerName || kyb.stationName,
                '🎉 Your EmberGas Vendor KYB License is Approved!',
                'KYB Verification Approved',
                `<p>Congratulations <strong>${kyb.ownerName || kyb.stationName}</strong>!</p>
                 <p>Your business license for <strong>${kyb.stationName}</strong> has been officially verified by the EmberGas Compliance Team.</p>
                 <p>Your station is now fully unlocked to receive live customer cooking gas orders and accept refill dispatch requests across the platform.</p>`
            );
        } else if (status === 'REJECTED') {
            await sendNotificationEmail(
                cleanEmail,
                kyb.ownerName || kyb.stationName,
                'EmberGas KYB Verification Update — Action Required',
                'KYB License Review Notice',
                `<p>Hello <strong>${kyb.ownerName || kyb.stationName}</strong>,</p>
                 <p>Our compliance team reviewed your station verification request. Additional documentation or corrections are required:</p>
                 <blockquote style="background:#FEF2F2;border-left:4px solid #EF4444;padding:12px;color:#991B1B;">${reason || 'License credentials could not be validated. Please update your business registration documents.'}</blockquote>
                 <p>Please log in to your vendor dashboard to review and resubmit your documents.</p>`
            );
        }
    } catch (emailErr) {
        console.warn('[KYB Email Notice Error]:', emailErr.message);
    }

    res.json({
        success: true,
        message: `Station KYB status permanently updated to ${status}`,
        kyb,
        user: updatedUser
    });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Get all users permanently from MongoDB
// @route   GET /api/admin/users
// @access  Public / Admin Protected
// ─────────────────────────────────────────────────────────────────
export const getAdminUsers = expressAsyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password');
    res.json(users);
});

// ─────────────────────────────────────────────────────────────────
// @desc    Update user status / role in MongoDB
// @route   PUT /api/admin/users/:id
// @access  Public / Admin Protected
// ─────────────────────────────────────────────────────────────────
export const updateAdminUser = expressAsyncHandler(async (req, res) => {
    const { role, isVerified, verificationStatus, phone, businessName, address } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found in database');
    }

    if (role) user.role = role;
    if (typeof isVerified === 'boolean') user.isVerified = isVerified;
    if (verificationStatus) user.verificationStatus = verificationStatus;
    if (phone !== undefined) user.phone = phone;
    if (businessName !== undefined) user.businessName = businessName;
    if (address !== undefined) user.address = address;

    const updated = await user.save();
    res.json({ success: true, user: updated });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Delete user permanently from MongoDB
// @route   DELETE /api/admin/users/:id
// @access  Public / Admin Protected
// ─────────────────────────────────────────────────────────────────
export const deleteAdminUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    await User.findByIdAndDelete(req.params.id);
    // Also remove any KYB request for this user
    await KybRequest.deleteMany({ email: user.email.toLowerCase() });
    res.json({ success: true, message: `Account ${user.email} removed permanently.` });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Get all live orders permanently from MongoDB
// @route   GET /api/admin/orders
// @access  Public / Admin Protected
// ─────────────────────────────────────────────────────────────────
export const getAdminOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
});

// ─────────────────────────────────────────────────────────────────
// @desc    Update order status / assignment permanently
// @route   PUT /api/admin/orders/:id
// @access  Public / Admin Protected
// ─────────────────────────────────────────────────────────────────
export const updateAdminOrder = expressAsyncHandler(async (req, res) => {
    const { status, riderName, riderPhone } = req.body;
    const order = await Order.findById(req.params.id).catch(() => null);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (status) order.status = status;
    if (riderName) order.rider = { ...(order.rider || {}), name: riderName, phone: riderPhone || order.rider?.phone };

    const updated = await order.save();
    res.json({ success: true, order: updated });
});

// ─────────────────────────────────────────────────────────────────
// @desc    Get permanent platform settings & store products
// @route   GET /api/admin/settings
// @access  Public / Admin Protected
// ─────────────────────────────────────────────────────────────────
export const getAdminSettings = expressAsyncHandler(async (req, res) => {
    const settings = await getOrCreateSettings();
    res.json(settings);
});

// ─────────────────────────────────────────────────────────────────
// @desc    Update permanent platform settings & store products
// @route   POST /api/admin/settings
// @access  Public / Admin Protected
// ─────────────────────────────────────────────────────────────────
export const updateAdminSettings = expressAsyncHandler(async (req, res) => {
    const { ceilingPricePerKg, platformCommissionPercent, storeProducts, addProduct, removeProductId, performedBy } = req.body;
    const settings = await getOrCreateSettings();

    if (ceilingPricePerKg) {
        settings.ceilingPricePerKg = Number(ceilingPricePerKg);
        settings.auditLogs.unshift({
            action: 'Ceiling Price Enforced',
            detail: `Market ceiling price set to ₦${ceilingPricePerKg} / KG`,
            performedBy: performedBy || 'Super Admin',
            timestamp: new Date()
        });
    }

    if (platformCommissionPercent !== undefined) {
        settings.platformCommissionPercent = Number(platformCommissionPercent);
    }

    if (storeProducts && Array.isArray(storeProducts)) {
        settings.storeProducts = storeProducts;
    }

    if (addProduct) {
        settings.storeProducts.unshift(addProduct);
        settings.auditLogs.unshift({
            action: 'New Store Product Added',
            detail: `Added "${addProduct.name}" priced at ₦${addProduct.price}`,
            performedBy: performedBy || 'Super Admin',
            timestamp: new Date()
        });
    }

    if (removeProductId) {
        settings.storeProducts = settings.storeProducts.filter(p => String(p._id) !== String(removeProductId));
    }

    if (settings.auditLogs.length > 50) {
        settings.auditLogs = settings.auditLogs.slice(0, 50);
    }

    const updated = await settings.save();
    res.json({ success: true, settings: updated });
});
