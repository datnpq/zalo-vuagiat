import { atom } from 'jotai';
import { LaundryStore, Machine, Reservation, User, NotificationSettings } from '@/types';

// Mock data atoms
export const userAtom = atom<User>({
  id: 'user1',
  name: 'Nguyễn Văn A',
  phone: '0901234567',
  balance: 150000, // 150k VND
  bonusBalance: 25000, // 25k VND bonus
  bonusExpiry: new Date('2025-12-31'),
  favoriteStores: ['store1'],
  reservations: []
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
        price: 25000, // 25k VND
        features: ['Giặt nhanh', 'Tiết kiệm nước'],
        currentUser: 'user1'
      },
      {
        id: 'wash2',
        type: 'washing',
        status: 'available',
        capacity: 12,
        price: 35000, // 35k VND
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
        price: 20000, // 20k VND
        features: ['Sấy nhanh', 'Không nhăn']
      },
      {
        id: 'dry2',
        type: 'drying',
        status: 'in-use',
        remainingTime: 25,
        capacity: 12,
        price: 30000, // 30k VND
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
        id: 'wash3',
        type: 'washing',
        status: 'available',
        capacity: 8,
        price: 28000,
        features: ['Giặt thông minh', 'Tiết kiệm điện']
      },
      {
        id: 'wash4',
        type: 'washing',
        status: 'available',
        capacity: 10,
        price: 32000,
        features: ['Giặt sạch sâu', 'Khử khuẩn']
      }
    ],
    dryingMachines: [
      {
        id: 'dry3',
        type: 'drying',
        status: 'available',
        capacity: 8,
        price: 22000,
        features: ['Sấy êm ái', 'Bảo vệ vải']
      },
      {
        id: 'dry4',
        type: 'drying',
        status: 'available',
        capacity: 10,
        price: 28000,
        features: ['Sấy cao cấp', 'Chống nhăn']
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