import React from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';
import { LaundryStore } from '@/types';
import MachineIcon from './machine-icon';

interface StoreCardProps {
  store: LaundryStore;
  onSelect?: () => void;
  onNavigate?: () => void;
  onCall?: () => void;
  className?: string;
}

const StoreCard: React.FC<StoreCardProps> = ({ 
  store, 
  onSelect,
  onNavigate,
  onCall,
  className = ""
}) => {
  const availableWashing = store.washingMachines.filter(m => m.status === 'available').length;
  const totalWashing = store.washingMachines.length;
  const availableDrying = store.dryingMachines.filter(m => m.status === 'available').length;
  const totalDrying = store.dryingMachines.length;

  const getStatusText = (available: number, total: number) => {
    if (available === total) return 'Sẵn';
    if (available === 0) return 'Hết';
    return 'Còn';
  };

  const getStatusColor = (available: number, total: number) => {
    if (available === total) return 'bg-green-600';
    if (available === 0) return 'bg-red-600';
    return 'bg-orange-500';
  };

  return (
    <Box className={`clean-card card-bg-animated overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer relative ${className}`}>
      {/* Background Image */}
      <Box 
        className="absolute inset-0 opacity-8 store-pattern"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(6, 182, 212, 0.03) 0%, transparent 50%),
            linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(139, 92, 246, 0.01) 50%, rgba(6, 182, 212, 0.02) 100%)
          `,
          backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="1.5" fill="%233b82f6" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="400" height="200" fill="url(%23dots)"/>
              <!-- Washing machine icons -->
              <g opacity="0.04">
                <rect x="50" y="30" width="25" height="25" rx="4" fill="%233b82f6"/>
                <circle cx="62.5" cy="42.5" r="8" fill="none" stroke="%23ffffff" stroke-width="1"/>
                <circle cx="62.5" cy="42.5" r="3" fill="%23ffffff"/>
              </g>
              <g opacity="0.03">
                <rect x="320" y="120" width="20" height="20" rx="3" fill="%238b5cf6"/>
                <circle cx="330" cy="130" r="6" fill="none" stroke="%23ffffff" stroke-width="0.8"/>
                <circle cx="330" cy="130" r="2" fill="%23ffffff"/>
              </g>
              <!-- Decorative elements -->
              <circle cx="150" cy="50" r="2" fill="%2310b981" opacity="0.06"/>
              <circle cx="250" cy="150" r="3" fill="%23f59e0b" opacity="0.05"/>
              <circle cx="350" cy="40" r="1.5" fill="%23ef4444" opacity="0.04"/>
            </svg>
          `)}')`
        }}
      />
      
      {/* Store Info */}
      <Box className="relative z-10 p-4">
        <Box flex className="items-start justify-between mb-3">
          <Box className="flex-1 min-w-0 pr-3">
            <Text.Title size="small" className="font-semibold mb-1 text-gray-900 truncate">
              {store.name}
            </Text.Title>
            <Text size="xSmall" className="text-gray-500 mb-2 line-clamp-2">
              {store.address}
            </Text>
            <Box flex className="items-center space-x-3 flex-wrap">
              <Box flex className="items-center space-x-1">
                <Icon icon="zi-star" className="text-yellow-500 icon-sm" />
                <Text size="xSmall" className="font-medium">{store.rating}</Text>
              </Box>
              <Box flex className="items-center space-x-1">
                <Icon icon="zi-location" className="icon-primary icon-sm" />
                <Text size="xSmall" className="text-gray-600">{store.distance}</Text>
              </Box>
              <Box className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                store.status === 'open' 
                  ? 'status-modern-available' 
                  : 'status-modern-maintenance'
              }`}>
                {store.status === 'open' ? 'Mở cửa' : 'Đóng cửa'}
              </Box>
            </Box>
          </Box>
          
          <Box flex className="space-x-1 ml-2">
            {onCall && (
              <Button
                size="small"
                variant="tertiary"
                icon={<Icon icon="zi-call" className="icon-success" />}
                onClick={onCall}
                className="bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 transition-all duration-200"
              />
            )}
            {onNavigate && (
              <Button
                size="small"
                variant="tertiary"
                icon={<Icon icon="zi-location" className="icon-primary" />}
                onClick={onNavigate}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all duration-200"
              />
            )}
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-star" className="icon-warning" />}
              className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 transition-all duration-200"
            />
          </Box>
        </Box>
      </Box>

      {/* Machine Status */}
      <Box className="relative z-10 bg-gradient-to-br from-gray-50 to-blue-50 p-4 border-t border-gray-100">
        {/* Header Row */}
        <Box flex className="items-center justify-between mb-3">
          <Text size="small" className="font-semibold text-gray-900">Trạng thái máy</Text>
          <Text size="small" className="font-medium text-gray-500">Chi tiết</Text>
        </Box>
        
        {/* Machine Status Row */}
        <Box flex className="items-center justify-between">
          {/* Washing Machines */}
          <Box flex className="items-center space-x-3">
            <Box className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Text size="xxSmall" className="font-bold text-white">GIẶT</Text>
            </Box>
            <Box className="w-12 h-12 rounded-lg bg-white border-2 border-blue-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200">
              <MachineIcon type="washing" size={24} status="available" />
            </Box>
            <Box>
              <Box className={`text-white px-3 py-1 rounded-lg text-xs font-semibold mb-1 ${getStatusColor(availableWashing, totalWashing)}`}>
                {getStatusText(availableWashing, totalWashing)}
              </Box>
              <Text size="small" className="font-bold gradient-text">
                {availableWashing}/{totalWashing}
              </Text>
            </Box>
          </Box>

          {/* Drying Machines */}
          <Box flex className="items-center space-x-3">
            <Box className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
              <Text size="xxSmall" className="font-bold text-white">SẤY</Text>
            </Box>
            <Box className="w-12 h-12 rounded-lg bg-white border-2 border-purple-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200">
              <MachineIcon type="drying" size={24} status="available" />
            </Box>
            <Box>
              <Box className={`text-white px-3 py-1 rounded-lg text-xs font-semibold mb-1 ${getStatusColor(availableDrying, totalDrying)}`}>
                {getStatusText(availableDrying, totalDrying)}
              </Box>
              <Text size="small" className="font-bold gradient-text">
                {availableDrying}/{totalDrying}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StoreCard;
