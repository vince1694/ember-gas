import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        orderNumber: { type: String, required: true, default: '#GF10284' },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        customerName: { type: String, default: 'David Goodluck' },
        customerPhone: { type: String, default: '0803 123 4567' },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
        sellerName: { type: String, default: 'ABC Gas Station' },
        sellerAddress: { type: String, default: '23 Allen Avenue, Ikeja, Lagos' },
        cylinderSize: { type: String, default: '12.5kg' },
        quantity: { type: Number, default: 2 },
        pricePerUnit: { type: Number, default: 1250 },
        gasPriceTotal: { type: Number, default: 2500 },
        deliveryFee: { type: Number, default: 500 },
        serviceFee: { type: Number, default: 100 },
        totalAmount: { type: Number, default: 3100 },
        fulfillmentType: { type: String, enum: ['Delivery', 'Pickup'], default: 'Delivery' },
        deliveryAddress: { type: String, default: '23 Allen Avenue, Ikeja, Lagos' },
        paymentMethod: { type: String, enum: ['Card', 'Bank Transfer', 'Wallet'], default: 'Card' },
        paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Paid' },
        status: {
            type: String,
            enum: ['ORDER_CONFIRMED', 'SELLER_PREPARING', 'READY_FOR_PICKUP', 'RIDER_PICKING_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'],
            default: 'ORDER_CONFIRMED'
        },
        estimatedDeliveryMinutes: { type: Number, default: 35 },
        rider: {
            name: { type: String, default: 'Michael' },
            rating: { type: Number, default: 4.9 },
            phone: { type: String, default: '0802 987 6543' },
            currentEtaMinutes: { type: Number, default: 15 }
        }
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
