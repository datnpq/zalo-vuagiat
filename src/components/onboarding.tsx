import React, { useState } from 'react';
import { Box, Text, Button, Swiper } from 'zmp-ui';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      emoji: "🧺",
      title: "Bắt đầu cuộc sống giặt ủi dễ dàng!",
      subtitle: "Đăng ký tiệm quen thuộc và máy yêu thích, giặt ủi không cần chờ đợi nha!",
      buttonText: "Tiếp theo"
    },
    {
      emoji: "⏰", 
      title: "Theo dõi giặt ủi real-time!",
      subtitle: "Kiểm tra tiến độ và thời gian còn lại, đặt báo thức trước khi xong nè!",
      buttonText: "Tiếp theo"
    },
    {
      emoji: "📱",
      title: "Đặt chỗ bằng app luôn!",
      subtitle: "Đặt nhanh qua app và đến tiệm, không phải chờ giặt ủi nữa đâu!",
      buttonText: "Tiếp theo"
    },
    {
      emoji: "💳",
      title: "Trả tiền đơn giản không cần đăng ký!",
      subtitle: "Quét mã QR và chọn cách trả tiền đơn giản thôi nha!",
      buttonText: "Tiếp theo"
    },
    {
      emoji: "🗺️",
      title: "Tìm tiệm GiGi gần nhất!",
      subtitle: "Tìm tiệm trên bản đồ và kiểm tra tình trạng tiệm real-time!",
      buttonText: "Bắt đầu nè"
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
    <Box className="min-h-screen bg-white flex flex-col">
      {/* Progress indicators */}
      <Box className="flex justify-center py-4">
        {slides.map((_, index) => (
          <Box
            key={index}
            className={`w-2 h-2 mx-1 rounded-full transition-colors ${
              index === currentSlide ? 'bg-purple-600' : 
              index < currentSlide ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </Box>

      {/* Content */}
      <Box className="flex-1 flex flex-col justify-center px-6 text-center">
        <Box className="text-8xl mb-8">
          {slides[currentSlide].emoji}
        </Box>
        
        <Text className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
          {slides[currentSlide].title}
        </Text>
        
        <Text className="text-gray-600 leading-relaxed px-4 mb-12">
          {slides[currentSlide].subtitle}
        </Text>

        {/* Mock phone preview for some slides */}
        {currentSlide === 1 && (
          <Box className="mx-auto mb-8 w-64 h-96 bg-gray-100 rounded-3xl p-4 shadow-lg">
            <Box className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
              <Box className="text-center">
                <Box className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Text className="text-2xl font-bold text-blue-600">45%</Text>
                </Box>
                <Text size="small" className="text-gray-600">Đang giặt nè</Text>
              </Box>
            </Box>
          </Box>
        )}

        {currentSlide === 2 && (
          <Box className="mx-auto mb-8 w-64 h-96 bg-gray-100 rounded-3xl p-4 shadow-lg">
            <Box className="w-full h-full bg-white rounded-2xl overflow-hidden">
              <Box className="h-1/2 bg-gradient-to-br from-purple-50 to-blue-50 relative">
                <Box className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">🏪</span>
                </Box>
              </Box>
              <Box className="h-1/2 p-4 flex flex-col justify-center">
                <Box className="bg-green-100 rounded-full px-3 py-1 mb-2">
                  <Text size="xSmall" className="text-green-700 font-medium text-center">Trống</Text>
                </Box>
                <Button size="small" variant="primary" className="mt-2">
                  Chọn máy này nè
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Bottom buttons */}
      <Box className="p-6 flex space-x-4">
        <Button
          variant="tertiary"
          className="flex-1"
          onClick={handleSkip}
        >
          Bỏ qua
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleNext}
        >
          {slides[currentSlide].buttonText}
        </Button>
      </Box>
    </Box>
  );
};

export default Onboarding;
