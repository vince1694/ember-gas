import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const WhyUs = () => {
    return (
        <main>
            <section className="why-us-page-hero page-hero" style={{ 
                background: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(7, 7, 7, 1)), url('https://images.unsplash.com/photo-1540315222108-98967b545465?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' 
            }}>
                <div className="container">
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>The Ember <span className="text-gradient">Advantage</span></motion.h1>
                    <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        Beyond delivery—we provide a safe, smart, and swift energy experience for every kitchen.
                    </motion.p>
                </div>
            </section>

            <section className="why-us" style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2>Unmatched Quality</h2>
                        <p>Why thousands of households trust EmberGas for their daily cooking needs</p>
                    </div>
                    <div className="resp-grid-3">
                        <FeatureItem icon="fa-shield-check" title="Certified Safety" desc="Every cylinder undergoes a rigorous 5-point safety check during every refill cycle." delay={0} />
                        <FeatureItem icon="fa-bolt" title="Flash Delivery" desc="Our distributed network ensures an average delivery time of just 45 minutes." delay={0.2} />
                        <FeatureItem icon="fa-tag" title="Fair Pricing" desc="No hidden fees or surge pricing. You get market-leading rates with every order." delay={0.4} />
                    </div>
                </div>
            </section>

            <section className="order-cta-section" style={{ padding: '60px 0', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Experience the EmberGas difference today</h2>
                    <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>Fast, safe, and reliable. We're ready when you are.</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/dashboard" className="btn-primary">Place Your Order</Link>
                        <Link to="/services" className="btn-secondary">Explore Services</Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

const FeatureItem = ({ icon, title, desc, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay }}
        style={{ textAlign: 'center', padding: '30px', background: 'var(--surface-dark)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}
    >
        <i className={`fa-solid ${icon}`} style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '20px' }}></i>
        <h4 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>{title}</h4>
        <p style={{ color: 'var(--text-secondary)' }}>{desc}</p>
    </motion.div>
);

export const FAQ = () => {
    return (
        <main className="faq-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
            <div className="container">
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2>Got Questions?</h2>
                    <p>Find answers to common questions about our services</p>
                </div>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <FaqItem 
                        question="How long does delivery take?" 
                        answer="We pride ourselves on our speed. Average delivery time is between 30 to 60 minutes depending on your location and traffic conditions." 
                    />
                    <FaqItem 
                        question="Do you accept all cylinder brands?" 
                        answer="Yes! We swap most major certified brands. If you're unsure, feel free to give us a call first." 
                    />
                    <FaqItem 
                        question="How do I pay for my order?" 
                        answer="You can pay securely online during the checkout process, or opt for payment on delivery via transfer." 
                    />
                </div>
            </div>
        </main>
    );
};

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ marginBottom: '15px', background: 'var(--surface-dark)', border: '1px solid var(--glass-border)', borderRadius: '15px', overflow: 'hidden' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'white', fontSize: '1.1rem', cursor: 'pointer', textAlign: 'left' }}
            >
                {question}
                <i className={`fa-solid fa-${isOpen ? 'minus' : 'plus'}`} style={{ color: 'var(--primary-color)', transition: 'transform 0.3s' }}></i>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        style={{ padding: '0 20px 20px 20px', color: 'var(--text-secondary)' }}
                    >
                        {answer}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
