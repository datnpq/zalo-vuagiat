import React from 'react';
import { Icon, Button, Box } from 'zmp-ui';
import { useAtom } from 'jotai';
import { activeReservationsAtom } from '@/store/atoms';

interface AppBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppBottomNavigation: React.FC<AppBottomNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const [activeReservations] = useAtom(activeReservationsAtom);
  const activeCount = activeReservations.length;
  const tabs: Array<{ key: 'home'|'map'|'machines'|'profile'; icon: string; label: string; badge?: number }> = [
    { key: 'home', icon: 'zi-home', label: 'Trang chủ' },
    { key: 'map', icon: 'zi-location', label: 'Bản đồ' },
    { key: 'machines', icon: 'zi-more-grid', label: 'Cửa hàng' },
    { key: 'profile', icon: 'zi-user', label: 'Tài khoản', badge: activeCount },
  ];

  return (
    <Box className="fixed bottom-0 left-0 right-0 z-50">
      <Box 
        className="mx-3 mb-3 rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-md"
        style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom, 6px))', boxShadow: '0 -8px 24px rgba(0,0,0,0.06)' }}
      >
        <Box className="flex items-end justify-between px-2 py-2 max-w-md mx-auto">
          {tabs.map(({ key, icon, label, badge }) => {
            const isActive = activeTab === key;
            return (
              <Button
                key={key}
                variant="tertiary"
                aria-label={label}
                className={`flex-1 mx-1 px-2 py-2 rounded-2xl transition-all duration-200 flex flex-col items-center ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                }`}
                onClick={() => onTabChange(key)}
              >
                <Box className="relative flex flex-col items-center">
                  <Box className={`grid place-items-center rounded-xl w-9 h-9 transition-all ${
                    isActive ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md scale-105' : 'bg-transparent'
                  }`}>
                    <Icon icon={icon as any} className={`text-[18px] ${isActive ? 'text-white' : ''}`} />
                  </Box>
                  {badge && badge > 0 && key === 'profile' && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] rounded-full bg-red-500 text-white">
                      {badge}
                    </span>
                  )}
                  <span className={`mt-1 text-[11px] font-medium leading-none ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>{label}</span>
                  <span className={`mt-1 h-1 w-6 rounded-full transition-transform ${isActive ? 'bg-blue-500 scale-100' : 'bg-transparent scale-0'}`} />
                </Box>
              </Button>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default AppBottomNavigation;
