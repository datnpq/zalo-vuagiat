import React, { useState } from "react";
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

const Layout = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showMachineActivation, setShowMachineActivation] = useState(false);
  const [scannedMachineData, setScannedMachineData] = useState<any>(null);

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

  const handleMachineActivated = (machineId: string, paymentMethod: string) => {
    console.log(`Machine ${machineId} activated with ${paymentMethod}`);
    alert(`✅ Máy ${machineId} đã được kích hoạt! Chúc bạn giặt vui vẻ!`);
    
    // Reset state
    setScannedMachineData(null);
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
