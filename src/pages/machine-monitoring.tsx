import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Box, Page, Text, Button, Icon, Select } from 'zmp-ui';
import { selectedMachineAtom, selectedStoreAtom, activeReservationsAtom } from '@/store/atoms';
import AppHeader from '@/components/app-header';

function MachineMonitoringPage() {
  const [selectedMachine] = useAtom(selectedMachineAtom);
  const [selectedStore] = useAtom(selectedStoreAtom);
  const [activeReservations] = useAtom(activeReservationsAtom);
  const [progress, setProgress] = useState(12);
  const [remainingTime, setRemainingTime] = useState(40);
  const [notificationMinutes, setNotificationMinutes] = useState('5');

  // Simulate progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
      setRemainingTime(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!selectedMachine || !selectedStore) {
    return (
      <Page>
        <AppHeader title="Theo dõi máy giặt" />
        <Box className="p-4 text-center">
          <Text>Không tìm thấy thông tin máy nè</Text>
        </Box>
      </Page>
    );
  }

  const activeReservation = activeReservations[0]; // Get first active reservation

  return (
    <Page className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <AppHeader title="Máy giặt của tui" />
      
      {/* Machine Status Header */}
      <Box className="clean-card m-4 p-0 overflow-hidden">
        {/* Store Images */}
        <Box className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 overflow-hidden">
          <Box className="absolute top-4 right-4 bg-black bg-opacity-30 backdrop-blur-sm text-white px-3 py-1 rounded-full">
            <Text size="xxSmall" className="font-semibold">1/5</Text>
          </Box>
          <Box className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-pulse">🏪</div>
          </Box>
          
          {/* Navigation arrows */}
          <Button
            size="small"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200 btn-hover-lift focus-ring"
            icon={<Icon icon="zi-chevron-left" className="text-white icon-md" />}
          />
          <Button
            size="small" 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200 btn-hover-lift focus-ring"
            icon={<Icon icon="zi-chevron-right" className="text-white icon-md" />}
          />
        </Box>

        {/* Store Info */}
        <Box className="text-center p-4">
          <Text.Title size="large" className="font-bold mb-2 text-gray-900">
            {selectedStore.name}
          </Text.Title>
          
          <Box flex className="items-center justify-center space-x-2">
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-call" className="icon-success" />}
              className="bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 transition-all duration-200 btn-hover-lift focus-ring"
            />
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-location" className="icon-primary" />}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all duration-200 btn-hover-lift focus-ring"
            />
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-star" className="icon-warning" />}
              className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 transition-all duration-200 btn-hover-lift focus-ring"
            />
          </Box>
        </Box>
      </Box>

      {/* Machine Tabs */}
      <Box className="clean-card m-4 p-0">
        <Box flex className="justify-center space-x-4 p-4 border-b border-gray-100">{/* rest of tabs content */}
          <Box className="text-center pb-2 border-b-2 border-purple-600">
            <Text size="small" className="font-semibold text-purple-600">
              Trạng thái máy
            </Text>
          </Box>
          <Box className="text-center pb-2">
            <Text size="small" className="text-gray-500">
              Thông tin cửa hàng
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Machine Status Card */}
      <Box className="p-4">
        <Box className="bg-white rounded-lg p-6 shadow-sm">
          <Box flex className="items-center justify-between mb-4">
            <Box>
              <Text.Title size="large" className="font-bold">
                {selectedMachine.type === 'washing' ? 'Máy giặt' : 'Máy sấy'} 01
              </Text.Title>
            </Box>
            <Icon icon="zi-close" className="text-gray-400" />
          </Box>

          {/* Progress Circle */}
          <Box className="text-center mb-6">
            <Box className="relative inline-flex items-center justify-center">
              <Box className="w-32 h-32 rounded-full border-8 border-gray-200 relative">
                <Box 
                  className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent border-r-transparent"
                  style={{
                    transform: `rotate(${(progress / 100) * 360}deg)`,
                    transition: 'transform 0.3s ease'
                  }}
                />
                <Box className="absolute inset-0 flex items-center justify-center">
                  <Text.Title size="xLarge" className="font-bold">
                    {progress}%
                  </Text.Title>
                </Box>
              </Box>
            </Box>
            
            <Text.Title size="small" className="font-semibold mt-4 mb-2">
              {selectedMachine.type === 'washing' ? 'Đang giặt' : 'Đang sấy'}
            </Text.Title>
            <Box flex className="items-center justify-center space-x-1">
              <Icon icon="zi-clock-1" className="text-gray-500" />
              <Text size="small" className="text-gray-600">
                {remainingTime} phút còn lại
              </Text>
            </Box>
          </Box>

          {/* Notification Settings */}
          <Box>
            <Text size="small" className="font-semibold mb-3">
              Thông báo trước khi hoàn thành (phút)
            </Text>
            <Select
              value={notificationMinutes}
              onChange={(value) => setNotificationMinutes(value as string)}
              placeholder="Chọn thời gian"
            >
              <Select.Option value="0" title="Tắt thông báo" />
              <Select.Option value="5" title="5 phút" />
              <Select.Option value="10" title="10 phút" />
              <Select.Option value="15" title="15 phút" />
            </Select>
          </Box>
        </Box>

        {/* Heart Button */}
        <Box className="text-center mt-4">
          <Button
            variant="tertiary"
            icon={<Icon icon="zi-heart" />}
          />
        </Box>
      </Box>
    </Page>
  );
}

export default MachineMonitoringPage;
