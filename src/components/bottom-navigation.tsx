import React from 'react';
import { BottomNavigation, Icon, Button, Box, Text } from 'zmp-ui';

interface AppBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppBottomNavigation: React.FC<AppBottomNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <Box className="fixed bottom-0 left-0 right-0 z-50">
      {/* Mobile-First Responsive Bottom Navigation */}
      <Box 
        className="bg-white/98 backdrop-blur-sm border-t border-gray-200 mx-2 mb-2 rounded-t-2xl"
        style={{ 
          paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box className="flex items-center justify-between px-3 py-3 max-w-sm mx-auto">
          {/* Home */}
          <Button
            variant="tertiary"
            className={`flex-1 mx-1 p-3 rounded-xl transition-all duration-200 flex flex-col items-center space-y-1 ${
              activeTab === 'home' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
            }`}
            onClick={() => onTabChange('home')}
          >
            <Icon icon="zi-home" className="text-lg" />
            <span className="text-xs font-medium"></span>
          </Button>

          {/* Map */}
          <Button
            variant="tertiary"
            className={`flex-1 mx-1 p-3 rounded-xl transition-all duration-200 flex flex-col items-center space-y-1 ${
              activeTab === 'map' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
            }`}
            onClick={() => onTabChange('map')}
          >
            <Icon icon="zi-location" className="text-lg" />
            <span className="text-xs font-medium"></span>
          </Button>

          {/* Machines */}
          {/* <Button
            variant="tertiary"
            className={`flex-1 mx-1 p-3 rounded-xl transition-all duration-200 flex flex-col items-center space-y-1 ${
              activeTab === 'machines' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
            }`}
            onClick={() => onTabChange('machines')}
          >
            <Icon icon="zi-more-grid" className="text-lg" />
            <span className="text-xs font-medium"></span>
          </Button> */}

          {/* Profile */}
          <Button
            variant="tertiary"
            className={`flex-1 mx-1 p-3 rounded-xl transition-all duration-200 flex flex-col items-center space-y-1 ${
              activeTab === 'profile' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
            }`}
            onClick={() => onTabChange('profile')}
          >
            <Icon icon="zi-user" className="text-lg" />
            <span className="text-xs font-medium"></span>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AppBottomNavigation;
