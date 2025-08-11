import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Box, Text, Button, Icon } from 'zmp-ui';
import { LaundryStore } from '@/types';

// Declare global google maps types
declare global {
  interface Window {
    selectStore: (storeId: string) => void;
    callStore: (phoneNumber: string) => void;
  }
}

interface GoogleMapProps {
  stores: LaundryStore[];
  onStoreSelect?: (store: LaundryStore) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({
  stores,
  onStoreSelect,
  center = { lat: 10.7769, lng: 106.7009 }, // Default to Ho Chi Minh City
  zoom = 13,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindows, setInfoWindows] = useState<any[]>([]);

  // Google Maps API Key - In production, this should be in environment variables
  const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // For development/demo purposes, we'll use a mock map implementation
        // In production, you would use the actual Google Maps API
        if (API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
          // Use mock implementation for demo
          initializeMockMap();
          return;
        }

        const loader = new Loader({
          apiKey: API_KEY,
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          setMap(mapInstance);
          setIsLoaded(true);
          
          // Add markers for stores
          addStoreMarkers(mapInstance, google);
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Using fallback display.');
        initializeMockMap();
      }
    };

    initializeMap();

    return () => {
      // Cleanup markers and info windows
      markers.forEach(marker => marker.setMap(null));
      infoWindows.forEach(infoWindow => infoWindow.close());
    };
  }, []);

  const initializeMockMap = () => {
    setIsLoaded(true);
    setError(null);
  };

  const addStoreMarkers = (mapInstance: any, google: any) => {
    const newMarkers: any[] = [];
    const newInfoWindows: any[] = [];

    stores.forEach((store) => {
      // Create custom marker
      const marker = new google.maps.Marker({
        position: store.coordinates,
        map: mapInstance,
        title: store.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.164 0 0 7.164 0 16C0 24.836 16 40 16 40C16 40 32 24.836 32 16C32 7.164 24.836 0 16 0Z" fill="#7C3AED"/>
              <circle cx="16" cy="16" r="8" fill="white"/>
              <text x="16" y="20" text-anchor="middle" fill="#7C3AED" font-size="12" font-family="Arial">🏪</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 40),
          anchor: new google.maps.Point(16, 40)
        }
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(store)
      });

      // Add click event
      marker.addListener('click', () => {
        // Close all other info windows
        newInfoWindows.forEach(iw => iw.close());
        
        // Open this info window
        infoWindow.open(mapInstance, marker);
        
        // Call onStoreSelect if provided
        if (onStoreSelect) {
          onStoreSelect(store);
        }
      });

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });

    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);
  };

  const createInfoWindowContent = (store: LaundryStore) => {
    const availableWashing = store.washingMachines.filter(m => m.status === 'available').length;
    const totalWashing = store.washingMachines.length;
    const availableDrying = store.dryingMachines.filter(m => m.status === 'available').length;
    const totalDrying = store.dryingMachines.length;

    return `
      <div style="max-width: 250px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${store.name}</h3>
        <p style="margin: 0 0 12px 0; font-size: 12px; color: #6b7280; line-height: 1.4;">${store.address}</p>
        
        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 16px;">🧺</span>
            <span style="font-size: 12px; font-weight: 500;">${availableWashing}/${totalWashing}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 16px;">🔥</span>
            <span style="font-size: 12px; font-weight: 500;">${availableDrying}/${totalDrying}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: #fbbf24; font-size: 12px;">★</span>
            <span style="font-size: 12px;">${store.rating}</span>
          </div>
        </div>
        
        <div style="display: flex; gap: 8px;">
          <button onclick="window.selectStore('${store.id}')" style="
            background: #7c3aed; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            padding: 6px 12px; 
            font-size: 12px; 
            font-weight: 500;
            cursor: pointer;
          ">Xem chi tiết</button>
          ${store.phoneNumber ? `
            <button onclick="window.callStore('${store.phoneNumber}')" style="
              background: #f3f4f6; 
              color: #374151; 
              border: none; 
              border-radius: 6px; 
              padding: 6px 12px; 
              font-size: 12px;
              cursor: pointer;
            ">Gọi</button>
          ` : ''}
        </div>
      </div>
    `;
  };

  // Mock map render when Google Maps is not available
  const renderMockMap = () => (
    <Box className="relative bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden" style={{ height }}>
      {/* Mock map background */}
      <Box className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Mock roads */}
          <path d="M0 150 Q200 100 400 150" stroke="#94a3b8" strokeWidth="8" fill="none" opacity="0.4"/>
          <path d="M150 0 Q200 150 150 300" stroke="#94a3b8" strokeWidth="6" fill="none" opacity="0.4"/>
        </svg>
      </Box>

      {/* Store markers */}
      {stores.map((store, index) => (
        <Box
          key={store.id}
          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${30 + (index * 25) % 40}%`,
            top: `${35 + (index * 15) % 30}%`
          }}
          onClick={() => onStoreSelect?.(store)}
        >
          <Box className="relative">
            {/* Marker pin */}
            <Box className="w-8 h-10 bg-purple-600 rounded-t-full rounded-b-none relative shadow-lg flex items-start justify-center pt-1">
              <span className="text-white text-xs">🏪</span>
            </Box>
            
            {/* Marker shadow */}
            <Box className="w-4 h-2 bg-black bg-opacity-20 rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2 blur-sm" />
            
            {/* Store info popup on hover */}
            <Box className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10">
              <Text size="small" className="font-semibold mb-1">{store.name}</Text>
              <Text size="xSmall" className="text-gray-600 mb-2">{store.distance}km away</Text>
              <Box flex className="space-x-4 text-xs">
                <Box flex className="items-center space-x-1">
                  <span>🧺</span>
                  <span>{store.washingMachines.filter(m => m.status === 'available').length}/{store.washingMachines.length}</span>
                </Box>
                <Box flex className="items-center space-x-1">
                  <span>🔥</span>
                  <span>{store.dryingMachines.filter(m => m.status === 'available').length}/{store.dryingMachines.length}</span>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}

      {/* User location */}
      <Box className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Box className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse" />
        <Box className="w-8 h-8 bg-blue-600 bg-opacity-20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping" />
      </Box>

      {/* Map controls */}
      <Box className="absolute top-4 right-4 space-y-2">
        <Button size="small" className="bg-white shadow-md" icon={<Icon icon="zi-plus" />} />
        <Button size="small" className="bg-white shadow-md" icon={<Icon icon="zi-arrow-down" />} />
        <Button size="small" className="bg-white shadow-md" icon={<Icon icon="zi-location" />} />
      </Box>

      {/* Search in area button */}
      <Box className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <Button size="small" className="bg-white shadow-md">
          <Icon icon="zi-search" className="mr-2" />
          Tìm khu vực này
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box className="w-full">
      {error && (
        <Box className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <Text size="small" className="text-orange-700">{error}</Text>
        </Box>
      )}
      
      {isLoaded ? (
        API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' ? (
          renderMockMap()
        ) : (
          <div ref={mapRef} style={{ width: '100%', height }} className="rounded-lg overflow-hidden" />
        )
      ) : (
        <Box className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
          <Box className="text-center">
            <Box className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2" />
            <Text size="small" className="text-gray-600">Đang tải bản đồ...</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GoogleMapComponent;
