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
import MapPage from "@/pages/map";
import StoreDetailPage from "@/pages/store-detail";
import MachineMonitoringPage from "@/pages/machine-monitoring";
import AppHeader from "@/components/app-header";
import ProfilePage from "@/pages/profile";
import AppBottomNavigation from "./bottom-navigation";
import PermissionHandler from "./permission-handler";
import QRScanner from "./qr-scanner";
import MachineActivation from "./machine-activation";
import { useAtom } from "jotai";
import { activeTabAtom, selectedMachineAtom, selectedStoreAtom, reservationsAtom, qrScanRequestAtom } from "@/store/atoms";

const Layout = () => {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showMachineActivation, setShowMachineActivation] = useState(false);
  const [scannedMachineData, setScannedMachineData] = useState<any>(null);
  const [, setSelectedMachine] = useAtom(selectedMachineAtom);
  const [, setSelectedStore] = useAtom(selectedStoreAtom);
  const [, setReservations] = useAtom(reservationsAtom);
  const [qrScanRequest, setQrScanRequest] = useAtom(qrScanRequestAtom);

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

  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <ZMPRouter>
        <div className="app-layout min-h-screen bg-gray-50">
          <div className="content-safe-area">
            {renderCurrentPage()}
          </div>
          <AppBottomNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {/* Permission Handler - only shows when needed */}
          <PermissionHandler 
            onPermissionsGranted={() => setPermissionsGranted(true)}
          />

          {/* QR Scanner Modal */}
          <QRScanner
            visible={showQRScanner}
            onClose={() => setShowQRScanner(false)}
            onScanned={handleQRScanned}
          />

          {/* Machine Activation Modal */}
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
