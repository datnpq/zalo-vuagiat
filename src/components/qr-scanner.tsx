import React, { useState } from 'react';
import { Box, Modal, Text, Button, Icon } from 'zmp-ui';

interface QRScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanned: (qrData: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ visible, onClose, onScanned }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    
    // Mock QR scan result after 2 seconds
    setTimeout(() => {
      const mockMachineData = {
        storeId: 'store1',
        machineId: 'wash2', // Available machine
        type: 'washing',
        price: 35000,
        capacity: 12,
        features: ['Giặt cao cấp', 'Khử mùi']
      };
      
      setIsScanning(false);
      onScanned(JSON.stringify(mockMachineData));
      onClose();
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      title=""
      onClose={onClose}
      maskClosable={true}
    >
      <Box className="p-6 text-center">
        {/* Scanner Header */}
        <Box className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Icon icon="zi-camera" className="text-white text-2xl" />
        </Box>

        <Text.Title className="text-xl font-bold mb-2 text-gray-900">
          Quét mã QR máy giặt
        </Text.Title>

        <Text className="text-gray-600 mb-6">
          Hướng camera về phía mã QR trên máy giặt để nhận diện và đặt chỗ nhanh chóng
        </Text>

        {!isScanning ? (
          <>
            {/* Mock Camera View */}
            <Box className="w-64 h-64 mx-auto mb-6 bg-gray-100 rounded-2xl border-4 border-dashed border-gray-300 flex items-center justify-center">
              <Box className="text-center">
                <Icon icon="zi-camera" className="text-gray-400 text-4xl mb-2" />
                <Text size="small" className="text-gray-500">Camera sẵn sàng</Text>
              </Box>
            </Box>

            {/* Start Scan Button */}
            <Button
              fullWidth
              variant="primary"
              onClick={handleStartScan}
              className="bg-gradient-to-r from-purple-600 to-blue-600 mb-4"
            >
              <Icon icon="zi-camera" className="mr-2" />
              Bắt đầu quét
            </Button>
          </>
        ) : (
          <>
            {/* Scanning Animation */}
            <Box className="w-64 h-64 mx-auto mb-6 bg-black rounded-2xl relative overflow-hidden flex items-center justify-center">
              <Box className="absolute inset-4 border-2 border-white rounded-xl">
                {/* Scanning line animation */}
                <Box className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent absolute top-1/2 animate-pulse" />
              </Box>
              <Text className="text-white text-sm">Đang quét...</Text>
            </Box>

            <Box className="flex items-center justify-center mb-6">
              <Icon icon="zi-more-horiz" className="text-purple-600 text-2xl animate-pulse" />
            </Box>
          </>
        )}

        {/* Cancel Button */}
        <Button
          fullWidth
          variant="tertiary"
          onClick={onClose}
          disabled={isScanning}
        >
          Hủy
        </Button>

        {/* Instructions */}
        <Box className="mt-6 p-4 bg-blue-50 rounded-xl">
          <Text size="xSmall" className="text-blue-700 font-medium mb-1">
            💡 Mẹo sử dụng:
          </Text>
          <Text size="xSmall" className="text-blue-600">
            • Giữ camera ổn định và cách mã QR 10-20cm<br />
            • Đảm bảo đủ ánh sáng để quét rõ nét<br />
            • Mã QR thường ở phía trước máy giặt
          </Text>
        </Box>
      </Box>
    </Modal>
  );
};

export default QRScanner;
