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
      {/* Zalo Mini App Safe Area */}
      <Box className="safe-area-top bg-transparent" style={{ paddingTop: 'env(safe-area-inset-top, 8px)' }} />
      
      <AppHeader
        title={selectedStore.name}
        showBack={true}
        onBack={handleBackToMap}
      />
      
      {/* Content with bottom navigation padding */}
      <Box style={{ paddingBottom: 'max(7rem, calc(120px + env(safe-area-inset-bottom, 24px)))' }}>
      
      {/* Enhanced Store Header */}
      <Box className="clean-card mx-6 my-4 p-0 overflow-hidden shadow-lg border border-white/50 backdrop-blur-sm">
        {/* Enhanced Store Image/Gallery */}
        <Box className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 overflow-hidden">
          {/* Animated Background Pattern */}
          <Box
            className="absolute inset-0 opacity-15"
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
          
          <Box className="absolute inset-0 flex items-center justify-center">
            <Box className="text-center">
              <Box className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                <Text className="text-4xl">🏪</Text>
              </Box>
              <Text className="text-white/90 font-semibold">Chi tiết cửa hàng</Text>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Store Info */}
        <Box className="p-5 bg-white/80 backdrop-blur-sm">
          <Box flex className="items-start gap-3 mb-4">
            <Box className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Text className="text-white font-bold text-sm">🏪</Text>
            </Box>
            <Box className="flex-1">
              <Text.Title size="large" className="font-bold text-gray-900 mb-1">
                {selectedStore.name}
              </Text.Title>
              <Box flex className="items-start gap-2 mb-3">
                <Icon icon="zi-location" className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
                <Text size="small" className="text-gray-600 line-clamp-2 leading-relaxed">
                  {selectedStore.address}
                </Text>
              </Box>
            </Box>
          </Box>
          
          {/* Enhanced Info Badges */}
          <Box flex className="items-center gap-2 flex-wrap mb-4">
            <Box flex className="items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1.5 rounded-full border border-yellow-200 shadow-sm">
              <Icon icon="zi-star" className="text-yellow-500" size={14} />
              <Text size="xSmall" className="font-bold text-yellow-700">{selectedStore.rating}</Text>
            </Box>
            <Box flex className="items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
              <Icon icon="zi-location" className="text-blue-500" size={14} />
              <Text size="xSmall" className="font-medium text-blue-700">{selectedStore.distance}km</Text>
            </Box>
            <Box className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border ${
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
          <Box flex className="gap-2">
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-call" className="text-green-600" />}
              onClick={() => window.open(`tel:${selectedStore.phoneNumber}`)}
              className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl"
            >
              Gọi
            </Button>
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-location" className="text-blue-600" />}
              className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl"
            >
              Đường
            </Button>
            <Button
              size="small"
              variant="tertiary"
              icon={<Icon icon="zi-star" className="text-yellow-600" />}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 hover:from-yellow-100 hover:to-orange-100 border border-yellow-200 hover:border-yellow-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 rounded-xl px-3"
            />
          </Box>
        </Box>
      </Box>

      {/* Tabs Section */}
      <Box className="clean-card mx-6 my-6 p-4 bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg rounded-xl space-y-4">
        {/* Tabs */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.Tab key="machines" label="Trạng thái máy">
            <Box className="pt-4">
              {/* Machine Status Overview */}
              <Box className="grid grid-cols-2 gap-3 mb-6">
                <Box className="clean-card bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 p-4">
                  <Box flex className="items-center space-x-3 mb-3">
                    <Box className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                      <MachineIcon type="washing" size={20} status="available" className="text-white" />
                    </Box>
                    <Box>
                      <Text size="small" className="font-semibold text-gray-800">Máy giặt</Text>
                      <Box className="bg-green-500 text-white px-2 py-0.5 rounded-lg text-xs font-semibold inline-block">
                        Sẵn sàng
                      </Box>
                    </Box>
                  </Box>
                  <Text.Title size="large" className="font-bold text-blue-600">
                    {selectedStore.washingMachines.filter(m => m.status === 'available').length}/{selectedStore.washingMachines.length}
                  </Text.Title>
                </Box>

                <Box className="clean-card bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 p-4">
                  <Box flex className="items-center space-x-3 mb-3">
                    <Box className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                      <MachineIcon type="drying" size={20} status="available" className="text-white" />
                    </Box>
                    <Box>
                      <Text size="small" className="font-semibold text-gray-800">Máy sấy</Text>
                      <Box className="bg-green-500 text-white px-2 py-0.5 rounded-lg text-xs font-semibold inline-block">
                        Có sẵn
                      </Box>
                    </Box>
                  </Box>
                  <Text.Title size="large" className="font-bold text-purple-600">
                    {selectedStore.dryingMachines.filter(m => m.status === 'available').length}/{selectedStore.dryingMachines.length}
                  </Text.Title>
                </Box>
              </Box>

              {/* Machine Selection */}
              <Box flex className="gap-2 mb-5">
                <Button
                  variant={selectedMachineType === 'washing' ? 'primary' : 'tertiary'}
                  className={`flex-1 font-medium py-3 rounded-xl transition-all duration-200 ${
                    selectedMachineType === 'washing'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedMachineType('washing')}
                >
                  Máy giặt ({selectedStore.washingMachines.filter(m => m.status === 'available').length})
                </Button>
                <Button
                  variant={selectedMachineType === 'drying' ? 'primary' : 'tertiary'}
                  className={`flex-1 font-medium py-3 rounded-xl transition-all duration-200 ${
                    selectedMachineType === 'drying'
                      ? 'bg-purple-500 text-white shadow-md'
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
                  <Text.Title size="small" className="mb-3 font-bold text-gray-900">Máy đang hoạt động</Text.Title>
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
                <Text.Title size="small" className="mb-3 font-bold text-gray-900">
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
                  <Box className="text-center py-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
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
            <Box className="pt-4 space-y-5">
              <Box className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <Box flex className="items-start gap-3">
                  <Icon icon="zi-location" className="text-blue-500 mt-1" size={16} />
                  <Box>
                    <Text size="small" className="font-semibold mb-2 text-gray-900">Địa chỉ</Text>
                    <Text size="small" className="text-gray-600 leading-relaxed">
                      {selectedStore.address}
                    </Text>
                  </Box>
                </Box>
              </Box>
              
              <Box className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <Box flex className="items-start gap-3">
                  <Icon icon="zi-clock-1" className="text-green-500 mt-1" size={16} />
                  <Box>
                    <Text size="small" className="font-semibold mb-2 text-gray-900">Giờ hoạt động</Text>
                    <Text size="small" className="text-gray-600">
                      24/7 - Mở cửa cả tuần
                    </Text>
                  </Box>
                </Box>
              </Box>
              
              <Box className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <Box flex className="items-start gap-3">
                  <Icon icon="zi-call" className="text-purple-500 mt-1" size={16} />
                  <Box>
                    <Text size="small" className="font-semibold mb-2 text-gray-900">Liên hệ</Text>
                    <Text size="small" className="text-gray-600">
                      {selectedStore.phoneNumber}
                    </Text>
                  </Box>
                </Box>
              </Box>
              
              <Box className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <Box flex className="items-start gap-3">
                  <Icon icon="zi-star" className="text-yellow-500 mt-1" size={16} />
                  <Box>
                    <Text size="small" className="font-semibold mb-2 text-gray-900">Đánh giá</Text>
                    <Box flex className="items-center gap-2">
                      <Text size="small" className="text-gray-600">{selectedStore.rating}/5.0</Text>
                      <Box flex className="items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            icon="zi-star"
                            className={star <= Math.floor(selectedStore.rating) ? "text-yellow-400" : "text-gray-300"}
                            size={12}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Tabs.Tab>
        </Tabs>
      </Box>

      </Box>
    </Page>
  );
}

export default StoreDetailPage;
