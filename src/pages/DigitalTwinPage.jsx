import React, { useEffect, useState } from 'react';
import useDigitalTwinStore from '../store/useDigitalTwinStore';
import useDeviceStore from '../store/useDeviceStore';
import useAuthStore from '../store/useAuthStore';
import socketService from '../services/socketService';
import Sidebar from "../Components/Layout/Sidebar";
import Header from '../Components/Layout/Header';
import ChatPanel from '../Components/Communication/ChatPanel';
import AdminDashboard from '../Components/Views/AdminDashboard';
import OperatorDashboard from '../Components/Views/OperatorDashboard';
import ViewerDashboard from '../Components/Views/ViewerDashboard';
import DashboardView from '../Components/Views/DashboardView';
import ModelViewer from '../Components/3D/ModelViewer';
import AnalyticsView from '../Components/Views/AnalyticsView';
import PredictiveAnalyticsView from '../Components/Views/PredictiveAnalyticsView';
import DataComparisonView from '../Components/Views/DataComparisonView';
import DeviceManager from '../Components/DeviceManagement/DeviceManager';
import EmployeeManager from '../Components/EmployeeManagement/EmployeeManager';
import AlertConfiguration from '../Components/Alerts/AlertConfiguration';
import MonitoringView from '../Components/Views/MonitoringView';
import SettingsView from '../Components/Views/SettingsView';
import { ROLES } from '../store/useAuthStore';

function DigitalTwinPage() {
  const { uiState, updateSensorData } = useDigitalTwinStore();
  const { selectedDeviceId, updateDeviceSensorData } = useDeviceStore();
  const { user } = useAuthStore();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    // Connect to socket service
    socketService.connect();

    // Start receiving sensor data
    const cleanup = socketService.startSimulation((data) => {
      // Update main store
      updateSensorData(data, selectedDeviceId);

      // Update selected device
      if (selectedDeviceId) {
        updateDeviceSensorData(selectedDeviceId, data);
      }
    });

    // Cleanup on unmount
    return () => {
      cleanup?.();
      socketService.disconnect();
    };
  }, [updateSensorData, selectedDeviceId, updateDeviceSensorData]);

  const renderView = () => {
    // Role-based dashboard routing
    if (uiState.selectedView === 'dashboard') {
      if (user?.role === ROLES.ADMIN) {
        return <AdminDashboard />;
      } else if (user?.role === ROLES.OPERATOR || user?.role === ROLES.MAINTENANCE) {
        return <OperatorDashboard />;
      } else {
        return <ViewerDashboard />;
      }
    }

    switch (uiState.selectedView) {
      case '3d-view':
        return <ModelViewer />;
      case 'analytics':
        return <AnalyticsView />;
      case 'predictive':
        return <PredictiveAnalyticsView />;
      case 'comparison':
        return <DataComparisonView />;
      case 'devices':
        return <DeviceManager />;
      case 'employees':
        return <EmployeeManager />;
      case 'alerts-config':
        return <AlertConfiguration />;
      case 'monitoring':
        return <MonitoringView />;
      case 'settings':
        return <SettingsView />;
      default:
        if (user?.role === ROLES.ADMIN) {
          return <AdminDashboard />;
        } else if (user?.role === ROLES.OPERATOR || user?.role === ROLES.MAINTENANCE) {
          return <OperatorDashboard />;
        } else {
          return <ViewerDashboard />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onChatClick={() => setChatOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
      {chatOpen && <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />}
    </div>
  );
}

export default DigitalTwinPage;
