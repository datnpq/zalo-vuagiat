import React, { useState } from 'react';
import { Box, Button, Text, Icon, Modal, Input, Select } from 'zmp-ui';
import { useToast, ToastMessages } from './toast';

interface WalletTopupProps {
  visible: boolean;
  onClose: () => void;
  onTopup: (amount: number, method: string, bonusAmount?: number) => void;
  currentBalance: number;
}

const WalletTopup: React.FC<WalletTopupProps> = ({
  visible,
  onClose,
  onTopup,
  currentBalance
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('zalopay');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showInfo, ToastContainer } = useToast();

  const predefinedAmounts = [
    { value: 50000, label: '50K' },
    { value: 100000, label: '100K' },
    { value: 200000, label: '200K' },
    { value: 500000, label: '500K' },
    { value: 1000000, label: '1TR' },
  ];

  const paymentMethods = [
    { 
      value: 'zalopay', 
      label: 'ZaloPay', 
      icon: '💳',
      color: '#0068FF'
    },
    { 
      value: 'momo', 
      label: 'MoMo', 
      icon: '🅼',
      color: '#A50064'
    },
    { 
      value: 'bank', 
      label: 'Chuyển khoản ngân hàng', 
      icon: '🏦',
      color: '#1976D2'
    },
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''));
    if (!isNaN(numValue)) {
      setCustomAmount(numValue.toLocaleString());
      setSelectedAmount(numValue);
    } else {
      setCustomAmount('');
      setSelectedAmount(0);
    }
  };

  const handleTopup = async () => {
    if (selectedAmount < 10000) {
      showError('Số tiền nạp tối thiểu là 10,000đ nha! 💰');
      return;
    }

    setLoading(true);
    showInfo('Đang xử lý thanh toán... Đợi tí nha! 💳');
    
    // Calculate bonus
    let bonusAmount = 0;
    if (selectedAmount >= 200000) {
      bonusAmount = Math.floor(selectedAmount * 0.1); // 10% bonus
    }
    
    const totalAmount = selectedAmount + bonusAmount;
    
    // Simulate API call with realistic steps
    setTimeout(() => {
      showInfo('Đang xác nhận giao dịch... ✅');
      
      setTimeout(() => {
        onTopup(selectedAmount, paymentMethod, bonusAmount);
        showSuccess(ToastMessages.success.topupSuccess);
        setLoading(false);
        
        // Reset form
        setSelectedAmount(0);
        setCustomAmount('');
        setPaymentMethod('zalopay');
      }, 1000);
    }, 2000);
  };

  const getBonusAmount = () => {
    return selectedAmount >= 200000 ? Math.floor(selectedAmount * 0.1) : 0;
  };

  const getTotalAmount = () => {
    return selectedAmount + getBonusAmount();
  };

  const getSelectedMethodInfo = () => {
    return paymentMethods.find(m => m.value === paymentMethod) || paymentMethods[0];
  };

  return (
    <>
      <ToastContainer />
      <Modal
        visible={visible}
        onClose={onClose}
        verticalActions
        title="Nạp tiền vào ví"
        className="modal-enhanced"
        actions={[
          {
            text: 'Hủy',
            close: true,
            disabled: loading,
          },
          {
            text: loading ? 'Đang xử lý...' : `Nạp ${getTotalAmount().toLocaleString()}đ${getBonusAmount() > 0 ? ` (+ ${getBonusAmount().toLocaleString()}đ thưởng)` : ''}`,
            highLight: true,
            onClick: handleTopup,
            disabled: loading || selectedAmount < 10000,
          },
        ]}
      >
        <Box className="p-4">
        {/* Promotion Banner */}
        <Box className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl p-4 mb-6 text-white">
          <Box className="flex items-center mb-2">
            <Text size="large" className="mr-2">🎉</Text>
            <Text size="normal" className="font-bold text-white">
              Khuyến mãi đặc biệt
            </Text>
          </Box>
          <Text size="small" className="text-white/90 mb-1">
            Nạp từ 200K tặng thêm 10% tiền thưởng
          </Text>
          <Text size="xSmall" className="text-white/80">
            💰 Tiền thưởng có hạn sử dụng 30 ngày
          </Text>
        </Box>

        {/* Current Balance */}
        <Box className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 mb-6 text-white">
          <Text size="small" className="text-white/80 mb-1">Số dư hiện tại</Text>
          <Text size="xLarge" className="font-bold text-white">
            {currentBalance.toLocaleString()}đ
          </Text>
        </Box>

        {/* Amount Selection */}
        <Box className="mb-6">
          <Text size="normal" className="font-semibold mb-3 text-gray-800">
            Chọn số tiền nạp
          </Text>
          
          {/* Predefined Amounts */}
          <Box className="grid grid-cols-3 gap-3 mb-4">
            {predefinedAmounts.map((amount) => (
              <Button
                key={amount.value}
                variant={selectedAmount === amount.value ? 'primary' : 'tertiary'}
                size="medium"
                onClick={() => handleAmountSelect(amount.value)}
                className={`flex flex-col py-4 px-3 rounded-2xl font-medium transition-all duration-200 min-h-[80px] ${
                  selectedAmount === amount.value
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                }`}
              >
                <Text className="font-bold mb-1 text-base">
                  {amount.label}
                </Text>
                <Text size="xSmall" className="opacity-70 font-medium">
                  {amount.value.toLocaleString()}đ
                </Text>
              </Button>
            ))}
          </Box>

          {/* Custom Amount */}
          <Box className="bg-gray-50 rounded-2xl p-4">
            <Text size="small" className="text-gray-600 mb-3 font-medium">
              Hoặc nhập số tiền khác (tối thiểu 10,000đ)
            </Text>
            <Input
              placeholder="Nhập số tiền..."
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="text-center text-lg font-semibold bg-white border-2 border-gray-200 rounded-xl py-3"
              suffix="đ"
            />
          </Box>
        </Box>

        {/* Payment Method */}
        <Box className="mb-6">
          <Text size="normal" className="font-semibold mb-3 text-gray-800">
            Phương thức thanh toán
          </Text>
          
          <Box className="space-y-3">
            {paymentMethods.map((method) => (
              <Box
                key={method.value}
                className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  paymentMethod === method.value
                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:bg-gray-50'
                }`}
                onClick={() => setPaymentMethod(method.value)}
              >
                <Box
                  className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 text-xl shadow-sm"
                  style={{ backgroundColor: `${method.color}20`, color: method.color }}
                >
                  {method.icon}
                </Box>
                <Box className="flex-1">
                  <Text
                    className={`font-semibold text-base mb-1 ${
                      paymentMethod === method.value ? 'text-blue-700' : 'text-gray-800'
                    }`}
                  >
                    {method.label}
                  </Text>
                  {method.value === 'zalopay' && (
                    <Text size="small" className="text-gray-500 font-medium">Thanh toán nhanh, bảo mật</Text>
                  )}
                  {method.value === 'momo' && (
                    <Text size="small" className="text-gray-500 font-medium">Ví điện tử phổ biến</Text>
                  )}
                  {method.value === 'bank' && (
                    <Text size="small" className="text-gray-500 font-medium">Chuyển khoản trực tiếp</Text>
                  )}
                </Box>
                {paymentMethod === method.value && (
                  <Icon icon="zi-check-circle" className="text-blue-500 text-2xl" />
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Summary */}
        {selectedAmount > 0 && (
          <Box className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-5 border border-gray-200">
            <Text size="normal" className="text-gray-700 mb-4 font-bold">📋 Tóm tắt giao dịch</Text>
            <Box className="space-y-3">
              <Box className="flex justify-between items-center">
                <Text size="normal" className="text-gray-600">Số tiền nạp:</Text>
                <Text size="normal" className="font-bold text-gray-800">
                  {selectedAmount.toLocaleString()}đ
                </Text>
              </Box>
              
              {getBonusAmount() > 0 && (
                <Box className="flex justify-between items-center">
                  <Text size="normal" className="text-orange-600 font-medium">🎁 Tiền thưởng (10%):</Text>
                  <Text size="normal" className="font-bold text-orange-600">
                    +{getBonusAmount().toLocaleString()}đ
                  </Text>
                </Box>
              )}
              
              <Box className="flex justify-between items-center">
                <Text size="normal" className="text-gray-600">Phương thức:</Text>
                <Text size="normal" className="font-semibold text-gray-800">
                  {getSelectedMethodInfo().label}
                </Text>
              </Box>
              
              <Box className="border-t border-gray-300 pt-4 mt-4">
                <Box className="flex justify-between items-center mb-3">
                  <Text size="normal" className="font-bold text-gray-800">Tổng nhận được:</Text>
                  <Text size="large" className="font-bold text-blue-600">
                    {getTotalAmount().toLocaleString()}đ
                  </Text>
                </Box>
                <Box className="flex justify-between items-center">
                  <Text size="normal" className="font-bold text-gray-800">Số dư sau nạp:</Text>
                  <Text size="large" className="font-bold text-green-600">
                    {(currentBalance + getTotalAmount()).toLocaleString()}đ
                  </Text>
                </Box>
                
                {getBonusAmount() > 0 && (
                  <Box className="bg-orange-100 rounded-xl p-3 mt-3 border border-orange-200">
                    <Text size="small" className="text-orange-700 font-medium">
                      ⏰ Tiền thưởng {getBonusAmount().toLocaleString()}đ có hạn sử dụng 30 ngày
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
    </>
  );
};

export default WalletTopup;
