import React from 'react';
import { Box, Text, Icon } from 'zmp-ui';
import { LaundryStore, MachineStatusLabels } from '@/types';
import MachineIcon from './machine-icon';

interface StoreCardProps {
  store: LaundryStore;
  onSelect?: () => void;
  className?: string;
}

const StoreCard: React.FC<StoreCardProps> = ({ 
  store, 
  onSelect,
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
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${className}`} 
      onClick={onSelect}
    >
      {/* Store Info */}
      <Box className="p-4">
        <Box className="flex items-start justify-between mb-3">
          <Box className="flex-1 min-w-0">
            <Text.Title size="small" className="font-bold mb-1 text-gray-900">
              {store.name}
            </Text.Title>
            <Text size="xSmall" className="text-gray-500 mb-2 line-clamp-2">
              {store.address}
            </Text>
            <Box className="flex items-center space-x-3">
              <Box className="flex items-center space-x-1">
                <Icon icon="zi-star" className="text-yellow-500 text-sm" />
                <Text size="xSmall" className="font-medium">{store.rating}</Text>
              </Box>
              <Box className="flex items-center space-x-1">
                <Icon icon="zi-location" className="text-gray-400 text-sm" />
                <Text size="xSmall" className="text-gray-600">{store.distance}km</Text>
              </Box>
              <Box className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                store.status === 'open' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {store.status === 'open' ? 'Mở cửa' : 'Đóng cửa'}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Machine Status */}
      <Box className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <Box className="grid grid-cols-2 gap-4">
          {/* Washing Machines */}
          <Box className="flex items-center space-x-3">
            <Box className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
              <MachineIcon type="washing" size={20} status="available" />
            </Box>
            <Box>
              <Text size="xSmall" className="text-gray-600 mb-0.5">Máy giặt</Text>
              <Box className={`px-2 py-0.5 rounded-lg text-xs font-bold ${getStatusColor(availableWashing, totalWashing)}`}>
                {getStatusText(availableWashing, totalWashing)}
              </Box>
              <Text size="xxSmall" className="text-gray-500 mt-0.5">
                {availableWashing}/{totalWashing}
              </Text>
            </Box>
          </Box>

          {/* Drying Machines */}
          <Box className="flex items-center space-x-3">
            <Box className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
              <MachineIcon type="drying" size={20} status="available" />
            </Box>
            <Box>
              <Text size="xSmall" className="text-gray-600 mb-0.5">Máy sấy</Text>
              <Box className={`px-2 py-0.5 rounded-lg text-xs font-bold ${getStatusColor(availableDrying, totalDrying)}`}>
                {getStatusText(availableDrying, totalDrying)}
              </Box>
              <Text size="xxSmall" className="text-gray-500 mt-0.5">
                {availableDrying}/{totalDrying}
              </Text>
            </Box>
          </Box>
        </Box>
        
        {/* Instruction Text */}
        <Box className="mt-3 pt-3 border-t border-gray-200">
          <Text size="xSmall" className="text-center text-gray-500">
            👆 Chạm để xem chi tiết • Quét QR tại tiệm để sử dụng
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default StoreCard;
