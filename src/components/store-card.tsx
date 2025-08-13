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
    <Box
      className={`store-card-enhanced clean-card card-bg-animated overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer relative group ${className}`}
      onClick={onSelect}
    >
      {/* Enhanced Background with Modern Gradient */}
      <Box
        className="absolute inset-0 opacity-10 store-pattern"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 85% 80%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 40% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 40%),
            linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.03) 50%, rgba(6, 182, 212, 0.05) 100%)
          `,
          backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="%233b82f6" opacity="0.15"/>
                </pattern>
              </defs>
              <rect width="400" height="200" fill="url(%23dots)"/>
              <!-- Washing machine icons -->
              <g opacity="0.08">
                <rect x="50" y="30" width="30" height="30" rx="6" fill="%233b82f6"/>
                <circle cx="65" cy="45" r="10" fill="none" stroke="%23ffffff" stroke-width="1.5"/>
                <circle cx="65" cy="45" r="4" fill="%23ffffff"/>
              </g>
              <g opacity="0.06">
                <rect x="320" y="120" width="25" height="25" rx="4" fill="%238b5cf6"/>
                <circle cx="332.5" cy="132.5" r="7" fill="none" stroke="%23ffffff" stroke-width="1"/>
                <circle cx="332.5" cy="132.5" r="2.5" fill="%23ffffff"/>
              </g>
              <!-- Decorative elements -->
              <circle cx="150" cy="50" r="3" fill="%2310b981" opacity="0.1"/>
              <circle cx="250" cy="150" r="4" fill="%23f59e0b" opacity="0.08"/>
              <circle cx="350" cy="40" r="2" fill="%23ef4444" opacity="0.06"/>
            </svg>
          `)}')`
        }}
      />
      
      {/* Hover Effect Overlay */}
      <Box className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Store Info - Enhanced */}
      <Box className="relative z-10 p-5">
        <Box flex className="items-start justify-between mb-4">
          <Box className="flex-1 min-w-0 pr-3">
            {/* Store Name with Icon */}
            <Box flex className="items-center gap-2 mb-2">
              <Box className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Text className="text-white font-bold text-xs">🏪</Text>
              </Box>
              <Text.Title size="small" className="font-bold text-gray-900 truncate leading-tight group-hover:text-blue-700 transition-colors duration-300">
                {store.name}
              </Text.Title>
            </Box>
            
            {/* Address with improved styling */}
            <Box flex className="items-start gap-2 mb-4">
              <Icon icon="zi-location" className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
              <Text size="xSmall" className="text-gray-500 line-clamp-2 leading-relaxed">
                {store.address}
              </Text>
            </Box>
            
            {/* Enhanced Info Badges */}
            <Box flex className="items-center gap-3 flex-wrap">
              <Box flex className="items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1.5 rounded-full border border-yellow-200 shadow-sm">
                <Icon icon="zi-star" className="text-yellow-500" size={14} />
                <Text size="xSmall" className="font-bold text-yellow-700">{store.rating}</Text>
              </Box>
              <Box flex className="items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
                <Icon icon="zi-location" className="text-blue-500" size={14} />
                <Text size="xSmall" className="font-medium text-blue-700">{store.distance}km</Text>
              </Box>
              <Box className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border ${
                store.status === 'open'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400'
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400'
              }`}>
                <Box flex className="items-center gap-1.5">
                  <Box className={`w-2 h-2 rounded-full ${store.status === 'open' ? 'bg-white' : 'bg-gray-300'} animate-pulse`} />
                  {store.status === 'open' ? 'Mở cửa' : 'Đóng cửa'}
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* Action Buttons - Enhanced */}
          <Box flex className="gap-2 ml-3">
            {onCall && (
              <Button
                size="small"
                variant="tertiary"
                icon={<Icon icon="zi-call" className="text-green-600" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCall();
                }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
              />
            )}
            {onNavigate && (
              <Button
                size="small"
                variant="tertiary"
                icon={<Icon icon="zi-location" className="text-blue-600" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate();
                }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
              />
            )}
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-star" className="text-yellow-600" />}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 hover:from-yellow-100 hover:to-orange-100 border border-yellow-200 hover:border-yellow-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
            />
          </Box>
        </Box>
      </Box>

      {/* Machine Status - Enhanced */}
      <Box className="relative z-10 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-5 border-t border-gray-100 rounded-b-2xl">
        {/* Header Row - Enhanced */}
        <Box flex className="items-center justify-between mb-5">
          <Box flex className="items-center gap-2">
            <Box className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Text className="text-white font-bold text-xs">⚙️</Text>
            </Box>
            <Text size="small" className="font-bold text-gray-900">Trạng thái máy</Text>
          </Box>
          <Text
            size="small"
            className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            Xem chi tiết →
          </Text>
        </Box>
        
        {/* Machine Status Row - Enhanced */}
        <Box flex className="items-center justify-between gap-6">
          {/* Washing Machines - Enhanced */}
          <Box flex className="items-center gap-4 flex-1 p-3 bg-white/60 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-all duration-300">
            <Box className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Text size="xxSmall" className="font-bold text-white">GIẶT</Text>
            </Box>
            <Box className="w-16 h-16 rounded-xl bg-white border-2 border-blue-200 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group-hover:border-blue-300">
              <MachineIcon type="washing" size={32} status="available" />
            </Box>
            <Box className="flex-1">
              <Box className={`text-white px-3 py-1.5 rounded-lg text-xs font-bold mb-2 ${getStatusColor(availableWashing, totalWashing)} shadow-md transition-all duration-300 hover:shadow-lg`}>
                {getStatusText(availableWashing, totalWashing)}
              </Box>
              <Text size="small" className="font-bold gradient-text text-lg">
                {availableWashing}/{totalWashing}
              </Text>
              <Text size="xSmall" className="text-gray-500 block font-medium">máy sẵn sàng</Text>
            </Box>
          </Box>

          {/* Drying Machines - Enhanced */}
          <Box flex className="items-center gap-4 flex-1 p-3 bg-white/60 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-all duration-300">
            <Box className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Text size="xxSmall" className="font-bold text-white">SẤY</Text>
            </Box>
            <Box className="w-16 h-16 rounded-xl bg-white border-2 border-purple-200 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group-hover:border-purple-300">
              <MachineIcon type="drying" size={32} status="available" />
            </Box>
            <Box className="flex-1">
              <Box className={`text-white px-3 py-1.5 rounded-lg text-xs font-bold mb-2 ${getStatusColor(availableDrying, totalDrying)} shadow-md transition-all duration-300 hover:shadow-lg`}>
                {getStatusText(availableDrying, totalDrying)}
              </Box>
              <Text size="small" className="font-bold gradient-text text-lg">
                {availableDrying}/{totalDrying}
              </Text>
              <Text size="xSmall" className="text-gray-500 block font-medium">máy sẵn sàng</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StoreCard;
