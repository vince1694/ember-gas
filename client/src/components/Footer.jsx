import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ background: '#0a0a0a', borderTop: '1px solid var(--glass-border)', padding: '80px 0 40px' }}>
            <div className="container footer-grid">
                <div className="footer-about">
                    <div className="footer-logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <i className="fa-solid fa-fire-flame-curved" style={{ color: 'var(--primary-color)' }}></i> EmberGas
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '350px' }}>Fast, safe, and reliable cooking gas delivery service. We bring the heat to your kitchen, so you can focus on what matters most.</p>
                    <div className="social-links" style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <SocialIcon icon="fa-instagram" link="https://instagram.com" />
                        <SocialIcon icon="fa-whatsapp" link="https://wa.me/2349162789976" isWhatsApp />
                    </div>
                </div>
                <div className="footer-links">
                    <h4 style={{ marginBottom: '25px', position: 'relative' }}>Service Catalog</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <li><Link to="/">Home Interface</Link></li>
                        <li><Link to="/services">Elite Services</Link></li>
                        <li><Link to="/safety">Safety Center</Link></li>
                        <li><Link to="/dashboard">Control Center</Link></li>
                        <li><Link to="/partner-portal" style={{ color: 'var(--primary-color)' }}>Partner Access</Link></li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <h4 style={{ marginBottom: '25px' }}>Support Channel</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--text-secondary)' }}>
                        <li><i className="fa-solid fa-phone" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i> +234 916 278 9976</li>
                        <li><i className="fa-solid fa-envelope" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i> support@embergas.com</li>
                        <li><i className="fa-solid fa-clock" style={{ color: 'var(--primary-color)', marginRight: '10px' }}></i> 24/7 Rapid Response</li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '60px', paddingTop: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <p>&copy; 2026 EmberGas Dynamics. Built for efficiency.</p>
            </div>
            
            <a href="https://wa.me/2349162789976" className="floating-whatsapp" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-whatsapp"></i>
                <span>Chat with us</span>
            </a>

            <style>{`
                .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 50px; }
                .footer-links ul li a { color: var(--text-secondary); transition: all 0.3s; }
                .footer-links ul li a:hover { color: var(--primary-color); padding-left: 5px; }
                
                @media (max-width: 768px) {
                    .footer-grid { display: flex; flex-direction: column; text-align: left; }
                }
            `}</style>
        </footer>
    );
};

const SocialIcon = ({ icon, link, isWhatsApp }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" style={{ 
        width: '40px', height: '40px', background: isWhatsApp ? 'rgba(37, 211, 102, 0.1)' : 'rgba(255,255,255,0.05)', 
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: '1.2rem', color: isWhatsApp ? '#25D366' : 'white', border: '1px solid rgba(255,255,255,0.05)', 
        transition: 'all 0.3s' 
    }}>
        <i className={`fa-brands ${icon}`}></i>
    </a>
)

export default Footer;
