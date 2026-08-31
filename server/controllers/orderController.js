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
        vendorName,
        vendorEmail,
        status
    } = req.body;

    const finalOrderId = id || orderId || ('EG-' + Math.floor(1000 + Math.random() * 9000));
    const finalSize = size || cylinderSize || '12.5';
    const finalTotal = Number(total || amount || 13750);

    const newOrder = new Order({
        orderNumber: '#' + finalOrderId,
        customer: req.user ? req.user._id : null,
        customerName: customerName || (req.user ? req.user.name : 'Valued Customer'),
        customerPhone: req.user ? req.user.phone : '—',
        sellerName: vendorName || 'Grace LPG Depot Hub',
        cylinderSize: String(finalSize).includes('kg') ? String(finalSize) : finalSize + 'kg',
        totalAmount: finalTotal,
        deliveryAddress: address || '—',
        status: status || 'ORDER_CONFIRMED'
    });

    const createdOrder = await newOrder.save();
    res.status(201).json({
        id: finalOrderId,
        size: finalSize,
        cylinderSize: String(finalSize).includes('kg') ? String(finalSize) : finalSize + 'kg',
        serviceType: serviceType || 'refill',
        total: finalTotal,
        amount: finalTotal,
        address: address || '—',
        customerName: newOrder.customerName,
        userEmail: userEmail || (req.user ? req.user.email : ''),
        vendorName: newOrder.sellerName,
        status: newOrder.status,
        _id: createdOrder._id,
        createdAt: createdOrder.createdAt
    });
});

// @desc    Get orders for customer or vendor
// @route   GET /api/orders
// @access  Public / Private
const getOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(orders);
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
    const { status } = req.body;
    const orderIdParam = req.params.id;

    let order = await Order.findById(orderIdParam).catch(() => null);
    if (!order) {
        order = await Order.findOne({ orderNumber: '#' + orderIdParam }) || await Order.findOne({ orderNumber: orderIdParam });
    }

    if (order) {
        order.status = status || order.status;
        const updated = await order.save();
        res.json({ message: 'Order status updated', status: updated.status, id: orderIdParam });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

export { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
