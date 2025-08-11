import React, { useState } from 'react';
import { Box, Modal, Text, Button, Icon, Radio } from 'zmp-ui';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/atoms';
import MachineIcon from './machine-icon';

interface MachineData {
  storeId: string;
  machineId: string;
  type: 'washing' | 'drying';
  price: number;
  capacity: number;
  features: string[];
}

interface MachineActivationProps {
  visible: boolean;
  machineData: MachineData | null;
  onClose: () => void;
  onActivated: (machineId: string, paymentMethod: string) => void;
}

const MachineActivation: React.FC<MachineActivationProps> = ({
  visible,
  machineData,
  onClose,
  onActivated
}) => {
  const [user, setUser] = useAtom(userAtom);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'direct'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!machineData) return null;

  const canPayWithWallet = (user.balance || 0) >= machineData.price;
  const estimatedTime = machineData.type === 'washing' ? '35-45 phút' : '25-35 phút';

  const handleActivate = async () => {
    setIsProcessing(true);

    // Mock activation process
    setTimeout(() => {
      if (paymentMethod === 'wallet') {
        // Deduct from wallet
        setUser(prev => ({
          ...prev,
          balance: (prev.balance || 0) - machineData.price
        }));
      }

      setIsProcessing(false);
      onActivated(machineData.machineId, paymentMethod);
      onClose();
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      title=""
      onClose={onClose}
      maskClosable={!isProcessing}
    >
      <Box className="p-6">
        {/* Machine Info Header */}
        <Box className="text-center mb-6">
          <Box className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
            <MachineIcon 
              type={machineData.type} 
              size={40} 
              status="available" 
            />
          </Box>
          
          <Text.Title className="text-xl font-bold mb-2">
            Máy {machineData.type === 'washing' ? 'giặt' : 'sấy'} #{machineData.machineId.slice(-1)}
          </Text.Title>
          
          <Text className="text-gray-600 mb-2">
            Dung tích: {machineData.capacity}kg • Thời gian: {estimatedTime}
          </Text>
          
          <Box className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full">
            <Box className="w-2 h-2 bg-green-500 rounded-full mr-2"></Box>
            <Text size="small" className="text-green-700 font-medium">Có sẵn</Text>
          </Box>
        </Box>

        {/* Machine Features */}
        <Box className="mb-6">
          <Text size="small" className="font-semibold text-gray-900 mb-3">Tính năng:</Text>
          <Box className="flex flex-wrap gap-2">
            {machineData.features.map((feature, index) => (
              <Box key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                {feature}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Payment Method */}
        <Box className="mb-6">
          <Text size="small" className="font-semibold text-gray-900 mb-4">Chọn phương thức thanh toán:</Text>
          
          <Box className="space-y-3">
            {/* Wallet Payment */}
            <Box 
              className={`p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                paymentMethod === 'wallet' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200'
              }`}
              onClick={() => setPaymentMethod('wallet')}
            >
              <Box className="flex items-center justify-between">
                <Box className="flex items-center space-x-3">
                  <Radio 
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                  />
                  <Box>
                    <Text className="font-medium">Ví GiGi</Text>
                    <Text size="small" className="text-gray-600">
                      Số dư: {user.balance?.toLocaleString('vi-VN')}₫
                    </Text>
                  </Box>
                </Box>
                <Icon icon="zi-star" className="text-purple-600" />
              </Box>
              {!canPayWithWallet && (
                <Text size="xSmall" className="text-red-600 mt-2">
                  ⚠️ Số dư không đủ. Vui lòng nạp thêm {(machineData.price - (user.balance || 0)).toLocaleString('vi-VN')}₫
                </Text>
              )}
            </Box>

            {/* Direct Payment */}
            <Box 
              className={`p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                paymentMethod === 'direct' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200'
              }`}
              onClick={() => setPaymentMethod('direct')}
            >
              <Box className="flex items-center justify-between">
                <Box className="flex items-center space-x-3">
                  <Radio 
                    checked={paymentMethod === 'direct'}
                    onChange={() => setPaymentMethod('direct')}
                  />
                  <Box>
                    <Text className="font-medium">Thanh toán trực tiếp</Text>
                    <Text size="small" className="text-gray-600">
                      Tiền mặt tại máy
                    </Text>
                  </Box>
                </Box>
                <Icon icon="zi-more-horiz" className="text-green-600" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Price & Actions */}
        <Box className="border-t pt-4">
          <Box className="flex items-center justify-between mb-4">
            <Text className="text-gray-600">Tổng tiền:</Text>
            <Text.Title className="text-xl font-bold text-purple-600">
              {machineData.price.toLocaleString('vi-VN')}₫
            </Text.Title>
          </Box>

          <Box className="space-y-3">
            <Button
              fullWidth
              variant="primary"
              onClick={handleActivate}
              loading={isProcessing}
              disabled={paymentMethod === 'wallet' && !canPayWithWallet}
              className="bg-gradient-to-r from-purple-600 to-blue-600 py-3"
            >
              {isProcessing ? 'Đang kích hoạt...' : 'Kích hoạt máy'}
            </Button>
            
            <Button
              fullWidth
              variant="tertiary"
              onClick={onClose}
              disabled={isProcessing}
            >
              Hủy
            </Button>
          </Box>
        </Box>

        {/* Footer Note */}
        <Text size="xxSmall" className="text-gray-400 text-center mt-4">
          💡 Máy sẽ tự động bắt đầu sau khi thanh toán thành công
        </Text>
      </Box>
    </Modal>
  );
};

export default MachineActivation;
