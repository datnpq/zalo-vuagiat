import { atom } from 'jotai';
import { LaundryStore, Machine, Reservation, User, NotificationSettings } from '@/types';

// Enhanced Mock data atoms
export const userAtom = atom<User>({
  id: 'user1',
  name: 'Nguyễn Văn A',
  phone: '0901234567',
  email: 'nguyenvana@gmail.com',
  avatar: 'https://via.placeholder.com/150/3b82f6/ffffff?text=A',
  balance: 150000, // 150k VND
  bonusBalance: 25000, // 25k VND bonus
  bonusExpiry: new Date('2025-12-31'),
  favoriteStores: ['store1', 'store3'],
  reservations: [],
  memberSince: new Date('2024-01-15'),
  totalWashes: 23,
  totalSavings: 45000,
  loyaltyPoints: 1250,
  preferredPaymentMethod: 'wallet'
});

export const laundryStoresAtom = atom<LaundryStore[]>([
  {
    id: 'store1',
    name: 'Giặt Sấy 247',
    address: '247 Đề Thám, Phạm Ngũ Lão, Quận 1, TP.HCM',
    distance: 0.8,
    status: 'open',
    rating: 4.9,
    phoneNumber: '028-3920-4567',
    coordinates: { lat: 10.7692, lng: 106.6914 },
    washingMachines: [
      {
        id: 'wash1',
        type: 'washing',
        status: 'in-use',
        remainingTime: 40,
        capacity: 8,
        price: 25000,
        features: ['Giặt nhanh', 'Tiết kiệm nước'],
        currentUser: 'user1'
      },
      {
        id: 'wash2',
        type: 'washing',
        status: 'available',
        capacity: 12,
        price: 35000,
        features: ['Giặt cao cấp', 'Khử mùi']
      },
      {
        id: 'wash3',
        type: 'washing',
        status: 'available',
        capacity: 10,
        price: 30000,
        features: ['Giặt thông minh', 'Bảo vệ vải']
      }
    ],
    dryingMachines: [
      {
        id: 'dry1',
        type: 'drying',
        status: 'available',
        capacity: 8,
        price: 20000,
        features: ['Sấy nhanh', 'Không nhăn']
      },
      {
        id: 'dry2',
        type: 'drying',
        status: 'in-use',
        remainingTime: 25,
        capacity: 12,
        price: 30000,
        features: ['Sấy nhẹ nhàng', 'Khử mùi'],
        currentUser: 'user1'
      },
      {
        id: 'dry3',
        type: 'drying',
        status: 'available',
        capacity: 10,
        price: 25000,
        features: ['Sấy cao cấp', 'Chống nhăn']
      }
    ]
  },
  {
    id: 'store2',
    name: 'STV Laundry',
    address: '728 Võ Văn Kiệt, tầng 7, Quận 5, TP.HCM',
    distance: 1.2,
    status: 'open',
    rating: 4.7,
    phoneNumber: '028-3836-1234',
    coordinates: { lat: 10.7545, lng: 106.6673 },
    washingMachines: [
      {
        id: 'wash4',
        type: 'washing',
        status: 'available',
        capacity: 8,
        price: 28000,
        features: ['Giặt thông minh', 'Tiết kiệm điện']
      },
      {
        id: 'wash5',
        type: 'washing',
        status: 'available',
        capacity: 10,
        price: 32000,
        features: ['Giặt sạch sâu', 'Khử khuẩn']
      }
    ],
    dryingMachines: [
      {
        id: 'dry4',
        type: 'drying',
        status: 'available',
        capacity: 8,
        price: 22000,
        features: ['Sấy êm ái', 'Bảo vệ vải']
      },
      {
        id: 'dry5',
        type: 'drying',
        status: 'available',
        capacity: 10,
        price: 28000,
        features: ['Sấy cao cấp', 'Chống nhăn']
      }
    ]
  },
  {
    id: 'store3',
    name: 'Giặt Ủi Sài Gòn',
    address: '123 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
    distance: 1.5,
    status: 'open',
    rating: 4.8,
    phoneNumber: '028-3930-5678',
    coordinates: { lat: 10.7886, lng: 106.6947 },
    washingMachines: [
      {
        id: 'wash6',
        type: 'washing',
        status: 'available',
        capacity: 15,
        price: 40000,
        features: ['Giặt siêu sạch', 'Công nghệ Nhật']
      },
      {
        id: 'wash7',
        type: 'washing',
        status: 'maintenance',
        capacity: 8,
        price: 25000,
        features: ['Giặt thường', 'Tiết kiệm']
      },
      {
        id: 'wash8',
        type: 'washing',
        status: 'available',
        capacity: 12,
        price: 35000,
        features: ['Giặt cao cấp', 'Khử mùi']
      }
    ],
    dryingMachines: [
      {
        id: 'dry6',
        type: 'drying',
        status: 'available',
        capacity: 15,
        price: 35000,
        features: ['Sấy siêu nhanh', 'Công nghệ mới']
      },
      {
        id: 'dry7',
        type: 'drying',
        status: 'available',
        capacity: 10,
        price: 25000,
        features: ['Sấy thông minh', 'Bảo vệ vải']
      }
    ]
  },
  {
    id: 'store4',
    name: 'Clean & Fresh',
    address: '456 Lê Văn Sỹ, Quận Tân Bình, TP.HCM',
    distance: 2.1,
    status: 'open',
    rating: 4.6,
    phoneNumber: '028-3844-9876',
    coordinates: { lat: 10.7990, lng: 106.6542 },
    washingMachines: [
      {
        id: 'wash9',
        type: 'washing',
        status: 'available',
        capacity: 8,
        price: 26000,
        features: ['Giặt eco', 'Thân thiện môi trường']
      },
      {
        id: 'wash10',
        type: 'washing',
        status: 'in-use',
        remainingTime: 15,
        capacity: 10,
        price: 30000,
        features: ['Giặt nhanh', 'Khử khuẩn'],
        currentUser: 'user2'
      }
    ],
    dryingMachines: [
      {
        id: 'dry8',
        type: 'drying',
        status: 'available',
        capacity: 8,
        price: 20000,
        features: ['Sấy nhẹ', 'Tiết kiệm điện']
      },
      {
        id: 'dry9',
        type: 'drying',
        status: 'available',
        capacity: 12,
        price: 28000,
        features: ['Sấy cao cấp', 'Không nhăn']
      }
    ]
  },
  {
    id: 'store5',
    name: 'Laundry Express',
    address: '789 Cách Mạng Tháng 8, Quận 10, TP.HCM',
    distance: 2.8,
    status: 'closed',
    rating: 4.4,
    phoneNumber: '028-3865-4321',
    coordinates: { lat: 10.7640, lng: 106.6700 },
    washingMachines: [
      {
        id: 'wash11',
        type: 'washing',
        status: 'available',
        capacity: 8,
        price: 24000,
        features: ['Giặt cơ bản', 'Giá rẻ']
      },
      {
        id: 'wash12',
        type: 'washing',
        status: 'available',
        capacity: 10,
        price: 28000,
        features: ['Giặt thường', 'Khử mùi nhẹ']
      }
    ],
    dryingMachines: [
      {
        id: 'dry10',
        type: 'drying',
        status: 'available',
        capacity: 8,
        price: 18000,
        features: ['Sấy cơ bản', 'Tiết kiệm']
      }
    ]
  },
  {
    id: 'store6',
    name: 'Premium Wash',
    address: '321 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    distance: 3.2,
    status: 'open',
    rating: 4.9,
    phoneNumber: '028-3899-7777',
    coordinates: { lat: 10.8031, lng: 106.7100 },
    washingMachines: [
      {
        id: 'wash13',
        type: 'washing',
        status: 'available',
        capacity: 20,
        price: 50000,
        features: ['Giặt VIP', 'Công nghệ Đức', 'Khử khuẩn 99%']
      },
      {
        id: 'wash14',
        type: 'washing',
        status: 'available',
        capacity: 15,
        price: 42000,
        features: ['Giặt cao cấp', 'Bảo vệ màu sắc']
      }
    ],
    dryingMachines: [
      {
        id: 'dry11',
        type: 'drying',
        status: 'available',
        capacity: 20,
        price: 45000,
        features: ['Sấy VIP', 'Không nhăn 100%']
      },
      {
        id: 'dry12',
        type: 'drying',
        status: 'available',
        capacity: 15,
        price: 35000,
        features: ['Sấy cao cấp', 'Thơm lâu']
      }
    ]
  }
]);

export const reservationsAtom = atom<Reservation[]>([]);

export const notificationSettingsAtom = atom<NotificationSettings>({
  beforeCompletion: 5,
  enabled: true
});

export const selectedStoreAtom = atom<LaundryStore | null>(null);
export const selectedMachineAtom = atom<Machine | null>(null);

// Derived atoms
export const activeReservationsAtom = atom((get) => 
  get(reservationsAtom).filter(r => r.status === 'active')
);

export const interestedMachinesAtom = atom((get) => 
  get(reservationsAtom).filter(r => r.status === 'completed')
);

// Global navigation state
export const activeTabAtom = atom<'home' | 'map' | 'machines' | 'profile' | 'monitor'>('home');

// Global QR scan request trigger
export const qrScanRequestAtom = atom<boolean>(false);

// Onboarding state
export const hasCompletedOnboardingAtom = atom<boolean>(false);

// App initialization state
export const appInitializedAtom = atom<boolean>(false);