import expressAsyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = expressAsyncHandler(async (req, res) => {
    const {
        orderId,
        orderType,
        cylinderSize,
        deliverySpeed,
        address,
        phone,
        totalPrice,
        paymentReference,
        deliveryDate,
    } = req.body;

    if (!orderId || !orderType || !cylinderSize || !address || !phone || !totalPrice) {
        res.status(400);
        throw new Error('Please fill in all order details');
    }

    const order = new Order({
        user: req.user._id,
        orderId,
        orderType,
        cylinderSize,
        deliverySpeed,
        address,
        phone,
        totalPrice,
        paymentReference,
        deliveryDate,
    });

    const createdOrder = await order.save();

    // Send order confirmation email
    try {
        const message = `
            <h2>Order Confirmation</h2>
            <p>Dear ${req.user.name},</p>
            <p>Your order (ID: <strong>${orderId}</strong>) has been placed successfully.</p>
            <h3>Order Details:</h3>
            <ul>
                <li><strong>Type:</strong> ${orderType}</li>
                <li><strong>Size:</strong> ${cylinderSize}</li>
                <li><strong>Delivery:</strong> ${deliverySpeed}</li>
                <li><strong>Total Price:</strong> ₦${totalPrice.toLocaleString()}</li>
            </ul>
            <p>We will notify you when the status changes.</p>
            <p>Thank you for choosing EmberGas!</p>
        `;

        await sendEmail({
            email: req.user.email,
            subject: 'EmberGas - Order Confirmation',
            html: message,
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }

    res.status(201).json(createdOrder);
});

// @desc    Get my orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get all orders (Admin/Sellers/Refillers)
// @route   GET /api/orders
// @access  Private (Admin/Vendor)
const getOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Vendor)
const updateOrderStatus = expressAsyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        order.status = status;
        const updatedOrder = await order.save();

        // Send status update email
        try {
            if (order.user && order.user.email) {
                const message = `
                    <h2>Order Status Update</h2>
                    <p>Dear ${order.user.name},</p>
                    <p>Your order (ID: <strong>${order.orderId}</strong>) status has been updated to: <strong>${status}</strong>.</p>
                    <p>Thank you for choosing EmberGas!</p>
                `;

                await sendEmail({
                    email: order.user.email,
                    subject: 'EmberGas - Order Status Update',
                    html: message,
                });
            }
        } catch (error) {
            console.error('Email sending failed:', error);
        }

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

export { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
