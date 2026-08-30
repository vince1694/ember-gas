import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { PaystackButton } from 'react-paystack';

const UserDashboard = ({ user, orders, fetchOrders, loading }) => {
    const [step, setStep] = useState(1);
    const [orderData, setOrderData] = useState({
        orderType: 'refill',
        cylinderSize: '12.5kg',
        deliverySpeed: 'standard',
        fullName: user.name,
        phone: user.phone || '',
        address: user.address || '',
    });

    const prices = {
        '6kg': { refill: 8500, new: 25000 },
        '12.5kg': { refill: 17000, new: 45000 },
        '25kg': { refill: 34000, new: 85000 },
        '50kg': { refill: 68000, new: 160000 }
    };

    const deliveryFees = {
        standard: 2500,
        express: 5000
    };

    const productPrice = prices[orderData.cylinderSize][orderData.orderType];
    const totalPrice = productPrice + deliveryFees[orderData.deliverySpeed];

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const config = {
        headers: { Authorization: `Bearer ${user.token}` },
    };

    const handleOrderSubmit = async (reference) => {
        const newOrder = {
            ...orderData,
            orderId: Math.random().toString(36).substr(2, 6).toUpperCase(),
            totalPrice,
            paymentReference: reference?.reference || 'SIMULATED',
            deliveryDate: orderData.deliverySpeed === 'express' ? 'Same Day' : '3-5 Business Days',
        };

        try {
            await axios.post('/api/orders', newOrder, config);
            alert('Order Placed Successfully!');
            setStep(1);
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.message || 'Order failed');
        }
    };

    // Paystack Configuration
    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: user.email,
        amount: totalPrice * 100, // In Kobo
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, // Pulled from .env file
    };

    const componentProps = {
        ...paystackConfig,
        text: 'CONFIRM & PAY',
        onSuccess: (reference) => handleOrderSubmit(reference),
        onClose: () => alert("Transaction Cancelled"),
    };

    return (
        <div className="user-dashboard">
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2.2rem' }}>Welcome Back, <span className="text-gradient">{user.name}</span></h2>
                <p>Top up your energy reserves in just a few taps.</p>
            </div>

            {/* Order Form Container */}
            <div className="glass-card" style={{ background: 'var(--surface-dark)', borderRadius: '24px', border: '1px solid var(--glass-border)', overflow: 'hidden', marginBottom: '40px' }}>
                <div className="step-progress-bar" style={{ height: '4px', background: 'rgba(255,107,0,0.1)' }}>
                    <motion.div 
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        style={{ height: '100%', background: 'var(--primary-color)' }}
                    />
                </div>

                <div className="order-form-content" style={{ padding: '40px' }}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <h3 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Select Service Mode</h3>
                                <div className="resp-grid-2">
                                    <div className={`service-card ${orderData.orderType === 'refill' ? 'active' : ''}`} onClick={() => setOrderData({...orderData, orderType: 'refill'})}>
                                        <i className="fa-solid fa-rotate" />
                                        <h4>Gas Refill</h4>
                                        <p>Swift swap of your empty cylinder for a full one.</p>
                                    </div>
                                    <div className={`service-card ${orderData.orderType === 'new' ? 'active' : ''}`} onClick={() => setOrderData({...orderData, orderType: 'new'})}>
                                        <i className="fa-solid fa-box-open" />
                                        <h4>New Cylinder</h4>
                                        <p>Brand new certified cylinder + first refill included.</p>
                                    </div>
                                </div>
                                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn-primary" onClick={nextStep}>Next Step <i className="fa-solid fa-arrow-right"></i></button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <h3 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Configuration Details</h3>
                                <label style={{ color: 'var(--text-secondary)', marginBottom: '15px', display: 'block' }}>Cylinder Capacity</label>
                                <div className="resp-grid-4" style={{ marginBottom: '30px' }}>
                                    {['6kg', '12.5kg', '25kg', '50kg'].map(size => (
                                        <div key={size} className={`size-card ${orderData.cylinderSize === size ? 'active' : ''}`} onClick={() => setOrderData({...orderData, cylinderSize: size})}>
                                            <h4 style={{ margin: 0 }}>{size}</h4>
                                        </div>
                                    ))}
                                </div>

                                <label style={{ color: 'var(--text-secondary)', marginBottom: '15px', display: 'block' }}>Delivery Priority</label>
                                <div className="resp-grid-2">
                                    <div className={`speed-option ${orderData.deliverySpeed === 'standard' ? 'active' : ''}`} onClick={() => setOrderData({...orderData, deliverySpeed: 'standard'})}>Standard (₦2,500)</div>
                                    <div className={`speed-option ${orderData.deliverySpeed === 'express' ? 'active' : ''}`} onClick={() => setOrderData({...orderData, deliverySpeed: 'express'})}>Express (₦5,000)</div>
                                </div>

                                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                                    <button onClick={prevStep} className="btn-text">Back</button>
                                    <button className="btn-primary" onClick={nextStep}>Logistics Info <i className="fa-solid fa-arrow-right"></i></button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div className="resp-grid-2" style={{ gap: '40px' }}>
                                    <div>
                                        <h3 style={{ marginBottom: '20px' }}>Delivery Address</h3>
                                        <div className="logistics-form">
                                            <input type="text" placeholder="Recipient Name" value={orderData.fullName} onChange={(e) => setOrderData({...orderData, fullName: e.target.value})} className="dash-input" />
                                            <input type="text" placeholder="Detailed Address" value={orderData.address} onChange={(e) => setOrderData({...orderData, address: e.target.value})} className="dash-input" />
                                            <input type="tel" placeholder="Contact Phone" value={orderData.phone} onChange={(e) => setOrderData({...orderData, phone: e.target.value})} className="dash-input" />
                                        </div>
                                    </div>

                                    <div className="checkout-summary">
                                        <h4 style={{ color: 'var(--primary-color)' }}>Final Summary</h4>
                                        <div className="bill-details">
                                            <div className="bill-row"><span>Type:</span> <span>{orderData.orderType}</span></div>
                                            <div className="bill-row"><span>Size:</span> <span>{orderData.cylinderSize}</span></div>
                                            <div className="bill-row"><span>Delivery:</span> <span>₦{deliveryFees[orderData.deliverySpeed].toLocaleString()}</span></div>
                                            <div className="bill-total"><span>Total:</span> <span>₦{totalPrice.toLocaleString()}</span></div>
                                            
                                            {/* Paystack Integration */}
                                            <PaystackButton {...componentProps} className="btn-primary w-full" />
                                            
                                            <button onClick={prevStep} className="btn-text w-full mt-2">Modify Details</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* History Section */}
            <div className="history-section">
                <h3>My Recent Orders</h3>
                <div className="history-list">
                    {loading ? <p>Loading orders...</p> : orders.map(order => (
                        <div key={order._id} className="history-item glass-card">
                            <div className="item-details">
                                <h4>{order.cylinderSize} {order.orderType}</h4>
                                <p>ID: #{order.orderId} • {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="item-meta">
                                <p className="price">₦{order.totalPrice.toLocaleString()}</p>
                                <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
