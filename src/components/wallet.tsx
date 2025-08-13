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
      <Box className={`wallet-card-enhanced bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl ${className}`}>
        {/* Enhanced Background Effects */}
        <Box className="absolute inset-0 opacity-20">
          <Box
            className="absolute top-0 right-0 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
              transform: 'translate(20px, -20px)'
            }}
          />
          <Box
            className="absolute bottom-0 left-0 w-24 h-24 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
              transform: 'translate(-10px, 10px)'
            }}
          />
        </Box>
        
        {/* Animated Background Pattern */}
        <Box
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
              <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="wallet-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.3"/>
                    <circle cx="15" cy="15" r="1" fill="white" opacity="0.2"/>
                    <circle cx="45" cy="45" r="1" fill="white" opacity="0.2"/>
                  </pattern>
                </defs>
                <rect width="400" height="200" fill="url(#wallet-pattern)"/>
                <!-- Wallet icons -->
                <g opacity="0.15">
                  <rect x="50" y="40" width="20" height="15" rx="3" fill="white"/>
                  <rect x="52" y="42" width="16" height="2" rx="1" fill="rgba(0,0,0,0.2)"/>
                  <rect x="52" y="45" width="12" height="2" rx="1" fill="rgba(0,0,0,0.2)"/>
                </g>
                <g opacity="0.1">
                  <circle cx="320" cy="60" r="8" fill="none" stroke="white" stroke-width="1"/>
                  <text x="320" y="65" text-anchor="middle" fill="white" font-size="8">₫</text>
                </g>
              </svg>
            `)}')`
          }}
        />
        
        <Box flex className="items-center justify-between mb-5 relative z-10">
          <Box flex className="items-center gap-2">
            <Box className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Text className="text-white font-bold text-sm">💰</Text>
            </Box>
            <Text className="text-white/90 font-semibold">Số tiền trong ví</Text>
          </Box>
          <Icon icon="zi-more-grid" className="text-white/60 hover:text-white/80 transition-colors cursor-pointer" />
        </Box>
        
        <Box className="mb-6 relative z-10">
          <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
            {formatCurrency(balance)}
          </Text>
          <Box flex className="items-center gap-2">
            <Box className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <Text className="text-white/80 text-sm font-medium">
              Dùng để trả tiền giặt ủi nha
            </Text>
          </Box>
        </Box>
        
        <Box flex className="gap-3 relative z-10">
          <Button
            variant="secondary"
            className="flex-1 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            onClick={() => setShowTopUpModal(true)}
          >
            <Icon icon="zi-plus" className="mr-2" />
            Nạp tiền vô
          </Button>
          <Button
            variant="tertiary"
            className="bg-white/15 backdrop-blur-md border-white/25 text-white hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Icon icon="zi-clock-1" />
          </Button>
        </Box>
      </Box>

      {/* Enhanced Top Up Modal */}
      <Modal
        visible={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        title="Nạp tiền vào ví GiGi"
        className="modal-enhanced"
      >
        <Box className="p-6">
          {/* Header with Icon */}
          <Box flex className="items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <Box className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Text className="text-white font-bold text-lg">💰</Text>
            </Box>
            <Box>
              <Text className="font-bold text-gray-900 text-lg">Nạp tiền vào ví</Text>
              <Text size="small" className="text-gray-600">Chọn số tiền muốn nạp vô nha</Text>
            </Box>
          </Box>
          
          {/* Quick Amount Selection - Enhanced */}
          <Box className="mb-6">
            <Text className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Text className="text-blue-500">⚡</Text>
              Số tiền phổ biến
            </Text>
            <Box className="grid grid-cols-2 gap-3 mb-6">
              {quickAmounts.map((amount, index) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "primary" : "secondary"}
                  onClick={() => handleAmountSelect(amount)}
                  className={`h-14 text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedAmount === amount
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </Box>
            
            {/* Custom Amount Input - Enhanced */}
            <Box className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Text size="small" className="text-gray-700 mb-3 font-medium flex items-center gap-2">
                <Text className="text-purple-500">✏️</Text>
                Hoặc nhập số tiền khác (tối thiểu 10.000đ)
              </Text>
              <Input
                type="text"
                placeholder="Nhập số tiền nè..."
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                prefix={<Text className="text-gray-500 font-semibold">đ</Text>}
                className="form-input-enhanced"
              />
            </Box>
          </Box>
          
          {/* Selected Amount Display - Enhanced */}
          {selectedAmount > 0 && (
            <Box className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 mb-6 border border-blue-200 shadow-sm">
              <Box flex className="items-center justify-between">
                <Box flex className="items-center gap-2">
                  <Box className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Text className="text-white font-bold text-sm">💳</Text>
                  </Box>
                  <Text className="text-gray-700 font-medium">Số tiền nạp vô:</Text>
                </Box>
                <Text className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(selectedAmount)}
                </Text>
              </Box>
            </Box>
          )}
          
          {/* Continue Button - Enhanced */}
          <Button
            fullWidth
            variant="primary"
            disabled={selectedAmount < 10000}
            onClick={() => setShowPaymentMethods(true)}
            className={`h-14 font-semibold text-base transition-all duration-300 ${
              selectedAmount >= 10000
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Icon icon="zi-arrow-right" className="mr-2" />
            Tiếp tục thanh toán
          </Button>
        </Box>
      </Modal>

      {/* Enhanced Payment Methods Sheet */}
      <Sheet
        visible={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        title="Chọn phương thức thanh toán"
        height="auto"
        className="payment-sheet-enhanced"
      >
        <Box className="p-6">
          {/* Amount Summary - Enhanced */}
          <Box className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <Text className="text-gray-600 mb-1">Số tiền cần thanh toán</Text>
            <Text className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatCurrency(selectedAmount)}
            </Text>
          </Box>
          
          {/* Payment Methods - Enhanced */}
          <Box className="space-y-4">
            <Text className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Text className="text-green-500">💳</Text>
              Chọn phương thức thanh toán
            </Text>
            {paymentMethods.map((method, index) => (
              <Button
                key={method.id}
                variant="secondary"
                fullWidth
                className="h-18 justify-start p-4 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-102 shadow-sm hover:shadow-md"
                onClick={() => handlePaymentMethodSelect(method.id)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Box flex className="items-center gap-4 w-full">
                  <Box className={`w-14 h-14 ${method.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg transform transition-transform duration-300 hover:scale-110`}>
                    {method.icon}
                  </Box>
                  <Box className="text-left flex-1">
                    <Text className="font-bold text-gray-900 text-base mb-1">
                      {method.name}
                    </Text>
                    <Text size="small" className="text-gray-600 font-medium">
                      {method.id === 'momo' && 'Ví điện tử MoMo - Nhanh chóng'}
                      {method.id === 'zalopay' && 'Ví điện tử ZaloPay - Tiện lợi'}
                      {method.id === 'vietqr' && 'Quét mã QR - An toàn'}
                      {method.id === 'banking' && 'Chuyển khoản - Đáng tin cậy'}
                    </Text>
                  </Box>
                  <Icon icon="zi-chevron-right" className="text-gray-400 ml-auto transform transition-transform duration-300 group-hover:translate-x-1" />
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
