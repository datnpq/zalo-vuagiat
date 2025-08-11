import React from 'react';
import { Box, Header, Text, Button, Icon } from 'zmp-ui';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/atoms';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title = "GiGi",
  showBack = false,
  onBack,
  rightAction
}) => {
  const [user] = useAtom(userAtom);

  return (
    <Box className="app-header bg-white/95 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* Safe area for notch devices */}
      <Box className="h-0" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }} />
      
      <Box className="px-4 py-4">
        <Box flex className="items-center justify-between">
          {/* Left side - Back button or empty space */}
          <Box className="w-10">
            {showBack && (
              <Button
                variant="tertiary"
                size="small"
                icon={<Icon icon="zi-arrow-left" className="icon-secondary icon-md" />}
                onClick={onBack}
                className="btn-hover-lift focus-ring"
              />
            )}
          </Box>

          {/* Center - Title */}
          <Text.Title className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight flex-1 text-center">
            {title}
          </Text.Title>

          {/* Right side - Actions */}
          <Box className="w-10 flex justify-end">
            {rightAction}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppHeader;
