import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Separate role-based views
import UserDashboard from '../components/dashboards/UserDashboard';
import VendorDashboard from '../components/dashboards/VendorDashboard';

const Dashboard = () => {
    const { user, updateLocalUser } = useAuth();
    const navigate = useNavigate();
    
    // Global Dashboard States
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]); // For Vendors/Admins
    const [loading, setLoading] = useState(true);

    // Profile Edit States
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        password: '' // Only filled if changing
    });

    const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // If normal user, fetch only their orders
            if (user.role === 'user') {
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
            } 
            // If vendor/admin, fetch all orders
            else if (['seller', 'refiller', 'admin'].includes(user.role)) {
                const { data } = await axios.get('/api/orders', config);
                setAllOrders(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put('/api/auth/profile', profileData, config);
            updateLocalUser(data);
            setIsEditing(false);
            alert('Profile Updated Successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        }
    };

    if (!user) return null;

    return (
        <div className="dashboard-page" style={{ minHeight: '100vh', padding: '100px 0 60px' }}>
            <div className="container">
                <div className="dashboard-layout-main" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
                    
                    {/* Common Sidebar Profile */}
                    <aside className="profile-column">
                        <div className="profile-card sticky-sidebar" style={{ background: 'var(--surface-dark)', borderRadius: '24px', padding: '30px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                            <div className="profile-avatar" style={{ width: '80px', height: '80px', background: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                                {user.name.charAt(0)}
                            </div>
                            
                            {isEditing ? (
                                <form onSubmit={handleProfileUpdate} style={{ textAlign: 'left', marginTop: '20px' }}>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full Name</label>
                                        <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="dash-input" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} required />
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                                        <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="dash-input" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Primary Address</label>
                                        <input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="dash-input" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>New Password (Optional)</label>
                                        <input type="password" value={profileData.password} onChange={(e) => setProfileData({...profileData, password: e.target.value})} className="dash-input" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                        <button type="submit" style={{ flex: 1, padding: '10px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h3 style={{ marginBottom: '5px' }}>{user.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>{user.email}</p>
                                    <span className={`role-badge role-${user.role}`} style={{ padding: '4px 12px', borderRadius: '30px', fontSize: '0.75rem', background: 'rgba(255,107,0,0.1)', color: 'var(--primary-color)', border: '1px solid rgba(255,107,0,0.2)' }}>
                                        {user.role?.toUpperCase()}
                                    </span>

                                    <div className="profile-quick-stats" style={{ marginTop: '30px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px', textAlign: 'left' }}>
                                        <div className="p-stat" style={{ marginBottom: '15px' }}>
                                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>CONTACT</label>
                                            <strong>{user.phone || 'N/A'}</strong>
                                        </div>
                                        <div className="p-stat">
                                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>PRIMARY ADDRESS</label>
                                            <p style={{ margin: 0, fontSize: '0.85rem' }}>{user.address || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        style={{ width: '100%', marginTop: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}
                                        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </aside>

                    {/* Dynamic View Injection */}
                    <main className="dashboard-view-area">
                        {user.role === 'user' ? (
                            <UserDashboard 
                                user={user} 
                                orders={orders} 
                                fetchOrders={fetchData} 
                                loading={loading} 
                            />
                        ) : (
                            <VendorDashboard 
                                user={user} 
                                allOrders={allOrders} 
                                fetchAllOrders={fetchData} 
                                loading={loading} 
                            />
                        )}
                    </main>

                </div>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .dashboard-layout-main { grid-template-columns: 1fr !important; gap: 30px !important; }
                    .sticky-sidebar { position: static !important; }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
