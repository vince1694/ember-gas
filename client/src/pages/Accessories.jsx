import React from 'react';
import { motion } from 'framer-motion';

const Accessories = () => {
    return (
        <main className="accessories-page">
            <section className="accessories-page-hero page-hero" style={{ 
                background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(7, 7, 7, 1)), url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop')",
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
                        Premium Gas <span className="text-gradient">Accessories</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Enhance your kitchen safety and efficiency with our high-quality parts and equipment.
                    </motion.p>
                </div>
            </section>

            <section className="container" style={{ padding: '80px 0' }}>
                <div className="resp-grid-4">
                    <AccessoryCard 
                        icon="fa-hose"
                        title="Safety Gas Hose"
                        desc="High-pressure, fire-resistant reinforced rubber hose for maximum safety."
                        price="₦5,500"
                        unit="/ meter"
                        delay={0}
                    />
                    <AccessoryCard 
                        icon="fa-gauge-high"
                        title="Gas Regulator Head"
                        desc="Certified low-pressure regulator with double leakage protection mechanism."
                        price="₦8,500"
                        unit="Each"
                        delay={0.1}
                    />
                    <AccessoryCard 
                        icon="fa-spinner"
                        title="Round Stove Head"
                        desc="Heavy-duty cast iron stove burner head for efficient blue flame cooking."
                        price="₦12,000"
                        unit="Each"
                        delay={0.2}
                    />
                    <AccessoryCard 
                        icon="fa-table-cells-large"
                        title="Premium Gas Table"
                        desc="Standard stainless steel double-burner gas table, durable and easy to clean."
                        price="₦50,000"
                        unit="Full Set"
                        delay={0.3}
                    />
                </div>
            </section>
        </main>
    );
};

const AccessoryCard = ({ icon, title, desc, price, unit, delay }) => (
    <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
        <div>
            <div style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '20px' }}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{desc}</p>
        </div>
        <div style={{ margin: '20px 0' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>{price}</span>
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginLeft: '5px' }}>{unit}</span>
        </div>
        <a href="https://wa.me/2349162789976" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
            Buy Now
        </a>
    </motion.div>
);

export default Accessories;
