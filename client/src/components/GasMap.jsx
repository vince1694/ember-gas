import React from 'react';
import { MapPin, Navigation, ShieldCheck, Star, ChevronRight } from 'lucide-react';
import { useGas } from '../context/GasContext';

const GasMap = ({ onSelectSeller, isTracking = false, activeOrder }) => {
  const { sellers, selectedSeller, setSelectedSeller } = useGas();

  // Helper to determine primary status color of seller
  const getSellerPrimaryStatus = (seller) => {
    if (!seller.isOpen) return 'grey';
    const availableItems = seller.inventory.filter(i => i.status === 'AVAILABLE');
    const lowStockItems = seller.inventory.filter(i => i.status === 'LOW_STOCK');
    if (availableItems.length > 0) return 'green';
    if (lowStockItems.length > 0) return 'yellow';
    return 'red';
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px', background: '#E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
      {/* SVG Map Grid Background Simulation */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.85 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#F1F5F9" />
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Curved Roads / Highways */}
        <path d="M -50 150 Q 150 80 450 220 T 900 350" fill="none" stroke="#FFFFFF" strokeWidth="14" />
        <path d="M -50 150 Q 150 80 450 220 T 900 350" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="6 4" />
        
        <path d="M 180 -50 L 220 550" fill="none" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M 320 -50 L 290 550" fill="none" stroke="#E2E8F0" strokeWidth="8" />

        {/* Lagos Waterway Area Graphic */}
        <path d="M 0 320 C 120 280 240 380 400 340 L 400 500 L 0 500 Z" fill="#BAE6FD" opacity="0.6" />
        <text x="20" y="380" fill="#0284C7" fontSize="11" fontWeight="700" opacity="0.7">Lagos Lagoon</text>

        {/* Live Order Route Line if tracking */}
        {isTracking && (
          <>
            <path d="M 120 180 Q 200 130 280 220" fill="none" stroke="#059669" strokeWidth="4" strokeDasharray="6 4" />
            {/* Rider Location Pin */}
            <circle cx="200" cy="155" r="8" fill="#10B981" />
            <circle cx="200" cy="155" r="14" fill="#10B981" opacity="0.3" className="pulse-active" />
          </>
        )}
      </svg>

      {/* Map Pins for Sellers */}
      {!isTracking && sellers.map((seller) => {
        const statusColor = getSellerPrimaryStatus(seller);
        const isSelected = selectedSeller?.id === seller.id;

        return (
          <div
            key={seller.id}
            className={`map-pin ${isSelected ? 'active' : ''}`}
            style={{ left: `${seller.coords.x}%`, top: `${seller.coords.y}%` }}
            onClick={() => {
              setSelectedSeller(seller);
              if (onSelectSeller) onSelectSeller(seller);
            }}
          >
            <div className={`map-pin-bubble ${statusColor}`}>
              <MapPin size={12} />
              <span>{seller.name.split(' ')[0]}</span>
            </div>
            <div className={`map-pin-arrow ${statusColor}`} />
          </div>
        );
      })}

      {/* User Location Pulse Pin */}
      <div style={{ position: 'absolute', left: '25%', top: '48%', transform: 'translate(-50%, -50%)', zIndex: 12 }}>
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#3B82F6', border: '3px solid #FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
        <div style={{ position: 'absolute', inset: '-8px', borderRadius: '50%', background: '#3B82F6', opacity: 0.25 }} className="pulse-active" />
      </div>

      {/* Map Legend Overlay */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', padding: '8px 12px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="status-dot green" /> Available</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="status-dot yellow" /> Low Stock</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="status-dot red" /> Out of Stock</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="status-dot grey" /> Closed</div>
      </div>
    </div>
  );
};

export default GasMap;
