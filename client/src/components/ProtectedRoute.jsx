import React from 'react';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useGas } from '../context/GasContext';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, navigateToScreen } = useGas();

  // If user is not logged in
  if (!user || !user.isLoggedIn) {
    return (
      <div style={{ padding: '30px 20px', textAlign: 'center', background: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Lock size={32} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>Authentication Required</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px', marginBottom: '24px' }}>
          Please log in to access this screen on GasFinder.
        </p>
        <button className="gf-btn gf-btn-primary" onClick={() => navigateToScreen(3)}>
          GO TO LOGIN
        </button>
      </div>
    );
  }

  // Check role authorization gate (Admin bypasses role gates)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && user.role !== 'admin') {
    return (
      <div style={{ padding: '30px 20px', textAlign: 'center', background: '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ShieldAlert size={32} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>Access Restricted</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px', marginBottom: '24px', lineHeight: 1.5 }}>
          Your current account role (<strong>{user.role}</strong>) is not authorized to access this section.
        </p>
        <button className="gf-btn gf-btn-primary" onClick={() => navigateToScreen(3)}>
          SWITCH ACCOUNT ROLE / LOGIN
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
