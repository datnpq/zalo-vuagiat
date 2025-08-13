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
      <Box className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <Box flex className="items-center justify-between mb-3">
          <Box flex className="items-center space-x-3">
            <Box className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              machine.type === 'washing'
                ? 'bg-blue-500'
                : 'bg-purple-500'
            }`}>
              <MachineIcon
                type={machine.type}
                size={24}
                status={machine.status}
                className="text-white"
              />
            </Box>
            <Box>
              <Text className="font-semibold text-gray-900 text-base">
                {machine.type === 'washing' ? 'Máy giặt' : 'Máy sấy'} #{machine.id.slice(-1)}
              </Text>
              <Box flex className="items-center gap-2 mt-1">
                <Text size="small" className="text-gray-600">
                  {machine.capacity}kg
                </Text>
                <Text size="small" className="text-blue-600 font-semibold">
                  {machine.price.toLocaleString()}₫
                </Text>
              </Box>
            </Box>
          </Box>
          
          <Box className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(machine.status)}`}>
            {getStatusText(machine.status)}
          </Box>
        </Box>

        {showProgress && (
          <Box className="mb-3">
            <Box flex className="items-center justify-between mb-2">
              <Text size="small" className="text-gray-600">
                {machine.type === 'washing' ? 'Đang giặt' : 'Đang sấy'}
              </Text>
              <Text size="small" className="text-gray-600 font-semibold">
                {progress}%
              </Text>
            </Box>
            <Box className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <Box
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </Box>
            {remainingTime && (
              <Text size="xSmall" className="text-gray-500 mt-1">
                {remainingTime} phút còn lại
              </Text>
            )}
          </Box>
        )}

        {machine.features.length > 0 && (
          <Box className="mb-3">
            <Box flex className="flex-wrap gap-1.5">
              {machine.features.slice(0, 2).map((feature, index) => (
                <Box key={index} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                  {feature}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {onSelect && machine.status === 'available' && (
          <Button
            fullWidth
            variant="primary"
            size="medium"
            onClick={handleMachineSelect}
            loading={isSelecting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            {isSelecting ? 'Đang chuẩn bị...' : 'Chọn máy này'}
          </Button>
        )}

        {machine.status === 'in-use' && remainingTime && (
          <Button
            fullWidth
            variant="tertiary"
            size="medium"
            onClick={onSelect}
            className="border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Theo dõi máy này
          </Button>
        )}

        {machine.status === 'maintenance' && (
          <Box className="text-center py-3 bg-gray-50 rounded-lg">
            <Text size="small" className="text-gray-500">
              Máy đang bảo trì
            </Text>
          </Box>
        )}
    </Box>
    </>
  );
};

export default MachineCard;
