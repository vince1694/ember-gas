import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [trackedOrder, setTrackedOrder] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleTrack = () => {
        // Placeholder for future API integration
        // Currently mimics the original HTML's mock tracking logic
        const id = orderId.trim().toUpperCase();
        if (id === '') {
            setErrorMsg('Please enter an Order ID');
            setTrackedOrder(null);
            return;
        }

        // Simulating finding an order. In the future this will be an axios.get
        if (id.length > 3) { // Mock condition
            setTrackedOrder({
                id: id,
                deliveryDate: 'Same Day',
                status: 'Pending' // Could be Pending, Delivered, Cancelled
            });
            setErrorMsg('');
        } else {
            setTrackedOrder(null);
            setErrorMsg('No order found with that ID. Please check and try again.');
        }
    };

    return (
        <main className="track-section" style={{ minHeight: '80vh', paddingTop: '150px', textAlign: 'center' }}>
            <div className="container">
                <motion.div 
                    className="glass-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ maxWidth: '600px', margin: '0 auto', padding: '40px', borderRadius: '30px', border: '1px solid var(--glass-border)', background: 'var(--surface-dark)' }}
                >
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Track Your Order</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Enter your unique Order ID to check your delivery status.</p>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }} className="search-box-mobile">
                        <input 
                            type="text" 
                            placeholder="e.g. A1B2C3"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', textTransform: 'uppercase' }}
                        />
                        <button className="btn-primary" onClick={handleTrack}>Track Now</button>
                    </div>

                    {errorMsg && (
                        <div style={{ color: '#ff4757', marginBottom: '20px' }}>
                            {errorMsg}
                        </div>
                    )}

                    {trackedOrder && (
                        <div style={{ textAlign: 'left', marginTop: '40px' }}>
                            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255, 107, 0, 0.05)', borderRadius: '10px' }}>
                                <p style={{ marginBottom: '5px' }}><strong>Order ID:</strong> #{trackedOrder.id}</p>
                                <p><strong>Exp. Delivery:</strong> {trackedOrder.deliveryDate}</p>
                            </div>

                            <TrackingStep 
                                icon="fa-check" 
                                title="Order Placed" 
                                desc="We've received your order and it's being processed." 
                                status={trackedOrder.status === 'Cancelled' ? 'cancelled' : 'completed'} 
                                delay={0.2}
                            />
                            <TrackingStep 
                                icon="fa-truck-ramp-box" 
                                title="Out for Delivery" 
                                desc="Our agent is on their way to your address." 
                                status={trackedOrder.status === 'Pending' ? 'current' : (trackedOrder.status === 'Delivered' ? 'completed' : '')} 
                                delay={0.4}
                            />
                            <TrackingStep 
                                icon="fa-house-circle-check" 
                                title="Delivered" 
                                desc="Enjoy your gas! Your refill was completed successfully." 
                                status={trackedOrder.status === 'Delivered' ? 'completed' : ''} 
                                delay={0.6}
                                isLast
                            />
                        </div>
                    )}
                </motion.div>
            </div>
            <style>{`
                @media (max-width: 500px) {
                    .search-box-mobile { flex-direction: column; }
                    .search-box-mobile button { width: 100%; }
                }
            `}</style>
        </main>
    );
};

const TrackingStep = ({ icon, title, desc, status, isLast, delay }) => {
    let iconBg = 'var(--surface-dark)';
    let iconColor = 'var(--text-secondary)';
    let borderColor = 'var(--glass-border)';

    if (status === 'completed') {
        iconBg = 'var(--primary-color)';
        borderColor = 'var(--primary-color)';
        iconColor = 'white';
    } else if (status === 'current') {
        iconBg = 'rgba(255, 107, 0, 0.1)';
        borderColor = 'var(--primary-color)';
        iconColor = 'var(--primary-color)';
    } else if (status === 'cancelled') {
        iconBg = '#ff4757';
        borderColor = '#ff4757';
        iconColor = 'white';
    }

    return (
        <motion.div 
            style={{ display: 'flex', gap: '20px', marginBottom: '30px', position: 'relative' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            {!isLast && (
                <div style={{ position: 'absolute', left: '17px', top: '35px', width: '2px', height: 'calc(100% - 10px)', background: 'var(--glass-border)' }} />
            )}
            
            <div style={{ 
                width: '35px', height: '35px', background: iconBg, border: `2px solid ${borderColor}`, 
                color: iconColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '0.8rem', zIndex: 2, flexShrink: 0,
                boxShadow: status === 'current' ? '0 0 15px var(--primary-color)' : 'none'
            }}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            
            <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{desc}</p>
            </div>
        </motion.div>
    );
};

export default TrackOrder;
