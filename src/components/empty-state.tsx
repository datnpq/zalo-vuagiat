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
    <Box className={`text-center py-12 px-6 ${className}`}>
      <Box className="text-6xl mb-6 animate-bounce">
        {content.emoji}
      </Box>
      
      <Text className="text-xl font-bold text-gray-900 mb-3 leading-tight">
        {title || content.defaultTitle}
      </Text>
      
      <Text className="text-gray-600 leading-relaxed mb-8 px-2">
        {subtitle || content.defaultSubtitle}
      </Text>

      {(onAction || actionText) && (
        <Button
          variant="primary"
          size="medium"
          onClick={onAction}
          className="font-semibold px-8"
        >
          <Icon icon="zi-star" className="mr-2" />
          {actionText || content.defaultAction}
        </Button>
      )}

      {/* Decorative elements */}
      <Box className="flex justify-center space-x-2 mt-8 opacity-30">
        <Box className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
        <Box className="w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-75" />
        <Box className="w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-150" />
      </Box>
    </Box>
  );
};

export default EmptyState;
