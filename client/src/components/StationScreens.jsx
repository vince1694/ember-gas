import React, { useState } from 'react';
import { Building2, ShieldCheck, Plus, ChevronRight, Store, MapPin, Phone, Users, BarChart } from 'lucide-react';
import { useGas } from '../context/GasContext';

export const Screen22CompanyDashboard = () => {
  const { navigateToScreen } = useGas();

  return (
    <div className="phone-body">
      <div style={{ padding: '16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>ABC GAS LTD</h3>
              <ShieldCheck size={18} color="#059669" />
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Verified LPG Station Company</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto' }}>
        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>TOTAL BRANCHES</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>5</h3>
          </div>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>TOTAL GAS STOCK</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>1,284 kg</h3>
          </div>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>TODAY'S SALES</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>₦235,600</h3>
          </div>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>TODAY'S ORDERS</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>124</h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Station Branches</h4>
          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 800, cursor: 'pointer' }} onClick={() => navigateToScreen(23)}>
            Manage
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { name: 'Ikeja Branch', stock: '46 × 12.5kg available', sales: '₦88,400' },
            { name: 'Yaba Branch', stock: '31 × 12.5kg available', sales: '₦62,100' },
            { name: 'Surulere Branch', stock: '28 × 12.5kg available', sales: '₦45,200' },
            { name: 'Lekki Branch', stock: '80 × 12.5kg available', sales: '₦120,500' },
            { name: 'Ajah Branch', stock: '0 × 12.5kg (Closed)', sales: '₦0' }
          ].map((b, idx) => (
            <div key={idx} className="gf-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{b.name}</h5>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>{b.stock}</span>
              </div>
              <button className="gf-btn gf-btn-secondary" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => navigateToScreen(25)}>
                VIEW
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Screen23BranchManagement = () => {
  const { navigateToScreen } = useGas();

  return (
    <div className="phone-body" style={{ background: '#F8FAFC' }}>
      <div style={{ padding: '16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>Your Branches</h3>
        <button className="gf-btn gf-btn-primary" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => navigateToScreen(24)}>
          <Plus size={14} /> ADD BRANCH
        </button>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto' }}>
        {[
          { name: 'ABC Gas — Ikeja', status: 'OPEN', stock: '48 × 12.5kg', sales: '₦88,400' },
          { name: 'ABC Gas — Yaba', status: 'OPEN', stock: '31 × 12.5kg', sales: '₦62,100' },
          { name: 'ABC Gas — Surulere', status: 'OPEN', stock: '28 × 12.5kg', sales: '₦45,200' }
        ].map((branch, idx) => (
          <div key={idx} className="gf-card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{branch.name}</h4>
              <span className="status-pill available">{branch.status}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '10px' }}>
              {branch.stock} available • Today: <strong>{branch.sales}</strong>
            </p>
            <button className="gf-btn gf-btn-outline" style={{ padding: '8px', fontSize: '0.8rem' }} onClick={() => navigateToScreen(25)}>
              VIEW BRANCH DASHBOARD
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Screen24AddBranch = () => {
  const { navigateToScreen } = useGas();

  return (
    <div className="phone-body" style={{ background: '#FFFFFF', padding: '20px', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Add New Branch</h3>

      <div className="gf-input-group">
        <label className="gf-input-label">Branch Name</label>
        <input className="gf-input" placeholder="e.g. ABC Gas — Lekki Phase 1" />
      </div>

      <div className="gf-input-group">
        <label className="gf-input-label">Branch Address</label>
        <input className="gf-input" placeholder="e.g. Admiralty Way, Lekki, Lagos" />
      </div>

      <div className="gf-input-group">
        <label className="gf-input-label">Phone Number</label>
        <input className="gf-input" placeholder="0809 111 2233" />
      </div>

      <div className="gf-input-group">
        <label className="gf-input-label">Manager Name</label>
        <input className="gf-input" placeholder="e.g. Samuel Okafor" />
      </div>

      <div className="gf-input-group">
        <label className="gf-input-label">Initial Stock (12.5kg count)</label>
        <input className="gf-input" defaultValue="50" />
      </div>

      <button className="gf-btn gf-btn-primary" style={{ marginTop: '14px' }} onClick={() => navigateToScreen(23)}>
        ADD BRANCH
      </button>
    </div>
  );
};

export const Screen25BranchDashboard = () => {
  const { navigateToScreen } = useGas();

  return (
    <div className="phone-body" style={{ background: '#F8FAFC' }}>
      <div style={{ padding: '16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>ABC Gas — Ikeja Branch</h3>
        <p style={{ fontSize: '0.78rem', color: '#64748B' }}>23 Allen Avenue, Ikeja, Lagos</p>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>STOCK</span>
            <strong style={{ display: 'block', fontSize: '1rem', marginTop: '2px', color: '#059669' }}>48 cylinders</strong>
          </div>
          <div className="gf-card">
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>TODAY SALES</span>
            <strong style={{ display: 'block', fontSize: '1rem', marginTop: '2px' }}>₦88,400</strong>
          </div>
        </div>

        <button className="gf-btn gf-btn-primary" onClick={() => navigateToScreen(18)}>
          MANAGE BRANCH INVENTORY
        </button>
      </div>
    </div>
  );
};
