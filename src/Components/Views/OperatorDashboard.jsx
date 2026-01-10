import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertCircle, 
  Clock,
  CheckCircle,
  MessageSquare,
  Settings,
  BarChart3
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import useDeviceStore from '../../store/useDeviceStore';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import useActivityStore from '../../store/useActivityStore';
import { format } from 'date-fns';
import { playNotificationSound, timeAgo } from '../../utils/realtimeUtils';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function OperatorDashboard() {
  const { user } = useAuthStore();
  const { employees, getActiveAssignments } = useEmployeeStore();
  const { selectedDeviceId, getSelectedDevice } = useDeviceStore();
  const { sensorData, historicalData, alerts, notifications } = useDigitalTwinStore();
  const { addActivity, getFilteredActivities } = useActivityStore();
  const [myAssignment, setMyAssignment] = useState(null);
  const [liveMetrics, setLiveMetrics] = useState({
    productionRate: 0,
    qualityScore: 98,
    efficiency: 95,
  });

  // Find current user's assignment
  useEffect(() => {
    const currentEmployee = employees.find((e) => e.email === user?.email);
    if (currentEmployee) {
      const assignments = getActiveAssignments();
      const assignment = assignments.find((a) => a.employeeId === currentEmployee.id);
      setMyAssignment(assignment);
      
      // Log operator login
      addActivity({
        type: 'login',
        userId: currentEmployee.id,
        userName: currentEmployee.name,
        description: `${currentEmployee.name} logged in to operator dashboard`,
        severity: 'info',
      });
    }
  }, [employees, user, getActiveAssignments, addActivity]);

  // Real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics((prev) => ({
        productionRate: prev.productionRate + Math.floor(Math.random() * 3),
        qualityScore: Math.max(95, Math.min(100, prev.qualityScore + (Math.random() - 0.5) * 0.5)),
        efficiency: Math.max(90, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 0.5)),
      }));
    }, 3000);

    // Check for critical alerts and play sound
    const alertInterval = setInterval(() => {
      const currentAlerts = useDigitalTwinStore.getState().alerts;
      const criticalAlerts = currentAlerts.filter(
        (a) => !a.acknowledged && 
        (a.severity === 'critical' || a.severity === 'warning') &&
        new Date(a.timestamp) > new Date(Date.now() - 5000)
      );
      
      if (criticalAlerts.length > 0) {
        playNotificationSound('alert');
        addActivity({
          type: 'alert',
          userId: user?.id,
          userName: user?.name,
          description: `New ${criticalAlerts[0].severity} alert: ${criticalAlerts[0].ruleName}`,
          severity: criticalAlerts[0].severity,
        });
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(alertInterval);
    };
  }, [user, addActivity]);

  const currentDevice = getSelectedDevice();
  const myAlerts = alerts.filter((a) => !a.acknowledged).slice(0, 5);
  const recentNotifications = notifications.slice(0, 5);
  const activities = getFilteredActivities().slice(0, 5);

  const getStatus = (type, value) => {
    switch (type) {
      case 'temperature':
        return value > 30 ? 'warning' : 'normal';
      case 'vibration':
        return value > 7 ? 'warning' : 'normal';
      case 'pressure':
        return value < 1000 || value > 1050 ? 'warning' : 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Operator Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome, {user?.name}. Monitor your assigned machine and tasks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white font-semibold">Live</span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-400 text-sm">
              {format(new Date(), 'HH:mm:ss')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Live Metrics Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-4 border border-green-500/30 grid grid-cols-3 gap-4"
      >
        <div>
          <div className="text-gray-400 text-sm mb-1">Production Rate</div>
          <div className="text-2xl font-bold text-white">{liveMetrics.productionRate}/hr</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Quality Score</div>
          <div className="text-2xl font-bold text-green-400">{liveMetrics.qualityScore.toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Efficiency</div>
          <div className="text-2xl font-bold text-blue-400">{liveMetrics.efficiency.toFixed(1)}%</div>
        </div>
      </motion.div>

      {/* My Assignment Card */}
      {myAssignment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-xl font-semibold mb-2">Current Assignment</h3>
              <div className="space-y-1 text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-medium">{currentDevice?.name}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-purple-400">{myAssignment.sectorId}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Task: {myAssignment.task}
                </div>
                <div className="text-sm text-gray-400">
                  Started: {format(new Date(myAssignment.startTime), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {Math.floor((Date.now() - new Date(myAssignment.startTime).getTime()) / 3600000)}h
              </div>
              <div className="text-gray-400 text-sm">Active Time</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { key: 'temperature', label: 'Temperature', unit: '°C', color: 'red' },
          { key: 'humidity', label: 'Humidity', unit: '%', color: 'blue' },
          { key: 'pressure', label: 'Pressure', unit: 'hPa', color: 'purple' },
          { key: 'vibration', label: 'Vibration', unit: 'Hz', color: 'yellow' },
          { key: 'energy', label: 'Energy', unit: 'kW', color: 'green' },
        ].map((metric) => {
          const value = sensorData[metric.key] || 0;
          const status = getStatus(metric.key, value);
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-gray-800/50 rounded-xl p-4 border ${
                status === 'warning' ? 'border-yellow-500/50' : 'border-white/10'
              }`}
            >
              <div className="text-gray-400 text-sm mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-white mb-1">
                {value.toFixed(1)}
                <span className="text-sm text-gray-400 ml-1">{metric.unit}</span>
              </div>
              <div className={`text-xs ${
                status === 'warning' ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {status === 'warning' ? '⚠ Warning' : '✓ Normal'}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts & Notifications */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Alerts */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <AlertCircle size={20} />
                Active Alerts
              </h2>
              <span className="text-gray-400 text-sm">{myAlerts.length} alerts</span>
            </div>
            <div className="space-y-3">
              {myAlerts.length > 0 ? (
                myAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`bg-gray-900/50 rounded-lg p-4 border ${
                      alert.severity === 'critical' ? 'border-red-500/50' :
                      alert.severity === 'warning' ? 'border-yellow-500/50' :
                      'border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{alert.ruleName}</div>
                        <div className="text-gray-400 text-sm">{alert.message}</div>
                        <div className="text-gray-500 text-xs mt-2">
                          {format(new Date(alert.timestamp), 'MMM dd, HH:mm:ss')}
                        </div>
                      </div>
                      <button
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                        onClick={() => {
                          useDigitalTwinStore.getState().acknowledgeAlert(alert.id);
                        }}
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No active alerts</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
            <h2 className="text-white font-semibold text-lg mb-4">Recent Notifications</h2>
            <div className="space-y-2">
              {recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-gray-900/50 rounded-lg p-3 border border-white/5"
                >
                  <div className="text-white text-sm">{notif.title}</div>
                  <div className="text-gray-400 text-xs mt-1">{notif.message}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {format(new Date(notif.timestamp), 'HH:mm:ss')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => useDigitalTwinStore.getState().setSelectedView('monitoring')}
              className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              <Activity size={20} />
              <span>Live Monitoring</span>
            </button>
            <button
              onClick={() => useDigitalTwinStore.getState().setSelectedView('analytics')}
              className="w-full flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              <BarChart3 size={20} />
              <span>View Analytics</span>
            </button>
            <button
              onClick={() => useDigitalTwinStore.getState().setSelectedView('settings')}
              className="w-full flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>

          {/* Machine Status */}
          {currentDevice && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-white font-semibold mb-3">Machine Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className={`text-sm font-semibold ${
                    currentDevice.status === 'operational' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {currentDevice.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Location</span>
                  <span className="text-white text-sm">{currentDevice.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Last Update</span>
                  <span className="text-white text-sm">
                    {currentDevice.lastUpdate 
                      ? format(new Date(currentDevice.lastUpdate), 'HH:mm:ss')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default OperatorDashboard;
