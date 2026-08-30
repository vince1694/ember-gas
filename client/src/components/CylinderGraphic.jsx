import React from 'react';

const CylinderGraphic = ({ size = '12.5kg', height = 64, color = '#059669', status = 'AVAILABLE' }) => {
  // Height ratios for cylinder sizes
  const getDimensions = () => {
    switch (size) {
      case '6kg': return { w: 32, h: 48, label: '6kg' };
      case '12.5kg': return { w: 42, h: 64, label: '12.5kg' };
      case '25kg': return { w: 50, h: 80, label: '25kg' };
      case '50kg': return { w: 58, h: 96, label: '50kg' };
      default: return { w: 42, h: 64, label: size };
    }
  };

  const { w, h, label } = getDimensions();

  const getStatusFill = () => {
    switch (status) {
      case 'AVAILABLE': return '#10B981';
      case 'LOW_STOCK': return '#F59E0B';
      case 'OUT_OF_STOCK': return '#EF4444';
      case 'CLOSED': return '#9CA3AF';
      default: return color;
    }
  };

  const fill = getStatusFill();

  return (
    <div className="cylinder-render">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="cylinder-icon-svg">
        <defs>
          <linearGradient id={`cylGrad-${size}-${fill}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fill} />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor={fill} />
          </linearGradient>
        </defs>

        {/* Cylinder Top Handle / Guard Ring */}
        <path d={`M ${w * 0.25} ${h * 0.12} L ${w * 0.25} ${h * 0.04} Q ${w * 0.5} 0 ${w * 0.75} ${h * 0.04} L ${w * 0.75} ${h * 0.12}`} fill="none" stroke="#1F2937" strokeWidth="2.5" />
        <rect x={w * 0.42} y={h * 0.06} width={w * 0.16} height={h * 0.08} fill="#9CA3AF" rx="1" />

        {/* Main Body */}
        <rect x="2" y={h * 0.16} width={w - 4} height={h * 0.74} rx={w * 0.2} fill={`url(#cylGrad-${size}-${fill})`} stroke="#047857" strokeWidth="1.5" />

        {/* Center Welded Ring Line */}
        <line x1="2" y1={h * 0.53} x2={w - 2} y2={h * 0.53} stroke="#047857" strokeWidth="1.5" opacity="0.6" />

        {/* Bottom Ring Base */}
        <path d={`M 4 ${h * 0.9} Q ${w * 0.5} ${h * 0.96} ${w - 4} ${h * 0.9} L ${w - 6} ${h} L 6 ${h} Z`} fill="#374151" />

        {/* Size Label on Tank */}
        <text x={w * 0.5} y={h * 0.5} textAnchor="middle" fill="#FFFFFF" fontSize={w * 0.24} fontWeight="800">
          {label.replace('kg', '')}
        </text>
      </svg>
    </div>
  );
};

export default CylinderGraphic;
