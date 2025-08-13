import React, { useEffect, useState } from "react";
import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import MapPage from "@/pages/map-new";
import StoreDetailPage from "@/pages/store-detail";
import MachineMonitoringPage from "@/pages/machine-monitoring";
import AppHeader from "@/components/app-header";
import ProfilePage from "@/pages/profile";
import AppBottomNavigation from "./bottom-navigation";
import PermissionHandler from "./permission-handler";
import QRScanner from "./qr-scanner";
import MachineActivation from "./machine-activation";
import Onboarding from "./onboarding";
import SplashScreen from "./splash-screen";
import { useAtom } from "jotai";
import { activeTabAtom, selectedMachineAtom, selectedStoreAtom, reservationsAtom, qrScanRequestAtom, hasCompletedOnboardingAtom, appInitializedAtom } from "@/store/atoms";

const Layout = () => {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useAtom(hasCompletedOnboardingAtom);
  const [appInitialized, setAppInitialized] = useAtom(appInitializedAtom);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showMachineActivation, setShowMachineActivation] = useState(false);
  const [scannedMachineData, setScannedMachineData] = useState<any>(null);
  const [, setSelectedMachine] = useAtom(selectedMachineAtom);
  const [, setSelectedStore] = useAtom(selectedStoreAtom);
  const [, setReservations] = useAtom(reservationsAtom);
  const [qrScanRequest, setQrScanRequest] = useAtom(qrScanRequestAtom);

  // Initialize app after splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppInitialized(true);
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [setAppInitialized]);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleQRScanned = (qrData: string) => {
    try {
      const machineData = JSON.parse(qrData);
      console.log('QR Scanned:', machineData);
      
      // Set machine data and show activation modal
      setScannedMachineData(machineData);
      setShowMachineActivation(true);
      setShowQRScanner(false);
    } catch (error) {
      console.error('Invalid QR data:', error);
      alert('Mã QR không hợp lệ. Vui lòng thử lại.');
    }
  };

  // Global reservation progress updater (per minute)
  useEffect(() => {
    const updateProgress = () => {
      setReservations((prev) => prev.map((r) => {
        if (r.status !== 'active') return r;
        const now = Date.now();
        const start = new Date(r.startTime).getTime();
        const end = new Date(r.endTime).getTime();
        const total = Math.max(1, end - start);
        const elapsed = Math.max(0, now - start);
        const progress = Math.min(100, Math.round((elapsed / total) * 100));
        if (now >= end) {
          return { ...r, status: 'completed', progress: 100 };
        }
        return { ...r, progress };
      }));
    };

    updateProgress();
    const id = setInterval(updateProgress, 30_000);
    return () => clearInterval(id);
  }, [setReservations]);

  // React to global QR scan requests (from header/FAB)
  useEffect(() => {
    if (qrScanRequest) {
      setShowQRScanner(true);
      setQrScanRequest(false);
    }
  }, [qrScanRequest, setQrScanRequest]);

  const handleMachineActivated = (machineId: string, paymentMethod: string) => {
    // After activation, navigate to monitoring page and set selected machine
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
      setSelectedStore({
        id: scannedMachineData.storeId,
        name: 'Tiệm đã quét',
        address: 'Đang cập nhật',
        distance: 0,
        status: 'open',
        rating: 4.8,
        phoneNumber: '',
        coordinates: { lat: 10.7769, lng: 106.7009 },
        washingMachines: [],
        dryingMachines: [],
      } as any);
    }
    setScannedMachineData(null);
    setActiveTab('monitor');
  };

  const handleTabChange = (tab: string) => {
    const newTab = tab as "home" | "map" | "machines" | "profile" | "monitor";
    setActiveTab(newTab);
    
    // Clear selected store when navigating away from machines tab
    if (newTab !== 'machines' && newTab !== 'monitor') {
      setSelectedStore(null);
    }
    
    // Clear selected machine when navigating away from monitor tab
    if (newTab !== 'monitor') {
      setSelectedMachine(null);
    }
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'map':
        return <MapPage />;
      case 'machines':
        return <StoreDetailPage />;
      case 'profile':
        return <ProfilePage />;
      case 'monitor':
        return <MachineMonitoringPage />;
      default:
        return <HomePage />;
    }
  };

  // Show splash screen first
  if (!appInitialized) {
    return <SplashScreen onComplete={() => setAppInitialized(true)} />;
  }

  // Show onboarding if not completed
  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <ZMPRouter>
        <div className="app-layout min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
          {/* Enhanced Background Pattern */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="app-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                      <circle cx="50" cy="50" r="2" fill="#3b82f6" opacity="0.3"/>
                      <circle cx="25" cy="25" r="1" fill="#8b5cf6" opacity="0.2"/>
                      <circle cx="75" cy="75" r="1" fill="#6366f1" opacity="0.2"/>
                      <circle cx="25" cy="75" r="1.5" fill="#10b981" opacity="0.15"/>
                      <circle cx="75" cy="25" r="1.5" fill="#f59e0b" opacity="0.15"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="400" fill="url(#app-pattern)"/>
                </svg>
              `)}')`
            }}
          />
          
          {/* Page Content with Enhanced Transitions */}
          <div className="content-safe-area relative z-10">
            <div className="page-transition-container">
              {renderCurrentPage()}
            </div>
          </div>
          
          {/* Enhanced Bottom Navigation */}
          <AppBottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          
          {/* Permission Handler - only shows when needed */}
          <PermissionHandler
            onPermissionsGranted={() => setPermissionsGranted(true)}
          />

          {/* Enhanced QR Scanner Modal */}
          <QRScanner
            visible={showQRScanner}
            onClose={() => setShowQRScanner(false)}
            onScanned={handleQRScanned}
          />

          {/* Enhanced Machine Activation Modal */}
          <MachineActivation
            visible={showMachineActivation}
            machineData={scannedMachineData}
            onClose={() => {
              setShowMachineActivation(false);
              setScannedMachineData(null);
            }}
            onActivated={handleMachineActivated}
          />
        </div>
      </ZMPRouter>
    </App>
  );
};

export default Layout;
