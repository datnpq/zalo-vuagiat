import React, { useState } from 'react';
import { Box, Text, Button, Icon, Input, Modal, Sheet } from 'zmp-ui';

interface WalletComponentProps {
  balance: number;
  onTopUp: (amount: number, method: string) => void;
  className?: string;
}

const WalletComponent: React.FC<WalletComponentProps> = ({
  balance,
  onTopUp,
  className = ''
}) => {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const quickAmounts = [50000, 100000, 200000, 500000];
  
  const paymentMethods = [
    { id: 'momo', name: 'MoMo', icon: '💰', color: 'bg-pink-500' },
    { id: 'zalopay', name: 'ZaloPay', icon: '💳', color: 'bg-blue-500' },
    { id: 'vietqr', name: 'VietQR', icon: '📱', color: 'bg-green-500' },
    { id: 'banking', name: 'Internet Banking', icon: '🏦', color: 'bg-purple-500' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseInt(value.replace(/[^0-9]/g, ''));
    setSelectedAmount(numValue || 0);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setShowPaymentMethods(false);
    
    // Simulate payment processing
    setTimeout(() => {
      onTopUp(selectedAmount, methodId);
      setShowTopUpModal(false);
      setSelectedAmount(0);
      setCustomAmount('');
      setSelectedPaymentMethod('');
    }, 2000);
  };

  return (
    <>
      <Box className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white ${className}`}>
        <Box flex className="items-center justify-between mb-4">
          <Text className="text-white/80 font-medium">Số tiền trong ví</Text>
          <Icon icon="zi-more-grid" className="text-white/60" />
        </Box>
        
        <Box className="mb-6">
          <Text className="text-3xl font-bold text-white mb-1">
            {formatCurrency(balance)}
          </Text>
          <Text className="text-white/70 text-sm">
            Dùng để trả tiền giặt ủi nha
          </Text>
        </Box>
        
        <Box flex className="space-x-3">
          <Button
            variant="secondary"
            className="flex-1 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            onClick={() => setShowTopUpModal(true)}
          >
            <Icon icon="zi-plus" className="mr-2" />
            Nạp tiền vô
          </Button>
          <Button
            variant="tertiary"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <Icon icon="zi-clock-1" />
          </Button>
        </Box>
      </Box>

      {/* Top Up Modal */}
      <Modal
        visible={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        title="Nạp tiền vào ví GiGi"
      >
        <Box className="p-4">
          {/* Quick Amount Selection */}
          <Box className="mb-6">
            <Text className="font-semibold mb-3 text-gray-800">
              Chọn số tiền nạp vô nha
            </Text>
            <Box className="grid grid-cols-2 gap-3 mb-4">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "primary" : "secondary"}
                  onClick={() => handleAmountSelect(amount)}
                  className="h-12 text-sm font-medium"
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </Box>
            
            {/* Custom Amount Input */}
            <Box>
              <Text size="small" className="text-gray-600 mb-2">
                Hoặc nhập số tiền khác nha (tối thiểu 10.000đ)
              </Text>
              <Input
                type="text"
                placeholder="Nhập số tiền nè..."
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                prefix={<Text className="text-gray-500">đ</Text>}
              />
            </Box>
          </Box>
          
          {/* Selected Amount Display */}
          {selectedAmount > 0 && (
            <Box className="bg-gray-50 rounded-lg p-4 mb-6">
              <Box flex className="items-center justify-between">
                <Text className="text-gray-600">Số tiền nạp vô:</Text>
                <Text className="font-bold text-lg text-purple-600">
                  {formatCurrency(selectedAmount)}
                </Text>
              </Box>
            </Box>
          )}
          
          {/* Continue Button */}
          <Button
            fullWidth
            variant="primary"
            disabled={selectedAmount < 10000}
            onClick={() => setShowPaymentMethods(true)}
            className="h-12"
          >
            Tiếp tục
          </Button>
        </Box>
      </Modal>

      {/* Payment Methods Sheet */}
      <Sheet
        visible={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        title="Chọn phương thức thanh toán"
        height="auto"
      >
        <Box className="p-4">
          <Text className="text-center text-gray-600 mb-4">
            Nạp {formatCurrency(selectedAmount)} vào tài khoản
          </Text>
          
          <Box className="space-y-3">
            {paymentMethods.map((method) => (
              <Button
                key={method.id}
                variant="secondary"
                fullWidth
                className="h-16 justify-start p-4"
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                <Box flex className="items-center space-x-4">
                  <Box className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {method.icon}
                  </Box>
                  <Box className="text-left">
                    <Text className="font-semibold text-gray-800">
                      {method.name}
                    </Text>
                    <Text size="small" className="text-gray-500">
                      {method.id === 'momo' && 'Ví điện tử MoMo'}
                      {method.id === 'zalopay' && 'Ví điện tử ZaloPay'}
                      {method.id === 'vietqr' && 'Quét mã QR thanh toán'}
                      {method.id === 'banking' && 'Chuyển khoản ngân hàng'}
                    </Text>
                  </Box>
                  <Icon icon="zi-chevron-right" className="text-gray-400 ml-auto" />
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
      </Sheet>
    </>
  );
};

export default WalletComponent;
