import React, { useState, useEffect } from 'react';
import { Box, Page, Text, Button, Icon, Input, Select } from 'zmp-ui';
import { useAtom } from 'jotai';
import AppHeader from '@/components/app-header';
import StoreCard from '@/components/store-card';
import MachineIcon from '@/components/machine-icon';
import QRScanner from '@/components/qr-scanner';
import MachineActivation from '@/components/machine-activation';
import WalletTopup from '@/components/wallet-topup';
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
  const [showTopupModal, setShowTopupModal] = useState(false);
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
      setShowQRScanner(false);
      showSuccess(ToastMessages.success.machineFound);
    } catch (error) {
      console.error('Invalid QR data:', error);
      showError(ToastMessages.error.qrInvalid);
    }
  };

  const handleMachineActivated = (machineId: string, paymentMethod: string) => {
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

  const handleTopup = (amount: number, method: string, bonusAmount: number = 0) => {
    // This will be handled by the wallet topup component
    setShowTopupModal(false);
  };

  const favoriteStore = laundryStores.find(store => store.id === 'store1');

  return (
    <Page className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Zalo Mini App Safe Area - đảm bảo không bị che header */}
      <Box className="safe-area-top bg-transparent" style={{ paddingTop: 'env(safe-area-inset-top, 8px)' }} />
      
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
              <Box className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mr-3">
                <Icon icon="zi-search" className="text-white" size={18} />
              </Box>
              <Box className="flex-1">
                <Text className="text-gray-600 font-medium">
                  Tìm tiệm giặt gần bạn...
                </Text>
                <Text size="small" className="text-gray-400 mt-0.5">
                  Khám phá các tiệm xung quanh
                </Text>
              </Box>
              <Icon icon="zi-chevron-right" className="text-gray-400" />
            </Box>
          </Box>
        </Box>

        {/* Clean Wallet Section */}
        <Box className="mb-6">
          <Box className="bg-blue-500 rounded-2xl p-5 shadow-sm">
            <Box className="flex items-center justify-between mb-4">
              <Box className="flex items-center gap-3">
                <Box className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Text className="text-white text-lg">💰</Text>
                </Box>
                <Box>
                  <Text className="text-white font-semibold">Ví GiGi</Text>
                  <Text className="text-white/80 text-sm">của {user.name || 'bạn'}</Text>
                </Box>
              </Box>
              <Box className="text-xs text-white/90 bg-white/20 px-3 py-1 rounded-full font-medium">
                VND
              </Box>
            </Box>

            <Box className="mb-4">
              <Text className="text-white/90 text-sm mb-2">Số dư khả dụng</Text>
              <Text className="text-3xl font-bold text-white mb-2">
                {user.balance?.toLocaleString('vi-VN') || '0'}₫
              </Text>
              
              {user.bonusBalance && user.bonusBalance > 0 && (
                <Box className="bg-white/20 px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Icon icon="zi-star" className="text-yellow-300 text-sm" />
                  <Text className="text-yellow-100 text-sm font-medium">
                    +{user.bonusBalance.toLocaleString('vi-VN')}₫ thưởng
                  </Text>
                </Box>
              )}
            </Box>

            <Box flex className="gap-2">
              <Button
                className="flex-1 bg-white/20 border border-white/30 text-white font-medium py-3 rounded-xl hover:bg-white/30 transition-colors duration-200"
                onClick={() => setShowTopupModal(true)}
              >
                <Icon icon="zi-plus-circle" className="mr-2" />
                Nạp tiền
              </Button>
              <Button
                className="bg-white/15 border border-white/25 text-white hover:bg-white/25 transition-colors duration-200 px-4 rounded-xl"
                onClick={() => setActiveTab('profile')}
              >
                <Icon icon="zi-user" />
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Empty state when no active machine */}
        {activeReservations.length === 0 && (
          <Box className="mb-8">
            <EmptyState
              type="no-reservations"
              title="Chưa có máy nào đang chạy"
              subtitle="Quét QR tại tiệm để bắt đầu giặt ủi nha"
              actionText="Quét QR ngay"
              onAction={() => setShowQRScanner(true)}
              className="py-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg"
            />
          </Box>
        )}

        {/* Enhanced Nearby Stores Section */}
        <Box className="mb-8">
          <Box className="flex items-center justify-between mb-5 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
            <Box flex className="items-center gap-3">
              <Box className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Text className="text-white font-bold text-sm">🏪</Text>
              </Box>
              <Box>
                <Text.Title size="small" className="font-bold text-gray-900">
                  Tiệm giặt gần đây
                </Text.Title>
                <Text size="xSmall" className="text-gray-600 font-medium">
                  {laundryStores.length} tiệm đang hoạt động
                </Text>
              </Box>
            </Box>
            <Button
              size="small"
              variant="tertiary"
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 shadow-sm"
              onClick={() => setActiveTab('map')}
            >
              <Text size="xSmall" className="font-semibold">Xem thêm</Text>
            </Button>
          </Box>
          
          <Box className="space-y-4">
            {laundryStores.slice(0, 2).map((store, index) => (
              <Box
                key={store.id}
                style={{ animationDelay: `${index * 200}ms` }}
                className="animate-fadeInUp"
              >
                <StoreCard
                  store={store}
                  onSelect={() => handleStoreSelect(store)}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Enhanced Favorite Store */}
        {favoriteStore && (
          <Box className="mb-8">
            <Box className="flex items-center gap-3 mb-5 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <Box className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                <Text className="text-white font-bold text-sm">⭐</Text>
              </Box>
              <Box>
                <Text.Title size="small" className="font-bold text-gray-900">
                  Tiệm quen thuộc
                </Text.Title>
                <Text size="xSmall" className="text-gray-600 font-medium">
                  Tiệm bạn hay đến nhất
                </Text>
              </Box>
            </Box>
            
            <StoreCard
              store={favoriteStore}
              onSelect={() => handleStoreSelect(favoriteStore)}
              className="border-2 border-purple-200 shadow-lg"
            />
          </Box>
        )}

        {/* Clean Floating QR FAB - Icon Only */}
        <Box className="fixed bottom-28 right-4 z-50">
          <Button
            className="w-14 h-14 bg-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-2xl"
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

      {/* Wallet Topup Modal */}
      <WalletTopup
        visible={showTopupModal}
        onClose={() => setShowTopupModal(false)}
        onTopup={handleTopup}
        currentBalance={user.balance || 0}
      />
    </Page>
  );
}

export default HomePage;
