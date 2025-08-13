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
    { key: 'profile', icon: 'zi-user', label: 'Tài khoản', badge: activeCount > 0 ? activeCount : undefined },
  ];

  // Show monitor tab only when there are active reservations
  if (activeCount > 0) {
    tabs.splice(3, 0, { key: 'monitor', icon: 'zi-clock-1', label: 'Theo dõi', badge: activeCount });
  }

  return (
    <Box className="fixed bottom-0 left-0 right-0 z-50">
      {/* Aurora Background Effect */}
      <Box
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.1) 75%, rgba(139, 92, 246, 0.1) 100%)',
          backgroundSize: '400% 400%',
          animation: 'aurora 8s ease-in-out infinite'
        }}
      />
      
      <Box
        className="mx-3 mb-3 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        style={{
          paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
          boxShadow: '0 -20px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        {/* Inner Aurora Glow */}
        <Box
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          }}
        />
        
        <Box className="flex items-center justify-between px-4 py-4 max-w-md mx-auto relative z-10">
          {tabs.map(({ key, icon, label, badge }) => {
            const isActive = activeTab === key;
            const isMonitorTab = key === 'monitor';
            return (
              <Button
                key={key}
                variant="tertiary"
                aria-label={label}
                className="flex-1 mx-1 px-2 py-2 rounded-2xl transition-all duration-300 flex flex-col items-center transform hover:scale-110 active:scale-95"
                onClick={() => onTabChange(key)}
              >
                <Box className="relative flex flex-col items-center">
                  <Box className={`grid place-items-center rounded-2xl w-12 h-12 transition-all duration-300 ${
                    isActive
                      ? (isMonitorTab
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-110'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                        )
                      : 'bg-white/20 backdrop-blur-sm text-gray-600 hover:bg-white/30 hover:text-blue-600'
                  }`}>
                    <Icon icon={icon as any} className={`text-[22px] ${isActive ? 'text-white' : ''}`} />
                  </Box>
                  {badge && badge > 0 && (
                    <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] rounded-full font-bold shadow-lg animate-pulse ${
                      isMonitorTab ? 'bg-purple-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {badge}
                    </span>
                  )}
                  {/* Active indicator dot */}
                  <Box className={`mt-2 w-1 h-1 rounded-full transition-all duration-300 ${
                    isActive
                      ? (isMonitorTab
                          ? 'bg-purple-400 scale-100 opacity-100'
                          : 'bg-blue-400 scale-100 opacity-100'
                        )
                      : 'bg-transparent scale-0 opacity-0'
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
