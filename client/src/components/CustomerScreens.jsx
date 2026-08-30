import React, { useState } from 'react';
import {
  MapPin, Search, Filter, Star, ShieldCheck, Phone, CheckCircle, Clock,
  ArrowRight, ChevronRight, Heart, Navigation, Truck, ShoppingBag, CreditCard,
  Building2, Store, User, Settings, Bell, HelpCircle, Shield, LogOut, MessageSquare
} from 'lucide-react';
import { useGas } from '../context/GasContext';
import GasMap from './GasMap';
import CylinderGraphic from './CylinderGraphic';

// Bottom Navigation Bar for Customer Screens
export const CustomerBottomNav = ({ activeTab = 'Home' }) => {
  const { navigateToScreen } = useGas();

  return (
    <div className="phone-bottom-nav">
      <button
        className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`}
        onClick={() => navigateToScreen(6)}
      >
        <ShoppingBag size={20} />
        <span>Home</span>
      </button>
      <button
        className={`nav-item ${activeTab === 'Map' ? 'active' : ''}`}
        onClick={() => navigateToScreen(7)}
      >
        <MapPin size={20} />
        <span>Map</span>
      </button>
      <button
        className={`nav-item ${activeTab === 'Orders' ? 'active' : ''}`}
        onClick={() => navigateToScreen(14)}
      >
        <Clock size={20} />
        <span>Orders</span>
      </button>
      <button
        className={`nav-item ${activeTab === 'Favorites' ? 'active' : ''}`}
        onClick={() => navigateToScreen(6)}
      >
        <Heart size={20} />
        <span>Favorites</span>
      </button>
      <button
        className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`}
        onClick={() => navigateToScreen(15)}
      >
        <User size={20} />
        <span>Profile</span>
      </button>
    </div>
  );
};

// SCREEN 6 — CUSTOMER HOME
export const Screen6CustomerHome = () => {
  const { navigateToScreen, sellers, setSelectedSeller } = useGas();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="phone-body">
      <div style={{ padding: '16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Good afternoon 👋</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>David Goodluck</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F1F5F9', padding: '6px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, color: '#059669', cursor: 'pointer' }}>
            <MapPin size={14} />
            <span>Ikeja, Lagos</span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginTop: '14px', position: 'relative' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="gf-input"
            style={{ paddingLeft: '42px', background: '#F8FAFC', borderRadius: '14px' }}
            placeholder="Search gas sellers near you..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto' }}>
        {/* Main Availability Summary Card */}
        <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#FFFFFF', borderRadius: '20px', padding: '18px', boxShadow: '0 8px 20px rgba(5,150,105,0.25)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.5px', opacity: 0.9 }}>
              GAS AVAILABILITY NEAR YOU
            </span>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
              146 Sellers Available
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 4px', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.7rem', display: 'block', opacity: 0.9 }}>6kg</span>
              <strong style={{ fontSize: '0.95rem' }}>42 avail</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.22)', padding: '8px 4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)' }}>
              <span style={{ fontSize: '0.7rem', display: 'block', opacity: 0.9 }}>12.5kg</span>
              <strong style={{ fontSize: '0.95rem' }}>83 avail</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 4px', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.7rem', display: 'block', opacity: 0.9 }}>25kg</span>
              <strong style={{ fontSize: '0.95rem' }}>21 avail</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 4px', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.7rem', display: 'block', opacity: 0.9 }}>50kg</span>
              <strong style={{ fontSize: '0.95rem' }}>14 avail</strong>
            </div>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '22px' }}>
          <button style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => navigateToScreen(7)}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>FIND GAS</span>
          </button>
          <button style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => navigateToScreen(10)}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>ORDER GAS</span>
          </button>
          <button style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => navigateToScreen(7)}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={20} />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>SELLERS</span>
          </button>
          <button style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => navigateToScreen(14)}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>MY ORDERS</span>
          </button>
        </div>

        {/* Nearby Sellers List Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Gas Sellers Near You</h4>
          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigateToScreen(7)}>
            See All
          </span>
        </div>

        {/* Seller Cards */}
        {sellers.slice(0, 3).map((seller) => (
          <div key={seller.id} className="gf-card" style={{ marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <CylinderGraphic size="12.5kg" status={seller.isOpen ? 'AVAILABLE' : 'CLOSED'} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827' }}>{seller.name}</h5>
                {seller.isVerified && <ShieldCheck size={16} color="#059669" />}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#64748B', margin: '4px 0 6px' }}>
                <span>{seller.distanceKm} km away</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#D97706', fontWeight: 700 }}>
                  <Star size={12} fill="#F59E0B" /> {seller.rating}
                </span>
                <span>•</span>
                <span style={{ color: seller.isOpen ? '#10B981' : '#6B7280', fontWeight: 700 }}>
                  {seller.isOpen ? 'OPEN NOW' : 'CLOSED'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>
                  ₦1,450/kg
                </span>
                <button
                  className="gf-btn gf-btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.75rem', width: 'auto' }}
                  onClick={() => {
                    setSelectedSeller(seller);
                    navigateToScreen(9);
                  }}
                >
                  VIEW
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CustomerBottomNav activeTab="Home" />
    </div>
  );
};

// SCREEN 7 — LIVE GAS MAP
export const Screen7LiveGasMap = () => {
  const { navigateToScreen, selectedSeller, setSelectedSeller } = useGas();

  return (
    <div className="phone-body">
      {/* Top Header & Search Bar */}
      <div style={{ padding: '12px 16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>Find Gas Near You</h3>
          <button style={{ background: '#F1F5F9', border: 'none', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigateToScreen(8)}>
            <Filter size={14} /> Filter
          </button>
        </div>

        {/* Filter Pills Horizontal Scroll */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ background: '#059669', color: '#FFF', padding: '4px 10px', borderRadius: '14px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>12.5kg</span>
          <span style={{ background: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '14px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Within 5km</span>
          <span style={{ background: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '14px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Available Now</span>
          <span style={{ background: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '14px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Filling Stations</span>
        </div>
      </div>

      {/* Interactive Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <GasMap onSelectSeller={setSelectedSeller} />

        {/* Bottom Drawer Preview Card when Seller Selected */}
        {selectedSeller && (
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: '#FFFFFF', borderRadius: '18px', padding: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.18)', zIndex: 40, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>{selectedSeller.name}</h4>
                  {selectedSeller.isVerified && <ShieldCheck size={16} color="#059669" />}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  {selectedSeller.distanceKm} km away • {selectedSeller.locationName}
                </p>
              </div>
              <span className={`status-pill ${selectedSeller.isOpen ? 'available' : 'closed'}`}>
                {selectedSeller.isOpen ? 'OPEN NOW' : 'CLOSED'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0 10px', background: '#F8FAFC', padding: '8px 12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>12.5kg Available</span>
              <strong style={{ fontSize: '0.95rem', color: '#059669' }}>₦1,450 / kg</strong>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="gf-btn gf-btn-outline"
                style={{ flex: 1, padding: '10px', fontSize: '0.8rem' }}
                onClick={() => navigateToScreen(9)}
              >
                VIEW SELLER
              </button>
              <button
                className="gf-btn gf-btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.8rem' }}
                onClick={() => navigateToScreen(10)}
              >
                ORDER NOW
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ background: '#1E293B', color: '#F8FAFC', padding: '8px 16px', fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', borderTop: '1px solid #334155' }}>
        Gas available within 5km: <strong>12.5kg — 86 cylinders</strong>
      </div>

      <CustomerBottomNav activeTab="Map" />
    </div>
  );
};

// SCREEN 8 — FILTER
export const Screen8Filter = () => {
  const { navigateToScreen, filters, setFilters } = useGas();

  return (
    <div className="phone-body" style={{ background: '#FFFFFF', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>Filter Gas Sellers</h3>
          <button style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => setFilters({ cylinderSize: '12.5kg', sellerType: 'All', availability: 'All', distance: '5 km', priceSort: 'Low to High', deliveryMode: 'Both' })}>
            RESET
          </button>
        </div>

        {/* Cylinder Size */}
        <div style={{ marginBottom: '18px' }}>
          <label className="gf-input-label">Cylinder Size</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '6px' }}>
            {['6kg', '12.5kg', '25kg', '50kg'].map(size => (
              <button
                key={size}
                onClick={() => setFilters({ ...filters, cylinderSize: size })}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  border: filters.cylinderSize === size ? '2px solid #059669' : '1px solid #E2E8F0',
                  background: filters.cylinderSize === size ? '#ECFDF5' : '#FFFFFF',
                  color: filters.cylinderSize === size ? '#059669' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Seller Type */}
        <div style={{ marginBottom: '18px' }}>
          <label className="gf-input-label">Seller Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
            {['Filling Station', 'Independent Seller', 'All'].map(type => (
              <button
                key={type}
                onClick={() => setFilters({ ...filters, sellerType: type })}
                style={{
                  padding: '8px',
                  borderRadius: '12px',
                  border: filters.sellerType === type ? '2px solid #059669' : '1px solid #E2E8F0',
                  background: filters.sellerType === type ? '#ECFDF5' : '#FFFFFF',
                  color: filters.sellerType === type ? '#059669' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div style={{ marginBottom: '18px' }}>
          <label className="gf-input-label">Availability</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
            {['Available', 'Low Stock', 'All'].map(avail => (
              <button
                key={avail}
                onClick={() => setFilters({ ...filters, availability: avail })}
                style={{
                  padding: '8px',
                  borderRadius: '12px',
                  border: filters.availability === avail ? '2px solid #059669' : '1px solid #E2E8F0',
                  background: filters.availability === avail ? '#ECFDF5' : '#FFFFFF',
                  color: filters.availability === avail ? '#059669' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {avail}
              </button>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div style={{ marginBottom: '18px' }}>
          <label className="gf-input-label">Maximum Distance</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '6px' }}>
            {['1 km', '3 km', '5 km', '10 km'].map(dist => (
              <button
                key={dist}
                onClick={() => setFilters({ ...filters, distance: dist })}
                style={{
                  padding: '8px',
                  borderRadius: '12px',
                  border: filters.distance === dist ? '2px solid #059669' : '1px solid #E2E8F0',
                  background: filters.distance === dist ? '#ECFDF5' : '#FFFFFF',
                  color: filters.distance === dist ? '#059669' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="gf-btn gf-btn-primary" onClick={() => navigateToScreen(7)}>
        APPLY FILTERS
      </button>
    </div>
  );
};

// SCREEN 9 — SELLER DETAILS
export const Screen9SellerDetails = () => {
  const { navigateToScreen, selectedSeller } = useGas();
  const seller = selectedSeller || {
    name: 'ABC GAS STATION',
    isVerified: true,
    rating: 4.8,
    reviewCount: 126,
    distanceKm: 1.2,
    address: '23 Allen Avenue, Ikeja, Lagos',
    phone: '0803 123 4567',
    openingHours: 'Open 8:00 AM - 7:00 PM'
  };

  return (
    <div className="phone-body" style={{ background: '#F8FAFC' }}>
      <div style={{ padding: '16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{seller.name}</h3>
              {seller.isVerified && <ShieldCheck size={18} color="#059669" />}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>{seller.address}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D97706' }}>
            <Star size={14} fill="#F59E0B" /> {seller.rating} ({seller.reviewCount} reviews)
          </span>
          <span>•</span>
          <span>{seller.distanceKm} km away</span>
          <span>•</span>
          <span style={{ color: '#10B981' }}>OPEN NOW</span>
        </div>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>
          Available Gas Stock
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
          <div className="gf-card" style={{ textAlign: 'center' }}>
            <CylinderGraphic size="6kg" status="AVAILABLE" />
            <h5 style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '4px' }}>6kg Refill</h5>
            <span className="status-pill available" style={{ margin: '4px 0' }}>Available</span>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#059669' }}>₦1,300/kg</strong>
          </div>
          <div className="gf-card" style={{ textAlign: 'center', border: '2px solid #059669' }}>
            <CylinderGraphic size="12.5kg" status="AVAILABLE" />
            <h5 style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '4px' }}>12.5kg Refill</h5>
            <span className="status-pill available" style={{ margin: '4px 0' }}>Available</span>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#059669' }}>₦1,450/kg</strong>
          </div>
          <div className="gf-card" style={{ textAlign: 'center' }}>
            <CylinderGraphic size="25kg" status="LOW_STOCK" />
            <h5 style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '4px' }}>25kg Refill</h5>
            <span className="status-pill low_stock" style={{ margin: '4px 0' }}>Low Stock</span>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#D97706' }}>₦2,800/kg</strong>
          </div>
          <div className="gf-card" style={{ textAlign: 'center', opacity: 0.6 }}>
            <CylinderGraphic size="50kg" status="OUT_OF_STOCK" />
            <h5 style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '4px' }}>50kg Refill</h5>
            <span className="status-pill out_of_stock" style={{ margin: '4px 0' }}>Out of Stock</span>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#EF4444' }}>₦0</strong>
          </div>
        </div>

        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
          Customer Reviews
        </h4>
        <div className="gf-card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ fontSize: '0.85rem' }}>Emeka A.</strong>
            <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700 }}>⭐⭐⭐⭐⭐ 5.0</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
            "Very fast service and accurate gas weights. Cylinder was sealed properly!"
          </p>
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <button className="gf-btn gf-btn-primary" onClick={() => navigateToScreen(10)}>
          ORDER GAS
        </button>
      </div>
    </div>
  );
};

// SCREEN 10 — ORDER GAS
export const Screen10OrderGas = () => {
  const { navigateToScreen, createNewOrder } = useGas();
  const [qty, setQty] = useState(2);
  const [payMethod, setPayMethod] = useState('Card');

  const unitPrice = 1250;
  const gasPriceTotal = unitPrice * qty;
  const deliveryFee = 500;
  const serviceFee = 100;
  const totalAmount = gasPriceTotal + deliveryFee + serviceFee;

  const handlePlaceOrder = () => {
    createNewOrder({
      sellerName: 'ABC Gas Station',
      cylinderSize: '12.5kg',
      quantity: qty,
      gasPriceTotal,
      deliveryFee,
      serviceFee,
      totalAmount,
      paymentMethod: payMethod
    });
  };

  return (
    <div className="phone-body" style={{ background: '#FFFFFF', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Order Gas</h3>

        <div className="gf-card" style={{ marginBottom: '14px' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>SELLER</span>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>ABC Gas Station</h4>
          <p style={{ fontSize: '0.78rem', color: '#64748B' }}>1.2 km away • Ikeja, Lagos</p>
        </div>

        {/* Cylinder & Qty Counter */}
        <div className="gf-card" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CylinderGraphic size="12.5kg" height={44} status="AVAILABLE" />
            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 800 }}>12.5kg Cylinder Refill</h5>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>₦1,250 / cylinder</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F5F9', padding: '4px 10px', borderRadius: '12px' }}>
            <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer' }} onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
            <strong style={{ fontSize: '0.95rem' }}>{qty}</strong>
            <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer' }} onClick={() => setQty(qty + 1)}>+</button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="gf-card" style={{ marginBottom: '14px' }}>
          <h5 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '10px' }}>Price Details</h5>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '6px' }}>
            <span>Gas Price (12.5kg × {qty})</span>
            <strong>₦{gasPriceTotal.toLocaleString()}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '6px' }}>
            <span>Delivery Fee</span>
            <strong>₦{deliveryFee}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '10px' }}>
            <span>Service Fee</span>
            <strong>₦{serviceFee}</strong>
          </div>
          <div style={{ height: '1px', background: '#E2E8F0', margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>
            <span>TOTAL</span>
            <strong style={{ color: '#059669' }}>₦{totalAmount.toLocaleString()}</strong>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="gf-input-group">
          <label className="gf-input-label">Delivery Address</label>
          <input className="gf-input" defaultValue="23 Allen Avenue, Ikeja, Lagos" />
        </div>
      </div>

      <button className="gf-btn gf-btn-primary" onClick={() => navigateToScreen(11)}>
        PROCEED TO PAYMENT (₦{totalAmount.toLocaleString()})
      </button>
    </div>
  );
};

// SCREEN 11 — PAYMENT
export const Screen11Payment = () => {
  const { navigateToScreen, createNewOrder } = useGas();
  const [method, setMethod] = useState('Card');

  return (
    <div className="phone-body" style={{ background: '#FFFFFF', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Payment Method</h3>

        <div className="gf-card" style={{ marginBottom: '20px', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>ORDER AMOUNT</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>₦3,100</h2>
          <span style={{ fontSize: '0.78rem', color: '#475569' }}>12.5kg × 2 Cylinder Refill</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {['Card', 'Bank Transfer', 'Wallet'].map(m => (
            <div
              key={m}
              onClick={() => setMethod(m)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '14px',
                borderRadius: '14px',
                border: method === m ? '2px solid #059669' : '1px solid #E2E8F0',
                background: method === m ? '#ECFDF5' : '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={20} color="#059669" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{m}</span>
              </div>
              <input type="radio" checked={method === m} readOnly style={{ accentColor: '#059669' }} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: '#64748B', marginBottom: '12px' }}>
          <ShieldCheck size={16} color="#059669" /> Your payment is protected with Paystack SSL security.
        </div>
        <button className="gf-btn gf-btn-primary" onClick={() => createNewOrder({})}>
          PAY NOW (₦3,100)
        </button>
      </div>
    </div>
  );
};

// SCREEN 12 — ORDER CONFIRMATION
export const Screen12OrderConfirmation = () => {
  const { navigateToScreen, activeOrder } = useGas();
  const ord = activeOrder || { orderNumber: '#GF10284', sellerName: 'ABC Gas Station' };

  return (
    <div className="phone-body" style={{ background: '#FFFFFF', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ marginTop: '30px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <CheckCircle size={48} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Order Confirmed!</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '6px' }}>
          Your gas order has been received by {ord.sellerName}.
        </p>

        <div className="gf-card" style={{ margin: '24px 0', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Order Number</span>
            <strong style={{ fontSize: '0.85rem', color: '#111827' }}>{ord.orderNumber}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Seller</span>
            <strong style={{ fontSize: '0.85rem', color: '#111827' }}>{ord.sellerName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Estimated Delivery</span>
            <strong style={{ fontSize: '0.85rem', color: '#059669' }}>30–45 minutes</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="gf-btn gf-btn-primary" onClick={() => navigateToScreen(13)}>
          TRACK ORDER
        </button>
        <button className="gf-btn gf-btn-outline" onClick={() => navigateToScreen(14)}>
          VIEW ALL ORDERS
        </button>
      </div>
    </div>
  );
};

// SCREEN 13 — LIVE ORDER TRACKING
export const Screen13LiveOrderTracking = () => {
  const { navigateToScreen, activeOrder } = useGas();
  const ord = activeOrder || { orderNumber: '#GF10284', rider: { name: 'Michael', rating: 4.9, phone: '0802 987 6543' } };

  return (
    <div className="phone-body">
      {/* Interactive Map Header */}
      <div style={{ height: '260px', position: 'relative' }}>
        <GasMap isTracking={true} activeOrder={ord} />
      </div>

      <div style={{ padding: '16px', background: '#FFFFFF', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Track Your Order</h4>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Order {ord.orderNumber}</span>
          </div>
          <span style={{ background: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 800 }}>
            ETA: 15 mins
          </span>
        </div>

        {/* Order Status Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', paddingLeft: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={18} color="#10B981" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827' }}>ORDER CONFIRMED ✓</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={18} color="#10B981" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827' }}>SELLER PREPARING ✓</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={10} color="#FFF" />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>RIDER ON THE WAY</span>
          </div>
        </div>

        {/* Rider Card */}
        <div className="gf-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#059669', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              M
            </div>
            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{ord.rider.name} (Delivery Rider)</h5>
              <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>⭐ {ord.rider.rating}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button style={{ background: '#ECFDF5', color: '#059669', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
              <Phone size={16} />
            </button>
            <button style={{ background: '#ECFDF5', color: '#059669', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
              <MessageSquare size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// SCREEN 14 — CUSTOMER ORDERS
export const Screen14CustomerOrders = () => {
  const { navigateToScreen, orders } = useGas();
  const [tab, setTab] = useState('ACTIVE');

  return (
    <div className="phone-body">
      <div style={{ padding: '16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>My Orders</h3>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ACTIVE', 'COMPLETED', 'CANCELLED'].map(t => (
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
          <div key={ord.orderNumber} className="gf-card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ fontSize: '0.85rem', color: '#111827' }}>{ord.orderNumber}</strong>
              <span className="status-pill available">{ord.status}</span>
            </div>

            <h5 style={{ fontSize: '0.92rem', fontWeight: 800 }}>{ord.sellerName}</h5>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 8px' }}>
              {ord.cylinderSize} × {ord.quantity} • ₦{ord.totalAmount.toLocaleString()}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{ord.createdAt}</span>
              <button className="gf-btn gf-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', width: 'auto' }} onClick={() => navigateToScreen(13)}>
                TRACK
              </button>
            </div>
          </div>
        ))}
      </div>

      <CustomerBottomNav activeTab="Orders" />
    </div>
  );
};

// SCREEN 15 — CUSTOMER PROFILE
export const Screen15CustomerProfile = () => {
  const { navigateToScreen, user } = useGas();

  return (
    <div className="phone-body" style={{ background: '#F8FAFC' }}>
      <div style={{ padding: '20px 16px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#059669', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
          DG
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{user.name}</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>{user.phone}</p>
        </div>
      </div>

      <div style={{ padding: '16px', overflowY: 'auto' }}>
        <div className="gf-card" style={{ padding: '0', overflow: 'hidden' }}>
          {[
            { label: 'Edit Profile', icon: User, screen: 15 },
            { label: 'My Orders', icon: Clock, screen: 14 },
            { label: 'Saved Sellers', icon: Heart, screen: 6 },
            { label: 'Saved Addresses', icon: MapPin, screen: 6 },
            { label: 'Payment Methods', icon: CreditCard, screen: 11 },
            { label: 'Notifications', icon: Bell, screen: 32 },
            { label: 'Help & Support', icon: HelpCircle, screen: 33 },
            { label: 'Safety Center', icon: Shield, screen: 33 },
            { label: 'Settings', icon: Settings, screen: 34 },
            { label: 'Logout', icon: LogOut, screen: 3 }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigateToScreen(item.screen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '14px 16px',
                borderBottom: idx === 9 ? 'none' : '1px solid #F1F5F9',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <item.icon size={18} color={item.label === 'Logout' ? '#EF4444' : '#059669'} />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: item.label === 'Logout' ? '#EF4444' : '#111827' }}>
                  {item.label}
                </span>
              </div>
              <ChevronRight size={16} color="#94A3B8" />
            </div>
          ))}
        </div>
      </div>

      <CustomerBottomNav activeTab="Profile" />
    </div>
  );
};
