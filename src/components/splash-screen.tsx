import React, { useEffect, useState } from 'react';
import { Box, Text } from 'zmp-ui';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1500);
    const timer3 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);  
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <Box className="fixed inset-0 z-50 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 flex flex-col items-center justify-center">
      {/* Logo Animation */}
      <Box className={`transition-all duration-1000 ${animationPhase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <Box className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6">
          <Text className="text-4xl font-black text-purple-600">GiGi</Text>
        </Box>
      </Box>

      {/* Title Animation */}
      <Box className={`text-center transition-all duration-1000 delay-500 ${animationPhase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <Text className="text-3xl font-bold text-white mb-2">
          GiGi
        </Text>
        <Text className="text-white/90 text-lg font-medium">
          Giặt gia công thông minh
        </Text>
      </Box>

      {/* Subtitle Animation */}
      <Box className={`text-center mt-8 transition-all duration-1000 delay-1000 ${animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <Text className="text-white/80 text-sm">
          Tiện lợi • Nhanh chóng • Sạch sẽ
        </Text>
        <Text className="text-white/60 text-xs mt-2">
          Phong cách miền Nam, chất lượng 5 sao ⭐
        </Text>
      </Box>

      {/* Loading dots */}
      <Box className={`flex space-x-1 mt-12 transition-opacity duration-500 ${animationPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            className="w-2 h-2 bg-white/40 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SplashScreen;
