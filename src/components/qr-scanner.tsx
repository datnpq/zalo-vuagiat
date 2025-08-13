import React, { useState } from 'react';
import { Box, Modal, Text, Button, Icon } from 'zmp-ui';
import { useToast, ToastMessages } from './toast';

interface QRScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanned: (qrData: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ visible, onClose, onScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanAttempts, setScanAttempts] = useState(0);
  const { showSuccess, showError, showInfo, ToastContainer } = useToast();

  const handleStartScan = () => {
    setIsScanning(true);
    showInfo('Đang khởi động camera... 📱');
    setScanAttempts(prev => prev + 1);
    
    // Mock QR scan result with realistic scenarios
    setTimeout(() => {
      // Simulate different scenarios based on attempts
      if (scanAttempts === 0) {
        // First attempt - success
        const mockMachineData = {
          storeId: 'store1',
          machineId: 'wash2', // Available machine
          type: 'washing',
          price: 35000,
          capacity: 12,
          features: ['Giặt cao cấp', 'Khử mùi']
        };
        
        setIsScanning(false);
        showSuccess('Quét QR thành công! 🎉');
        onScanned(JSON.stringify(mockMachineData));
        onClose();
      } else if (scanAttempts === 1) {
        // Second attempt - machine busy
        setIsScanning(false);
        showError(ToastMessages.error.machineUnavailable);
      } else {
        // Third+ attempt - success with different machine
        const mockMachineData = {
          storeId: 'store2',
          machineId: 'dry4', // Available drying machine
          type: 'drying',
          price: 22000,
          capacity: 8,
          features: ['Sấy êm ái', 'Bảo vệ vải']
        };
        
        setIsScanning(false);
        showSuccess('Tìm thấy máy sấy trống! 🌪️');
        onScanned(JSON.stringify(mockMachineData));
        onClose();
      }
    }, 2500);
  };

  const handleClose = () => {
    setIsScanning(false);
    setScanAttempts(0);
    onClose();
  };

  return (
    <>
      <ToastContainer />
      <Modal
        visible={visible}
        title=""
        onClose={handleClose}
        maskClosable={!isScanning}
        className="modal-enhanced"
      >
        <Box className="p-6 text-center">
          {/* Clean Scanner Header */}
          <Box className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Icon icon="zi-camera" className="text-white text-2xl" />
          </Box>

          <Text className="text-xl font-semibold mb-2 text-gray-900">
            Quét mã QR máy giặt
          </Text>

          <Text className="text-gray-600 mb-6 text-sm">
            Hướng camera về phía mã QR trên máy để bắt đầu sử dụng dịch vụ
          </Text>

          {!isScanning ? (
            <>
              {/* Clean Camera View */}
              <Box className="w-64 h-64 mx-auto mb-6 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center relative">
                {/* Simple viewfinder */}
                <Box className="absolute inset-6 border-2 border-blue-400 rounded-xl">
                  <Box className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
                  <Box className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
                  <Box className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500" />
                  <Box className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500" />
                </Box>
                
                <Box className="text-center">
                  <Icon icon="zi-camera" className="text-gray-400 text-4xl mb-2" />
                  <Text size="small" className="text-gray-600">Camera sẵn sàng</Text>
                </Box>
              </Box>

              {/* Clean Start Button */}
              <Button
                fullWidth
                variant="primary"
                onClick={handleStartScan}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 mb-4 rounded-xl transition-colors duration-200"
              >
                Bắt đầu quét QR
              </Button>
            </>
          ) : (
            <>
              {/* Clean Scanning Animation */}
              <Box className="w-64 h-64 mx-auto mb-6 bg-gray-900 rounded-2xl relative overflow-hidden flex items-center justify-center">
                {/* Simple viewfinder */}
                <Box className="absolute inset-6 border-2 border-green-400 rounded-xl">
                  <Box className="w-full h-0.5 bg-green-400 absolute top-1/2 animate-pulse" />
                  <Box className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400" />
                  <Box className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400" />
                  <Box className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400" />
                  <Box className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400" />
                </Box>
                
                <Box className="text-center">
                  <Text className="text-white font-semibold mb-1">Đang quét...</Text>
                  <Text className="text-green-400 text-sm">Giữ camera ổn định</Text>
                </Box>
              </Box>

              {/* Simple Loading */}
              <Box className="flex items-center justify-center mb-6">
                <Box className="flex gap-1">
                  <Box className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <Box className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <Box className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </Box>
              </Box>
            </>
          )}

          {/* Clean Cancel Button */}
          <Button
            fullWidth
            variant="tertiary"
            onClick={handleClose}
            disabled={isScanning}
            className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-xl transition-colors duration-200"
          >
            {isScanning ? 'Đang quét...' : 'Hủy bỏ'}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default QRScanner;
