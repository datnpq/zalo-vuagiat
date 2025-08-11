import React, { useState, useEffect } from 'react';
import { Box, Page, Text, Button, Icon, Input, Select } from 'zmp-ui';
import { useAtom } from 'jotai';
import AppHeader from '@/components/app-header';
import MachineCard from '@/components/machine-card';
import StoreCard from '@/components/store-card';
import MachineIcon from '@/components/machine-icon';
import QRScanner from '@/components/qr-scanner';
import MachineActivation from '@/components/machine-activation';
import { 
  userAtom, 
  activeReservationsAtom, 
  laundryStoresAtom,
  selectedStoreAtom 
} from '@/store/atoms';

interface HomePageProps {
  // Reserved for future props
}

function HomePage({}: HomePageProps = {}) {
  const [user] = useAtom(userAtom);
  const [activeReservations] = useAtom(activeReservationsAtom);
  const [laundryStores] = useAtom(laundryStoresAtom);
  const [selectedStore, setSelectedStore] = useAtom(selectedStoreAtom);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showMachineActivation, setShowMachineActivation] = useState(false);
  const [scannedMachineData, setScannedMachineData] = useState<any>(null);

  const handleStoreSelect = (store: any) => {
    setSelectedStore(store);
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
      alert('Mã QR không hợp lệ. Vui lòng thử lại.');
    }
  };

  const handleMachineActivated = (machineId: string, paymentMethod: string) => {
    console.log(`Machine ${machineId} activated with ${paymentMethod}`);
    
    // TODO: Update machine status to in-use
    // TODO: Create new active reservation
    
    alert(`✅ Máy ${machineId} đã được kích hoạt! Chúc bạn giặt vui vẻ!`);
    
    // Reset state
    setShowMachineActivation(false);
    setScannedMachineData(null);
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
            onClick={() => window.location.hash = '#map'}
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

        {/* Current Active Reservations */}
        {activeReservations.length > 0 && (
          <Box className="mb-6">
            <Text.Title size="small" className="mb-4 font-bold text-gray-900">
              Máy đã giữ chỗ ({activeReservations.length})
            </Text.Title>
            
            <Box className="space-y-4">
              {activeReservations.map((reservation) => {
                const store = laundryStores.find(s => s.id === reservation.storeId);
                const machine = store?.washingMachines.find(m => m.id === reservation.machineId) ||
                              store?.dryingMachines.find(m => m.id === reservation.machineId);
                
                if (!machine) return null;
                
                return (
                  <MachineCard
                    key={reservation.id}
                    machine={machine}
                    onSelect={() => {}}
                  />
                );
              })}
            </Box>
          </Box>
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
              onClick={() => window.location.hash = '#map'}
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

        {/* Large QR Scan Button */}
        <Box className="flex justify-center mb-8 px-4">
          <Button
            onClick={() => setShowQRScanner(true)}
            className="w-full max-w-xs h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Box className="flex items-center justify-center space-x-4">
              <Icon icon="zi-qrline" className="text-4xl" />
              <Box>
                <div className="text-lg font-bold">Quét mã QR</div>
                <div className="text-sm opacity-90">Kích hoạt máy giặt</div>
              </Box>
            </Box>
          </Button>
        </Box>
        
      </Box>

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
