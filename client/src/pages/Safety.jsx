import React from 'react';
import { motion } from 'framer-motion';

const Safety = () => {
    return (
        <main className="safety-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <motion.div 
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2>Safety First</h2>
                    <p>Your safety is our top priority. Follow these simple tips to keep your household safe.</p>
                </motion.div>
                
                <div className="resp-grid-3" style={{ marginTop: '50px' }}>
                    <SafetyCard 
                        icon="fa-wind"
                        title="Ventilation"
                        desc="Keep your kitchen well-ventilated while cooking to prevent gas accumulation."
                        delay={0.1}
                    />
                    <SafetyCard 
                        icon="fa-soap"
                        title="Leak Check"
                        desc="Regularly apply soapy water to the hose and regulator to check for bubbles. If you see bubbles, there's a leak."
                        delay={0.2}
                    />
                    <SafetyCard 
                        icon="fa-screwdriver-wrench"
                        title="Certified Parts"
                        desc="Only use high-quality, certified regulators and high-pressure hoses. Replace them every 2 years or as recommended."
                        delay={0.3}
                    />
                </div>
            </div>
        </main>
    );
};

const SafetyCard = ({ icon, title, desc, delay }) => (
    <motion.div 
        className="glass-card"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        style={{ padding: '40px', textAlign: 'center', border: '1px solid rgba(255,107,0,0.2)' }}
    >
        <div style={{ width: '70px', height: '70px', background: 'rgba(255,107,0,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem', color: 'var(--primary-color)' }}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <h3 style={{ marginBottom: '15px' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{desc}</p>
    </motion.div>
);

export default Safety;
