import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, BarChart3, TrendingUp, Activity, Clock } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import useDeviceStore from '../../store/useDeviceStore';
import useActivityStore from '../../store/useActivityStore';
import MetricCard from '../Dashboard/MetricCard';
import DataChart from '../Dashboard/DataChart';
import { format } from 'date-fns';
import { timeAgo } from '../../utils/realtimeUtils';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ViewerDashboard() {
  const { user } = useAuthStore();
  const { sensorData, historicalData, notifications } = useDigitalTwinStore();
  const { devices } = useDeviceStore();
  const { addActivity, getFilteredActivities } = useActivityStore();
  const [liveStatus, setLiveStatus] = useState({
    lastUpdate: new Date(),
    systemUptime: 99.8,
    dataRefreshRate: '2s',
  });

  // Log viewer login
  useEffect(() => {
    addActivity({
      type: 'login',
      userId: user?.id,
      userName: user?.name,
      description: `${user?.name} logged in to viewer dashboard`,
      severity: 'info',
    });

    // Real-time status updates
    const interval = setInterval(() => {
      setLiveStatus((prev) => ({
        ...prev,
        lastUpdate: new Date(),
        systemUptime: Math.max(98, Math.min(100, prev.systemUptime + (Math.random() - 0.5) * 0.1)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [user, addActivity]);

  const activities = getFilteredActivities().slice(0, 5);
  const recentNotifications = notifications.slice(0, 3);

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
              Viewer Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome, {user?.name}. View real-time system data and analytics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white font-semibold">Live</span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <Clock size={14} />
              {format(liveStatus.lastUpdate, 'HH:mm:ss')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Live Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-500/30 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div>
            <div className="text-gray-400 text-sm">System Uptime</div>
            <div className="text-2xl font-bold text-green-400">{liveStatus.systemUptime.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Data Refresh</div>
            <div className="text-2xl font-bold text-white">{liveStatus.dataRefreshRate}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-400 text-sm">Last Updated</div>
          <div className="text-white font-semibold">{format(liveStatus.lastUpdate, 'HH:mm:ss')}</div>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-4"
      >
        <div className="flex items-center gap-3">
          <Eye className="text-blue-400" size={24} />
          <div>
            <div className="text-white font-semibold">Viewer Mode</div>
            <div className="text-gray-300 text-sm">
              You have read-only access. Contact an administrator for additional permissions.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          type="temperature"
          value={sensorData.temperature}
          unit="°C"
          label="Temperature"
          status={getStatus('temperature', sensorData.temperature)}
        />
        <MetricCard
          type="humidity"
          value={sensorData.humidity}
          unit="%"
          label="Humidity"
          status="normal"
        />
        <MetricCard
          type="pressure"
          value={sensorData.pressure}
          unit="hPa"
          label="Pressure"
          status={getStatus('pressure', sensorData.pressure)}
        />
        <MetricCard
          type="vibration"
          value={sensorData.vibration}
          unit="Hz"
          label="Vibration"
          status={getStatus('vibration', sensorData.vibration)}
        />
        <MetricCard
          type="energy"
          value={sensorData.energy}
          unit="kW"
          label="Energy Consumption"
          status="normal"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <DataChart
            data={historicalData}
            dataKey="temperature"
            color="#ef4444"
            name="Temperature Trend"
            type="area"
          />
        </div>
        <div className="h-80">
          <DataChart
            data={historicalData}
            dataKey="humidity"
            color="#3b82f6"
            name="Humidity Trend"
            type="area"
          />
        </div>
        <div className="h-80">
          <DataChart
            data={historicalData}
            dataKey="pressure"
            color="#a855f7"
            name="Pressure Trend"
            type="line"
          />
        </div>
        <div className="h-80">
          <DataChart
            data={historicalData}
            dataKey="vibration"
            color="#eab308"
            name="Vibration Trend"
            type="line"
          />
        </div>
      </div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
      >
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Activity size={20} />
          System Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Devices</div>
            <div className="text-2xl font-bold text-white">{devices.length}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">System Status</div>
            <div className={`text-2xl font-bold ${
              sensorData.status === 'operational' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {sensorData.status === 'operational' ? 'Operational' : 'Warning'}
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Data Points</div>
            <div className="text-2xl font-bold text-white">{historicalData.length}</div>
          </div>
        </div>
      </motion.div>

      {/* Live Data Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
      >
        <h2 className="text-white font-semibold text-lg mb-4">Real-time Data Stream</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData.slice(-30)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                name="Temperature"
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Humidity"
              />
              <Area
                type="monotone"
                dataKey="pressure"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.3}
                name="Pressure"
              />
              <Area
                type="monotone"
                dataKey="vibration"
                stroke="#eab308"
                fill="#eab308"
                fillOpacity={0.3}
                name="Vibration"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Activity size={20} />
            Recent Notifications
          </h2>
          <div className="space-y-2">
            {recentNotifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-gray-900/50 rounded-lg p-3 border border-white/5"
              >
                <div className="text-white text-sm font-medium">{notif.title}</div>
                <div className="text-gray-400 text-xs mt-1">{notif.message}</div>
                <div className="text-gray-500 text-xs mt-1">
                  {format(new Date(notif.timestamp), 'MMM dd, HH:mm:ss')}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Access */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
      >
        <h2 className="text-white font-semibold text-lg mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => useDigitalTwinStore.getState().setSelectedView('analytics')}
            className="flex items-center gap-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <BarChart3 size={20} />
            <span>View Analytics</span>
          </button>
          <button
            onClick={() => useDigitalTwinStore.getState().setSelectedView('predictive')}
            className="flex items-center gap-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <TrendingUp size={20} />
            <span>Predictive Analytics</span>
          </button>
          <button
            onClick={() => useDigitalTwinStore.getState().setSelectedView('3d-view')}
            className="flex items-center gap-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <Activity size={20} />
            <span>3D Visualization</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ViewerDashboard;
