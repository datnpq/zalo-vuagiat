import React, { useState, useEffect } from 'react';
import { Box, Page, Text, Button, Icon, Input, Select } from 'zmp-ui';
import { useAtom } from 'jotai';
import AppHeader from '@/components/app-header';
import StoreCard from '@/components/store-card';
import MachineIcon from '@/components/machine-icon';
import QRScanner from '@/components/qr-scanner';
import MachineActivation from '@/components/machine-activation';
import { useToast, ToastMessages } from '@/components/toast';
import EmptyState from '@/components/empty-state';
import { 
  userAtom, 
  activeReservationsAtom, 
  laundryStoresAtom,
  selectedStoreAtom,
  activeTabAtom,
  selectedMachineAtom,
  reservationsAtom
} from '@/store/atoms';

interface HomePageProps {
  // Reserved for future props
}

function HomePage({}: HomePageProps = {}) {
  const [user] = useAtom(userAtom);
  const [activeReservations] = useAtom(activeReservationsAtom);
  const [laundryStores] = useAtom(laundryStoresAtom);
  const [selectedStore, setSelectedStore] = useAtom(selectedStoreAtom);
  const [, setActiveTab] = useAtom(activeTabAtom);
  const [, setSelectedMachine] = useAtom(selectedMachineAtom);
  const [reservations, setReservations] = useAtom(reservationsAtom);
  const { showSuccess, showError, ToastContainer } = useToast();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showMachineActivation, setShowMachineActivation] = useState(false);
  const [scannedMachineData, setScannedMachineData] = useState<any>(null);

  const handleStoreSelect = (store: any) => {
    setSelectedStore(store);
    setActiveTab('machines');
  };

  const handleQRScanned = (qrData: string) => {
    try {
      const machineData = JSON.parse(qrData);
      console.log('QR Scanned:', machineData);
      
      // Set machine data and show activation modal
      setScannedMachineData(machineData);
      setShowMachineActivation(true);
    } catch (error) {
      console.error('Invalid QR data:', error);
      showError(ToastMessages.error.machineUnavailable);
    }
  };

  const handleMachineActivated = (machineId: string, paymentMethod: string) => {
    showSuccess(ToastMessages.success.reservation);
    if (scannedMachineData) {
      setSelectedMachine({
        id: scannedMachineData.machineId,
        type: scannedMachineData.type,
        status: 'in-use',
        remainingTime: scannedMachineData.type === 'washing' ? 40 : 30,
        capacity: scannedMachineData.capacity,
        price: scannedMachineData.price,
        features: scannedMachineData.features,
      });

      // Add active reservation for sync across app (badge, profile list)
      const now = new Date();
      const end = new Date(now.getTime() + ((scannedMachineData.type === 'washing' ? 40 : 30) * 60 * 1000));
      setReservations(prev => ([
        ...prev,
        {
          id: `res_${Date.now()}`,
          userId: 'user1',
          storeId: scannedMachineData.storeId,
          machineId: scannedMachineData.machineId,
          startTime: now,
          endTime: end,
          status: 'active',
          paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
          totalAmount: scannedMachineData.price,
          progress: 0,
        }
      ]));
    }
    setShowMachineActivation(false);
    setScannedMachineData(null);
    setActiveTab('monitor');
  };

  const favoriteStore = laundryStores.find(store => store.id === 'store1');

  return (
    <Page className="min-h-screen bg-gray-50">
      {/* Zalo Mini App Safe Area - đảm bảo không bị che header */}
      <Box className="safe-area-top bg-white" style={{ paddingTop: 'env(safe-area-inset-top, 8px)' }} />
      
      <AppHeader />
      
      {/* Content với padding tránh bottom navigation và safe area */}
      <Box className="px-4 pt-6" style={{ paddingBottom: 'max(7rem, calc(120px + env(safe-area-inset-bottom, 24px)))' }}>
        {/* Clean Search Bar */}
        <Box className="mb-6">
          <Box 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md"
            onClick={() => setActiveTab('map')}
          >
            <Box className="flex items-center px-4 py-4">
              <Icon icon="zi-search" className="icon-secondary mr-3 icon-lg" />
              <Box className="flex-1">
                <Text size="normal" className="text-gray-500">
                  Tìm tiệm giặt gần bạn...
                </Text>
              </Box>
              <Icon icon="zi-chevron-right" className="icon-secondary ml-2 icon-sm" />
            </Box>
          </Box>
          
          {/* Search suggestion hint */}
          <Box className="flex items-center justify-center mt-3">
            <Text size="xSmall" className="text-gray-500 text-center">
              📍 Bấm để xem bản đồ tiệm gần bạn
            </Text>
          </Box>
        </Box>

        {/* Wallet Section - Prominent Money Display */}
        <Box className="mb-6">
          <Box className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <Box 
              className="absolute top-0 right-0 w-32 h-32 opacity-10"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                transform: 'translate(50%, -50%)'
              }}
            />
            
            <Box className="relative z-10">
              {/* Header */}
              <Box className="flex items-center justify-between mb-4">
                <Box className="flex items-center space-x-2">
                  <Box className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon icon="zi-user" className="text-white text-lg" />
                  </Box>
                  <div className="text-white/90 font-medium">Ví của bạn</div>
                </Box>
                <div className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full">
                  VND
                </div>
              </Box>

              {/* Balance Display */}
              <Box className="mb-4">
                <div className="text-xs text-white/80 mb-1">Số dư chính</div>
                <div className="text-3xl font-bold text-white mb-2">
                  {user.balance?.toLocaleString('vi-VN') || '0'}₫
                </div>
                
                {/* Bonus Balance */}
                {user.bonusBalance && user.bonusBalance > 0 && (
                  <Box className="flex items-center space-x-2">
                    <Box className="bg-yellow-400/20 px-3 py-1 rounded-full flex items-center space-x-1">
                      <Icon icon="zi-star" className="text-yellow-300 text-sm" />
                      <div className="text-yellow-100 text-sm font-medium">
                        +{user.bonusBalance.toLocaleString('vi-VN')}₫ thưởng
                      </div>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Top-up Button */}
              <Button
                className="w-full bg-white/15 backdrop-blur-sm border border-white/20 text-white font-medium py-3 rounded-xl hover:bg-white/20 transition-all duration-200"
                onClick={() => {/* Handle top-up */}}
              >
                <Box className="flex items-center justify-center space-x-2">
                  <Icon icon="zi-plus-circle" className="text-lg" />
                  <span>Nạp tiền</span>
                </Box>
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Empty state when no active machine */}
        {activeReservations.length === 0 && (
          <EmptyState
            type="no-reservations"
            title="Chưa có máy nào đang chạy"
            subtitle="Quét QR tại tiệm để bắt đầu"
            actionText="Quét QR"
            onAction={() => setShowQRScanner(true)}
            className="py-6"
          />
        )}

        {/* Nearby Stores */}
        <Box className="mb-6">
          <Box className="flex items-center justify-between mb-4">
            <Text.Title size="small" className="font-bold text-gray-900">
              Tiệm giặt gần đây ({laundryStores.length})
            </Text.Title>
            <Button
              size="small"
              variant="tertiary"
              className="text-blue-600 p-1"
              onClick={() => setActiveTab('map')}
            >
              <Icon icon="zi-plus" className="icon-primary icon-sm mr-1" />
              <Text size="xSmall" className="font-medium">Thêm</Text>
            </Button>
          </Box>
          
          <Box className="space-y-4">
            {laundryStores.slice(0, 2).map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onSelect={() => handleStoreSelect(store)}
              />
            ))}
          </Box>
        </Box>

        {/* Favorite Store */}
        {favoriteStore && (
          <Box className="mb-6">
            <Text.Title size="small" className="mb-4 font-bold text-gray-900">
              Tiệm quen thuộc (1)
            </Text.Title>
            
            <StoreCard 
              store={favoriteStore}
              onSelect={() => handleStoreSelect(favoriteStore)}
            />
          </Box>
        )}

        {/* Floating QR FAB */}
        <Box className="fixed bottom-24 right-4 z-50">
          <Button
            round
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            icon={<Icon icon="zi-qrline" className="text-xl" />}
            onClick={() => setShowQRScanner(true)}
          />
        </Box>
        
      </Box>

      {/* Toasts */}
      <ToastContainer />

      {/* QR Scanner Modal */}
      <QRScanner
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanned={handleQRScanned}
      />

      {/* Machine Activation Modal */}
      <MachineActivation
        visible={showMachineActivation}
        machineData={scannedMachineData}
        onClose={() => {
          setShowMachineActivation(false);
          setScannedMachineData(null);
        }}
        onActivated={handleMachineActivated}
      />
    </Page>
  );
}

export default HomePage;
