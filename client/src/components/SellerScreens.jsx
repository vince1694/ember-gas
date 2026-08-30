import React, { useState } from 'react';
import {
  Store, Building2, ShieldCheck, CheckCircle, Clock, DollarSign, Package,
  ArrowUpRight, Plus, Minus, User, Settings, LogOut, ChevronRight, AlertTriangle
} from 'lucide-react';
import { useGas } from '../context/GasContext';
import CylinderGraphic from './CylinderGraphic';

// Seller Bottom Navigation Bar
export const SellerBottomNav = ({ activeTab = 'Dashboard' }) => {
  const { navigateToScreen } = useGas();

  return (
    <div className="phone-bottom-nav">
      <button
        className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
        onClick={() => navigateToScreen(17)}
      >
        <Store size={20} />
        <span>Dashboard</span>
      </button>
      <button
        className={`nav-item ${activeTab === 'Inventory' ? 'active' : ''}`}
        onClick={() => navigateToScreen(18)}
      >
        <Package size={20} />
        <span>Inventory</span>
      </button>
      <button
        className={`nav-item ${activeTab === 'Orders' ? 'active' : ''}`}
        onClick={() => navigateToScreen(19)}
      >
        <Clock size={20} />
        <span>Orders</span>
      </button>
      <button
        className={`nav-item ${activeTab === 'Earnings' ? 'active' : ''}`}
        onClick={() => navigateToScreen(21)}
      >
        <DollarSign size={20} />
        <span>Earnings</span>
      </button>
      <button
        className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`}
        onClick={() => navigateToScreen(17)}
      >
        <User size={20} />
        <span>Profile</span>
      </button>
    </div>
  );
};

// SCREEN 16 — SELLER REGISTRATION
export const Screen16SellerRegistration = () => {
  const { navigateToScreen } = useGas();
  const [sellerType, setSellerType] = useState('independent_seller');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);
  };

  return (
    <div className="phone-body" style={{ background: '#FFFFFF', padding: '20px', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>Become a Seller</h3>
      <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
        Register your gas business on GasFinder live map.
      </p>

      {isPending ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Clock size={36} />
          </div>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>Verification Pending</h4>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px', lineHeight: 1.5 }}>
            Thank you! Your business documents have been submitted to GasFinder compliance team. Review takes 24-48 hours.
          </p>
          <button className="gf-btn gf-btn-primary" style={{ marginTop: '24px' }} onClick={() => navigateToScreen(17)}>
            GO TO DASHBOARD PREVIEW
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="gf-input-label">What type of seller are you?</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', margin: '8px 0 16px' }}>
            <button
              type="button"
              onClick={() => setSellerType('filling_station')}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: sellerType === 'filling_station' ? '2px solid #059669' : '1px solid #E2E8F0',
                background: sellerType === 'filling_station' ? '#ECFDF5' : '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Filling Station
            </button>
            <button
              type="button"
              onClick={() => setSellerType('independent_seller')}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: sellerType === 'independent_seller' ? '2px solid #059669' : '1px solid #E2E8F0',
                background: sellerType === 'independent_seller' ? '#ECFDF5' : '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Independent Seller
            </button>
          </div>

          <div className="gf-input-group">
            <label className="gf-input-label">Full Name</label>
            <input className="gf-input" defaultValue="David Goodluck" />
          </div>

          <div className="gf-input-group">
            <label className="gf-input-label">Business Name</label>
            <input className="gf-input" defaultValue="Goodluck Cooking Gas Supplies" />
          </div>

          <div className="gf-input-group">
            <label className="gf-input-label">Phone Number</label>
            <input className="gf-input" defaultValue="0803 123 4567" />
          </div>

          <div className="gf-input-group">
            <label className="gf-input-label">Business Location</label>
            <input className="gf-input" defaultValue="Ikeja, Lagos" />
          </div>

          <div className="gf-input-group">
            <label className="gf-input-label">Upload Verification Document (Govt ID / Business License)</label>
            <div style={{ border: '2px dashed #CBD5E1', padding: '16px', borderRadius: '12px', textAlign: 'center', background: '#F8FAFC', cursor: 'pointer' }}>
              <ShieldCheck size={24} color="#059669" />
              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: '4px' }}>Click to upload ID Card or Business License (PDF, JPG)</span>
            </div>
          </div>

          <button type="submit" className="gf-btn gf-btn-primary" style={{ marginTop: '16px' }}>
            SUBMIT FOR VERIFICATION
          </button>
        </form>
      )}
    </div>
  );
};

// SCREEN 17 — SELLER DASHBOARD
export const Screen17SellerDashboard = () => {
  const { navigateToScreen, sellers } = useGas();
  const [isOnline, setIsOnline] = useState(true);
  const currentSeller = sellers[0]; // ABC Gas Station

  return (
    <div className="phone-body">
      <div style={{ padding: '16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Good morning 👋</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>ABC Gas Station</h3>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              background: isOnline ? '#10B981' : '#6B7280',
              color: '#FFF',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {isOnline ? '● ONLINE' : '○ OFFLINE'}
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto' }}>
        {/* Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
          <div className="gf-card" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
            <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700 }}>TODAY'S SALES</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>₦45,600</h3>
          </div>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>ORDERS TODAY</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>24</h3>
          </div>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>GAS SOLD</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>183 kg</h3>
          </div>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>RATING</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>4.8 ⭐</h3>
          </div>
        </div>

        {/* Current Inventory Summary */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>Current Inventory</h4>
          <button style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }} onClick={() => navigateToScreen(18)}>
            UPDATE
          </button>
        </div>

        <div className="gf-card" style={{ marginBottom: '18px' }}>
          {currentSeller.inventory.map(item => (
            <div key={item.size} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{item.size}</span>
                <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
              </div>
              <strong style={{ fontSize: '0.85rem', color: '#334155' }}>{item.count} cylinders</strong>
            </div>
          ))}
        </div>

        <button className="gf-btn gf-btn-primary" onClick={() => navigateToScreen(18)}>
          UPDATE INVENTORY STOCK
        </button>
      </div>

      <SellerBottomNav activeTab="Dashboard" />
    </div>
  );
};

// SCREEN 18 — INVENTORY MANAGEMENT
export const Screen18Inventory = () => {
  const { navigateToScreen, sellers, updateSellerInventory } = useGas();
  const currentSeller = sellers[0]; // ABC Gas Station

  return (
    <div className="phone-body">
      <div style={{ padding: '16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>My Inventory</h3>
        <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
          Updates here automatically reflect live pin colors on the Customer Map.
        </p>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto' }}>
        {currentSeller.inventory.map(item => (
          <div key={item.size} className="gf-card" style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CylinderGraphic size={item.size} height={42} status={item.status} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{item.size} Cylinder</h4>
              </div>
              <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label className="gf-input-label">Stock Count</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    style={{ background: '#E2E8F0', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                    onClick={() => updateSellerInventory(currentSeller.id, item.size, Math.max(0, item.count - 1), item.pricePerKg, item.status)}
                  >
                    -
                  </button>
                  <input
                    className="gf-input"
                    style={{ textAlign: 'center', padding: '6px' }}
                    value={item.count}
                    onChange={e => updateSellerInventory(currentSeller.id, item.size, e.target.value, item.pricePerKg, item.status)}
                  />
                  <button
                    style={{ background: '#E2E8F0', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                    onClick={() => updateSellerInventory(currentSeller.id, item.size, item.count + 1, item.pricePerKg, item.status)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="gf-input-label">Price / kg (₦)</label>
                <input
                  className="gf-input"
                  style={{ padding: '6px 10px' }}
                  value={item.pricePerKg}
                  onChange={e => updateSellerInventory(currentSeller.id, item.size, item.count, e.target.value, item.status)}
                />
              </div>
            </div>

            <div>
              <label className="gf-input-label">Status Toggle</label>
              <select
                className="gf-input"
                style={{ padding: '6px 10px', fontSize: '0.8rem', fontWeight: 700 }}
                value={item.status}
                onChange={e => updateSellerInventory(currentSeller.id, item.size, item.count, item.pricePerKg, e.target.value)}
              >
                <option value="AVAILABLE">AVAILABLE (Green)</option>
                <option value="LOW_STOCK">LOW_STOCK (Yellow)</option>
                <option value="OUT_OF_STOCK">OUT_OF_STOCK (Red)</option>
                <option value="CLOSED">CLOSED (Grey)</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <SellerBottomNav activeTab="Inventory" />
    </div>
  );
};

// SCREEN 19 & 20 — SELLER ORDERS & PIPELINE MANAGEMENT
export const Screen19SellerOrders = () => {
  const { navigateToScreen, orders, updateOrderStatus } = useGas();
  const [tab, setTab] = useState('NEW');

  return (
    <div className="phone-body">
      <div style={{ padding: '16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>Incoming Orders</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['NEW', 'PROCESSING', 'COMPLETED'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '12px',
                border: 'none',
                background: tab === t ? '#059669' : '#F1F5F9',
                color: tab === t ? '#FFF' : '#64748B',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto' }}>
        {orders.map(ord => (
          <div key={ord.orderNumber} className="gf-card" style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ fontSize: '0.9rem', color: '#111827' }}>Order {ord.orderNumber}</strong>
              <span className="status-pill available">{ord.status}</span>
            </div>

            <h5 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{ord.customerName} ({ord.customerPhone})</h5>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '4px 0' }}>
              {ord.cylinderSize} × {ord.quantity} • Total: <strong>₦{ord.totalAmount.toLocaleString()}</strong>
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                className="gf-btn gf-btn-primary"
                style={{ flex: 1, padding: '8px', fontSize: '0.75rem' }}
                onClick={() => updateOrderStatus(ord.orderNumber, 'SELLER_PREPARING')}
              >
                ACCEPT ORDER
              </button>
              <button
                className="gf-btn gf-btn-outline"
                style={{ flex: 1, padding: '8px', fontSize: '0.75rem', color: '#EF4444' }}
                onClick={() => updateOrderStatus(ord.orderNumber, 'CANCELLED')}
              >
                DECLINE
              </button>
            </div>
          </div>
        ))}
      </div>

      <SellerBottomNav activeTab="Orders" />
    </div>
  );
};

// SCREEN 21 — SELLER EARNINGS
export const Screen21SellerEarnings = () => {
  const { navigateToScreen } = useGas();

  return (
    <div className="phone-body">
      <div style={{ padding: '16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>Earnings</h3>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto' }}>
        <div className="gf-card" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>TODAY'S EARNINGS</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>₦45,600</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>THIS WEEK</span>
            <strong style={{ display: 'block', fontSize: '1rem', marginTop: '4px' }}>₦210,400</strong>
          </div>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>THIS MONTH</span>
            <strong style={{ display: 'block', fontSize: '1rem', marginTop: '4px' }}>₦856,300</strong>
          </div>
        </div>

        {/* SVG Sales Trend Chart Visual */}
        <div className="gf-card" style={{ marginBottom: '18px' }}>
          <h5 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '12px' }}>Sales Performance</h5>
          <svg width="100%" height="120" viewBox="0 0 300 120">
            <path d="M 0 100 Q 60 40 120 70 T 240 20 L 300 50 L 300 120 L 0 120 Z" fill="#D1FAE5" opacity="0.6" />
            <path d="M 0 100 Q 60 40 120 70 T 240 20 L 300 50" fill="none" stroke="#10B981" strokeWidth="3" />
            <circle cx="240" cy="20" r="5" fill="#059669" />
          </svg>
        </div>

        <button className="gf-btn gf-btn-primary" onClick={() => alert('Withdrawal request of ₦45,600 sent to registered bank account.')}>
          WITHDRAW TO BANK ACCOUNT
        </button>
      </div>

      <SellerBottomNav activeTab="Earnings" />
    </div>
  );
};
