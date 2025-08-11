// Laundry Store Types
export interface LaundryStore {
  id: string;
  name: string;
  address: string;
  distance: number;
  status: 'open' | 'closed';
  washingMachines: Machine[];
  dryingMachines: Machine[];
  rating: number;
  phoneNumber?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Machine Types
export interface Machine {
  id: string;
  type: 'washing' | 'drying';
  status: 'available' | 'in-use' | 'reserved' | 'maintenance';
  remainingTime?: number; // minutes
  capacity: number; // kg
  price: number; // VND
  features: string[];
  currentUser?: string; // userId if machine is in use
}

// Reservation Types
export interface Reservation {
  id: string;
  userId: string;
  storeId: string;
  machineId: string;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  totalAmount: number;
  progress?: number; // 0-100%
}

// User Types
export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  balance?: number;
  bonusBalance?: number;
  bonusExpiry?: Date;
  favoriteStores: string[];
  reservations: Reservation[];
}

// Notification Types
export interface NotificationSettings {
  beforeCompletion: number; // minutes before completion to notify
  enabled: boolean;
}

// Search Types
export interface SearchParams {
  latitude?: number;
  longitude?: number;
  radius?: number; // km
  machineType?: 'washing' | 'drying';
  availableOnly?: boolean;
}
