import { create } from 'zustand';

const useDigitalTwinStore = create((set, get) => ({
  // Sensor Data
  sensorData: {
    temperature: 0,
    humidity: 0,
    pressure: 0,
    vibration: 0,
    energy: 0,
    status: 'operational',
  },

  // Historical Data for Charts
  historicalData: [],

  // 3D Model State
  modelState: {
    rotation: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 0, z: 0 },
    scale: 1,
    selectedPart: null,
  },

  // UI State
  uiState: {
    sidebarOpen: true,
    selectedView: 'dashboard',
    theme: 'dark',
    notificationCenterOpen: false,
    filters: {
      dateRange: null,
      sensorTypes: [],
      statusFilter: 'all',
    },
    comparisonMode: false,
    selectedDevices: [],
  },

  // Notifications & Alerts
  notifications: [],
  alerts: [],

  // Performance Metrics
  performanceMetrics: {
    uptime: 99.8,
    responseTime: 45,
    dataThroughput: 1250,
    errorRate: 0.02,
    healthScore: 98,
  },

  // Maintenance Schedule
  maintenanceSchedule: [
    { id: 1, type: 'routine', date: '2024-01-15', status: 'scheduled', description: 'Monthly inspection' },
    { id: 2, type: 'preventive', date: '2024-01-20', status: 'pending', description: 'Filter replacement' },
  ],

  // System Logs
  systemLogs: [],

  // Widget Configuration
  dashboardWidgets: {
    showTemperature: true,
    showHumidity: true,
    showPressure: true,
    showVibration: true,
    showEnergy: true,
  },

  // Actions
  updateSensorData: (data, deviceId = null) => {
    const timestamp = new Date().toISOString();
    const currentData = get().sensorData;
    const newData = { ...currentData, ...data, timestamp };

    set({ sensorData: newData });

    // Add to historical data (keep last 1000 entries for better analytics)
    const historical = get().historicalData;
    const updatedHistorical = [...historical, newData].slice(-1000);
    set({ historicalData: updatedHistorical });

    // Check alerts if alert config store is available (async check)
    setTimeout(async () => {
      try {
        const alertConfigModule = await import('./useAlertConfigStore');
        const alertConfigStore = alertConfigModule.default;
        const { checkAlerts } = alertConfigStore.getState();
        if (checkAlerts) {
          const triggeredAlerts = checkAlerts(newData, deviceId);
          if (triggeredAlerts.length > 0) {
            triggeredAlerts.forEach((alert) => {
              get().addAlert(alert);
              get().addNotification({
                type: alert.severity,
                title: alert.ruleName,
                message: `${alert.sensorType} is ${alert.sensorValue} (threshold: ${alert.threshold})`,
              });
            });
          }
        }
      } catch (e) {
        // Alert config store not available, skip
      }
    }, 0);
  },

  updateModelState: (state) => {
    set((prev) => ({
      modelState: { ...prev.modelState, ...state },
    }));
  },

  toggleSidebar: () => {
    set((prev) => ({
      uiState: { ...prev.uiState, sidebarOpen: !prev.uiState.sidebarOpen },
    }));
  },

  setSelectedView: (view) => {
    set((prev) => ({
      uiState: { ...prev.uiState, selectedView: view },
    }));
  },

  resetModel: () => {
    set({
      modelState: {
        rotation: { x: 0, y: 0, z: 0 },
        position: { x: 0, y: 0, z: 0 },
        scale: 1,
        selectedPart: null,
      },
    });
  },

  // Notification Management
  addNotification: (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((prev) => ({
      notifications: [newNotification, ...prev.notifications].slice(0, 50),
    }));
  },

  markNotificationAsRead: (id) => {
    set((prev) => ({
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  toggleNotificationCenter: () => {
    set((prev) => ({
      uiState: { ...prev.uiState, notificationCenterOpen: !prev.uiState.notificationCenterOpen },
    }));
  },

  // Alert Management
  addAlert: (alert) => {
    const newAlert = {
      id: Date.now(),
      ...alert,
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };
    set((prev) => ({
      alerts: [newAlert, ...prev.alerts].slice(0, 100),
    }));
  },

  acknowledgeAlert: (id) => {
    set((prev) => ({
      alerts: prev.alerts.map((a) =>
        a.id === id ? { ...a, acknowledged: true } : a
      ),
    }));
  },

  // System Logs
  addSystemLog: (log) => {
    const newLog = {
      id: Date.now(),
      ...log,
      timestamp: new Date().toISOString(),
    };
    set((prev) => ({
      systemLogs: [newLog, ...prev.systemLogs].slice(0, 200),
    }));
  },

  // Performance Metrics Update
  updatePerformanceMetrics: (metrics) => {
    set((prev) => ({
      performanceMetrics: { ...prev.performanceMetrics, ...metrics },
    }));
  },

  // Dashboard Widgets Toggle
  toggleWidget: (widgetName) => {
    set((prev) => ({
      dashboardWidgets: {
        ...prev.dashboardWidgets,
        [widgetName]: !prev.dashboardWidgets[widgetName],
      },
    }));
  },

  // Calculate Health Score
  calculateHealthScore: () => {
    const { sensorData, performanceMetrics } = get();
    let score = 100;

    // Temperature penalty
    if (sensorData.temperature > 30) score -= 10;
    if (sensorData.temperature > 35) score -= 10;

    // Vibration penalty
    if (sensorData.vibration > 7) score -= 5;
    if (sensorData.vibration > 9) score -= 10;

    // Pressure penalty
    if (sensorData.pressure < 1000 || sensorData.pressure > 1050) score -= 5;

    // Status penalty
    if (sensorData.status === 'warning') score -= 15;

    // Performance penalty
    if (performanceMetrics.errorRate > 0.05) score -= 5;
    if (performanceMetrics.uptime < 99) score -= 10;

    return Math.max(0, Math.min(100, score));
  },

  // Filter Management
  setFilters: (filters) => {
    set((prev) => ({
      uiState: { ...prev.uiState, filters: { ...prev.uiState.filters, ...filters } },
    }));
  },

  // Comparison Mode
  toggleComparisonMode: () => {
    set((prev) => ({
      uiState: { ...prev.uiState, comparisonMode: !prev.uiState.comparisonMode },
    }));
  },

  // Device Selection
  toggleDeviceSelection: (deviceId) => {
    set((prev) => {
      const selected = prev.uiState.selectedDevices;
      const newSelected = selected.includes(deviceId)
        ? selected.filter((id) => id !== deviceId)
        : [...selected, deviceId];
      return {
        uiState: { ...prev.uiState, selectedDevices: newSelected },
      };
    });
  },
}));

export default useDigitalTwinStore;
