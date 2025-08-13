import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAtom } from 'jotai';
import { Box, Page, Text, Button, Icon, Select } from 'zmp-ui';
import { selectedMachineAtom, selectedStoreAtom, activeReservationsAtom, notificationSettingsAtom, activeTabAtom } from '@/store/atoms';
import { useToast } from '@/components/toast';
import AppHeader from '@/components/app-header';

function MachineMonitoringPage() {
  const [selectedMachine] = useAtom(selectedMachineAtom);
  const [selectedStore] = useAtom(selectedStoreAtom);
  const [activeReservations] = useAtom(activeReservationsAtom);
  const [notificationSettings, setNotificationSettings] = useAtom(notificationSettingsAtom);
  const [, setActiveTab] = useAtom(activeTabAtom);
  const { showInfo, showWarning } = useToast();
  const notifiedRef = useRef(false);

  const handleBackToStore = () => {
    setActiveTab('machines');
  };

  const handleBackToHome = () => {
    setActiveTab('home');
  };

  // Find the active reservation for selected machine
  const reservation = useMemo(() => {
    if (!selectedMachine) return null;
    return activeReservations.find(r => r.machineId === selectedMachine.id && r.status === 'active') || null;
  }, [activeReservations, selectedMachine]);

  // Derived time/progress from reservation
  const { progress, remainingMinutes } = useMemo(() => {
    if (!reservation) return { progress: 0, remainingMinutes: 0 };
    const now = Date.now();
    const start = new Date(reservation.startTime).getTime();
    const end = new Date(reservation.endTime).getTime();
    const total = Math.max(1, end - start);
    const elapsed = Math.max(0, now - start);
    const pct = Math.min(100, Math.round((elapsed / total) * 100));
    const remainingMs = Math.max(0, end - now);
    return { progress: pct, remainingMinutes: Math.ceil(remainingMs / 60000) };
  }, [reservation]);

  // Notify when approaching completion based on settings
  useEffect(() => {
    if (!reservation) return;
    const threshold = notificationSettings.beforeCompletion; // minutes
    if (notificationSettings.enabled && remainingMinutes === threshold && !notifiedRef.current) {
      showWarning('⏰ Máy sắp xong rồi! Chuẩn bị nhận đồ nha');
      notifiedRef.current = true;
    }
    if (remainingMinutes > threshold) {
      // reset to allow re-notify on next cycle if user changed settings
      notifiedRef.current = false;
    }
  }, [reservation, remainingMinutes, notificationSettings, showWarning]);

  // Note: Progress is calculated from reservation data, no need for manual updates

  if (!selectedMachine || !selectedStore) {
    return (
      <Page className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
        <AppHeader
          title="Theo dõi máy giặt"
          showBack={true}
          onBack={handleBackToHome}
        />
        <Box className="p-4 text-center">
          <Box className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Text className="text-3xl">🤔</Text>
          </Box>
          <Text className="text-gray-600 font-medium">Không tìm thấy thông tin máy</Text>
          <Button
            className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
            onClick={handleBackToHome}
          >
            Quay lại trang chủ
          </Button>
        </Box>
      </Page>
    );
  }

  const activeReservation = activeReservations[0]; // Get first active reservation

  return (
    <Page className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <AppHeader
        title="Máy giặt của tui"
        showBack={true}
        onBack={handleBackToStore}
      />
      
      {/* Enhanced Machine Status Header */}
      <Box className="clean-card m-4 p-0 overflow-hidden shadow-xl border border-blue-100">
        {/* Enhanced Store Images */}
        <Box className="relative h-52 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 overflow-hidden">
          {/* Animated Background Pattern */}
          <Box
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
                <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="monitor-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                      <circle cx="25" cy="25" r="1" fill="white" opacity="0.4"/>
                      <circle cx="12.5" cy="12.5" r="0.5" fill="white" opacity="0.3"/>
                      <circle cx="37.5" cy="37.5" r="0.5" fill="white" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#monitor-pattern)"/>
                </svg>
              `)}')`
            }}
          />
          
          <Box className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
            <Text size="xxSmall" className="font-bold">1/5</Text>
          </Box>
          
          <Box className="absolute inset-0 flex items-center justify-center">
            <Box className="text-center">
              <Box className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                <Text className="text-4xl animate-pulse">🏪</Text>
              </Box>
              <Text className="text-white/90 font-semibold text-lg">Đang theo dõi máy</Text>
            </Box>
          </Box>
          
          {/* Enhanced Navigation arrows */}
          <Button
            size="small"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 rounded-xl border border-white/30 hover:scale-110"
            icon={<Icon icon="zi-chevron-left" className="text-white" size={20} />}
          />
          <Button
            size="small"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 rounded-xl border border-white/30 hover:scale-110"
            icon={<Icon icon="zi-chevron-right" className="text-white" size={20} />}
          />
        </Box>

        {/* Enhanced Store Info */}
        <Box className="text-center p-6 bg-gradient-to-r from-white to-blue-50">
          <Text.Title size="large" className="font-bold mb-3 text-gray-900">
            {selectedStore.name}
          </Text.Title>
          
          <Box flex className="items-center justify-center gap-3">
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-call" className="text-green-600" />}
              className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl"
            />
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-location" className="text-blue-600" />}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl"
            />
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-star" className="text-yellow-600" />}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 hover:from-yellow-100 hover:to-orange-100 border border-yellow-200 hover:border-yellow-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl"
            />
          </Box>
        </Box>
      </Box>

      {/* Enhanced Machine Tabs */}
      <Box className="clean-card m-4 p-0 shadow-lg border border-blue-100">
        <Box flex className="justify-center gap-8 p-5 border-b border-gray-100 bg-gradient-to-r from-white to-blue-50">
          <Box className="text-center pb-3 border-b-3 border-purple-600 px-4">
            <Box flex className="items-center gap-2 mb-1">
              <Box className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Text className="text-white font-bold text-xs">⚙️</Text>
              </Box>
              <Text size="small" className="font-bold text-purple-600">
                Trạng thái máy
              </Text>
            </Box>
          </Box>
          <Box className="text-center pb-3 px-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-300">
            <Box flex className="items-center gap-2 mb-1">
              <Box className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center">
                <Text className="text-gray-500 font-bold text-xs">🏪</Text>
              </Box>
              <Text size="small" className="text-gray-500 hover:text-gray-700 transition-colors">
                Thông tin cửa hàng
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Enhanced Machine Status Card */}
      <Box className="p-4">
        <Box className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100 relative overflow-hidden">
          {/* Background Pattern */}
          <Box
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
                <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="machine-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                      <circle cx="40" cy="40" r="2" fill="#3b82f6" opacity="0.3"/>
                      <circle cx="20" cy="20" r="1" fill="#8b5cf6" opacity="0.2"/>
                      <circle cx="60" cy="60" r="1" fill="#6366f1" opacity="0.2"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="300" fill="url(#machine-pattern)"/>
                </svg>
              `)}')`
            }}
          />
          
          {/* Machine Header */}
          <Box flex className="items-center justify-between mb-6 relative z-10">
            <Box flex className="items-center gap-3">
              <Box className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Text className="text-white font-bold">
                  {selectedMachine.type === 'washing' ? '🧺' : '🌪️'}
                </Text>
              </Box>
              <Box>
                <Text.Title size="large" className="font-bold text-gray-900">
                  {selectedMachine.type === 'washing' ? 'Máy giặt' : 'Máy sấy'} 01
                </Text.Title>
                <Text size="small" className="text-gray-600 font-medium">
                  {selectedMachine.type === 'washing' ? 'Đang giặt quần áo' : 'Đang sấy khô'}
                </Text>
              </Box>
            </Box>
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-close" className="text-gray-400" />}
              className="hover:bg-gray-100 rounded-lg transition-all duration-300"
            />
          </Box>

          {/* Enhanced Progress Circle with Better Visualization */}
          <Box className="text-center mb-8 relative z-10">
            <Box className="relative inline-flex items-center justify-center mb-6">
              {/* Enhanced Outer Ring with Glow Effect */}
              <Box className="w-48 h-48 rounded-full border-8 border-gray-200 relative shadow-2xl bg-white">
                {/* Enhanced Progress Ring with Gradient */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Enhanced Inner Content */}
                <Box className="absolute inset-6 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-inner flex items-center justify-center border border-gray-100">
                  <Box className="text-center">
                    <Text className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {progress}%
                    </Text>
                    <Text size="small" className="text-gray-600 font-semibold">
                      hoàn thành
                    </Text>
                    <Box className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-2" />
                  </Box>
                </Box>
                
                {/* Enhanced Animated Pulse Ring */}
                <Box className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-20 animate-ping" />
                <Box className="absolute inset-2 rounded-full border-2 border-purple-400 opacity-15 animate-ping" style={{ animationDelay: '0.5s' }} />
              </Box>
            </Box>
            
            {/* Enhanced Status Info with More Details */}
            <Box className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
              <Text.Title size="large" className="font-bold mb-4 text-gray-900">
                {selectedMachine.type === 'washing' ? '🧺 Đang giặt quần áo' : '🌪️ Đang sấy khô'}
              </Text.Title>
              
              {/* Time Display */}
              <Box className="grid grid-cols-2 gap-4 mb-4">
                <Box className="text-center p-3 bg-white/60 rounded-xl">
                  <Box flex className="items-center justify-center gap-2 mb-1">
                    <Icon icon="zi-clock-1" className="text-blue-500" />
                    <Text size="small" className="text-gray-700 font-semibold">Còn lại</Text>
                  </Box>
                  <Text className="text-2xl font-bold text-blue-600">
                    {remainingMinutes}
                  </Text>
                  <Text size="xSmall" className="text-gray-600">phút</Text>
                </Box>
                <Box className="text-center p-3 bg-white/60 rounded-xl">
                  <Box flex className="items-center justify-center gap-2 mb-1">
                    <Icon icon="zi-check-circle" className="text-green-500" />
                    <Text size="small" className="text-gray-700 font-semibold">Hoàn thành</Text>
                  </Box>
                  <Text className="text-2xl font-bold text-green-600">
                    {progress}
                  </Text>
                  <Text size="xSmall" className="text-gray-600">%</Text>
                </Box>
              </Box>
              
              {/* Enhanced Time Progress Bar */}
              <Box className="mb-4">
                <Box flex className="items-center justify-between mb-2">
                  <Text size="small" className="text-gray-600 font-medium">Tiến độ</Text>
                  <Text size="small" className="text-gray-600 font-medium">
                    {Math.floor((100 - progress) * (remainingMinutes / 100))} phút nữa
                  </Text>
                </Box>
                <Box className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <Box
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${progress}%` }}
                  >
                    <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                  </Box>
                </Box>
              </Box>

              {/* Machine Status Indicator */}
              <Box className="flex items-center justify-center gap-2 p-3 bg-white/60 rounded-xl">
                <Box className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <Text size="small" className="text-gray-700 font-semibold">
                  Máy đang hoạt động bình thường
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Enhanced Notification Settings */}
          <Box className="relative z-10">
            <Box className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
              <Box flex className="items-center gap-2 mb-4">
                <Box className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md">
                  <Text className="text-white font-bold text-sm">🔔</Text>
                </Box>
                <Text size="small" className="font-bold text-gray-900">
                  Cài đặt thông báo
                </Text>
              </Box>
              
              <Text size="xSmall" className="text-gray-600 mb-3 font-medium">
                Thông báo trước khi hoàn thành (phút)
              </Text>
              
              <Select
                value={String(notificationSettings.beforeCompletion)}
                onChange={(value) => setNotificationSettings({
                  ...notificationSettings,
                  beforeCompletion: parseInt(value as string, 10)
                })}
                placeholder="Chọn thời gian"
                className="form-select"
              >
                <Select.Option value="0" title="Tắt thông báo" />
                <Select.Option value="5" title="5 phút" />
                <Select.Option value="10" title="10 phút" />
                <Select.Option value="15" title="15 phút" />
              </Select>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Action Buttons */}
        <Box className="text-center mt-6 flex gap-3 justify-center">
          <Button
            variant="tertiary"
            icon={<Icon icon="zi-heart" className="text-red-500" />}
            className="bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 border border-red-200 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl px-6"
          >
            Yêu thích
          </Button>
          <Button
            variant="tertiary"
            icon={<Icon icon="zi-share" className="text-blue-500" />}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl px-6"
          >
            Chia sẻ
          </Button>
        </Box>
      </Box>
    </Page>
  );
}

export default MachineMonitoringPage;
