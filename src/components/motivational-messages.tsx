import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';

interface MotivationalMessageProps {
  className?: string;
}

const MotivationalMessage: React.FC<MotivationalMessageProps> = ({ className = '' }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages = [
    {
      emoji: "🌟",
      title: "Tiết kiệm thời gian!",
      text: "Giặt xong rồi, tự động báo cho bạn nha!"
    },
    {
      emoji: "💚", 
      title: "Thân thiện môi trường",
      text: "Máy giặt của chúng tôi tiết kiệm nước và điện đó!"
    },
    {
      emoji: "🎯",
      title: "Chất lượng 5 sao",
      text: "Quần áo sạch sẽ, thơm tho như mới luôn!"
    },
    {
      emoji: "⚡",
      title: "Nhanh chóng tiện lợi", 
      text: "Chỉ cần 30 giây để đặt máy, dễ vậy thôi!"
    },
    {
      emoji: "🏠",
      title: "Như ở nhà",
      text: "GiGi chăm sóc quần áo bạn chu đáo lắm!"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const message = messages[currentMessage];

  return (
    <Box className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 ${className}`}>
      <Box className="flex items-center justify-between">
        <Box className="flex items-center space-x-3 flex-1">
          <Box className="text-2xl">
            {message.emoji}
          </Box>
          <Box className="flex-1">
            <Text size="small" className="font-bold text-blue-900 mb-0.5">
              {message.title}
            </Text>
            <Text size="xSmall" className="text-blue-700 leading-relaxed">
              {message.text}
            </Text>
          </Box>
        </Box>
        <Button
          size="small"
          variant="tertiary"
          className="w-6 h-6 p-0 opacity-60 hover:opacity-100"
          onClick={() => setIsVisible(false)}
        >
          <Icon icon="zi-close" className="text-xs" />
        </Button>
      </Box>
    </Box>
  );
};

export default MotivationalMessage;
