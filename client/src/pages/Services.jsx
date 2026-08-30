import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Services = () => {
    return (
        <main>
            <section className="services-page-hero page-hero" style={{ 
                background: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(7, 7, 7, 1)), url('https://images.unsplash.com/photo-1521017432521-f34f739cb997?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}>
                <div className="container">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Elite Gas <span className="text-gradient">Solutions</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        From rapid refills to brand new connections, we power your kitchen with certified excellence.
                    </motion.p>
                </div>
            </section>

            <section id="services" className="services">
                <div className="container">
                    <div className="section-header">
                        <h2>Professional Services</h2>
                        <p>Tailored cooking gas solutions for every household and business</p>
                    </div>
                    <div className="services-grid">
                        <ServiceCard 
                            img="/images/gas_refill.png" 
                            icon="fa-rotate" 
                            title="Gas Refill" 
                            desc="Fast and reliable swap service for all major cylinder brands at competitive rates." 
                            link="/dashboard"
                            btnText="Select Refill"
                        />
                        <ServiceCard 
                            img="/images/new_cylinder.png" 
                            icon="fa-bottle-droplet" 
                            title="New Cylinder" 
                            desc="High-quality, certified new cylinders to get your kitchen up and running safely." 
                            link="/dashboard"
                            btnText="Buy New"
                            delay={0.2}
                        />
                        <ServiceCard 
                            img="/images/express_delivery.png" 
                            icon="fa-truck-fast" 
                            title="Express Delivery" 
                            desc="Priority 45-minute delivery window for when you need gas urgently." 
                            badge="Premium"
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
};

const ServiceCard = ({ img, icon, title, desc, link, btnText, badge, delay = 0 }) => (
    <motion.div 
        className="service-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
    >
        <div className="service-image">
            <img src={img} alt={title} />
        </div>
        <div className="icon-box">
            <i className={`fa-solid ${icon}`}></i>
        </div>
        {badge && <span className="badge">{badge}</span>}
        <h3>{title}</h3>
        <p>{desc}</p>
        {link && (
            <Link to={link} className="btn-text">
                {btnText} <i className="fa-solid fa-arrow-right"></i>
            </Link>
        )}
    </motion.div>
);

export default Services;
