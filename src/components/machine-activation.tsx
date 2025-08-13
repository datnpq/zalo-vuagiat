import React, { useState } from 'react';
import { Box, Modal, Text, Button, Icon, Radio } from 'zmp-ui';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/atoms';
import { useToast, ToastMessages } from './toast';
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
  const { showSuccess, showError, showInfo, ToastContainer } = useToast();

  if (!machineData) return null;

  const canPayWithWallet = (user.balance || 0) >= machineData.price;
  const estimatedTime = machineData.type === 'washing' ? '35-45 phút' : '25-35 phút';

  const handleActivate = async () => {
    // Validate payment method
    if (paymentMethod === 'wallet' && !canPayWithWallet) {
      showError(ToastMessages.error.insufficientBalance);
      return;
    }

    setIsProcessing(true);
    showInfo(ToastMessages.info.machineStarting);

    // Mock activation process with realistic steps
    setTimeout(() => {
      if (paymentMethod === 'wallet') {
        // Deduct from wallet
        setUser(prev => ({
          ...prev,
          balance: (prev.balance || 0) - machineData.price,
          totalWashes: (prev.totalWashes || 0) + 1,
          loyaltyPoints: (prev.loyaltyPoints || 0) + Math.floor(machineData.price / 1000) // 1 point per 1000 VND
        }));
        showSuccess(ToastMessages.success.payment);
      }

      setTimeout(() => {
        showSuccess(ToastMessages.success.machineActivated);
        setIsProcessing(false);
        onActivated(machineData.machineId, paymentMethod);
        onClose();
      }, 1000);
    }, 2000);
  };

  return (
    <>
      <ToastContainer />
      <Modal
        visible={visible}
        title=""
        onClose={onClose}
        maskClosable={!isProcessing}
        className="modal-enhanced"
      >
        <Box className="p-5">
        {/* Machine Info Header */}
        <Box className="text-center mb-6">
          <Box className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-md">
            <MachineIcon
              type={machineData.type}
              size={40}
              status="available"
            />
          </Box>
          
          <Text.Title className="text-xl font-bold mb-2 text-gray-900">
            Máy {machineData.type === 'washing' ? 'giặt' : 'sấy'} #{machineData.machineId.slice(-1)}
          </Text.Title>
          
          <Text className="text-gray-600 mb-3 text-sm">
            Dung tích: {machineData.capacity}kg • Thời gian: {estimatedTime}
          </Text>
          
          <Box className="inline-flex items-center px-3 py-1.5 bg-green-100 rounded-full shadow-sm">
            <Box className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></Box>
            <Text size="xSmall" className="text-green-800 font-bold">SẴN SÀNG</Text>
          </Box>
        </Box>

        {/* Machine Features */}
        <Box className="mb-6">
          <Text size="small" className="font-bold text-gray-900 mb-3">Tính năng đặc biệt:</Text>
          <Box className="flex flex-wrap gap-2">
            {machineData.features.map((feature, index) => (
              <Box key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                <Icon icon="zi-check" className="text-blue-600 mr-1 text-xs" />
                {feature}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Payment Method */}
        <Box className="mb-6">
          <Text size="small" className="font-bold text-gray-900 mb-4">Chọn phương thức thanh toán:</Text>
          
          <Box className="space-y-3">
            {/* Wallet Payment */}
            <Box
              className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                paymentMethod === 'wallet'
                  ? 'border-purple-400 bg-purple-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('wallet')}
            >
              <Box className="flex items-center justify-between">
                <Box className="flex items-center space-x-3">
                  <Radio
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                  />
                  <Box className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Icon icon="zi-user" className="text-white text-sm" />
                  </Box>
                  <Box>
                    <Text className="font-bold text-gray-900 text-sm">Ví GiGi</Text>
                    <Text size="xSmall" className="text-gray-600">
                      Số dư: {user.balance?.toLocaleString('vi-VN')}₫
                    </Text>
                  </Box>
                </Box>
                <Icon icon="zi-star" className="text-yellow-500 text-lg" />
              </Box>
              {!canPayWithWallet && (
                <Text size="xSmall" className="text-red-600 mt-2 bg-red-50 p-2 rounded-lg border border-red-200">
                  ⚠️ Số dư không đủ. Vui lòng nạp thêm {(machineData.price - (user.balance || 0)).toLocaleString('vi-VN')}₫
                </Text>
              )}
            </Box>

            {/* Direct Payment */}
            <Box
              className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                paymentMethod === 'direct'
                  ? 'border-gray-400 bg-gray-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('direct')}
            >
              <Box className="flex items-center justify-between">
                <Box className="flex items-center space-x-3">
                  <Radio
                    checked={paymentMethod === 'direct'}
                    onChange={() => setPaymentMethod('direct')}
                  />
                  <Box className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                    <Text className="text-white text-xs font-bold">...</Text>
                  </Box>
                  <Box>
                    <Text className="font-bold text-gray-900 text-sm">Thanh toán trực tiếp</Text>
                    <Text size="xSmall" className="text-gray-600">
                      Tiền mặt tại máy
                    </Text>
                  </Box>
                </Box>
                <Text className="text-gray-400 text-xs">...</Text>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Price & Actions */}
        <Box className="border-t border-gray-200 pt-4">
          <Box className="flex items-center justify-between mb-4">
            <Text className="text-gray-700 font-medium">Tổng tiền:</Text>
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
              className="bg-purple-600 hover:bg-purple-700 py-3 font-bold text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isProcessing ? 'Đang kích hoạt máy...' : 'Kích hoạt máy ngay'}
            </Button>
            
            <Button
              fullWidth
              variant="tertiary"
              onClick={onClose}
              disabled={isProcessing}
              className="py-3 font-medium text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200"
            >
              Hủy bỏ
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
    </>
  );
};

export default MachineActivation;
