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
        <Box className="p-6">
        {/* Machine Info Header */}
        <Box className="text-center mb-6">
          <Box className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center shadow-lg border border-purple-100">
            <MachineIcon
              type={machineData.type}
              size={48}
              status="available"
            />
          </Box>
          
          <Text.Title className="text-2xl font-bold mb-2 text-gray-900">
            Máy {machineData.type === 'washing' ? 'giặt' : 'sấy'} #{machineData.machineId.slice(-1)}
          </Text.Title>
          
          <Text className="text-gray-600 mb-3">
            Dung tích: {machineData.capacity}kg • Thời gian: {estimatedTime}
          </Text>
          
          <Box className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full shadow-sm">
            <Box className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></Box>
            <Text size="small" className="text-green-800 font-bold">SẴN SÀNG</Text>
          </Box>
        </Box>

        {/* Machine Features */}
        <Box className="mb-6">
          <Text size="small" className="font-bold text-gray-900 mb-3">Tính năng đặc biệt:</Text>
          <Box className="flex flex-wrap gap-2">
            {machineData.features.map((feature, index) => (
              <Box key={index} className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 rounded-full text-xs font-medium shadow-sm border border-blue-100">
                <Icon icon="zi-check" className="text-blue-600 mr-1 text-xs" />
                {feature}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Payment Method */}
        <Box className="mb-6">
          <Text size="small" className="font-bold text-gray-900 mb-4">Chọn phương thức thanh toán:</Text>
          
          <Box className="space-y-4">
            {/* Wallet Payment */}
            <Box
              className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                paymentMethod === 'wallet'
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-md'
                  : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => setPaymentMethod('wallet')}
            >
              <Box className="flex items-center justify-between">
                <Box className="flex items-center space-x-4">
                  <Radio
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                  />
                  <Box className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Icon icon="zi-user" className="text-purple-600 text-xl" />
                  </Box>
                  <Box>
                    <Text className="font-bold text-gray-900">Ví GiGi</Text>
                    <Text size="small" className="text-gray-600">
                      Số dư: {user.balance?.toLocaleString('vi-VN')}₫
                    </Text>
                  </Box>
                </Box>
                <Icon icon="zi-star" className="text-yellow-500 text-xl" />
              </Box>
              {!canPayWithWallet && (
                <Text size="xSmall" className="text-red-600 mt-3 bg-red-50 p-2 rounded-lg border border-red-100">
                  ⚠️ Số dư không đủ. Vui lòng nạp thêm {(machineData.price - (user.balance || 0)).toLocaleString('vi-VN')}₫
                </Text>
              )}
            </Box>

            {/* Direct Payment */}
            <Box
              className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                paymentMethod === 'direct'
                  ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md'
                  : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => setPaymentMethod('direct')}
            >
              <Box className="flex items-center justify-between">
                <Box className="flex items-center space-x-4">
                  <Radio
                    checked={paymentMethod === 'direct'}
                    onChange={() => setPaymentMethod('direct')}
                  />
                  <Box className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon icon="zi-more-horiz" className="text-green-600 text-xl" />
                  </Box>
                  <Box>
                    <Text className="font-bold text-gray-900">Thanh toán trực tiếp</Text>
                    <Text size="small" className="text-gray-600">
                      Tiền mặt tại máy
                    </Text>
                  </Box>
                </Box>
                <Icon icon="zi-more-horiz" className="text-green-600 text-xl" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Price & Actions */}
        <Box className="border-t pt-4">
          <Box className="flex items-center justify-between mb-4">
            <Text className="text-gray-600 font-medium">Tổng tiền:</Text>
            <Text.Title className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
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
              className="bg-gradient-to-r from-purple-600 to-blue-600 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isProcessing ? 'Đang kích hoạt máy...' : 'Kích hoạt máy ngay'}
            </Button>
            
            <Button
              fullWidth
              variant="tertiary"
              onClick={onClose}
              disabled={isProcessing}
              className="py-3 font-medium"
            >
              Hủy bỏ
            </Button>
          </Box>
        </Box>

        {/* Footer Note */}
        <Text size="xxSmall" className="text-gray-400 text-center mt-4">
          💡 Máy sẽ tự động bắt đầu sau khi thanh toán thành công
        </Text>
      </Box>
    </Modal>
    </>
  );
};

export default MachineActivation;
