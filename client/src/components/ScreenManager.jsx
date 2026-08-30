import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import { useGas } from '../context/GasContext';
import ProtectedRoute from './ProtectedRoute';
import { Screen1Splash, Screen2Onboarding, Screen3Login, Screen4CreateAccount, Screen4B_OTPVerification, Screen5ChooseAccountType } from './AuthScreens';
import { Screen6CustomerHome, Screen7LiveGasMap, Screen8Filter, Screen9SellerDetails, Screen10OrderGas, Screen11Payment, Screen12OrderConfirmation, Screen13LiveOrderTracking, Screen14CustomerOrders, Screen15CustomerProfile } from './CustomerScreens';
import { Screen16SellerRegistration, Screen17SellerDashboard, Screen18Inventory, Screen19SellerOrders, Screen21SellerEarnings } from './SellerScreens';
import { Screen22CompanyDashboard, Screen23BranchManagement, Screen24AddBranch, Screen25BranchDashboard } from './StationScreens';
import { Screen26AdminOverview, Screen27SellerManagement, Screen28Verification, Screen29Customers, Screen30OrderMonitor, Screen31Reports, Screen32Notifications, Screen33Safety, Screen34Settings } from './AdminScreens';

const ScreenManager = () => {
  const { currentScreen, activeRole, viewMode } = useGas();

  // Render current active screen component
  const renderScreen = () => {
    switch (currentScreen) {
      case 1: return <Screen1Splash />;
      case 2: return <Screen2Onboarding />;
      case 3: return <Screen3Login />;
      case 4: return <Screen4CreateAccount />;
      case '4B': return <Screen4B_OTPVerification />;
      case 5: return <Screen5ChooseAccountType />;
      case 6: return <ProtectedRoute allowedRoles={['customer', 'user']}><Screen6CustomerHome /></ProtectedRoute>;
      case 7: return <ProtectedRoute allowedRoles={['customer', 'user']}><Screen7LiveGasMap /></ProtectedRoute>;
      case 8: return <ProtectedRoute allowedRoles={['customer', 'user']}><Screen8Filter /></ProtectedRoute>;
      case 9: return <ProtectedRoute allowedRoles={['customer', 'user']}><Screen9SellerDetails /></ProtectedRoute>;
      case 10: return <ProtectedRoute allowedRoles={['customer', 'user']}><Screen10OrderGas /></ProtectedRoute>;
      case 11: return <ProtectedRoute allowedRoles={['customer', 'user']}><Screen11Payment /></ProtectedRoute>;
      case 12: return <ProtectedRoute allowedRoles={['customer', 'user']}><Screen12OrderConfirmation /></ProtectedRoute>;
      case 13: return <ProtectedRoute allowedRoles={['customer', 'user']}><Screen13LiveOrderTracking /></ProtectedRoute>;
      case 14: return <ProtectedRoute allowedRoles={['customer', 'user']}><Screen14CustomerOrders /></ProtectedRoute>;
      case 15: return <ProtectedRoute allowedRoles={['customer', 'user']}><Screen15CustomerProfile /></ProtectedRoute>;
      case 16: return <ProtectedRoute allowedRoles={['independent_seller', 'seller']}><Screen16SellerRegistration /></ProtectedRoute>;
      case 17: return <ProtectedRoute allowedRoles={['independent_seller', 'seller']}><Screen17SellerDashboard /></ProtectedRoute>;
      case 18: return <ProtectedRoute allowedRoles={['independent_seller', 'seller', 'filling_station']}><Screen18Inventory /></ProtectedRoute>;
      case 19: return <ProtectedRoute allowedRoles={['independent_seller', 'seller', 'filling_station']}><Screen19SellerOrders /></ProtectedRoute>;
      case 20: return <ProtectedRoute allowedRoles={['independent_seller', 'seller', 'filling_station']}><Screen19SellerOrders /></ProtectedRoute>;
      case 21: return <ProtectedRoute allowedRoles={['independent_seller', 'seller', 'filling_station']}><Screen21SellerEarnings /></ProtectedRoute>;
      case 22: return <ProtectedRoute allowedRoles={['filling_station']}><Screen22CompanyDashboard /></ProtectedRoute>;
      case 23: return <ProtectedRoute allowedRoles={['filling_station']}><Screen23BranchManagement /></ProtectedRoute>;
      case 24: return <ProtectedRoute allowedRoles={['filling_station']}><Screen24AddBranch /></ProtectedRoute>;
      case 25: return <ProtectedRoute allowedRoles={['filling_station']}><Screen25BranchDashboard /></ProtectedRoute>;
      case 26: return <ProtectedRoute allowedRoles={['admin']}><Screen26AdminOverview /></ProtectedRoute>;
      case 27: return <ProtectedRoute allowedRoles={['admin']}><Screen27SellerManagement /></ProtectedRoute>;
      case 28: return <ProtectedRoute allowedRoles={['admin']}><Screen28Verification /></ProtectedRoute>;
      case 29: return <ProtectedRoute allowedRoles={['admin']}><Screen29Customers /></ProtectedRoute>;
      case 30: return <ProtectedRoute allowedRoles={['admin']}><Screen30OrderMonitor /></ProtectedRoute>;
      case 31: return <ProtectedRoute allowedRoles={['admin']}><Screen31Reports /></ProtectedRoute>;
      case 32: return <ProtectedRoute allowedRoles={['admin']}><Screen32Notifications /></ProtectedRoute>;
      case 33: return <ProtectedRoute allowedRoles={['admin']}><Screen33Safety /></ProtectedRoute>;
      case 34: return <ProtectedRoute allowedRoles={['admin']}><Screen34Settings /></ProtectedRoute>;
      default: return <Screen3Login />;
    }
  };

  // Determine if active view should be clean 9:16 mobile frame or full desktop Admin view
  const isDesktopMode = activeRole === 'admin' || viewMode === 'desktop' || currentScreen >= 26;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0F172A' }}>
      <main className="gf-canvas-wrapper" style={{ padding: isDesktopMode ? '0' : '20px 10px' }}>
        {isDesktopMode ? (
          <div style={{ width: '100%', minHeight: '100vh' }}>
            {renderScreen()}
          </div>
        ) : (
          <div className="phone-frame-container">
            <div className="phone-notch" />
            <div className="phone-screen">
              {/* Phone Status Bar */}
              <div className="phone-status-bar">
                <span>9:41</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Signal size={12} />
                  <Wifi size={12} />
                  <Battery size={14} />
                </div>
              </div>
              {renderScreen()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScreenManager;
