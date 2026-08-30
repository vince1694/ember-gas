import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const Home = () => {
    return (
        <main>
            <section id="home" className="hero">
                <div className="hero-overlay"></div>
                <div className="container hero-grid">
                    <motion.div 
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1>Fuel Your Kitchen <br /> <span className="text-gradient">Without Interruption.</span></h1>
                        <p>Premium cooking gas delivery service. Fast, reliable, and safe refills at your doorstep in under 60 minutes.</p>
                        <div className="hero-buttons">
                            <Link to="/dashboard" className="btn-primary">Get Refill</Link>
                            <Link to="/services" className="btn-secondary">Explore Services</Link>
                        </div>
                    </motion.div>
                </div>
                <div className="glowing-orb orb-1"></div>
                <div className="glowing-orb orb-2"></div>
            </section>

            <section id="features-spacer" style={{ height: '40px' }} className="mobile-only"></section>
            <StatsSection />
            <section id="stats-spacer" style={{ height: '40px' }} className="mobile-only"></section>

            <section id="testimonial-spacer" style={{ height: '40px' }} className="mobile-only"></section>
            <section className="testimonials">
                <div className="container">
                    <div className="testimonial-slider">
                        <div className="testimonial-card">
                            <p>"EmberGas changed my cooking experience. I never have to worry about running out of gas in
                                the middle of a meal again!"</p>
                            <div className="user-info">
                                <div className="user-avatar">SA</div>
                                <div>
                                    <strong>Sarah Adams</strong>
                                    <span>Home Chef</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="order-cta-section reveal-on-scroll visible">
                <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <h2>Ready to experience premium gas delivery?</h2>
                    <p style={{ marginBottom: '30px' }}>Join thousands of happy customers and keep your kitchen running without interruption.</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/dashboard" className="btn-primary">Order Now</Link>
                        <Link to="/why-us" className="btn-secondary">Why Choose Us?</Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

const StatsSection = () => {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    return (
        <section className={`stats-section ${inView ? 'visible' : ''}`} ref={ref}>
            <div className="container stats-grid">
                <StatItem end={15000} suffix="+" label="Deliveries Completed" inView={inView} />
                <StatItem end={8000} suffix="+" label="Happy Customers" inView={inView} />
                <StatItem end={45} label="Avg Delivery Mins" inView={inView} />
                <StatItem end={100} suffix="%" label="Safety Rating %" inView={inView} />
            </div>
        </section>
    );
};

const StatItem = ({ end, suffix = "", label, inView }) => {
    return (
        <div className="stat-item">
            <h2 className="stat-number">
                {inView ? <CountUp end={end} suffix={suffix} duration={2} /> : 0}
            </h2>
            <p>{label}</p>
        </div>
    );
};

export default Home;
