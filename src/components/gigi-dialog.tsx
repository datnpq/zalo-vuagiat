import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Modal } from 'zmp-ui';

interface GiGiDialogProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

const GiGiDialog: React.FC<GiGiDialogProps> = ({
  visible,
  title,
  message,
  type = 'info',
  confirmText = 'Okê!',
  cancelText = 'Thôi',
  onConfirm,
  onCancel,
  showCancel = false
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [visible]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <Box className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </Box>
        );
      case 'warning':
        return (
          <Box className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </Box>
        );
      case 'error':
        return (
          <Box className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Box>
        );
      default:
        return (
          <Box className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Box>
        );
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  if (!show && !visible) return null;

  return (
    <Modal
      visible={visible}
      onClose={handleCancel}
      className="gigi-dialog"
    >
      <Box className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
        {/* Icon and Title */}
        <Box className="text-center mb-4">
          {getIcon()}
          
          <Text.Title className="text-lg font-bold text-gray-900 mb-2">
            {title}
          </Text.Title>
          
          <Text className="text-gray-600 leading-relaxed text-sm">
            {message}
          </Text>
        </Box>

        {/* Action Buttons */}
        <Box className="flex flex-col space-y-3 mt-6">
          <Button
            variant="primary"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full py-3 font-medium"
            onClick={handleConfirm}
            fullWidth
          >
            {confirmText}
          </Button>
          
          {showCancel && (
            <Button
              variant="tertiary"
              className="text-gray-600 bg-gray-100 rounded-full py-3 font-medium"
              onClick={handleCancel}
              fullWidth
            >
              {cancelText}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

// Hook for easy usage
export const useGiGiDialog = () => {
  const [dialog, setDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showDialog = (options: Omit<typeof dialog, 'visible'>) => {
    setDialog({ ...options, visible: true });
  };

  const hideDialog = () => {
    setDialog(prev => ({ ...prev, visible: false }));
  };

  const showSuccess = (title: string, message: string, onConfirm?: () => void) => {
    showDialog({
      title,
      message,
      type: 'success',
      confirmText: 'Tuyệt vời!',
      onConfirm: () => {
        onConfirm?.();
        hideDialog();
      }
    });
  };

  const showError = (title: string, message: string, onConfirm?: () => void) => {
    showDialog({
      title,
      message,
      type: 'error',
      confirmText: 'Hiểu rồi',
      onConfirm: () => {
        onConfirm?.();
        hideDialog();
      }
    });
  };

  const showConfirm = (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
    showDialog({
      title,
      message,
      type: 'warning',
      confirmText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
      showCancel: true,
      onConfirm: () => {
        onConfirm?.();
        hideDialog();
      },
      onCancel: () => {
        onCancel?.();
        hideDialog();
      }
    });
  };

  const DialogComponent = () => (
    <GiGiDialog
      {...dialog}
      onConfirm={dialog.onConfirm}
      onCancel={() => {
        dialog.onCancel?.();
        hideDialog();
      }}
    />
  );

  return {
    showDialog,
    hideDialog,
    showSuccess,
    showError,
    showConfirm,
    DialogComponent
  };
};

export default GiGiDialog;
