import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Box, Page, Text, Button, Icon, List, Avatar, Modal, Sheet } from 'zmp-ui';
import { userAtom, activeReservationsAtom, interestedMachinesAtom, laundryStoresAtom } from '@/store/atoms';
import { useToast, ToastMessages } from '@/components/toast';
import AppHeader from '@/components/app-header';
import WalletTopup from '@/components/wallet-topup';
import { authorize, getUserInfo, getPhoneNumber, getSetting } from 'zmp-sdk/apis';
import { openChat, openShareSheet } from 'zmp-sdk/apis';

interface ZaloUser {
  id: string;
  name: string;
  avatar: string;
  phone?: string;
}

interface ProfilePageProps {
  onQRScan?: () => void;
}

function ProfilePage() {
  const [user, setUser] = useAtom(userAtom);
  const [activeReservations] = useAtom(activeReservationsAtom);
  const [interestedMachines] = useAtom(interestedMachinesAtom);
  const [laundryStores] = useAtom(laundryStoresAtom);
  
  const [zaloUser, setZaloUser] = useState<ZaloUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showReservationsModal, setShowReservationsModal] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const { showSuccess, showError, showInfo, ToastContainer } = useToast();

  // Mock transaction history
  const transactionHistory = [
    {
      id: 1,
      date: '2024-08-10',
      type: 'payment',
      amount: -25000,
      description: 'Máy giặt - Giặt Sấy 247',
      status: 'completed'
    },
    {
      id: 2, 
      date: '2024-08-09',
      type: 'topup',
      amount: 100000,
      description: 'Nạp tiền vào ví',
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-08-08', 
      type: 'payment',
      amount: -30000,
      description: 'Máy sấy - STV Laundry',
      status: 'completed'
    }
  ];

  useEffect(() => {
    // Request permissions and get user info on app start
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request permissions
      await requestPermissions();
      
      // Get user info
      await loginWithZalo();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      // Request user info permission
      await getSetting({});
      
      // Request location permission for finding nearby stores
      await authorize({
        scopes: ['scope.userInfo', 'scope.userLocation']
      });
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const loginWithZalo = async () => {
    setIsLoading(true);
    try {
      // Get user basic info
      const userInfo = await getUserInfo({});
      
      if (userInfo.userInfo) {
        const zaloUserData: ZaloUser = {
          id: userInfo.userInfo.id,
          name: userInfo.userInfo.name,
          avatar: userInfo.userInfo.avatar
        };

        // Try to get phone number
        try {
          const phoneResult = await getPhoneNumber({});
          if (phoneResult.number) {
            zaloUserData.phone = phoneResult.number;
          }
        } catch (phoneError) {
          console.log('Phone permission not granted');
        }

        setZaloUser(zaloUserData);
        setIsLoggedIn(true);

        // Update user atom with Zalo info
        setUser({
          ...user,
          name: zaloUserData.name,
          phone: zaloUserData.phone || user.phone,
          avatar: zaloUserData.avatar
        });
      }
    } catch (error) {
      console.error('Zalo login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await openShareSheet({
        type: 'zmp',
        data: {
          title: 'GiGi - Giặt gia công thông minh',
          description: 'Ứng dụng giặt sấy tiện lợi, nhanh chóng!',
          thumbnail: '',
          path: '/'
        }
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleSupport = async () => {
    try {
      await openChat({
        id: 'support_oa_id', // Replace with actual OA ID
        message: 'Chào bạn! Tôi cần hỗ trợ về ứng dụng GiGi.',
        type: 'oa'
      });
    } catch (error) {
      console.error('Chat failed:', error);
    }
  };

  const handleTopup = (amount: number, method: string, bonusAmount: number = 0) => {
    const totalAmount = amount + bonusAmount;
    
    // Update user balance and stats
    setUser({
      ...user,
      balance: (user.balance || 0) + totalAmount,
      bonusBalance: bonusAmount > 0 ? (user.bonusBalance || 0) + bonusAmount : (user.bonusBalance || 0),
      bonusExpiry: bonusAmount > 0 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : user.bonusExpiry, // 30 days from now
      loyaltyPoints: (user.loyaltyPoints || 0) + Math.floor(amount / 10000) // 1 point per 10k VND
    });

    setShowTopupModal(false);
    showSuccess(ToastMessages.success.topupSuccess);
  };

  const handleShareApp = async () => {
    showInfo(ToastMessages.info.loading);
    try {
      await handleShare();
      showSuccess('Chia sẻ thành công! Cảm ơn bạn! 🎉');
    } catch (error) {
      showError('Không thể chia sẻ! Thử lại sau nha 😔');
    }
  };

  const handleContactSupport = async () => {
    showInfo(ToastMessages.info.callConnecting);
    try {
      await handleSupport();
      showSuccess('Đã kết nối với hỗ trợ! 💬');
    } catch (error) {
      showError('Không thể kết nối! Thử lại sau nha 📞');
    }
  };

  return (
    <Page className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <ToastContainer />
      {/* Safe Area */}
      <Box className="safe-area-top bg-transparent" style={{ paddingTop: 'env(safe-area-inset-top, 8px)' }} />
      
      <AppHeader title="Tài khoản" />
      
      {/* Content với safe area */}
      <Box className="pb-safe-bottom" style={{ paddingBottom: 'max(6rem, env(safe-area-inset-bottom, 24px))' }}>
        
        {/* Enhanced User Profile Section */}
        <Box className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white p-6 mx-4 mt-4 rounded-3xl shadow-2xl relative overflow-hidden border border-purple-400/30">
          {/* Enhanced Background Effects */}
          <Box className="absolute inset-0 opacity-20">
            <Box
              className="absolute top-0 right-0 w-32 h-32 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                transform: 'translate(20px, -20px)'
              }}
            />
            <Box
              className="absolute bottom-0 left-0 w-24 h-24 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                transform: 'translate(-10px, 10px)'
              }}
            />
          </Box>
          
          {isLoggedIn && zaloUser ? (
            <Box className="relative z-10">
              <Box flex className="items-center gap-4 mb-6">
                <Box className="relative">
                  <Avatar
                    size={80}
                    src={zaloUser.avatar}
                    online
                    className="border-4 border-white/30 shadow-xl"
                  />
                  <Box className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Text className="text-white font-bold text-xs">✓</Text>
                  </Box>
                </Box>
                <Box className="flex-1">
                  <Text.Title className="text-white font-bold mb-2 text-xl">
                    {zaloUser.name}
                  </Text.Title>
                  <Box flex className="items-center gap-2 mb-3">
                    <Icon icon="zi-call" className="text-white/80" size={16} />
                    <Text className="text-white/90 font-medium">
                      {zaloUser.phone || user.phone}
                    </Text>
                  </Box>
                  <Box flex className="items-center gap-2">
                    <Box className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <Text size="small" className="text-white/80 font-medium">
                      Đã xác thực Zalo
                    </Text>
                  </Box>
                </Box>
              </Box>
              
              {/* Enhanced Balance Display */}
              <Box className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 mb-4">
                <Box flex className="items-center justify-between mb-3">
                  <Box flex className="items-center gap-2">
                    <Box className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Text className="text-white font-bold">💰</Text>
                    </Box>
                    <Text className="text-white/90 font-semibold">Số dư ví</Text>
                  </Box>
                  <Button
                    size="small"
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300 rounded-xl"
                    onClick={() => setShowTopupModal(true)}
                  >
                    <Icon icon="zi-plus" className="mr-1" />
                    Nạp tiền
                  </Button>
                </Box>
                
                <Text className="text-3xl font-bold text-white mb-2">
                  {user.balance?.toLocaleString('vi-VN')}₫
                </Text>
                
                {user.bonusBalance && user.bonusBalance > 0 && (
                  <Box flex className="items-center gap-2">
                    <Box className="bg-gradient-to-r from-yellow-400/30 to-orange-400/30 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-300/40">
                      <Text size="xSmall" className="text-yellow-100 font-bold">
                        🎁 +{user.bonusBalance.toLocaleString('vi-VN')}₫ thưởng
                      </Text>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          ) : (
            <Box className="text-center py-8 relative z-10">
              {isLoading ? (
                <Box>
                  <Box className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Icon icon="zi-more-horiz" className="text-white text-2xl animate-pulse" />
                  </Box>
                  <Text className="text-white font-semibold text-lg">Đang đăng nhập...</Text>
                  <Text className="text-white/80 text-sm mt-1">Kết nối với Zalo</Text>
                </Box>
              ) : (
                <Box>
                  <Box className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                    <Icon icon="zi-user-circle" className="text-white text-4xl" />
                  </Box>
                  <Text.Title className="text-white mb-3 text-xl">Chưa đăng nhập</Text.Title>
                  <Text className="text-white/80 mb-4">Đăng nhập để sử dụng đầy đủ tính năng</Text>
                  <Button
                    variant="secondary"
                    onClick={loginWithZalo}
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Icon icon="zi-user" className="mr-2" />
                    Đăng nhập bằng Zalo
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Enhanced Quick Stats */}
        <Box className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <Text className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Text className="text-blue-500">📊</Text>
            Thống kê của bạn
          </Text>
          <Box className="grid grid-cols-4 gap-3">
            <Box className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <Text.Title className="text-purple-600 font-bold text-lg">
                {activeReservations.length}
              </Text.Title>
              <Text size="xSmall" className="text-purple-700 font-medium">Đang giặt</Text>
            </Box>
            <Box className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <Text.Title className="text-green-600 font-bold text-lg">
                {user.favoriteStores.length}
              </Text.Title>
              <Text size="xSmall" className="text-green-700 font-medium">Tiệm quen</Text>
            </Box>
            <Box className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <Text.Title className="text-blue-600 font-bold text-lg">
                {user.totalWashes || 0}
              </Text.Title>
              <Text size="xSmall" className="text-blue-700 font-medium">Đã giặt</Text>
            </Box>
            <Box className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <Text.Title className="text-orange-600 font-bold text-lg">
                {user.loyaltyPoints || 0}
              </Text.Title>
              <Text size="xSmall" className="text-orange-700 font-medium">Điểm thưởng</Text>
            </Box>
          </Box>
        </Box>

        {/* Main Menu */}
        <Box className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
          <List>
            <List.Item
              title="Máy đang hoạt động"
              subTitle={`${activeReservations.length} máy đang chạy`}
              prefix={<Icon icon="zi-calendar" className="text-purple-600" />}
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={() => setShowReservationsModal(true)}
            />
            <List.Item
              title="Lịch sử giao dịch"
              subTitle={`${transactionHistory.length} giao dịch`}
              prefix={<Icon icon="zi-clock-1" className="text-green-600" />}
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={() => setShowHistoryModal(true)}
            />
            <List.Item
              title="Tiệm yêu thích"
              subTitle={`${user.favoriteStores.length} tiệm đã lưu`}
              prefix={<Icon icon="zi-star" className="text-yellow-500" />}
              suffix={<Icon icon="zi-chevron-right" />}
            />
            <List.Item
              title="Máy quan tâm"
              subTitle={`${interestedMachines.length} máy đang theo dõi`}
              prefix={<Icon icon="zi-heart" className="text-red-500" />}
              suffix={<Icon icon="zi-chevron-right" />}
            />
          </List>
        </Box>

        {/* Secondary Menu */}
        <Box className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
          <List>
            <List.Item
              title="Thông báo"
              subTitle="Cài đặt nhắc nhở"
              prefix={<Icon icon="zi-notif" className="text-blue-600" />}
              suffix={<Icon icon="zi-chevron-right" />}
            />
            <List.Item
              title="Chia sẻ ứng dụng"
              subTitle="Giới thiệu cho bạn bè"
              prefix={<Icon icon="zi-share" className="text-green-600" />}
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={handleShareApp}
            />
            <List.Item
              title="Hỗ trợ khách hàng"
              subTitle="Chat với team hỗ trợ"
              prefix={<Icon icon="zi-chat" className="text-purple-600" />}
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={handleContactSupport}
            />
            <List.Item
              title="Cài đặt"
              subTitle="Tùy chỉnh ứng dụng"
              prefix={<Icon icon="zi-setting" className="text-gray-600" />}
              suffix={<Icon icon="zi-chevron-right" />}
            />
          </List>
        </Box>

        {/* Enhanced App Info */}
        <Box className="mx-4 mt-6 mb-8">
          <Box className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-6 text-center shadow-xl border border-blue-200">
            <Box className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Text className="text-white font-bold text-2xl">🚀</Text>
            </Box>
            <Text.Title size="small" className="font-bold text-gray-900 mb-2">
              GiGi v1.0.0
            </Text.Title>
            <Text size="small" className="text-gray-600 mb-4 leading-relaxed">
              Giặt gia công thông minh - Tiện lợi mọi lúc
            </Text>
            
            {/* App Features */}
            <Box className="grid grid-cols-2 gap-3 mb-4">
              <Box className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <Text className="text-blue-600 font-bold text-sm">🎯 Thông minh</Text>
              </Box>
              <Box className="p-3 bg-green-50 rounded-xl border border-green-200">
                <Text className="text-green-600 font-bold text-sm">⚡ Nhanh chóng</Text>
              </Box>
              <Box className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <Text className="text-purple-600 font-bold text-sm">💰 Tiết kiệm</Text>
              </Box>
              <Box className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <Text className="text-orange-600 font-bold text-sm">🔒 An toàn</Text>
              </Box>
            </Box>
            
            <Text size="xSmall" className="text-gray-500">
              © 2024 GiGi Team. Made with ❤️ in Vietnam
            </Text>
          </Box>
        </Box>

      </Box>

      {/* Transaction History Modal */}
      <Modal
        visible={showHistoryModal}
        title="Lịch sử giao dịch"
        onClose={() => setShowHistoryModal(false)}
      >
        <Box className="p-4">
          {transactionHistory.map((transaction) => (
            <Box key={transaction.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
              <Box className="flex items-center space-x-3">
                <Box className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'payment' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <Icon 
                    icon={transaction.type === 'payment' ? 'zi-arrow-down' : 'zi-arrow-up'} 
                    className={transaction.type === 'payment' ? 'text-red-600' : 'text-green-600'} 
                  />
                </Box>
                <Box>
                  <Text size="small" className="font-semibold mb-1">{transaction.description}</Text>
                  <Text size="xSmall" className="text-gray-500">{transaction.date}</Text>
                </Box>
              </Box>
              <Box className="text-right">
                <Text className={`font-bold ${
                  transaction.type === 'payment' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')}₫
                </Text>
                <Text size="xSmall" className="text-gray-500 capitalize">
                  {transaction.status === 'completed' ? 'Hoàn thành' : transaction.status}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Modal>

      {/* Active Machines Modal */}
      <Modal
        visible={showReservationsModal}
        title="Máy đang hoạt động"
        onClose={() => setShowReservationsModal(false)}
      >
        <Box className="p-4">
          {activeReservations.length > 0 ? (
            activeReservations.map((reservation) => {
              const store = laundryStores.find(s => s.id === reservation.storeId);
              const machine = store?.washingMachines.find(m => m.id === reservation.machineId) ||
                            store?.dryingMachines.find(m => m.id === reservation.machineId);
              
              return (
                <Box key={reservation.id} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl p-4 mb-3 shadow-md">
                  <Box className="flex justify-between items-start mb-3">
                    <Box>
                      <Text className="font-semibold mb-1">{store?.name}</Text>
                      <Text size="small" className="text-white/90">
                        {machine?.type === 'washing' ? 'Máy giặt' : 'Máy sấy'} {machine?.id.slice(-2)}
                      </Text>
                    </Box>
                    <Box className="text-right">
                      <Text size="small" className="font-semibold">{reservation.progress || 12}%</Text>
                      <Text size="xSmall" className="text-white/90">Hoàn thành</Text>
                    </Box>
                  </Box>
                  
                  <Box className="w-full bg-white/20 rounded-full h-2 mb-3">
                    <Box 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${reservation.progress || 12}%` }}
                    />
                  </Box>
                  
                  <Box className="flex justify-between items-center">
                    <Text size="small" className="text-white/90">
                      Còn lại: {machine?.remainingTime || 40} phút
                    </Text>
                    <Button size="small" className="bg-white/20 text-white border-white/30">
                      Xem chi tiết
                    </Button>
                  </Box>
                </Box>
              );
            })
            ) : (
            <Box className="text-center py-8">
              <Icon icon="zi-calendar" className="text-gray-400 text-4xl mb-3" />
              <Text className="text-gray-500 mb-2">Chưa có máy nào đang chạy</Text>
              <Text size="small" className="text-gray-400">
                Hãy quét QR tại tiệm để bắt đầu và theo dõi tại đây
              </Text>
            </Box>
          )}
        </Box>
      </Modal>

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

export default ProfilePage;
