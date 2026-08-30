import React from 'react';
import { Flame, Smartphone, Monitor, User, Store, Building2, ShieldCheck, ChevronRight } from 'lucide-react';
import { useGas } from '../context/GasContext';

const screenList = [
  { id: 1, title: 'Screen 1 — Splash Screen', role: 'customer' },
  { id: 2, title: 'Screen 2 — Onboarding (3 Slides)', role: 'customer' },
  { id: 3, title: 'Screen 3 — Login', role: 'customer' },
  { id: 4, title: 'Screen 4 — Create Account', role: 'customer' },
  { id: 5, title: 'Screen 5 — Choose Account Type', role: 'customer' },
  { id: 6, title: 'Screen 6 — Customer Home', role: 'customer' },
  { id: 7, title: 'Screen 7 — Live Gas Map', role: 'customer' },
  { id: 8, title: 'Screen 8 — Filter Gas Sellers', role: 'customer' },
  { id: 9, title: 'Screen 9 — Seller Details', role: 'customer' },
  { id: 10, title: 'Screen 10 — Order Gas', role: 'customer' },
  { id: 11, title: 'Screen 11 — Payment', role: 'customer' },
  { id: 12, title: 'Screen 12 — Order Confirmation', role: 'customer' },
  { id: 13, title: 'Screen 13 — Live Order Tracking', role: 'customer' },
  { id: 14, title: 'Screen 14 — Customer Orders', role: 'customer' },
  { id: 15, title: 'Screen 15 — Customer Profile', role: 'customer' },
  { id: 16, title: 'Screen 16 — Seller Registration', role: 'seller' },
  { id: 17, title: 'Screen 17 — Seller Dashboard', role: 'seller' },
  { id: 18, title: 'Screen 18 — Inventory Management', role: 'seller' },
  { id: 19, title: 'Screen 19 — Seller Orders', role: 'seller' },
  { id: 20, title: 'Screen 20 — Order Management Pipeline', role: 'seller' },
  { id: 21, title: 'Screen 21 — Seller Earnings', role: 'seller' },
  { id: 22, title: 'Screen 22 — Filling Station Dashboard', role: 'station' },
  { id: 23, title: 'Screen 23 — Branch Management', role: 'station' },
  { id: 24, title: 'Screen 24 — Add Branch', role: 'station' },
  { id: 25, title: 'Screen 25 — Branch Dashboard', role: 'station' },
  { id: 26, title: 'Screen 26 — Admin Overview Dashboard', role: 'admin' },
  { id: 27, title: 'Screen 27 — Admin Seller Management', role: 'admin' },
  { id: 28, title: 'Screen 28 — Admin Verification Requests', role: 'admin' },
  { id: 29, title: 'Screen 29 — Admin Customer Directory', role: 'admin' },
  { id: 30, title: 'Screen 30 — Admin Global Order Monitor', role: 'admin' },
  { id: 31, title: 'Screen 31 — Admin Reports & Analytics', role: 'admin' },
  { id: 32, title: 'Screen 32 — System Notifications', role: 'admin' },
  { id: 33, title: 'Screen 33 — Safety & Trust Center', role: 'admin' },
  { id: 34, title: 'Screen 34 — System Settings', role: 'admin' }
];

const MasterNav = () => {
  const { currentScreen, navigateToScreen, activeRole, setActiveRole, viewMode, setViewMode } = useGas();

  const handleRoleChange = (role) => {
    setActiveRole(role);
    if (role === 'customer') navigateToScreen(6);
    else if (role === 'seller') navigateToScreen(17);
    else if (role === 'station') navigateToScreen(22);
    else if (role === 'admin') {
      setActiveRole('admin');
      setViewMode('desktop');
      navigateToScreen(26);
    }
  };

  return (
    <header className="gf-master-nav">
      <div className="gf-logo-brand">
        <Flame size={26} fill="#10B981" />
        <span>GasFinder</span>
      </div>

      <div className="gf-nav-controls">
        {/* Screen Jump Dropdown */}
        <select
          className="gf-screen-select"
          value={currentScreen}
          onChange={(e) => navigateToScreen(Number(e.target.value))}
        >
          {screenList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>

        {/* Role Quick Switcher */}
        <div className="gf-role-badge-group">
          <button
            className={`gf-role-btn ${activeRole === 'customer' ? 'active' : ''}`}
            onClick={() => handleRoleChange('customer')}
          >
            <User size={14} /> Customer
          </button>
          <button
            className={`gf-role-btn ${activeRole === 'seller' ? 'active' : ''}`}
            onClick={() => handleRoleChange('seller')}
          >
            <Store size={14} /> Seller
          </button>
          <button
            className={`gf-role-btn ${activeRole === 'station' ? 'active' : ''}`}
            onClick={() => handleRoleChange('station')}
          >
            <Building2 size={14} /> Station
          </button>
          <button
            className={`gf-role-btn ${activeRole === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
            <ShieldCheck size={14} /> Admin
          </button>
        </div>

        {/* Layout Mode Switcher */}
        <button
          className="gf-layout-toggle"
          onClick={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')}
        >
          {viewMode === 'mobile' ? <Monitor size={16} /> : <Smartphone size={16} />}
          <span>{viewMode === 'mobile' ? '9:16 Phone' : 'Desktop View'}</span>
        </button>
      </div>
    </header>
  );
};

export default MasterNav;
