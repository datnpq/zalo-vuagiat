import React from 'react';
import { Box, Text, Button } from 'zmp-ui';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onClose?: () => void;
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  onClose,
  position = 'top'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '🎉';
      case 'error':
        return '😔';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white shadow-green-200';
      case 'error':
        return 'bg-red-500 text-white shadow-red-200';
      case 'warning':
        return 'bg-yellow-500 text-white shadow-yellow-200';
      default:
        return 'bg-blue-500 text-white shadow-blue-200';
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'bottom':
        return 'bottom-20 left-4 right-4';
      case 'center':
        return 'top-1/2 left-4 right-4 transform -translate-y-1/2';
      default:
        return 'top-20 left-4 right-4';
    }
  };

  if (!visible) return null;

  return (
    <Box
      className={`fixed ${getPosition()} z-50 transform transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <Box
        className={`${getColors()} rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm mx-auto max-w-sm flex items-center space-x-3`}
      >
        <Text className="text-lg">{getIcon()}</Text>
        <Text className="flex-1 font-medium text-sm">{message}</Text>
        {onClose && (
          <Button
            size="small"
            variant="tertiary"
            className="w-6 h-6 p-0 text-white/80 hover:text-white"
            onClick={onClose}
          >
            ×
          </Button>
        )}
      </Box>
    </Box>
  );
};

// Southern Vietnamese messages
export const ToastMessages = {
  success: {
    reservation: 'Đặt máy thành công rồi nha! 🎉',
    payment: 'Thanh toán xong rồi đó! Vô giặt thôi! 💰',
    favorite: 'Đã thêm vào danh sách yêu thích! ❤️',
    machineFound: 'Tìm thấy máy rồi! Mau mau đi giặt! 🔍'
  },
  error: {
    payment: 'Ối dời ơi! Thanh toán bị lỗi rồi 😔',
    network: 'Mạng bị lag rồi bạn ơi! Thử lại nha 📶',
    machineUnavailable: 'Máy này đang bận rồi nha! Tìm máy khác đi 😊',
    location: 'Không tìm thấy vị trí! Bật GPS lên nha 📍'
  },
  warning: {
    lowBattery: 'Pin sắp hết rồi! Cắm sạc đi nha 🔋',
    timeRunningOut: 'Sắp hết giờ rồi! Mau đi nhận đồ! ⏰',
    machineAlmostDone: 'Máy sắp xong rồi! Chuẩn bị nhận đồ nha 👕'
  },
  info: {
    searching: 'Đang tìm máy gần bạn nhất...',
    updating: 'Đang cập nhật thông tin...',
    loading: 'Đợi tí nha, đang tải...'
  }
};

// Hook for easy toast management
export const useToast = () => {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const showSuccess = (message: string, duration = 3000) => {
    showToast(message, 'success', duration);
  };

  const showError = (message: string, duration = 3000) => {
    showToast(message, 'error', duration);
  };

  const showWarning = (message: string, duration = 3000) => {
    showToast(message, 'warning', duration);
  };

  const showInfo = (message: string, duration = 3000) => {
    showToast(message, 'info', duration);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          visible={true}
          onClose={() => hideToast(toast.id)}
          position="top"
        />
      ))}
    </>
  );

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer
  };
};

export default Toast;
