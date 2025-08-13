import React from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';

interface EmptyStateProps {
  type: 'no-machines' | 'no-reservations' | 'no-favorites' | 'no-transactions';
  title?: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  subtitle,
  actionText,
  onAction,
  className = ''
}) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-machines':
        return {
          emoji: '🔄',
          defaultTitle: 'Máy đang bận hết rồi!',
          defaultSubtitle: 'Đợi tí nha, hoặc thử tìm tiệm khác gần đây. GiGi sẽ báo cho bạn khi có máy trống!',
          defaultAction: 'Tìm tiệm khác'
        };
      case 'no-reservations':
        return {
          emoji: '🧺',
          defaultTitle: 'Chưa có máy nào đang chạy nè!',
          defaultSubtitle: 'Hãy đến tiệm và chọn máy để bắt đầu giặt ủi nhé!',
          defaultAction: 'Tìm tiệm gần nhất'
        };
      case 'no-favorites':
        return {
          emoji: '⭐',
          defaultTitle: 'Chưa có tiệm quen thuộc!',
          defaultSubtitle: 'Thêm các tiệm bạn thích vào danh sách để dễ tìm sau này nha!',
          defaultAction: 'Khám phá tiệm'
        };
      case 'no-transactions':
        return {
          emoji: '💳',
          defaultTitle: 'Chưa có giao dịch nào!',
          defaultSubtitle: 'Lịch sử trả tiền sẽ hiển thị ở đây sau khi bạn dùng dịch vụ nè!',
          defaultAction: 'Bắt đầu giặt ủi'
        };
      default:
        return {
          emoji: '🤔',
          defaultTitle: 'Không có gì ở đây!',
          defaultSubtitle: 'Hãy thử lại sau nhé!',
          defaultAction: 'Làm mới'
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <Box className={`text-center py-16 px-6 ${className}`}>
      {/* Enhanced Icon Container */}
      <Box className="relative mb-8">
        <Box className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-lg border border-blue-200/50 mb-4">
          <Text className="text-4xl animate-bounce">
            {content.emoji}
          </Text>
        </Box>
        
        {/* Floating decorative elements */}
        <Box className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <Box className="w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-60" />
        </Box>
        <Box className="absolute top-4 right-1/2 transform translate-x-8">
          <Box className="w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
        </Box>
        <Box className="absolute top-4 left-1/2 transform -translate-x-8">
          <Box className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
        </Box>
      </Box>
      
      {/* Enhanced Title */}
      <Text className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
        {title || content.defaultTitle}
      </Text>
      
      {/* Enhanced Subtitle */}
      <Text className="text-gray-600 leading-relaxed mb-8 px-4 text-base">
        {subtitle || content.defaultSubtitle}
      </Text>

      {/* Enhanced Action Button */}
      {(onAction || actionText) && (
        <Button
          variant="primary"
          size="medium"
          onClick={onAction}
          className="font-semibold px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl"
        >
          <Icon icon="zi-star" className="mr-2" />
          {actionText || content.defaultAction}
        </Button>
      )}

      {/* Enhanced Decorative elements */}
      <Box className="flex justify-center gap-3 mt-10 opacity-40">
        <Box className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
        <Box className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        <Box className="w-3 h-3 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
      </Box>
      
      {/* Background Pattern */}
      <Box
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="empty-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="1" fill="#3b82f6" opacity="0.3"/>
                  <circle cx="15" cy="15" r="0.5" fill="#8b5cf6" opacity="0.2"/>
                  <circle cx="45" cy="45" r="0.5" fill="#6366f1" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#empty-pattern)"/>
            </svg>
          `)}')`
        }}
      />
    </Box>
  );
};

export default EmptyState;
