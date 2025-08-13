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
  const tabs: Array<{ key: 'home'|'map'|'machines'|'profile'|'monitor'; icon: string; label: string; badge?: number }> = [
    { key: 'home', icon: 'zi-home', label: 'Trang chủ' },
    { key: 'map', icon: 'zi-location', label: 'Bản đồ' },
    { key: 'machines', icon: 'zi-more-grid', label: 'Cửa hàng' },
    { key: 'profile', icon: 'zi-user', label: 'Tài khoản', badge: activeCount > 0 ? activeCount : undefined },
  ];

  // Show monitor tab only when there are active reservations
  if (activeCount > 0) {
    tabs.splice(3, 0, { key: 'monitor', icon: 'zi-clock-1', label: 'Theo dõi', badge: activeCount });
  }

  return (
    <Box className="fixed bottom-0 left-0 right-0 z-50">
      <Box
        className="mx-3 mb-3 rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-lg shadow-xl"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))', boxShadow: '0 -12px 30px rgba(0,0,0,0.1)' }}
      >
        <Box className="flex items-end justify-between px-3 py-3 max-w-md mx-auto">
          {tabs.map(({ key, icon, label, badge }) => {
            const isActive = activeTab === key;
            const isMonitorTab = key === 'monitor';
            return (
              <Button
                key={key}
                variant="tertiary"
                aria-label={label}
                className={`flex-1 mx-1 px-2 py-2 rounded-2xl transition-all duration-300 flex flex-col items-center transform hover:scale-105 ${
                  isActive ? (isMonitorTab ? 'text-purple-600' : 'text-blue-600') : 'text-gray-500 hover:text-blue-600'
                }`}
                onClick={() => onTabChange(key)}
              >
                <Box className="relative flex flex-col items-center">
                  <Box className={`grid place-items-center rounded-xl w-12 h-12 transition-all duration-300 ${
                    isActive
                      ? (isMonitorTab
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-110'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110'
                        )
                      : 'bg-gray-100'
                  }`}>
                    <Icon icon={icon as any} className={`text-[20px] ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  </Box>
                  {badge && badge > 0 && (
                    <span className={`absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[20px] h-5 px-2 text-[11px] rounded-full font-bold shadow-md animate-pulse ${
                      isMonitorTab ? 'bg-purple-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {badge}
                    </span>
                  )}
                  <span className={`mt-1 text-[11px] font-bold leading-none ${
                    isActive ? (isMonitorTab ? 'text-purple-700' : 'text-blue-700') : 'text-gray-500'
                  }`}>{label}</span>
                  <span className={`mt-1 h-1 w-6 rounded-full transition-transform duration-300 ${
                    isActive
                      ? (isMonitorTab
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 scale-100'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 scale-100'
                        )
                      : 'bg-transparent scale-0'
                  }`} />
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
