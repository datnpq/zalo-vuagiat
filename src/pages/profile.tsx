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
  const { showSuccess, showError, ToastContainer } = useToast();

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
    
    // Update user balance
    setUser({
      ...user,
      balance: (user.balance || 0) + totalAmount,
      bonusBalance: bonusAmount > 0 ? (user.bonusBalance || 0) + bonusAmount : (user.bonusBalance || 0),
      bonusExpiry: bonusAmount > 0 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : user.bonusExpiry // 30 days from now
    });

    setShowTopupModal(false);
    showSuccess(ToastMessages.success.payment);
  };

  return (
    <Page className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {/* Safe Area */}
      <Box className="safe-area-top bg-white" style={{ paddingTop: 'env(safe-area-inset-top, 8px)' }} />
      
      <AppHeader title="Tài khoản" />
      
      {/* Content với safe area */}
      <Box className="pb-safe-bottom" style={{ paddingBottom: 'max(6rem, env(safe-area-inset-bottom, 24px))' }}>
        
        {/* User Profile Section */}
        <Box className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 mx-4 mt-4 rounded-2xl shadow-lg">
          {isLoggedIn && zaloUser ? (
            <Box flex className="items-center space-x-4">
              <Avatar
                size={64}
                src={zaloUser.avatar}
                online
              />
              <Box className="flex-1">
                <Text.Title className="text-white font-bold mb-1">
                  {zaloUser.name}
                </Text.Title>
                <Text className="text-white/90 mb-2">
                  {zaloUser.phone || user.phone}
                </Text>
                <Box className="flex items-center space-x-2">
                  <Box className="bg-white/20 px-3 py-1 rounded-full">
                    <Text size="small" className="text-white font-medium">
                      {user.balance?.toLocaleString('vi-VN')}₫
                    </Text>
                  </Box>
                  {user.bonusBalance && user.bonusBalance > 0 && (
                    <Box className="bg-orange-400/30 px-3 py-1 rounded-full">
                      <Text size="xSmall" className="text-white font-medium">
                        🎁 +{user.bonusBalance.toLocaleString('vi-VN')}₫
                      </Text>
                    </Box>
                  )}
                  <Button 
                    size="small" 
                    className="bg-white/20 text-white border-white/30"
                    onClick={() => setShowTopupModal(true)}
                  >
                    Nạp tiền
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box className="text-center py-4">
              {isLoading ? (
                <Box>
                  <Icon icon="zi-more-horiz" className="text-white text-2xl mb-2 animate-pulse" />
                  <Text className="text-white">Đang đăng nhập...</Text>
                </Box>
              ) : (
                <Box>
                  <Icon icon="zi-user-circle" className="text-white text-4xl mb-3" />
                  <Text.Title className="text-white mb-2">Chưa đăng nhập</Text.Title>
                  <Button 
                    variant="secondary" 
                    onClick={loginWithZalo}
                    className="bg-white text-purple-600 font-semibold"
                  >
                    Đăng nhập bằng Zalo
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Quick Stats */}
        <Box className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
          <Box className="grid grid-cols-3 gap-4">
            <Box className="text-center">
              <Text.Title className="text-purple-600 font-bold">
                {activeReservations.length}
              </Text.Title>
              <Text size="xSmall" className="text-gray-600">Đang giặt</Text>
            </Box>
            <Box className="text-center">
              <Text.Title className="text-green-600 font-bold">
                {user.favoriteStores.length}
              </Text.Title>
              <Text size="xSmall" className="text-gray-600">Tiệm quen</Text>
            </Box>
            <Box className="text-center">
              <Text.Title className="text-blue-600 font-bold">
                {transactionHistory.filter(t => t.type === 'payment').length}
              </Text.Title>
              <Text size="xSmall" className="text-gray-600">Đã giặt</Text>
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
              onClick={handleShare}
            />
            <List.Item
              title="Hỗ trợ khách hàng"
              subTitle="Chat với team hỗ trợ"
              prefix={<Icon icon="zi-chat" className="text-purple-600" />}
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={handleSupport}
            />
            <List.Item
              title="Cài đặt"
              subTitle="Tùy chỉnh ứng dụng"
              prefix={<Icon icon="zi-setting" className="text-gray-600" />}
              suffix={<Icon icon="zi-chevron-right" />}
            />
          </List>
        </Box>

        {/* App Info */}
        <Box className="mx-4 mt-4 bg-white rounded-2xl p-6 text-center shadow-sm">
          <Icon icon="zi-star-solid" className="text-purple-600 text-2xl mb-2" />
          <Text.Title size="small" className="font-bold text-gray-900 mb-1">
            GiGi v1.0.0
          </Text.Title>
          <Text size="small" className="text-gray-500 mb-3">
            Giặt gia công thông minh - Tiện lợi mọi lúc
          </Text>
          <Text size="xSmall" className="text-gray-400">
            © 2024 GiGi Team. Made with ❤️ in Vietnam
          </Text>
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
