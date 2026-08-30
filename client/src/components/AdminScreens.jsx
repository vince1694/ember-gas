import React, { useState } from 'react';
import {
  ShieldCheck, Users, Store, Building2, Clock, DollarSign, Activity, FileText,
  AlertTriangle, CheckCircle, XCircle, Search, Filter, Bell, Settings, HelpCircle,
  Eye, Edit, Trash2, MapPin, Download, BarChart2, PieChart
} from 'lucide-react';
import { useGas } from '../context/GasContext';
import GasMap from './GasMap';

// Admin Sidebar Navigation Layout Container
export const AdminDesktopWrapper = ({ children, activeTab = 'Overview' }) => {
  const { navigateToScreen } = useGas();

  return (
    <div className="desktop-view-container">
      {/* Sidebar */}
      <div style={{ width: '240px', background: '#0F172A', color: '#F8FAFC', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10B981', fontWeight: 800, fontSize: '1.2rem', marginBottom: '30px' }}>
            <ShieldCheck size={28} />
            <span>GasFinder Admin</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 26, name: 'Overview', icon: Activity },
              { id: 27, name: 'Sellers Management', icon: Store },
              { id: 28, name: 'Verification Requests', icon: FileText },
              { id: 29, name: 'Customers Directory', icon: Users },
              { id: 30, name: 'Orders Monitor', icon: Clock },
              { id: 31, name: 'Reports & Analytics', icon: BarChart2 },
              { id: 32, name: 'Notifications', icon: Bell },
              { id: 33, name: 'Safety & Trust Center', icon: ShieldCheck },
              { id: 34, name: 'System Settings', icon: Settings }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => navigateToScreen(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === item.name ? '#059669' : 'transparent',
                  color: activeTab === item.name ? '#FFFFFF' : '#94A3B8',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#64748B', borderTop: '1px solid #1E293B', paddingTop: '16px' }}>
          GasFinder v2.4 Platform Admin
        </div>
      </div>

      {/* Main Desktop View Content Area */}
      <div style={{ flex: 1, background: '#F8FAFC', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ background: '#FFFFFF', padding: '16px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{activeTab}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '4px 12px', borderRadius: '20px' }}>
              ● Live System Active
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#059669', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              AD
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

// SCREEN 26 — ADMIN OVERVIEW
export const Screen26AdminOverview = () => {
  return (
    <AdminDesktopWrapper activeTab="Overview">
      {/* 8 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="gf-card">
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>TOTAL USERS</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>24,842</h3>
        </div>
        <div className="gf-card">
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>CUSTOMERS</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>21,304</h3>
        </div>
        <div className="gf-card">
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>SELLERS</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>3,214</h3>
        </div>
        <div className="gf-card">
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>FILLING STATIONS</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>324</h3>
        </div>
        <div className="gf-card">
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>INDEPENDENT SELLERS</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>2,890</h3>
        </div>
        <div className="gf-card">
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>TOTAL GAS AVAILABLE</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>48,392 kg</h3>
        </div>
        <div className="gf-card">
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>ORDERS TODAY</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>2,842</h3>
        </div>
        <div className="gf-card" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>REVENUE TODAY</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>₦3,245,600</h3>
        </div>
      </div>

      {/* Large Nationwide Live Gas Map */}
      <div className="gf-card" style={{ padding: '0', overflow: 'hidden', height: '420px', position: 'relative' }}>
        <div style={{ padding: '14px 20px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Nationwide Live Gas Availability Map</h4>
          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>Real-time updates active</span>
        </div>
        <GasMap />
      </div>
    </AdminDesktopWrapper>
  );
};

// SCREEN 27 — ADMIN SELLER MANAGEMENT
export const Screen27SellerManagement = () => {
  const { sellers } = useGas();

  return (
    <AdminDesktopWrapper activeTab="Sellers Management">
      <div className="gf-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <input className="gf-input" style={{ width: '300px' }} placeholder="Search sellers by name or city..." />
          <button className="gf-btn gf-btn-primary" style={{ width: 'auto', padding: '8px 16px' }}>
            + REGISTER NEW SELLER
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ padding: '12px' }}>Seller Name</th>
              <th style={{ padding: '12px' }}>Type</th>
              <th style={{ padding: '12px' }}>Location</th>
              <th style={{ padding: '12px' }}>Verification</th>
              <th style={{ padding: '12px' }}>Rating</th>
              <th style={{ padding: '12px' }}>Stock</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px', fontWeight: 800 }}>{s.name}</td>
                <td style={{ padding: '12px' }}>{s.sellerType === 'filling_station' ? 'Filling Station' : 'Independent Seller'}</td>
                <td style={{ padding: '12px' }}>{s.locationName}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`status-pill ${s.isVerified ? 'available' : 'low_stock'}`}>
                    {s.isVerified ? 'VERIFIED' : 'PENDING'}
                  </span>
                </td>
                <td style={{ padding: '12px', fontWeight: 700, color: '#D97706' }}>⭐ {s.rating}</td>
                <td style={{ padding: '12px', fontWeight: 700, color: '#059669' }}>48 cylinders</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={{ background: '#ECFDF5', color: '#059669', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Eye size={14} /></button>
                    <button style={{ background: '#FEF3C7', color: '#D97706', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Edit size={14} /></button>
                    <button style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminDesktopWrapper>
  );
};

// SCREEN 28 — ADMIN VERIFICATION REQUESTS
export const Screen28Verification = () => {
  const { verificationRequests, handleApproveVerification } = useGas();

  return (
    <AdminDesktopWrapper activeTab="Verification Requests">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {verificationRequests.map(req => (
          <div key={req.id} className="gf-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{req.businessName}</h4>
                <span className={`status-pill ${req.status === 'APPROVED' ? 'available' : 'low_stock'}`}>{req.status}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                Owner: <strong>{req.ownerName}</strong> ({req.phone}) • Location: {req.location}
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                <span>📄 {req.idCardDoc}</span>
                <span>📄 {req.permitDoc}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="gf-btn gf-btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => handleApproveVerification(req.id)}>
                APPROVE
              </button>
              <button className="gf-btn gf-btn-outline" style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#EF4444' }}>
                REJECT
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminDesktopWrapper>
  );
};

// SCREEN 29 — ADMIN CUSTOMER DIRECTORY
export const Screen29Customers = () => {
  return (
    <AdminDesktopWrapper activeTab="Customers Directory">
      <div className="gf-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ padding: '12px' }}>Customer Name</th>
              <th style={{ padding: '12px' }}>Phone</th>
              <th style={{ padding: '12px' }}>Location</th>
              <th style={{ padding: '12px' }}>Orders Count</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'David Goodluck', phone: '0803 123 4567', loc: 'Ikeja, Lagos', orders: 14, status: 'ACTIVE' },
              { name: 'Tunde Adeleke', phone: '0812 444 5566', loc: 'Yaba, Lagos', orders: 8, status: 'ACTIVE' },
              { name: 'Mary Johnson', phone: '0809 999 1122', loc: 'Lekki Phase 1', orders: 21, status: 'ACTIVE' }
            ].map((c, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px', fontWeight: 800 }}>{c.name}</td>
                <td style={{ padding: '12px' }}>{c.phone}</td>
                <td style={{ padding: '12px' }}>{c.loc}</td>
                <td style={{ padding: '12px', fontWeight: 700 }}>{c.orders} orders</td>
                <td style={{ padding: '12px' }}><span className="status-pill available">{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminDesktopWrapper>
  );
};

// SCREEN 30 — ADMIN GLOBAL ORDER MONITOR
export const Screen30OrderMonitor = () => {
  const { orders } = useGas();

  return (
    <AdminDesktopWrapper activeTab="Orders Monitor">
      <div className="gf-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #E2E8F0' }}>
              <th style={{ padding: '12px' }}>Order #</th>
              <th style={{ padding: '12px' }}>Customer</th>
              <th style={{ padding: '12px' }}>Seller</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.orderNumber} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px', fontWeight: 800 }}>{o.orderNumber}</td>
                <td style={{ padding: '12px' }}>{o.customerName}</td>
                <td style={{ padding: '12px' }}>{o.sellerName}</td>
                <td style={{ padding: '12px', fontWeight: 800, color: '#059669' }}>₦{o.totalAmount.toLocaleString()}</td>
                <td style={{ padding: '12px' }}><span className="status-pill available">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminDesktopWrapper>
  );
};

// SCREEN 31 — ADMIN REPORTS & ANALYTICS
export const Screen31Reports = () => {
  return (
    <AdminDesktopWrapper activeTab="Reports & Analytics">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div className="gf-card">
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px' }}>Revenue Trend (NGN)</h4>
          <svg width="100%" height="180" viewBox="0 0 400 180">
            <path d="M 0 150 Q 80 80 160 110 T 320 30 L 400 70 L 400 180 L 0 180 Z" fill="#D1FAE5" opacity="0.5" />
            <path d="M 0 150 Q 80 80 160 110 T 320 30 L 400 70" fill="none" stroke="#10B981" strokeWidth="4" />
          </svg>
        </div>

        <div className="gf-card">
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px' }}>Most Popular Cylinder Sizes</h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px' }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="60" fill="none" stroke="#E2E8F0" strokeWidth="20" />
              <circle cx="80" cy="80" r="60" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="240 376" />
              <text x="80" y="85" textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">12.5kg (55%)</text>
            </svg>
          </div>
        </div>
      </div>
    </AdminDesktopWrapper>
  );
};

// SCREEN 32 — SYSTEM NOTIFICATIONS
export const Screen32Notifications = () => {
  return (
    <AdminDesktopWrapper activeTab="Notifications">
      <div className="gf-card">
        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px' }}>System Notifications Engine</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { msg: 'Order #GF10284 confirmed by ABC Gas Station.', time: '5 mins ago' },
            { msg: 'New Seller verification request submitted by V.I. Clean Gas.', time: '1 hour ago' },
            { msg: 'Stock low alert: Surulere Refill Hub has only 5 cylinders left.', time: '2 hours ago' }
          ].map((n, idx) => (
            <div key={idx} style={{ padding: '12px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={18} color="#059669" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{n.msg}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminDesktopWrapper>
  );
};

// SCREEN 33 — SAFETY & TRUST CENTER
export const Screen33Safety = () => {
  return (
    <AdminDesktopWrapper activeTab="Safety & Trust Center">
      <div className="gf-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>
          Safety & Regulatory Verification Standards
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px', lineHeight: 1.6 }}>
          GasFinder strictly enforces safety compliance guidelines for all listed vendors in Nigeria.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          <div style={{ padding: '16px', background: '#ECFDF5', borderRadius: '14px', border: '1px solid #A7F3D0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={22} color="#059669" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#047857' }}>Verified Filling Station Badge</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155' }}>
              Requires DPR/NMDPRA license verification and permanent station premises inspection.
            </p>
          </div>

          <div style={{ padding: '16px', background: '#EFF6FF', borderRadius: '14px', border: '1px solid #BFDBFE' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={22} color="#2563EB" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E40AF' }}>Verified Independent Seller Badge</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155' }}>
              Requires valid identity verification (NIN/Voters Card) and safety equipment certification.
            </p>
          </div>
        </div>
      </div>
    </AdminDesktopWrapper>
  );
};

// SCREEN 34 — SYSTEM SETTINGS
export const Screen34Settings = () => {
  return (
    <AdminDesktopWrapper activeTab="System Settings">
      <div className="gf-card">
        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Platform Configuration</h4>
        <div className="gf-input-group">
          <label className="gf-input-label">Platform Name</label>
          <input className="gf-input" defaultValue="GasFinder Nigeria" />
        </div>
        <div className="gf-input-group">
          <label className="gf-input-label">Support Helpline</label>
          <input className="gf-input" defaultValue="0800-GASFINDER" />
        </div>
        <button className="gf-btn gf-btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>
          SAVE CHANGES
        </button>
      </div>
    </AdminDesktopWrapper>
  );
};
