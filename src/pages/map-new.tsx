import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { Box, Page, Text, Button, Icon } from 'zmp-ui';
import { laundryStoresAtom, selectedStoreAtom, activeTabAtom } from '@/store/atoms';
import AppHeader from '@/components/app-header';
import StoreCard from '@/components/store-card-new';

// Mapbox access token (replace with your own)
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGF0bnBxMDA4MjgiLCJhIjoiY21lNjBudWtzMHhjaTJscHVrN2EwYWF2cCJ9.5sskILmaC-ieOpyIPngV_A';

function MapPage() {
  const [laundryStores] = useAtom(laundryStoresAtom);
  const [selectedStore, setSelectedStore] = useAtom(selectedStoreAtom);
  const [, setActiveTab] = useAtom(activeTabAtom);
  const [searchArea, setSearchArea] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapboxMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Load Mapbox GL JS
    const loadMapbox = () => {
      if ((window as any).mapboxgl) {
        initializeMap();
        return;
      }
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
    };

    const initializeMap = () => {
      const mapboxgl = (window as any).mapboxgl;
      if (!mapRef.current || !mapboxgl) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      // Ho Chi Minh City center
      const center = [106.7009, 10.7769];

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center,
        zoom: 13,
        attributionControl: false,
      });

      mapboxMapRef.current = map;

      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add store markers
      laundryStores.forEach((store: any) => {
        const lng = store.coordinates?.lng || (106.7009 + (Math.random() - 0.5) * 0.02);
        const lat = store.coordinates?.lat || (10.7769 + (Math.random() - 0.5) * 0.02);

        // Custom marker element
        const el = document.createElement('div');
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.background = 'none';
        el.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" fill="#6366f1" stroke="white" stroke-width="2"/>
            <text x="16" y="21" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🧺</text>
          </svg>
        `;
        el.style.cursor = 'pointer';
        el.onclick = () => setSelectedStore(store);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      map.on('load', () => setMapLoaded(true));
    };

    loadMapbox();

    // Cleanup on unmount
    return () => {
      if (mapboxMapRef.current) {
        mapboxMapRef.current.remove();
        mapboxMapRef.current = null;
      }
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
    // eslint-disable-next-line
  }, [laundryStores, setSelectedStore]);

  const handleStoreSelect = (store: any) => {
    setSelectedStore(store);

    // Pan to store location on map
    if (mapboxMapRef.current && store.coordinates) {
      mapboxMapRef.current.flyTo({
        center: [store.coordinates.lng, store.coordinates.lat],
        zoom: 16,
        speed: 1.2,
      });
    }

    // Navigate to store detail page
    setActiveTab('machines');
  };

  const handleSearchArea = () => {
    setSearchArea(true);
    if (mapboxMapRef.current) {
      const bounds = mapboxMapRef.current.getBounds();
      console.log('Search in bounds:', bounds);
      // TODO: Filter stores by map bounds
    }
  };

  // Mapbox controls
  const handleZoomIn = () => {
    if (mapboxMapRef.current) mapboxMapRef.current.zoomIn();
  };
  const handleZoomOut = () => {
    if (mapboxMapRef.current) mapboxMapRef.current.zoomOut();
  };
  const handleLocate = () => {
    if (mapboxMapRef.current && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        mapboxMapRef.current.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 15,
        });
      });
    }
  };

  return (
    <Page className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Zalo Mini App Safe Area */}
      <Box className="safe-area-top bg-transparent" style={{ paddingTop: 'env(safe-area-inset-top, 8px)' }} />

      <AppHeader title="Tìm tiệm giặt" />

      <Box className="relative flex-1">
        {/* Enhanced Mapbox Map */}
        <Box className="relative h-96 mx-4 mt-4 rounded-2xl overflow-hidden shadow-xl border border-blue-200">
          <div
            ref={mapRef}
            className="w-full h-full"
            style={{ minHeight: '384px' }}
          />

          {/* Enhanced Loading overlay */}
          {!mapLoaded && (
            <Box className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 flex items-center justify-center">
              <Box className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
                <Box className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Icon icon="zi-location" size={32} className="text-white animate-pulse" />
                </Box>
                <Text className="text-gray-800 font-semibold text-lg mb-2">Đang tải bản đồ nha...</Text>
                <Text className="text-gray-600 text-sm">Tìm kiếm tiệm giặt gần bạn</Text>
                <Box className="flex justify-center gap-1 mt-4">
                  <Box className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <Box className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <Box className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </Box>
              </Box>
            </Box>
          )}

          {/* Enhanced Search in area button */}
          <Box className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <Button
              variant="secondary"
              size="small"
              onClick={handleSearchArea}
              className="bg-white/90 backdrop-blur-md shadow-xl border border-white/50 hover:bg-white hover:scale-105 transition-all duration-300 rounded-xl font-semibold"
            >
              <Icon icon="zi-search" className="mr-2 text-blue-600" />
              Tìm khu vực này
            </Button>
          </Box>

          {/* Enhanced Controls */}
          <Box className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              size="small"
              variant="secondary"
              className="bg-white/90 backdrop-blur-md shadow-lg w-12 h-12 p-0 rounded-xl border border-white/50 hover:scale-110 transition-all duration-300"
              icon={<Icon icon="zi-plus-circle" className="text-blue-600" />}
              onClick={handleZoomIn}
            />
            <Button
              size="small"
              variant="secondary"
              className="bg-white/90 backdrop-blur-md shadow-lg w-12 h-12 p-0 rounded-xl border border-white/50 hover:scale-110 transition-all duration-300"
              icon={<Icon icon="zi-minus-circle" className="text-blue-600" />}
              onClick={handleZoomOut}
            >
            </Button>
            <Button
              size="small"
              variant="secondary"
              className="bg-white/90 backdrop-blur-md shadow-lg w-12 h-12 p-0 rounded-xl border border-white/50 hover:scale-110 transition-all duration-300"
              icon={<Icon icon="zi-location-solid" className="text-blue-600" />}
              onClick={handleLocate}
            />
          </Box>

          {/* Map Legend */}
          <Box className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/50">
            <Box flex className="items-center gap-2 mb-2">
              <Box className="w-4 h-4 rounded-full bg-green-500" />
              <Text size="xSmall" className="text-gray-700 font-medium">Mở cửa</Text>
            </Box>
            <Box flex className="items-center gap-2">
              <Box className="w-4 h-4 rounded-full bg-gray-400" />
              <Text size="xSmall" className="text-gray-700 font-medium">Đóng cửa</Text>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Store List */}
        <Box className="p-4 pb-28">
          {/* Enhanced Header */}
          <Box className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <Box flex className="items-center justify-between">
              <Box flex className="items-center gap-3">
                <Box className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Text className="text-white font-bold">🗺️</Text>
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
              <Box className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border border-blue-200">
                <Text size="xSmall" className="font-bold text-blue-700">
                  {laundryStores.filter(s => s.status === 'open').length} mở cửa
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Enhanced Store Cards */}
          <Box className="space-y-4">
            {laundryStores.map((store, index) => (
              <Box
                key={store.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-fadeInUp"
              >
                <StoreCard
                  store={store}
                  onSelect={() => handleStoreSelect(store)}
                  onNavigate={() => {
                    // Navigate to store on map
                    if (mapboxMapRef.current && store.coordinates) {
                      mapboxMapRef.current.flyTo({
                        center: [store.coordinates.lng, store.coordinates.lat],
                        zoom: 16,
                        speed: 1.2,
                      });
                    }
                  }}
                  onCall={() => {
                    // Handle call action
                    window.open(`tel:${store.phoneNumber}`);
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Quick Stats */}
          <Box className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <Text className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Text className="text-blue-500">📊</Text>
              Thống kê nhanh
            </Text>
            <Box className="grid grid-cols-2 gap-4">
              <Box className="text-center p-3 bg-white/60 rounded-xl">
                <Text className="text-2xl font-bold text-green-600">
                  {laundryStores.reduce((acc, store) =>
                    acc + store.washingMachines.filter(m => m.status === 'available').length, 0
                  )}
                </Text>
                <Text size="xSmall" className="text-gray-600 font-medium">Máy giặt trống</Text>
              </Box>
              <Box className="text-center p-3 bg-white/60 rounded-xl">
                <Text className="text-2xl font-bold text-purple-600">
                  {laundryStores.reduce((acc, store) =>
                    acc + store.dryingMachines.filter(m => m.status === 'available').length, 0
                  )}
                </Text>
                <Text size="xSmall" className="text-gray-600 font-medium">Máy sấy trống</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default MapPage;
