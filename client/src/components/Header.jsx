import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        if (!mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        document.body.style.overflow = 'auto';
        navigate('/');
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <header id="navbar" className={scrolled ? 'scrolled' : ''}>
            <div className="container nav-container">
                <Link to="/" className="logo" onClick={closeMobileMenu}>
                    <i className="fa-solid fa-fire-flame-curved"></i> Ember<span className="highlight">Gas</span>
                </Link>
                
                <nav>
                    <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <li><Link to="/" onClick={closeMobileMenu} className={location.pathname === '/' ? 'active-link' : ''}>Home</Link></li>
                        <li><Link to="/services" onClick={closeMobileMenu} className={location.pathname === '/services' ? 'active-link' : ''}>Elite Services</Link></li>
                        <li><Link to="/accessories" onClick={closeMobileMenu} className={location.pathname === '/accessories' ? 'active-link' : ''}>Gas Shop</Link></li>
                        
                        {user ? (
                            <>
                                <li className="mobile-only-auth">
                                    <Link to="/dashboard" onClick={closeMobileMenu} style={{ color: 'var(--primary-color)' }}>
                                        <i className="fa-solid fa-user-circle"></i> {['seller', 'refiller', 'admin'].includes(user.role) ? 'Vendor Hub' : 'My Dashboard'}
                                    </Link>
                                </li>
                                <li className="desktop-only-auth">
                                    <Link to="/dashboard" onClick={closeMobileMenu} className="user-profile-nav">
                                        <div className="nav-avatar">{user.name.charAt(0)}</div>
                                        <span>{user.role === 'user' ? user.name.split(' ')[0] : (user.role.toUpperCase() + ' PORTAL')}</span>
                                    </Link>
                                </li>
                                <li className="mobile-only-auth">
                                    <button onClick={handleLogout} className="logout-btn-mobile">
                                        <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                                    </button>
                                </li>
                                <li className="desktop-only-auth">
                                    <button onClick={handleLogout} className="logout-btn">
                                        <i className="fa-solid fa-right-from-bracket"></i>
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link to="/login" onClick={closeMobileMenu} className="login-nav-link">
                                    <i className="fa-solid fa-user-lock"></i> Login
                                </Link>
                            </li>
                        )}
                        
                        <li className="nav-cta">
                            {['seller', 'refiller', 'admin'].includes(user?.role) ? (
                                <Link to="/dashboard" className="btn-primary-nav" onClick={closeMobileMenu} style={{ background: 'var(--text-primary)', color: '#000' }}>
                                    VIEW ALL REQUESTS <i className="fa-solid fa-clipboard-list"></i>
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="btn-primary-nav" onClick={closeMobileMenu}>
                                    START NEW ORDER <i className="fa-solid fa-plus-circle"></i>
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>

                <div className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>

            <style>{`
                .active-link { color: var(--primary-color) !important; font-weight: 700 !important; }
                .user-profile-nav { display: flex; align-items: center; gap: 8px; background: rgba(255,107,0,0.1); padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(255,107,0,0.2); transition: all 0.3s; }
                .user-profile-nav:hover { transform: scale(1.05); }
                .nav-avatar { width: 24px; height: 24px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; color: white; }
                
                .logout-btn { background: rgba(255,71,87,0.1); border: 1px solid rgba(255,71,87,0.2); color: #ff4757; cursor: pointer; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
                .logout-btn:hover { background: #ff4757; color: white; }
                
                .logout-btn-mobile { width: 100%; text-align: left; background: none; border: none; color: #ff6b6b; font-family: inherit; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 15px 0; border-top: 1px solid rgba(255,255,255,0.05); }
                
                .login-nav-link { color: var(--text-primary); font-weight: 500; }
                
                @media (max-width: 968px) {
                    .nav-links { height: 100vh; padding: 100px 30px !important; justify-content: flex-start; text-align: left; align-items: flex-start; }
                    .nav-links li { width: 100%; margin: 5px 0; }
                    .nav-links li a { font-size: 1.2rem; display: block; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
                    .nav-cta { margin-top: 30px !important; }
                    .btn-primary-nav { width: 100%; text-align: center; border-radius: 12px; font-weight: 700 !important; font-size: 1.1rem !important; }
                    .desktop-only-auth { display: none !important; }
                    .mobile-only-auth { display: block !important; }
                }
                @media (min-width: 969px) {
                    .mobile-only-auth { display: none !important; }
                }
            `}</style>
        </header>
    );
};

export default Header;
