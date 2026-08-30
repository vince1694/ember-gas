import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            await login(email, password);
            setMessage({ text: 'Login Successful! Redirecting...', type: 'success' });
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            setMessage({ 
                text: error.response?.data?.message || 'Invalid email or password', 
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
                <h2>Welcome Back</h2>
                <p>Login to your account to manage your orders.</p>

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
                        <i className="fa-solid fa-lock"></i>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        <span>{loading ? 'Logging In...' : 'Log In'}</span>
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
