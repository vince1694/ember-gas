import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const VendorDashboard = ({ user, allOrders, fetchAllOrders, loading }) => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [updatingId, setUpdatingId] = useState(null);

    const config = {
        headers: { Authorization: `Bearer ${user.token}` },
    };

    const handleUpdateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await axios.put(`/api/orders/${id}/status`, { status: newStatus }, config);
            fetchAllOrders();
            setUpdatingId(null);
        } catch (error) {
            alert('Status update failed');
            setUpdatingId(null);
        }
    };

    const statusFlow = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    const filteredOrders = filterStatus === 'All' 
        ? allOrders 
        : allOrders.filter(o => o.status === filterStatus);

    // Summary Stats
    const stats = {
        total: allOrders.length,
        pending: allOrders.filter(o => o.status === 'Pending').length,
        delivered: allOrders.filter(o => o.status === 'Delivered').length,
        revenue: allOrders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.totalPrice, 0)
    };

    return (
        <div className="vendor-dashboard">
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2.2rem' }}>Vendor <span className="text-gradient">Control Center</span></h2>
                <p>Monitor incoming gas requests and manage delivery pipelines.</p>
            </div>

            {/* Dashboard Summary Stats */}
            <div className="resp-grid-4" style={{ marginBottom: '40px' }}>
                <StatCard label="Total Requests" value={stats.total} icon="fa-list-check" color="#ff6b00" />
                <StatCard label="Pending Refills" value={stats.pending} icon="fa-clock" color="#f1c40f" />
                <StatCard label="Successful Deliveries" value={stats.delivered} icon="fa-circle-check" color="#2ecc71" />
                <StatCard label="Total Revenue" value={`₦${stats.revenue.toLocaleString()}`} icon="fa-wallet" color="#3498db" />
            </div>

            {/* Filters Section */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '15px', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Filter by Status:</span>
                {['All', ...statusFlow].map(status => (
                    <button 
                        key={status} 
                        onClick={() => setFilterStatus(status)}
                        className={`btn-pill ${filterStatus === status ? 'active' : ''}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Orders Feed */}
            <div className="orders-feed">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>Synchronizing with data stream...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No deployments currently in this category.
                    </div>
                ) : (
                    <div className="orders-table-container glass-card" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                        <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr 1fr', padding: '20px', background: 'rgba(255,255,255,0.03)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            <div>Order Details</div>
                            <div>Customer</div>
                            <div>Location</div>
                            <div>Action / Update</div>
                            <div style={{ textAlign: 'right' }}>Revenue</div>
                        </div>
                        <div className="table-body">
                            {filteredOrders.map(order => (
                                <div key={order._id} className="table-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr 1fr', padding: '20px', borderTop: '1px solid var(--glass-border)', alignItems: 'center' }}>
                                    <div className="order-main">
                                        <div style={{ fontWeight: 'bold' }}>{order.cylinderSize} {order.orderType}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>#{order.orderId} • {new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="order-customer" style={{ fontSize: '0.9rem' }}>
                                        <div>{order.user?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.phone}</div>
                                    </div>
                                    <div className="order-location" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingRight: '15px' }}>
                                        {order.address}
                                    </div>
                                    <div className="order-action">
                                        {updatingId === order._id ? (
                                            <span style={{ fontSize: '0.8rem' }}>Updating...</span>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {statusFlow.map(nextStatus => (
                                                    <button 
                                                        key={nextStatus}
                                                        onClick={() => handleUpdateStatus(order._id, nextStatus)}
                                                        className={`status-btn-small ${order.status === nextStatus ? 'active' : ''}`}
                                                        style={{ 
                                                            padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', border: '1px solid var(--glass-border)',
                                                            background: order.status === nextStatus ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                                            color: order.status === nextStatus ? 'white' : 'var(--text-secondary)',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {nextStatus}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="order-revenue" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                        ₦{order.totalPrice.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .btn-pill { padding: 6px 15px; borderRadius: 30px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.03); color: var(--text-secondary); cursor: pointer; transition: all 0.3s; }
                .btn-pill.active { background: var(--primary-color); border-color: var(--primary-color); color: white; }
                .table-row:hover { background: rgba(255,255,255,0.02); }
                @media (max-width: 992px) {
                    .table-header { display: none !important; }
                    .table-row { grid-template-columns: 1fr 1fr !important; gap: 20px; }
                    .order-action { grid-column: span 2; padding-top: 15px; border-top: 1px solid var(--glass-border); }
                    .order-revenue { text-align: left !important; }
                }
            `}</style>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }) => (
    <div className="glass-card" style={{ padding: '25px', borderRadius: '20px', border: `1.5px solid ${color}20` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '5px' }}>{label}</p>
                <h3 style={{ fontSize: '1.6rem', color: color }}>{value}</h3>
            </div>
            <div style={{ width: '50px', height: '50px', background: `${color}15`, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: color }}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
        </div>
    </div>
);

export default VendorDashboard;
