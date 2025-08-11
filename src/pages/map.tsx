import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { Box, Page, Text, Button, Icon } from 'zmp-ui';
import { laundryStoresAtom, selectedStoreAtom } from '@/store/atoms';
import AppHeader from '@/components/app-header';
import StoreCard from '@/components/store-card';

// Mapbox access token (replace with your own)
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94dXNlciIsImEiOiJja3Z4b2V6b3gwM2ZzMnZtb2Z3b2Z0b2JzIn0.2y3n1n6p3k9v7k9v7k9v7k9v7k9v7k9v7k9v7k9';

interface MapPageProps {
  onQRScan?: () => void;
}

function MapPage() {
  const [laundryStores] = useAtom(laundryStoresAtom);
  const [selectedStore, setSelectedStore] = useAtom(selectedStoreAtom);
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
    <Page className="bg-gray-50">
      {/* Zalo Mini App Safe Area */}
      <Box className="h-2 bg-transparent" />

      <AppHeader title="Tìm tiệm giặt" />

      <Box className="relative flex-1">
        {/* Mapbox Map */}
        <Box className="relative h-80">
          <div
            ref={mapRef}
            className="w-full h-full rounded-lg overflow-hidden"
            style={{ minHeight: '320px' }}
          />

          {/* Loading overlay */}
          {!mapLoaded && (
            <Box className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Box className="text-center">
                <Icon icon="zi-location" size={48} className="text-blue-600 mb-2 animate-pulse" />
                <Text className="text-blue-800">Đang tải bản đồ...</Text>
              </Box>
            </Box>
          )}

          {/* Search in area button */}
          <Box className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <Button
              variant="secondary"
              size="small"
              onClick={handleSearchArea}
              className="bg-white shadow-lg border border-gray-200"
            >
              <Icon icon="zi-search" className="mr-2" />
              Tìm khu vực này
            </Button>
          </Box>

          {/* Controls */}
          <Box className="absolute bottom-4 right-4 space-y-2">
            <Button
              size="small"
              variant="secondary"
              className="bg-white shadow-md w-10 h-10 p-0"
              icon={<Icon icon="zi-plus" />}
              onClick={handleZoomIn}
            />
            <Button
              size="small"
              variant="secondary"
              className="bg-white shadow-md w-10 h-10 p-0"
              onClick={handleZoomOut}
            >
              <Text>-</Text>
            </Button>
            <Button
              size="small"
              variant="secondary"
              className="bg-white shadow-md w-10 h-10 p-0"
              icon={<Icon icon="zi-location" />}
              onClick={handleLocate}
            />
          </Box>
        </Box>

        {/* Store List */}
        <Box className="p-4 pb-24">
          <Box flex className="items-center justify-between mb-4">
            <Text.Title size="small">Tiệm giặt gần đây nè</Text.Title>
            <Text size="xSmall" className="text-gray-500">
              {laundryStores.length} tiệm
            </Text>
          </Box>

          <Box className="space-y-3">
            {laundryStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onSelect={() => handleStoreSelect(store)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default MapPage;
