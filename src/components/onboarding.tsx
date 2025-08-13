import React, { useState } from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      emoji: "🧺",
      title: "Chào mừng đến với GiGi!",
      subtitle: "Giặt gia công thông minh - Tiện lợi mọi lúc mọi nơi! Không cần chờ đợi, không cần lo lắng nha!",
      buttonText: "Tuyệt vời!",
      color: "from-blue-500 to-indigo-600"
    },
    {
      emoji: "🗺️",
      title: "Tìm tiệm gần bạn nhất!",
      subtitle: "Xem bản đồ các tiệm xung quanh, kiểm tra máy trống real-time. Chọn tiệm gần nhất để tiết kiệm thời gian!",
      buttonText: "Hiểu rồi!",
      color: "from-green-500 to-emerald-600"
    },
    {
      emoji: "📱",
      title: "Quét QR để bắt đầu!",
      subtitle: "Đến tiệm, quét mã QR trên máy, chọn cách thanh toán và máy sẽ tự động chạy. Đơn giản vậy thôi!",
      buttonText: "Dễ quá!",
      color: "from-purple-500 to-pink-600"
    },
    {
      emoji: "⏰",
      title: "Theo dõi tiến độ giặt ủi!",
      subtitle: "App sẽ báo cho bạn khi máy sắp xong. Không cần đứng chờ, làm việc khác thoải mái!",
      buttonText: "Tuyệt vời!",
      color: "from-orange-500 to-red-600"
    },
    {
      emoji: "💰",
      title: "Ví điện tử tiện lợi!",
      subtitle: "Nạp tiền một lần, dùng mãi không lo. Có thưởng thêm khi nạp nhiều nữa đó!",
      buttonText: "Bắt đầu thôi!",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <Box
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="onboarding-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <circle cx="40" cy="40" r="2" fill="#3b82f6" opacity="0.3"/>
                  <circle cx="20" cy="20" r="1" fill="#8b5cf6" opacity="0.2"/>
                  <circle cx="60" cy="60" r="1" fill="#6366f1" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#onboarding-pattern)"/>
            </svg>
          `)}')`
        }}
      />

      {/* Enhanced Progress indicators */}
      <Box className="flex justify-center py-6 relative z-10">
        <Box className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50">
          {slides.map((_, index) => (
            <Box
              key={index}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide
                  ? 'w-8 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md'
                  : index < currentSlide
                    ? 'w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'w-3 h-3 bg-gray-300'
              }`}
            />
          ))}
        </Box>
      </Box>

      {/* Enhanced Content */}
      <Box className="flex-1 flex flex-col justify-center px-6 text-center relative z-10">
        {/* Enhanced Emoji Container */}
        <Box className="relative mb-8">
          <Box className={`w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center shadow-2xl border border-white/20 animate-fadeInScale`}>
            <Text className="text-6xl animate-bounce">
              {slides[currentSlide].emoji}
            </Text>
          </Box>
          
          {/* Floating decorative elements */}
          <Box className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <Box className="w-4 h-4 bg-blue-400 rounded-full animate-pulse opacity-60" />
          </Box>
          <Box className="absolute top-8 right-1/2 transform translate-x-12">
            <Box className="w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
          </Box>
          <Box className="absolute top-8 left-1/2 transform -translate-x-12">
            <Box className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
          </Box>
        </Box>
        
        {/* Enhanced Title */}
        <Text className="text-3xl font-bold text-gray-900 mb-6 leading-tight animate-fadeInUp">
          {slides[currentSlide].title}
        </Text>
        
        {/* Enhanced Subtitle */}
        <Text className="text-gray-600 leading-relaxed px-4 mb-12 text-lg animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          {slides[currentSlide].subtitle}
        </Text>

        {/* Enhanced Mock phone preview */}
        {currentSlide === 1 && (
          <Box className="mx-auto mb-8 w-72 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-4 shadow-2xl border border-gray-300 animate-fadeInScale">
            <Box className="w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-inner">
              <Box className="text-center">
                <Box className="w-28 h-28 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg border border-blue-200">
                  <Text className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">🗺️</Text>
                </Box>
                <Text size="small" className="text-gray-700 font-semibold">Tìm tiệm gần bạn</Text>
                <Text size="xSmall" className="text-gray-500 mt-1">6 tiệm đang mở cửa</Text>
              </Box>
            </Box>
          </Box>
        )}

        {currentSlide === 2 && (
          <Box className="mx-auto mb-8 w-72 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-4 shadow-2xl border border-gray-300 animate-fadeInScale">
            <Box className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-inner">
              <Box className="h-1/2 bg-gradient-to-br from-purple-50 to-pink-50 relative flex items-center justify-center">
                <Box className="text-center">
                  <Text className="text-5xl mb-2">📱</Text>
                  <Text size="small" className="text-purple-700 font-bold">Quét QR</Text>
                </Box>
              </Box>
              <Box className="h-1/2 p-4 flex flex-col justify-center">
                <Box className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl px-4 py-2 mb-3 border border-green-200">
                  <Text size="small" className="text-green-700 font-bold text-center">✅ Máy sẵn sàng</Text>
                </Box>
                <Button size="small" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-lg">
                  Bắt đầu giặt nè!
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {currentSlide === 3 && (
          <Box className="mx-auto mb-8 w-72 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-4 shadow-2xl border border-gray-300 animate-fadeInScale">
            <Box className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-inner">
              <Box className="h-1/3 bg-gradient-to-br from-orange-50 to-red-50 relative flex items-center justify-center">
                <Box className="text-center">
                  <Text className="text-4xl mb-1">⏰</Text>
                  <Text size="xSmall" className="text-orange-700 font-bold">Đang theo dõi</Text>
                </Box>
              </Box>
              <Box className="h-2/3 p-4 flex flex-col justify-center">
                <Box className="text-center mb-4">
                  <Text className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    65%
                  </Text>
                  <Text size="small" className="text-gray-600 font-medium">Còn 15 phút nữa xong</Text>
                </Box>
                <Box className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <Box className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: '65%' }} />
                </Box>
                <Text size="xSmall" className="text-center text-gray-500">🔔 Sẽ báo khi sắp xong</Text>
              </Box>
            </Box>
          </Box>
        )}

        {currentSlide === 4 && (
          <Box className="mx-auto mb-8 w-72 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-4 shadow-2xl border border-gray-300 animate-fadeInScale">
            <Box className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-inner">
              <Box className="h-1/2 bg-gradient-to-br from-indigo-50 to-purple-50 relative flex items-center justify-center">
                <Box className="text-center">
                  <Text className="text-5xl mb-2">💰</Text>
                  <Text size="small" className="text-indigo-700 font-bold">Ví GiGi</Text>
                </Box>
              </Box>
              <Box className="h-1/2 p-4 flex flex-col justify-center">
                <Box className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-3 mb-3 border border-indigo-200">
                  <Text className="text-2xl font-bold text-indigo-700 mb-1">150,000₫</Text>
                  <Text size="xSmall" className="text-indigo-600">+ 25,000₫ thưởng</Text>
                </Box>
                <Text size="xSmall" className="text-center text-gray-500">💳 Nạp tiền dễ dàng</Text>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Beautiful Bottom buttons */}
      <Box className="p-6 flex space-x-3 relative z-10">
        {currentSlide < slides.length - 1 && (
          <Button
            variant="tertiary"
            className="flex-1 bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 py-4 rounded-2xl font-medium shadow-sm"
            onClick={handleSkip}
          >
            <Box className="flex items-center justify-center gap-2">
              <Icon icon="zi-arrow-right" className="text-lg" />
              <Text className="font-medium">Bỏ qua</Text>
            </Box>
          </Button>
        )}
        <Button
          variant="primary"
          className={`${currentSlide < slides.length - 1 ? 'flex-1' : 'w-full'} bg-gradient-to-r ${slides[currentSlide].color} text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200`}
          onClick={handleNext}
        >
          <Box className="flex items-center justify-center gap-2">
            {currentSlide === slides.length - 1 ? (
              <>
                <Icon icon="zi-star" className="text-lg" />
                <Text className="font-semibold">{slides[currentSlide].buttonText}</Text>
              </>
            ) : (
              <>
                <Text className="font-semibold">{slides[currentSlide].buttonText}</Text>
                <Icon icon="zi-arrow-right" className="text-lg" />
              </>
            )}
          </Box>
        </Button>
      </Box>

      {/* Enhanced Decorative elements */}
      <Box className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-30">
        <Box className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <Box className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        <Box className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
      </Box>
    </Box>
  );
};

export default Onboarding;
