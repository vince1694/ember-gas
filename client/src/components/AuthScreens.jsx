import React, { useState } from 'react';
import { Flame, ArrowRight, ShieldCheck, User, Store, Building2, Lock, Phone, Mail, MapPin, CheckCircle, ChevronLeft } from 'lucide-react';
import { useGas } from '../context/GasContext';
import CylinderGraphic from './CylinderGraphic';

export const Screen1Splash = () => {
  const { navigateToScreen } = useGas();
  return (
    <div style={{ height: '100%', background: 'linear-gradient(180deg, #059669 0%, #047857 60%, #064E3B 100%)', color: '#FFFFFF', padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background Map Overlay Grid Effect */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      <div style={{ marginTop: '20px' }}>
        <div style={{ width: '68px', height: '68px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Flame size={40} fill="#FFFFFF" color="#FFFFFF" />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>GasFinder</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '6px', fontWeight: 500 }}>
          Find Gas. Check Availability. Get It Delivered.
        </p>
      </div>

      <div style={{ margin: '30px 0', transform: 'scale(1.25)' }}>
        <CylinderGraphic size="12.5kg" height={130} status="AVAILABLE" />
      </div>

      <div style={{ width: '100%', zIndex: 10 }}>
        <button
          className="gf-btn"
          style={{ background: '#FFFFFF', color: '#047857', fontWeight: 800, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
          onClick={() => navigateToScreen(2)}
        >
          EXPLORE NOW <ArrowRight size={18} />
        </button>
        <button
          style={{ background: 'transparent', border: 'none', color: '#E2E8F0', fontSize: '0.85rem', marginTop: '14px', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => navigateToScreen(3)}
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
};

export const Screen2Onboarding = () => {
  const { navigateToScreen } = useGas();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Find Gas Near You',
      desc: 'See cooking gas sellers and filling stations around your location in real-time.',
      graphic: (
        <div style={{ width: '100%', height: '180px', background: '#ECFDF5', borderRadius: '20px', border: '2px dashed #34D399', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '30px', left: '40px', background: '#10B981', color: '#FFF', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} /> ABC Gas (1.2km)
          </div>
          <div style={{ position: 'absolute', bottom: '35px', right: '40px', background: '#F59E0B', color: '#FFF', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} /> Grace Gas (Low Stock)
          </div>
          <Flame size={48} color="#059669" />
        </div>
      )
    },
    {
      title: 'Check Live Availability',
      desc: 'Know who has your preferred cylinder size (6kg, 12.5kg, 25kg, 50kg) before you leave home.',
      graphic: (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '16px', height: '180px', padding: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <CylinderGraphic size="6kg" status="AVAILABLE" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', display: 'block', marginTop: '6px' }}>6kg • Available</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CylinderGraphic size="12.5kg" status="AVAILABLE" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', display: 'block', marginTop: '6px' }}>12.5kg • Available</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CylinderGraphic size="25kg" status="LOW_STOCK" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F59E0B', display: 'block', marginTop: '6px' }}>25kg • Low Stock</span>
          </div>
        </div>
      )
    },
    {
      title: 'Order & Get Delivered',
      desc: 'Order from trusted sellers and track your gas delivery rider in real time directly to your doorstep.',
      graphic: (
        <div style={{ width: '100%', height: '180px', background: '#ECFDF5', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#059669', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={32} />
            </div>
            <CylinderGraphic size="12.5kg" status="AVAILABLE" />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857' }}>Fast Doorstep Delivery in 30 Mins</span>
        </div>
      )
    }
  ];

  return (
    <div style={{ height: '100%', background: '#FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          onClick={() => navigateToScreen(5)}
        >
          SKIP
        </button>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        {slides[slide].graphic}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '24px', color: '#111827' }}>
          {slides[slide].title}
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '8px', lineHeight: 1.5 }}>
          {slides[slide].desc}
        </p>
      </div>

      <div>
        {/* Pagination dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {slides.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: idx === slide ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: idx === slide ? '#059669' : '#E2E8F0',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {slide < 2 ? (
          <button className="gf-btn gf-btn-primary" onClick={() => setSlide(slide + 1)}>
            NEXT <ArrowRight size={18} />
          </button>
        ) : (
          <button className="gf-btn gf-btn-primary" onClick={() => navigateToScreen(5)}>
            GET STARTED
          </button>
        )}
      </div>
    </div>
  );
};

export const Screen3Login = () => {
  const { navigateToScreen, setUser } = useGas();
  const [phone, setPhone] = useState('0803 123 4567');
  const [password, setPassword] = useState('••••••••');

  const handleLogin = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, isLoggedIn: true }));
    navigateToScreen(6); // Default login goes to Customer Home
  };

  return (
    <div style={{ height: '100%', background: '#FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#059669', fontWeight: 800 }}>
          <Flame size={28} fill="#059669" />
          <span style={{ fontSize: '1.3rem' }}>GasFinder</span>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827' }}>Welcome Back</h2>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '4px', marginBottom: '24px' }}>
          Find cooking gas near you.
        </p>

        <form onSubmit={handleLogin}>
          <div className="gf-input-group">
            <label className="gf-input-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                className="gf-input"
                style={{ paddingLeft: '42px' }}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0803 123 4567"
              />
            </div>
          </div>

          <div className="gf-input-group">
            <label className="gf-input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="gf-input"
                style={{ paddingLeft: '42px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
          </div>

          <div style={{ textAlign: 'right', margin: '8px 0 20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, cursor: 'pointer' }}>
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="gf-btn gf-btn-primary">
            LOGIN
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>

        <button className="gf-btn gf-btn-outline" onClick={() => navigateToScreen(6)}>
          <ShieldCheck size={18} color="#4285F4" /> Continue with Google
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Don’t have an account?{' '}
          <strong style={{ color: '#059669', cursor: 'pointer' }} onClick={() => navigateToScreen(4)}>
            Create Account
          </strong>
        </span>
      </div>
    </div>
  );
};

export const Screen4CreateAccount = () => {
  const { navigateToScreen } = useGas();
  const [agreed, setAgreed] = useState(true);

  return (
    <div style={{ height: '100%', background: '#FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
      <div>
        <button style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', marginBottom: '12px' }} onClick={() => navigateToScreen(3)}>
          <ChevronLeft size={24} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Create Your Account</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px', marginBottom: '20px' }}>
          Join GasFinder for fast cooking gas availability & delivery.
        </p>

        <div className="gf-input-group">
          <label className="gf-input-label">Full Name</label>
          <input className="gf-input" placeholder="e.g. David Goodluck" defaultValue="David Goodluck" />
        </div>

        <div className="gf-input-group">
          <label className="gf-input-label">Phone Number</label>
          <input className="gf-input" placeholder="0803 123 4567" defaultValue="0803 123 4567" />
        </div>

        <div className="gf-input-group">
          <label className="gf-input-label">Email Address</label>
          <input className="gf-input" placeholder="davidgoodluck@gmail.com" defaultValue="davidgoodluck@gmail.com" />
        </div>

        <div className="gf-input-group">
          <label className="gf-input-label">Password</label>
          <input type="password" className="gf-input" defaultValue="••••••••" />
        </div>

        <div className="gf-input-group">
          <label className="gf-input-label">Confirm Password</label>
          <input type="password" className="gf-input" defaultValue="••••••••" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0 20px' }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} id="terms" style={{ accentColor: '#059669', width: '18px', height: '18px' }} />
          <label htmlFor="terms" style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        <button className="gf-btn gf-btn-primary" onClick={() => navigateToScreen('4B')}>
          CREATE ACCOUNT & SEND OTP
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Already have an account?{' '}
          <strong style={{ color: '#059669', cursor: 'pointer' }} onClick={() => navigateToScreen(3)}>
            LOGIN
          </strong>
        </span>
      </div>
    </div>
  );
};

// SCREEN 4B — OTP VERIFICATION
export const Screen4B_OTPVerification = () => {
  const { navigateToScreen, user } = useGas();
  const [digits, setDigits] = useState(['4', '8', '2', '9', '1', '0']);
  const [timer, setTimer] = useState(45);
  const [verified, setVerified] = useState(false);

  const handleDigitChange = (index, val) => {
    if (val.length > 1) val = val[val.length - 1];
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);
    // Auto focus next field
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setVerified(true);
    setTimeout(() => {
      navigateToScreen(5); // Proceed to Choose Account Type
    }, 1000);
  };

  return (
    <div style={{ height: '100%', background: '#FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <button style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', marginBottom: '12px' }} onClick={() => navigateToScreen(4)}>
          <ChevronLeft size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Lock size={30} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>OTP Verification</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px', lineHeight: 1.5 }}>
            We sent a 6-digit verification code to<br />
            <strong style={{ color: '#111827' }}>{user.phone || '0803 123 4567'}</strong> & <strong style={{ color: '#111827' }}>{user.email || 'davidgoodluck@gmail.com'}</strong>
          </p>
        </div>

        {verified ? (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '16px', borderRadius: '16px', textAlign: 'center', margin: '20px 0' }}>
            <CheckCircle size={36} color="#10B981" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#047857' }}>Phone & Email Verified!</h4>
            <p style={{ fontSize: '0.8rem', color: '#059669', marginTop: '4px' }}>Redirecting to choose your account type...</p>
          </div>
        ) : (
          <form onSubmit={handleVerify}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '24px 0' }}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-digit-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(idx, e.target.value)}
                  style={{
                    width: '46px',
                    height: '54px',
                    borderRadius: '12px',
                    border: digit ? '2px solid #059669' : '1.5px solid #E2E8F0',
                    background: digit ? '#ECFDF5' : '#F8FAFC',
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#111827',
                    outline: 'none'
                  }}
                />
              ))}
            </div>

            <button type="submit" className="gf-btn gf-btn-primary" style={{ marginTop: '10px' }}>
              VERIFY & CONTINUE
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Didn't receive code?{' '}
            <strong style={{ color: '#059669', cursor: 'pointer' }} onClick={() => alert('New 6-digit OTP code [482910] sent to your phone & email!')}>
              Resend OTP ({timer}s)
            </strong>
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8' }}>
        GasFinder Security System • 256-Bit SSL Protection
      </div>
    </div>
  );
};

export const Screen5ChooseAccountType = () => {
  const { navigateToScreen, setActiveRole } = useGas();
  const [selectedType, setSelectedType] = useState('customer');

  const handleContinue = () => {
    if (selectedType === 'customer') {
      setActiveRole('customer');
      navigateToScreen(6);
    } else if (selectedType === 'filling_station') {
      setActiveRole('station');
      navigateToScreen(22);
    } else if (selectedType === 'independent_seller') {
      setActiveRole('seller');
      navigateToScreen(16);
    }
  };

  return (
    <div style={{ height: '100%', background: '#FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginTop: '10px' }}>
          How will you use GasFinder?
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px', marginBottom: '24px' }}>
          Choose your primary account role to personalize your experience.
        </p>

        {/* CARD 1: CUSTOMER */}
        <div
          onClick={() => setSelectedType('customer')}
          style={{
            background: selectedType === 'customer' ? '#ECFDF5' : '#FFFFFF',
            border: selectedType === 'customer' ? '2px solid #059669' : '1.5px solid #E2E8F0',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: selectedType === 'customer' ? '#059669' : '#F1F5F9', color: selectedType === 'customer' ? '#FFF' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>CUSTOMER</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
              Find and order cooking gas near you for pickup or delivery.
            </p>
          </div>
        </div>

        {/* CARD 2: FILLING STATION */}
        <div
          onClick={() => setSelectedType('filling_station')}
          style={{
            background: selectedType === 'filling_station' ? '#ECFDF5' : '#FFFFFF',
            border: selectedType === 'filling_station' ? '2px solid #059669' : '1.5px solid #E2E8F0',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: selectedType === 'filling_station' ? '#059669' : '#F1F5F9', color: selectedType === 'filling_station' ? '#FFF' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>FILLING STATION</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
              Manage your gas station, multi-branches, inventory and orders.
            </p>
          </div>
        </div>

        {/* CARD 3: INDEPENDENT SELLER */}
        <div
          onClick={() => setSelectedType('independent_seller')}
          style={{
            background: selectedType === 'independent_seller' ? '#ECFDF5' : '#FFFFFF',
            border: selectedType === 'independent_seller' ? '2px solid #059669' : '1.5px solid #E2E8F0',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: selectedType === 'independent_seller' ? '#059669' : '#F1F5F9', color: selectedType === 'independent_seller' ? '#FFF' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Store size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>INDEPENDENT SELLER</h4>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
              List your gas stock, set live prices and sell directly to customers.
            </p>
          </div>
        </div>
      </div>

      <button className="gf-btn gf-btn-primary" onClick={handleContinue}>
        CONTINUE
      </button>
    </div>
  );
};
