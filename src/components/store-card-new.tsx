import React from 'react';
import { Box, Text, Icon, Button } from 'zmp-ui';
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
  
  const getStatusColor = (availableCount: number, totalCount: number) => {
    const ratio = availableCount / totalCount;
    if (ratio > 0.6) return 'bg-green-500 text-white';
    if (ratio > 0.3) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getStatusText = (availableCount: number, totalCount: number) => {
    if (availableCount === 0) return 'Hết chỗ';
    if (availableCount === totalCount) return 'Có sẵn';
    return `${availableCount} trống`;
  };

  return (
    <Box
      className={`clean-card hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden store-card-enhanced ${className}`}
      onClick={onSelect}
    >
      {/* Subtle Background Pattern */}
      <Box
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="store-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="#3b82f6" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="200" height="100" fill="url(#store-pattern)"/>
              <circle cx="30" cy="25" r="8" fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.04"/>
              <circle cx="170" cy="75" r="6" fill="none" stroke="#10b981" stroke-width="0.8" opacity="0.03"/>
            </svg>
          `)}')`
        }}
      />
      {/* Enhanced Store Info */}
      <Box className="p-5 relative z-10">
        <Box className="flex items-start justify-between mb-4">
          <Box className="flex-1 min-w-0">
            <Text.Title size="small" className="font-bold mb-2 text-gray-900">
              {store.name}
            </Text.Title>
            <Box flex className="items-start gap-2 mb-3">
              <Icon icon="zi-location" className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
              <Text size="xSmall" className="text-gray-600 line-clamp-2 leading-relaxed">
                {store.address}
              </Text>
            </Box>
            <Box className="flex items-center space-x-3 flex-wrap gap-2">
              <Box className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1.5 rounded-full border border-yellow-200 shadow-sm">
                <Icon icon="zi-star" className="text-yellow-500" size={14} />
                <Text size="xSmall" className="font-bold text-yellow-700">{store.rating}</Text>
              </Box>
              <Box className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
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
        </Box>

        {/* Enhanced Action Buttons */}
        <Box flex className="gap-2 mb-4">
          {onCall && (
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-call" className="text-green-600" />}
              onClick={(e) => {
                e.stopPropagation();
                onCall();
              }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl px-3"
            >
              Gọi
            </Button>
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
              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl px-3"
            >
              Chỉ đường
            </Button>
          )}
        </Box>
      </Box>

      {/* Enhanced Machine Status */}
      <Box className="bg-gradient-to-r from-gray-50 to-blue-50 px-5 py-4 border-t border-gray-100 relative z-10">
        <Box className="grid grid-cols-2 gap-4">
          {/* Enhanced Washing Machines */}
          <Box className="flex items-center space-x-3">
            <Box className="w-14 h-14 rounded-xl bg-white border-2 border-blue-200 flex items-center justify-center shadow-lg">
              <MachineIcon type="washing" size={24} status="available" />
            </Box>
            <Box>
              <Text size="xSmall" className="text-gray-700 mb-1 font-semibold">Máy giặt</Text>
              <Box className={`px-2 py-1 rounded-lg text-xs font-bold shadow-sm ${getStatusColor(availableWashing, totalWashing)}`}>
                {getStatusText(availableWashing, totalWashing)}
              </Box>
              <Text size="xxSmall" className="text-gray-500 mt-1 font-medium">
                {availableWashing}/{totalWashing} máy
              </Text>
            </Box>
          </Box>

          {/* Enhanced Drying Machines */}
          <Box className="flex items-center space-x-3">
            <Box className="w-14 h-14 rounded-xl bg-white border-2 border-purple-200 flex items-center justify-center shadow-lg">
              <MachineIcon type="drying" size={24} status="available" />
            </Box>
            <Box>
              <Text size="xSmall" className="text-gray-700 mb-1 font-semibold">Máy sấy</Text>
              <Box className={`px-2 py-1 rounded-lg text-xs font-bold shadow-sm ${getStatusColor(availableDrying, totalDrying)}`}>
                {getStatusText(availableDrying, totalDrying)}
              </Box>
              <Text size="xxSmall" className="text-gray-500 mt-1 font-medium">
                {availableDrying}/{totalDrying} máy
              </Text>
            </Box>
          </Box>
        </Box>
        
        {/* Enhanced Instruction Text */}
        <Box className="mt-4 pt-3 border-t border-gray-200">
          <Text size="xSmall" className="text-center text-gray-600 font-medium">
            👆 Chạm để xem chi tiết • Quét QR tại tiệm để sử dụng
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default StoreCard;
