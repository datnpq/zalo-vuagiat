import React from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';
import { Machine } from '@/types';
import MachineIcon from './machine-icon';

interface MachineCardProps {
  machine: Machine;
  onSelect?: () => void;
  showProgress?: boolean;
  progress?: number;
  remainingTime?: number;
}

const MachineCard: React.FC<MachineCardProps> = ({ 
  machine, 
  onSelect, 
  showProgress = false,
  progress = 0,
  remainingTime 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'status-modern-available';
      case 'in-use': return 'status-modern-unavailable';
      case 'occupied': return 'status-modern-unavailable'; // backward compatibility
      case 'reserved': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'maintenance': return 'status-modern-maintenance';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Sẵn';
      case 'in-use': return 'Hết';
      case 'occupied': return 'Hết'; // backward compatibility
      case 'reserved': return 'Đặt';
      case 'maintenance': return 'Bảo trì';
      default: return '?';
    }
  };

  return (
    <Box className="clean-card hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <Box 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="machine-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="${machine.type === 'washing' ? '%233b82f6' : '%238b5cf6'}" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="200" height="100" fill="url(%23machine-pattern)"/>
              <circle cx="30" cy="25" r="8" fill="none" stroke="${machine.type === 'washing' ? '%233b82f6' : '%238b5cf6'}" stroke-width="1" opacity="0.04"/>
              <circle cx="170" cy="75" r="6" fill="none" stroke="${machine.type === 'washing' ? '%2310b981' : '%23f59e0b'}" stroke-width="0.8" opacity="0.03"/>
            </svg>
          `)}')`
        }}
      />
      
      <Box flex className="items-center justify-between mb-4 relative z-10">
        <Box flex className="items-center space-x-3">
          <Box className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
            <MachineIcon 
              type={machine.type} 
              size={24} 
              status={machine.status}
              className="text-white"
            />
          </Box>
          <Box>
            <Text.Title size="small" className="font-bold text-gray-800">
              {machine.type === 'washing' ? 'Máy giặt' : 'Máy sấy'}
            </Text.Title>
            <Text size="small" className="text-gray-500">
              {machine.capacity}kg • <span className="gradient-text font-semibold">{machine.price.toLocaleString()}đ</span>
            </Text>
          </Box>
        </Box>
        
        <Box className={`px-3 py-2 rounded-xl border transition-all duration-200 ${getStatusColor(machine.status)}`}>
          <Text size="small" className="font-bold">
            {getStatusText(machine.status)}
          </Text>
        </Box>
      </Box>

      {showProgress && (
        <Box className="mb-3 relative z-10">
          <Box flex className="items-center justify-between mb-2">
            <Text size="small" className="font-medium">
              {machine.type === 'washing' ? 'Đang giặt' : 'Đang sấy'}
            </Text>
            <Text size="small" className="text-gray-600">
              {progress}%
            </Text>
          </Box>
          <Box className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <Box 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </Box>
          {remainingTime && (
            <Text size="xSmall" className="text-gray-500 mt-1">
              <Icon icon="zi-clock-1" className="mr-1 icon-secondary icon-xs" />
              {remainingTime} phút còn lại
            </Text>
          )}
        </Box>
      )}

      {machine.features.length > 0 && (
        <Box className="mb-3 relative z-10">
          <Box flex className="flex-wrap gap-2">
            {machine.features.map((feature, index) => (
              <Box key={index} className="bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 transition-all duration-200">
                <Text size="xxSmall" className="text-gray-700 font-medium">
                  {feature}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {onSelect && machine.status === 'available' && (
        <Button
          fullWidth
          variant="primary"
          size="small"
          onClick={onSelect}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 relative z-10"
        >
          Chọn máy này
        </Button>
      )}

      {machine.status === 'in-use' && remainingTime && (
        <Button
          fullWidth
          variant="tertiary"
          size="small"
          onClick={onSelect}
          className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-semibold relative z-10"
        >
          Theo dõi
        </Button>
      )}
    </Box>
  );
};

export default MachineCard;
