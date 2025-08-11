import React, { useState, useEffect } from 'react';
import { Box, Text } from 'zmp-ui';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  showText?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text = 'Đang tải...',
  showText = true,
  className = ''
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-6 h-6';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <Box className={`flex flex-col items-center justify-center ${className}`}>
      <Box className={`relative ${getSizeClass()}`}>
        {/* Outer ring */}
        <Box
          className={`absolute inset-0 border-4 border-purple-200 rounded-full animate-spin`}
          style={{ 
            borderTopColor: '#8b5cf6',
            animationDuration: '1s'
          }}
        />
        
        {/* Inner ring */}
        <Box
          className={`absolute inset-2 border-2 border-pink-200 rounded-full animate-spin`}
          style={{ 
            borderTopColor: '#ec4899',
            animationDuration: '1.5s',
            animationDirection: 'reverse'
          }}
        />
        
        {/* Center dot */}
        <Box className="absolute inset-0 flex items-center justify-center">
          <Box 
            className="w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"
            style={{ animationDuration: '2s' }}
          />
        </Box>
      </Box>
      
      {showText && (
        <Text 
          size="small" 
          className="text-gray-600 mt-3 font-medium animate-pulse"
          style={{ animationDuration: '1.5s' }}
        >
          {text}
        </Text>
      )}
    </Box>
  );
};

interface PulseLoaderProps {
  count?: number;
  size?: number;
  className?: string;
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({
  count = 3,
  size = 8,
  className = ''
}) => {
  return (
    <Box className={`flex items-center justify-center space-x-1 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <Box
          key={i}
          className={`bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </Box>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  lines = 3,
  showAvatar = false
}) => {
  return (
    <Box className={`animate-pulse ${className}`}>
      <Box className="flex items-start space-x-4">
        {showAvatar && (
          <Box className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
        )}
        <Box className="flex-1 space-y-3">
          {[...Array(lines)].map((_, i) => (
            <Box
              key={i}
              className="bg-gray-200 rounded h-4"
              style={{
                width: i === lines - 1 ? '75%' : '100%'
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

interface MachineLoadingProps {
  text?: string;
}

export const MachineLoading: React.FC<MachineLoadingProps> = ({
  text = 'Đang tìm máy giặt...'
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="flex flex-col items-center justify-center py-8">
      {/* Enhanced animated washing machine */}
      <Box className="relative mb-4">
        <Box className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl border-4 border-white shadow-xl relative overflow-hidden">
          {/* Machine door */}
          <Box className="absolute inset-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full overflow-hidden border-2 border-white/50">
            {/* Spinning inner circle with clothes */}
            <Box 
              className="w-full h-full border-4 border-white/30 rounded-full animate-spin relative"
              style={{ animationDuration: '2s' }}
            >
              <Box className="absolute inset-1 bg-white/20 rounded-full">
                <Box className="absolute top-1 left-1 w-2 h-2 bg-white/50 rounded-full" />
                <Box className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-white/40 rounded-full" />
              </Box>
            </Box>
          </Box>
          
          {/* Control panel */}
          <Box className="absolute top-1 right-1 space-y-0.5">
            <Box className="w-1 h-1 bg-gray-400 rounded-full" />
            <Box className="w-1 h-1 bg-gray-400 rounded-full" />
          </Box>
          
          {/* Machine legs */}
          <Box className="absolute -bottom-1 left-1 w-1 h-2 bg-gray-300 rounded-t" />
          <Box className="absolute -bottom-1 right-1 w-1 h-2 bg-gray-300 rounded-t" />
          
          {/* Water bubbles with improved animation */}
          <Box className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-60" 
               style={{ animationDelay: '0s', animationDuration: '1.5s' }} />
          <Box className="absolute -top-2 left-2 w-2 h-2 bg-blue-300 rounded-full animate-bounce opacity-40" 
               style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
          <Box className="absolute top-0 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-bounce opacity-50" 
               style={{ animationDelay: '1s', animationDuration: '1.8s' }} />
               
          {/* Floating soap bubbles */}
          <Box className="absolute -top-3 left-3 w-1.5 h-1.5 bg-white/80 rounded-full animate-float opacity-70" 
               style={{ animationDelay: '0.2s', animationDuration: '3s' }} />
          <Box className="absolute -top-2 right-2 w-1 h-1 bg-white/60 rounded-full animate-float opacity-50" 
               style={{ animationDelay: '1.5s', animationDuration: '2.5s' }} />
        </Box>
      </Box>
      
      <Text className="text-gray-600 font-medium">
        {text}<span className="inline-block w-6">{dots}</span>
      </Text>
      
      <Box className="mt-3">
        <PulseLoader count={3} size={6} />
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
