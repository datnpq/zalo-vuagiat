import React, { useState } from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';
import { Machine } from '@/types';
import { useToast, ToastMessages } from './toast';
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
  const [isSelecting, setIsSelecting] = useState(false);
  const { showSuccess, showInfo, ToastContainer } = useToast();
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

  const handleMachineSelect = async () => {
    if (machine.status !== 'available') {
      return;
    }

    setIsSelecting(true);
    showInfo('Đang chuẩn bị máy... ⚙️');

    // Simulate machine preparation
    setTimeout(() => {
      showSuccess(ToastMessages.success.machineFound);
      setIsSelecting(false);
      if (onSelect) {
        onSelect();
      }
    }, 1500);
  };

  return (
    <>
      <ToastContainer />
      <Box
        className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={onSelect && machine.status === 'available' ? handleMachineSelect : undefined}
      >
        <Box flex className="items-start justify-between mb-4">
          <Box flex className="items-center gap-4 flex-1">
            <Box className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${
              machine.type === 'washing'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-purple-500 to-purple-600'
            }`}>
              <MachineIcon
                type={machine.type}
                size={28}
                status={machine.status}
                className="text-white"
              />
            </Box>
            <Box className="flex-1">
              <Text className="font-bold text-gray-900 text-lg mb-1">
                {machine.type === 'washing' ? 'Máy giặt' : 'Máy sấy'} #{machine.id.slice(-1)}
              </Text>
              <Box flex className="items-center gap-3">
                <Text size="small" className="text-gray-600 font-medium">
                  {machine.capacity}kg
                </Text>
                <Text size="small" className="text-blue-600 font-bold">
                  {machine.price.toLocaleString()}₫
                </Text>
              </Box>
            </Box>
          </Box>
          
          <Box className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getStatusColor(machine.status)}`}>
            {getStatusText(machine.status)}
          </Box>
        </Box>

        {showProgress && (
          <Box className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <Box flex className="items-center justify-between mb-3">
              <Text size="small" className="text-blue-700 font-semibold">
                {machine.type === 'washing' ? 'Đang giặt' : 'Đang sấy'}
              </Text>
              <Text size="small" className="text-blue-700 font-bold">
                {progress}%
              </Text>
            </Box>
            <Box className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
              <Box
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </Box>
            {remainingTime && (
              <Text size="small" className="text-blue-600 mt-2 font-medium">
                {remainingTime} phút còn lại
              </Text>
            )}
          </Box>
        )}

        {machine.features.length > 0 && (
          <Box className="mt-4">
            <Box flex className="flex-wrap gap-2">
              {machine.features.slice(0, 2).map((feature, index) => (
                <Box key={index} className="bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700 font-medium">
                  {feature}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {machine.status === 'maintenance' && (
          <Box className="text-center py-4 bg-gray-50 rounded-2xl mt-4">
            <Text size="small" className="text-gray-500 font-medium">
              Máy đang bảo trì
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
};

export default MachineCard;
