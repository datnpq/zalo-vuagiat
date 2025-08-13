import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Box, Page, Text, Button, Icon, Tabs } from 'zmp-ui';
import { selectedStoreAtom, selectedMachineAtom, activeTabAtom } from '@/store/atoms';
import AppHeader from '@/components/app-header';
import MachineCard from '@/components/machine-card';
import MachineIcon from '@/components/machine-icon';

interface StoreDetailPageProps {
  onQRScan?: () => void;
}

function StoreDetailPage() {
  const [selectedStore] = useAtom(selectedStoreAtom);
  const [selectedMachine, setSelectedMachine] = useAtom(selectedMachineAtom);
  const [, setGlobalActiveTab] = useAtom(activeTabAtom);
  const [activeTab, setActiveTab] = useState('machines');
  const [selectedMachineType, setSelectedMachineType] = useState<'washing' | 'drying'>('washing');

  if (!selectedStore) {
    return (
      <Page className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
        <AppHeader
          title="Chi tiết cửa hàng"
          showBack={true}
          onBack={() => setGlobalActiveTab('map')}
        />
        <Box className="p-4 text-center">
          <Box className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Text className="text-3xl">🏪</Text>
          </Box>
          <Text className="text-gray-600 font-medium">Không tìm thấy thông tin cửa hàng</Text>
          <Button
            className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
            onClick={() => setGlobalActiveTab('map')}
          >
            Quay lại bản đồ
          </Button>
        </Box>
      </Page>
    );
  }

  const handleMachineSelect = (machine: any) => {
    setSelectedMachine(machine);
    setGlobalActiveTab('monitor');
  };

  const handleBackToMap = () => {
    setGlobalActiveTab('map');
  };

  const allMachines = [...selectedStore.washingMachines, ...selectedStore.dryingMachines];
  const activeMachines = allMachines.filter(m => m.status === 'in-use');

  return (
    <Page className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <AppHeader
        title={selectedStore.name}
        showBack={true}
        onBack={handleBackToMap}
      />
      
      {/* Enhanced Store Header */}
      <Box className="clean-card m-4 p-0 overflow-hidden shadow-xl border border-blue-200">
        {/* Enhanced Store Image/Gallery */}
        <Box className="relative h-56 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 overflow-hidden">
          {/* Animated Background Pattern */}
          <Box
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
                <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="store-detail-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                      <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.4"/>
                      <circle cx="15" cy="15" r="1" fill="white" opacity="0.3"/>
                      <circle cx="45" cy="45" r="1" fill="white" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#store-detail-pattern)"/>
                </svg>
              `)}')`
            }}
          />
          
          <Box className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
            <Text size="xxSmall" className="font-bold">1/5</Text>
          </Box>
          
          <Box className="absolute inset-0 flex items-center justify-center">
            <Box className="text-center">
              <Box className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                <Text className="text-5xl animate-bounce">🏪</Text>
              </Box>
              <Text className="text-white/90 font-semibold text-lg">Chi tiết cửa hàng</Text>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Store Info */}
        <Box className="p-6 bg-gradient-to-r from-white to-blue-50">
          <Box flex className="items-start gap-3 mb-4">
            <Box className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Text className="text-white font-bold">🏪</Text>
            </Box>
            <Box className="flex-1">
              <Text.Title size="large" className="font-bold text-gray-900 mb-1">
                {selectedStore.name}
              </Text.Title>
              <Box flex className="items-start gap-2 mb-3">
                <Icon icon="zi-location" className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                <Text size="small" className="text-gray-600 line-clamp-2">
                  {selectedStore.address}
                </Text>
              </Box>
            </Box>
          </Box>
          
          {/* Enhanced Info Badges */}
          <Box flex className="items-center gap-3 flex-wrap mb-4">
            <Box flex className="items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-2 rounded-full border border-yellow-200 shadow-sm">
              <Icon icon="zi-star" className="text-yellow-500" size={16} />
              <Text size="small" className="font-bold text-yellow-700">{selectedStore.rating}</Text>
            </Box>
            <Box flex className="items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-full border border-blue-200 shadow-sm">
              <Icon icon="zi-location" className="text-blue-500" size={16} />
              <Text size="small" className="font-medium text-blue-700">{selectedStore.distance}km</Text>
            </Box>
            <Box className={`px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border ${
              selectedStore.status === 'open'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400'
                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400'
            }`}>
              <Box flex className="items-center gap-1.5">
                <Box className={`w-2 h-2 rounded-full ${selectedStore.status === 'open' ? 'bg-white' : 'bg-gray-300'} animate-pulse`} />
                {selectedStore.status === 'open' ? 'Mở cửa' : 'Đóng cửa'}
              </Box>
            </Box>
          </Box>
          
          {/* Enhanced Action Buttons */}
          <Box flex className="gap-3">
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-call" className="text-green-600" />}
              onClick={() => window.open(`tel:${selectedStore.phoneNumber}`)}
              className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl px-4"
            >
              Gọi điện
            </Button>
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-location" className="text-blue-600" />}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl px-4"
            >
              Chỉ đường
            </Button>
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-star" className="text-yellow-600" />}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 hover:from-yellow-100 hover:to-orange-100 border border-yellow-200 hover:border-yellow-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl px-4"
            >
              Yêu thích
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tabs Section */}
      <Box className="clean-card m-4">
        {/* Tabs */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.Tab key="machines" label="Trạng thái máy">
            <Box className="pt-4">
              {/* Machine Status Overview */}
              <Box className="grid grid-cols-2 gap-4 mb-6">
                <Box className="clean-card bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                  <Box flex className="items-center space-x-3 mb-2">
                    <Box className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                      <MachineIcon type="washing" size={20} status="available" className="text-white" />
                    </Box>
                    <Box>
                      <Text size="small" className="font-semibold text-gray-800">Máy giặt</Text>
                      <Box className="status-modern-available px-2 py-1 rounded text-xs font-semibold inline-block">
                        Trống
                      </Box>
                    </Box>
                  </Box>
                  <Text.Title size="large" className="font-bold gradient-text">
                    {selectedStore.washingMachines.filter(m => m.status === 'available').length}/{selectedStore.washingMachines.length}
                  </Text.Title>
                </Box>

                <Box className="clean-card bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
                  <Box flex className="items-center space-x-3 mb-2">
                    <Box className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                      <MachineIcon type="drying" size={20} status="available" className="text-white" />
                    </Box>
                    <Box>
                      <Text size="small" className="font-semibold text-gray-800">Máy sấy</Text>
                      <Box className="status-modern-available px-2 py-1 rounded text-xs font-semibold inline-block">
                        Có sẵn
                      </Box>
                    </Box>
                  </Box>
                  <Text.Title size="large" className="font-bold gradient-text">
                    {selectedStore.dryingMachines.filter(m => m.status === 'available').length}/{selectedStore.dryingMachines.length}
                  </Text.Title>
                </Box>
              </Box>

              {/* Machine Selection */}
              <Box flex className="space-x-2 mb-4">
                <Button
                  variant={selectedMachineType === 'washing' ? 'primary' : 'tertiary'}
                  className={`flex-1 font-medium py-2.5 rounded-lg transition-colors duration-200 ${
                    selectedMachineType === 'washing'
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMachineType('washing')}
                >
                  Máy giặt ({selectedStore.washingMachines.filter(m => m.status === 'available').length})
                </Button>
                <Button
                  variant={selectedMachineType === 'drying' ? 'primary' : 'tertiary'}
                  className={`flex-1 font-medium py-2.5 rounded-lg transition-colors duration-200 ${
                    selectedMachineType === 'drying'
                      ? 'bg-purple-500 text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMachineType('drying')}
                >
                  Máy sấy ({selectedStore.dryingMachines.filter(m => m.status === 'available').length})
                </Button>
              </Box>

              {/* Active Machine */}
              {activeMachines.length > 0 && (
                <Box className="mb-6">
                  <Text.Title size="small" className="mb-3">Máy đang hoạt động</Text.Title>
                  <Box className="space-y-3">
                    {activeMachines.map((machine) => (
                      <MachineCard
                        key={machine.id}
                        machine={machine}
                        onSelect={() => handleMachineSelect(machine)}
                        showProgress={true}
                        progress={12}
                        remainingTime={machine.remainingTime}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Available Machines */}
              <Box>
                <Text.Title size="small" className="mb-3">
                  {selectedMachineType === 'washing' ? 'Máy giặt có sẵn' : 'Máy sấy có sẵn'}
                </Text.Title>
                <Box className="space-y-3">
                  {(selectedMachineType === 'washing' ? selectedStore.washingMachines : selectedStore.dryingMachines)
                    .filter(machine => machine.status === 'available')
                    .map((machine) => (
                      <MachineCard
                        key={machine.id}
                        machine={machine}
                        onSelect={() => handleMachineSelect(machine)}
                      />
                    ))}
                </Box>
                
                {/* Empty state for no available machines */}
                {(selectedMachineType === 'washing' ? selectedStore.washingMachines : selectedStore.dryingMachines)
                  .filter(machine => machine.status === 'available').length === 0 && (
                  <Box className="text-center py-8 bg-gray-50 rounded-xl">
                    <Text className="text-3xl mb-2">😔</Text>
                    <Text className="text-gray-600 font-medium">
                      Tất cả máy {selectedMachineType === 'washing' ? 'giặt' : 'sấy'} đang bận
                    </Text>
                    <Text size="small" className="text-gray-500 mt-1">
                      Thử chọn loại máy khác hoặc quay lại sau
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Tabs.Tab>
          
          <Tabs.Tab key="info" label="Thông tin cửa hàng">
            <Box className="pt-4 space-y-4">
              <Box>
                <Text size="small" className="font-semibold mb-2">Địa chỉ</Text>
                <Text size="small" className="text-gray-600">
                  {selectedStore.address}
                </Text>
              </Box>
              
              <Box>
                <Text size="small" className="font-semibold mb-2">Giờ hoạt động</Text>
                <Text size="small" className="text-gray-600">
                  24/7 - Mở cửa cả tuần
                </Text>
              </Box>
              
              <Box>
                <Text size="small" className="font-semibold mb-2">Liên hệ</Text>
                <Text size="small" className="text-gray-600">
                  {selectedStore.phoneNumber}
                </Text>
              </Box>
              
              <Box>
                <Text size="small" className="font-semibold mb-2">Đánh giá</Text>
                <Box flex className="items-center space-x-2">
                  <Icon icon="zi-star" className="text-yellow-500" />
                  <Text size="small">{selectedStore.rating}/5.0</Text>
                </Box>
              </Box>
            </Box>
          </Tabs.Tab>
        </Tabs>
      </Box>

      {/* Start Button */}
      <Box className="p-4 bg-white border-t border-gray-100">
        <Button
          fullWidth
          variant="primary"
          size="large"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-colors duration-200"
        >
          Bắt đầu sử dụng
        </Button>
      </Box>
    </Page>
  );
}

export default StoreDetailPage;
