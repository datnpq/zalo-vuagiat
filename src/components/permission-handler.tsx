import React, { useEffect, useState } from 'react';
import { Box, Modal, Text, Button, Icon } from 'zmp-ui';
import { authorize, getSetting, getUserInfo } from 'zmp-sdk/apis';

interface PermissionHandlerProps {
  onPermissionsGranted: () => void;
}

const PermissionHandler: React.FC<PermissionHandlerProps> = ({ onPermissionsGranted }) => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const permissions = [
    {
      scope: 'scope.userInfo',
      title: 'Thông tin cá nhân',
      description: 'Để hiển thị tên và ảnh đại diện của bạn',
      icon: 'zi-user'
    },
    {
      scope: 'scope.userLocation',
      title: 'Vị trí của bạn',
      description: 'Để tìm tiệm giặt gần nhất',
      icon: 'zi-location'
    }
  ];

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const settings = await getSetting({});
      
      // Check if all required permissions are granted
      const needsPermissions = permissions.some(permission => {
        const granted = settings[permission.scope as keyof typeof settings];
        return !granted;
      });

      if (needsPermissions) {
        setShowPermissionModal(true);
      } else {
        onPermissionsGranted();
      }
    } catch (error) {
      console.log('Permission check failed, showing modal anyway');
      setShowPermissionModal(true);
    }
  };

  const requestCurrentPermission = async () => {
    if (currentStep >= permissions.length) {
      setShowPermissionModal(false);
      onPermissionsGranted();
      return;
    }

    setIsLoading(true);
    const permission = permissions[currentStep];

    try {
      await authorize({
        scopes: [permission.scope as any]
      });

      // Move to next permission
      setCurrentStep(prev => prev + 1);
      
      if (currentStep + 1 >= permissions.length) {
        setShowPermissionModal(false);
        onPermissionsGranted();
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      // Continue anyway - optional permissions
      setCurrentStep(prev => prev + 1);
      
      if (currentStep + 1 >= permissions.length) {
        setShowPermissionModal(false);
        onPermissionsGranted();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const skipPermission = () => {
    setCurrentStep(prev => prev + 1);
    
    if (currentStep + 1 >= permissions.length) {
      setShowPermissionModal(false);
      onPermissionsGranted();
    }
  };

  if (!showPermissionModal) return null;

  const currentPermission = permissions[currentStep];

  return (
    <Modal
      visible={showPermissionModal}
      title=""
      onClose={() => {}}
      maskClosable={false}
    >
      <Box className="p-6 text-center">
        {/* App Logo */}
        <Box className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Text className="text-white font-bold text-xl">GiGi</Text>
        </Box>

        <Text.Title className="text-xl font-bold mb-2 text-gray-900">
          Chào mừng đến với GiGi!
        </Text.Title>

        {currentStep < permissions.length ? (
          <>
            <Text className="text-gray-600 mb-6">
              Để có trải nghiệm tốt nhất, GiGi cần một số quyền truy cập:
            </Text>

            {/* Current Permission */}
            <Box className="bg-gray-50 rounded-xl p-4 mb-6">
              <Box className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Icon icon={currentPermission.icon as any} className="text-purple-600 text-xl" />
              </Box>
              
              <Text.Title size="small" className="font-semibold mb-2">
                {currentPermission.title}
              </Text.Title>
              
              <Text size="small" className="text-gray-600">
                {currentPermission.description}
              </Text>
            </Box>

            {/* Progress */}
            <Box className="flex space-x-2 justify-center mb-6">
              {permissions.map((_, index) => (
                <Box
                  key={index}
                  className={`h-2 w-6 rounded-full ${
                    index <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </Box>

            {/* Buttons */}
            <Box className="space-y-3">
              <Button
                fullWidth
                variant="primary"
                loading={isLoading}
                onClick={requestCurrentPermission}
              >
                Cho phép
              </Button>
              
              <Button
                fullWidth
                variant="tertiary"
                onClick={skipPermission}
                disabled={isLoading}
              >
                Bỏ qua
              </Button>
            </Box>

            <Text size="xSmall" className="text-gray-400 mt-4">
              Bước {currentStep + 1} / {permissions.length}
            </Text>
          </>
        ) : (
          <>
            <Icon icon="zi-check-circle" className="text-green-500 text-4xl mb-4" />
            <Text className="text-gray-600 mb-6">
              Tất cả quyền đã được cấp! Bạn có thể bắt đầu sử dụng GiGi ngay bây giờ.
            </Text>
            
            <Button
              fullWidth
              variant="primary"
              onClick={() => {
                setShowPermissionModal(false);
                onPermissionsGranted();
              }}
            >
              Bắt đầu sử dụng
            </Button>
          </>
        )}

        {/* Footer */}
        <Text size="xxSmall" className="text-gray-400 mt-6">
          GiGi cam kết bảo vệ thông tin cá nhân của bạn
        </Text>
      </Box>
    </Modal>
  );
};

export default PermissionHandler;
