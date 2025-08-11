import React from 'react';

interface MachineIconProps {
  type: 'washing' | 'drying';
  size?: number;
  className?: string;
  status?: 'available' | 'in-use' | 'reserved' | 'maintenance';
}

const MachineIcon: React.FC<MachineIconProps> = ({ 
  type, 
  size = 24, 
  className = '',
  status = 'available'
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return '#10B981'; // green
      case 'in-use':
        return '#EF4444'; // red
      case 'reserved':
        return '#F59E0B'; // yellow
      case 'maintenance':
        return '#9CA3AF'; // gray
      default:
        return '#6B7280'; // gray
    }
  };

  if (type === 'washing') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className={className}
        fill="none"
      >
        {/* Washing Machine Body */}
        <rect 
          x="15" 
          y="10" 
          width="70" 
          height="80" 
          rx="8" 
          fill="#E5E7EB" 
          stroke="#9CA3AF" 
          strokeWidth="2"
        />
        
        {/* Control Panel */}
        <rect 
          x="20" 
          y="15" 
          width="60" 
          height="12" 
          rx="4" 
          fill="#F3F4F6"
        />
        
        {/* Control Buttons */}
        <circle cx="25" cy="21" r="2" fill="#6B7280" />
        <circle cx="35" cy="21" r="2" fill="#6B7280" />
        <circle cx="75" cy="21" r="2" fill={getStatusColor()} />
        
        {/* Door Frame */}
        <circle 
          cx="50" 
          cy="55" 
          r="25" 
          fill="#F9FAFB" 
          stroke="#9CA3AF" 
          strokeWidth="2"
        />
        
        {/* Door Glass */}
        <circle 
          cx="50" 
          cy="55" 
          r="20" 
          fill="#E0F2FE" 
          stroke="#0891B2" 
          strokeWidth="1"
        />
        
        {/* Water/Clothes inside */}
        <circle 
          cx="50" 
          cy="55" 
          r="15" 
          fill="#BFDBFE" 
          opacity="0.7"
        />
        
        {/* Rotating element */}
        <circle 
          cx="50" 
          cy="55" 
          r="8" 
          fill="none" 
          stroke="#0891B2" 
          strokeWidth="2" 
          strokeDasharray="4,4"
        />
        
        {/* Door Handle */}
        <rect 
          x="75" 
          y="52" 
          width="3" 
          height="6" 
          rx="1.5" 
          fill="#9CA3AF"
        />
      </svg>
    );
  }

  // Drying Machine
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
    >
      {/* Dryer Body */}
      <rect 
        x="15" 
        y="10" 
        width="70" 
        height="80" 
        rx="8" 
        fill="#E5E7EB" 
        stroke="#9CA3AF" 
        strokeWidth="2"
      />
      
      {/* Control Panel */}
      <rect 
        x="20" 
        y="15" 
        width="60" 
        height="12" 
        rx="4" 
        fill="#F3F4F6"
      />
      
      {/* Control Buttons */}
      <circle cx="25" cy="21" r="2" fill="#6B7280" />
      <circle cx="35" cy="21" r="2" fill="#6B7280" />
      <circle cx="75" cy="21" r="2" fill={getStatusColor()} />
      
      {/* Door Frame */}
      <circle 
        cx="50" 
        cy="55" 
        r="25" 
        fill="#F9FAFB" 
        stroke="#9CA3AF" 
        strokeWidth="2"
      />
      
      {/* Door Glass */}
      <circle 
        cx="50" 
        cy="55" 
        r="20" 
        fill="#FEF3C7" 
        stroke="#F59E0B" 
        strokeWidth="1"
      />
      
      {/* Heat waves inside */}
      <g opacity="0.8">
        <path 
          d="M42 45 Q45 48, 48 45 T54 45" 
          stroke="#F59E0B" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M40 55 Q43 58, 46 55 T52 55 Q55 58, 58 55" 
          stroke="#F59E0B" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M42 65 Q45 68, 48 65 T54 65" 
          stroke="#F59E0B" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
      </g>
      
      {/* Rotating drum element */}
      <circle 
        cx="50" 
        cy="55" 
        r="12" 
        fill="none" 
        stroke="#F59E0B" 
        strokeWidth="1" 
        strokeDasharray="3,3"
        opacity="0.6"
      />
      
      {/* Door Handle */}
      <rect 
        x="75" 
        y="52" 
        width="3" 
        height="6" 
        rx="1.5" 
        fill="#9CA3AF"
      />
    </svg>
  );
};

export default MachineIcon;
