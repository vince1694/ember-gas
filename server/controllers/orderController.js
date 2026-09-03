import expressAsyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public / Private
const addOrderItems = expressAsyncHandler(async (req, res) => {
    const {
        id,
        orderId,
        size,
        cylinderSize,
        serviceType,
        address,
        total,
        amount,
        customerName,
        userEmail,
        customerPhone,
        phone,
        vendorName,
        sellerName,
        vendorEmail,
        sellerEmail,
        orderType,
        assignedTo,
        itemsSummary,
        status
    } = req.body;

    const finalOrderId = id || orderId || ('EG-' + Math.floor(1000 + Math.random() * 9000));
    const finalSize = size || cylinderSize || '12.5';
    const finalTotal = Number(total || amount || 0);

    const isStoreAccessory = orderType === 'STORE_ACCESSORY' ||
        serviceType === 'new_cylinder' ||
        serviceType === 'accessories' ||
        assignedTo === 'admin';

    const finalOrderType = isStoreAccessory ? 'STORE_ACCESSORY' : 'REFILL';
    const finalAssignedTo = isStoreAccessory ? 'admin' : (assignedTo || 'vendor');
    const finalSellerName = vendorName || sellerName || (isStoreAccessory ? 'EmberGas Admin Store' : 'Station Depot');
    const finalSellerEmail = (sellerEmail || vendorEmail || (isStoreAccessory ? 'admin@embergas.ng' : '')).toLowerCase().trim();

    const newOrder = new Order({
        orderNumber: '#' + finalOrderId,
        customer: req.user ? req.user._id : null,
        customerName: customerName || (req.user ? req.user.name : 'Valued Customer'),
        customerPhone: customerPhone || phone || (req.user ? req.user.phone : '—'),
        customerEmail: (userEmail || (req.user ? req.user.email : '')).toLowerCase().trim(),
        sellerName: finalSellerName,
        sellerEmail: finalSellerEmail,
        orderType: finalOrderType,
        serviceType: serviceType || (isStoreAccessory ? 'new_cylinder' : 'refill'),
        assignedTo: finalAssignedTo,
        itemsSummary: itemsSummary || '',
        cylinderSize: String(finalSize).includes('kg') ? String(finalSize) : finalSize + 'kg',
        totalAmount: finalTotal,
        deliveryAddress: address || '—',
        status: status || (isStoreAccessory ? 'PENDING_ADMIN' : 'ORDER_CONFIRMED')
    });

    const createdOrder = await newOrder.save();
    res.status(201).json({
        id: finalOrderId,
        orderNumber: newOrder.orderNumber,
        size: finalSize,
        cylinderSize: newOrder.cylinderSize,
        serviceType: newOrder.serviceType,
        orderType: newOrder.orderType,
        assignedTo: newOrder.assignedTo,
        itemsSummary: newOrder.itemsSummary,
        total: finalTotal,
        amount: finalTotal,
        totalAmount: finalTotal,
        address: address || '—',
        deliveryAddress: newOrder.deliveryAddress,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        customerEmail: newOrder.customerEmail,
        userEmail: newOrder.customerEmail,
        vendorName: newOrder.sellerName,
        sellerName: newOrder.sellerName,
        vendorEmail: newOrder.sellerEmail,
        sellerEmail: newOrder.sellerEmail,
        status: newOrder.status,
        _id: createdOrder._id,
        createdAt: createdOrder.createdAt
    });
});

// @desc    Get orders for customer or vendor
// @route   GET /api/orders
// @access  Public / Private
const getOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(150);
    const enriched = orders.map(o => {
        const obj = o.toObject();
        return {
            ...obj,
            id: obj.orderNumber ? obj.orderNumber.replace('#', '') : obj._id,
            vendorName: obj.sellerName,
            vendorEmail: obj.sellerEmail,
            userEmail: obj.customerEmail || obj.userEmail || '',
            amount: obj.totalAmount,
            total: obj.totalAmount
        };
    });
    res.json(enriched);
});

// @desc    Get customer orders
// @route   GET /api/orders/myorders
// @access  Public / Private
const getMyOrders = expressAsyncHandler(async (req, res) => {
    const filter = req.user ? { customer: req.user._id } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public / Private
const updateOrderStatus = expressAsyncHandler(async (req, res) => {
    const { status, vendorName, sellerName, vendorEmail, sellerEmail } = req.body;
    const orderIdParam = req.params.id || '';
    const cleanId = orderIdParam.replace(/^#+/, '');

    let order = await Order.findById(orderIdParam).catch(() => null);
    if (!order) {
        order = await Order.findOne({ orderNumber: '#' + cleanId }) ||
                await Order.findOne({ orderNumber: cleanId }) ||
                await Order.findOne({ orderNumber: orderIdParam });
    }

    if (order) {
        if (status) order.status = status;
        // When vendor accepts, lock the order to that vendor station in MongoDB
        if (vendorName || sellerName) order.sellerName = vendorName || sellerName || order.sellerName;
        if (sellerEmail || vendorEmail) order.sellerEmail = (sellerEmail || vendorEmail || order.sellerEmail).toLowerCase().trim();
        const updated = await order.save();
        res.json({ message: 'Order status updated', status: updated.status, id: orderIdParam, orderNumber: order.orderNumber });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

export { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
