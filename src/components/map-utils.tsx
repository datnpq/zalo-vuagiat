import React from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';
import { LaundryStore } from '@/types';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCurrentLocation: () => void;
  onToggleLayer?: () => void;
  showTrafficLayer?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onCurrentLocation,
  onToggleLayer,
  showTrafficLayer = false
}) => {
  return (
    <Box className="absolute top-4 right-4 space-y-2 z-20">
      <Button
        size="small"
        className="bg-white shadow-md hover:shadow-lg transition-shadow"
        onClick={onZoomIn}
      >
        <Icon icon="zi-plus" />
      </Button>
      
      <Button
        size="small"
        className="bg-white shadow-md hover:shadow-lg transition-shadow"
        onClick={onZoomOut}
      >
        <Icon icon="zi-arrow-down" />
      </Button>
      
      <Button
        size="small"
        className="bg-white shadow-md hover:shadow-lg transition-shadow"
        onClick={onCurrentLocation}
      >
        <Icon icon="zi-location" />
      </Button>
      
      {onToggleLayer && (
        <Button
          size="small"
          className={`shadow-md hover:shadow-lg transition-shadow ${
            showTrafficLayer 
              ? 'bg-purple-600 text-white' 
              : 'bg-white text-gray-700'
          }`}
          onClick={onToggleLayer}
        >
          <Icon icon="zi-more-grid" />
        </Button>
      )}
    </Box>
  );
};

interface StoreInfoWindowProps {
  store: LaundryStore;
  onViewDetails: () => void;
  onCall?: () => void;
  onNavigate?: () => void;
}

export const StoreInfoWindow: React.FC<StoreInfoWindowProps> = ({
  store,
  onViewDetails,
  onCall,
  onNavigate
}) => {
  const availableWashing = store.washingMachines.filter(m => m.status === 'available').length;
  const totalWashing = store.washingMachines.length;
  const availableDrying = store.dryingMachines.filter(m => m.status === 'available').length;  
  const totalDrying = store.dryingMachines.length;

  return (
    <Box className="bg-white rounded-lg shadow-lg p-4 max-w-xs border border-gray-200">
      <Text.Title size="small" className="font-semibold mb-2 text-gray-900">
        {store.name}
      </Text.Title>
      
      <Text size="xSmall" className="text-gray-600 mb-3 leading-relaxed">
        {store.address}
      </Text>
      
      {/* Machine availability */}
      <Box className="mb-4">
        <Box flex className="justify-between items-center mb-2">
          <Box flex className="items-center space-x-2">
            <span className="text-lg">🧺</span>
            <Box>
              <Text size="xSmall" className="font-medium">Máy giặt</Text>
              <Box className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium inline-block">
                Có sẵn
              </Box>
            </Box>
            <Text size="small" className="font-semibold">
              {availableWashing}/{totalWashing}
            </Text>
          </Box>
        </Box>
        
        <Box flex className="items-center space-x-2">
          <span className="text-lg">🔥</span>
          <Box>
            <Text size="xSmall" className="font-medium">Máy sấy</Text>
            <Box className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium inline-block">
              Có sẵn
            </Box>
          </Box>
          <Text size="small" className="font-semibold">
            {availableDrying}/{totalDrying}
          </Text>
        </Box>
      </Box>
      
      {/* Store info */}
      <Box flex className="items-center justify-between mb-4 text-xs text-gray-600">
        <Box flex className="items-center space-x-1">
          <Icon icon="zi-star" className="text-yellow-500" />
          <span>{store.rating}</span>
        </Box>
        <Box flex className="items-center space-x-1">
          <Icon icon="zi-location" />
          <span>{store.distance}km</span>
        </Box>
        <Box className={`px-2 py-1 rounded-full text-xs font-medium ${
          store.status === 'open' 
            ? 'bg-green-100 text-green-600' 
            : 'bg-red-100 text-red-600'
        }`}>
          {store.status === 'open' ? 'Mở cửa' : 'Đóng cửa'}
        </Box>
      </Box>
      
      {/* Action buttons */}
      <Box flex className="space-x-2">
        <Button
          size="small"
          variant="primary"
          className="flex-1"
          onClick={onViewDetails}
        >
          Xem chi tiết
        </Button>
        
        {onCall && store.phoneNumber && (
          <Button
            size="small"
            variant="secondary"
            onClick={onCall}
          >
            <Icon icon="zi-call" />
          </Button>
        )}
        
        {onNavigate && (
          <Button
            size="small"
            variant="secondary"
            onClick={onNavigate}
          >
            <Icon icon="zi-location" />
          </Button>
        )}
      </Box>
    </Box>
  );
};

interface MapLegendProps {
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  return (
    <Box className={`bg-white rounded-lg shadow-md p-3 ${className}`}>
      <Text size="xSmall" className="font-semibold mb-2 text-gray-800">
        Chú thích
      </Text>
      
      <Box className="space-y-2 text-xs">
        <Box flex className="items-center space-x-2">
          <Box className="w-3 h-3 bg-blue-600 rounded-full border border-white shadow-sm" />
          <span className="text-gray-700">Vị trí của bạn</span>
        </Box>
        
        <Box flex className="items-center space-x-2">
          <Box className="w-3 h-3 bg-purple-600 rounded-full shadow-sm flex items-center justify-center">
            <span className="text-white text-xs">🏪</span>
          </Box>
          <span className="text-gray-700">Cửa hàng giặt ủi</span>
        </Box>
        
        <Box flex className="items-center space-x-2">
          <Box className="w-3 h-3 bg-green-500 rounded-full shadow-sm" />
          <span className="text-gray-700">Có máy sẵn</span>
        </Box>
        
        <Box flex className="items-center space-x-2">
          <Box className="w-3 h-3 bg-gray-400 rounded-full shadow-sm" />
          <span className="text-gray-700">Hết máy</span>
        </Box>
      </Box>
    </Box>
  );
};

// Utility functions for map calculations
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

export const updateStoreDistances = (
  stores: LaundryStore[], 
  userLat: number, 
  userLng: number
): LaundryStore[] => {
  return stores.map(store => ({
    ...store,
    distance: Math.round(calculateDistance(
      userLat, 
      userLng, 
      store.coordinates.lat, 
      store.coordinates.lng
    ) * 10) / 10 // Round to 1 decimal place
  })).sort((a, b) => a.distance - b.distance); // Sort by distance
};
