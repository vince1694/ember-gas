import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            await register({ name, email, phone, password, role });
            setMessage({ text: 'Account Created! Redirecting...', type: 'success' });
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || 'Registration failed', 
                type: 'error' 
            });
            setLoading(false);
        }
    };

    return (
        <div className="auth-body">
            <div className="bg-shape bg-shape-1"></div>
            <div className="bg-shape bg-shape-2"></div>

            <div className="auth-card">
                <Link to="/" className="logo">
                    <i className="fa-solid fa-fire-flame-curved"></i> Ember<span className="highlight">Gas</span>
                </Link>
                <h2>Create Account</h2>
                <p>Join over 10,000 satisfied customers today.</p>

                {message.text && (
                    <div className={`message-box ${message.type}`} style={{
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        background: message.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                        color: message.type === 'success' ? '#4caf50' : '#ff4757',
                        border: message.type === 'success' ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(255, 71, 87, 0.3)'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <i className="fa-solid fa-user"></i>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <i className="fa-solid fa-envelope"></i>
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <i className="fa-solid fa-phone"></i>
                        <input 
                            type="tel" 
                            placeholder="Phone Number" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <i className="fa-solid fa-lock"></i>
                        <input 
                            type="password" 
                            placeholder="Create Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group" style={{ border: 'none', background: 'none' }}>
                       <label style={{ color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>Account Type</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                outline: 'none'
                            }}
                        >
                            <option value="user" style={{ background: '#111' }}>Customer</option>
                            <option value="seller" style={{ background: '#111' }}>Vendor (Seller)</option>
                            <option value="refiller" style={{ background: '#111' }}>Vendor (Refiller)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
