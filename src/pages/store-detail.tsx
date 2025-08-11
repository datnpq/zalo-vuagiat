import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Box, Page, Text, Button, Icon, Tabs } from 'zmp-ui';
import { selectedStoreAtom, selectedMachineAtom } from '@/store/atoms';
import AppHeader from '@/components/app-header';
import MachineCard from '@/components/machine-card';
import MachineIcon from '@/components/machine-icon';

interface StoreDetailPageProps {
  onQRScan?: () => void;
}

function StoreDetailPage() {
  const [selectedStore] = useAtom(selectedStoreAtom);
  const [selectedMachine, setSelectedMachine] = useAtom(selectedMachineAtom);
  const [activeTab, setActiveTab] = useState('machines');

  if (!selectedStore) {
    return (
      <Page>
        <AppHeader title="Chi tiết cửa hàng" />
        <Box className="p-4 text-center">
          <Text>Không tìm thấy thông tin cửa hàng</Text>
        </Box>
      </Page>
    );
  }

  const handleMachineSelect = (machine: any) => {
    setSelectedMachine(machine);
    // TODO: Navigate to booking page
  };

  const allMachines = [...selectedStore.washingMachines, ...selectedStore.dryingMachines];
  const activeMachines = allMachines.filter(m => m.status === 'in-use');

  return (
    <Page className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <AppHeader title={selectedStore.name} />
      
      {/* Store Header */}
      <Box className="clean-card m-4 p-0 overflow-hidden">
        {/* Store Image/Gallery Slider */}
        <Box className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 overflow-hidden">
          <Box className="absolute top-4 right-4 bg-black bg-opacity-30 backdrop-blur-sm text-white px-3 py-1 rounded-full">
            <Text size="xxSmall" className="font-semibold">1/5</Text>
          </Box>
          <Box className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🏪</div>
          </Box>
        </Box>

        {/* Store Info */}
        <Box className="p-4">
          <Text.Title size="large" className="font-bold text-gray-900 mb-2">
            {selectedStore.name}
          </Text.Title>
          <Text size="small" className="text-gray-600 mb-3 line-clamp-2">
            {selectedStore.address}
          </Text>
          <Box flex className="items-center space-x-4 mb-3">
            <Box flex className="items-center space-x-1">
              <Icon icon="zi-star" className="text-yellow-500 icon-sm" />
              <Text size="small" className="font-semibold">{selectedStore.rating}</Text>
            </Box>
            <Box flex className="items-center space-x-1">
              <Icon icon="zi-location" className="icon-primary icon-sm" />
              <Text size="small" className="text-gray-600">{selectedStore.distance}</Text>
            </Box>
            <Box className={`px-3 py-1 rounded-full text-xs font-semibold ${
              selectedStore.status === 'open' 
                ? 'status-modern-available' 
                : 'status-modern-maintenance'
            }`}>
              {selectedStore.status === 'open' ? 'Mở cửa' : 'Đóng cửa'}
            </Box>
          </Box>
          
          <Box flex className="items-center space-x-2 mb-3">
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
              <Box flex className="space-x-3 mb-6">
                <Button 
                  variant="secondary"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Máy giặt
                </Button>
                <Button 
                  variant="tertiary"
                  className="flex-1 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
                >
                  Máy sấy
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
                <Text.Title size="small" className="mb-3">Máy có sẵn</Text.Title>
                <Box className="space-y-3">
                  {selectedStore.washingMachines
                    .filter(machine => machine.status === 'available')
                    .map((machine) => (
                      <MachineCard
                        key={machine.id}
                        machine={machine}
                        onSelect={() => handleMachineSelect(machine)}
                      />
                    ))}
                </Box>
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
      <Box className="p-4 bg-gradient-to-r from-white to-blue-50 border-t border-gray-200">
        <Button
          fullWidth
          variant="primary"
          size="large"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg py-4 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Bắt đầu sử dụng
        </Button>
      </Box>
    </Page>
  );
}

export default StoreDetailPage;
