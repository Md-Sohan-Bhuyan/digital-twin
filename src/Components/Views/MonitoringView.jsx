import React from 'react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import { motion } from 'framer-motion';
import { Activity, Clock, AlertTriangle } from 'lucide-react';

function MonitoringView() {
  const { sensorData, historicalData } = useDigitalTwinStore();

  const recentAlerts = [
    { id: 1, type: 'info', message: 'System check completed', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'Temperature approaching threshold', time: '15 min ago' },
    { id: 3, type: 'success', message: 'Energy optimization active', time: '1 hour ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Live Monitoring</h1>
        <p className="text-gray-400">Real-time system status and alerts</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Activity className="text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold">Live Status</h3>
              <p className="text-gray-400 text-sm">Current system metrics</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(sensorData).filter(([key]) => key !== 'timestamp' && key !== 'status').map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-gray-300 capitalize">{key}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / 100) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-white font-semibold w-20 text-right">
                    {typeof value === 'number' ? value.toFixed(1) : value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="text-yellow-400" size={24} />
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold">Recent Alerts</h3>
              <p className="text-gray-400 text-sm">System notifications</p>
            </div>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border ${
                  alert.type === 'warning'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : alert.type === 'success'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-white text-sm">{alert.message}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={12} />
                    {alert.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Data Stream */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-white text-xl font-semibold mb-4">Data Stream</h3>
        <div className="bg-black/40 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <div className="space-y-1">
            {historicalData.slice(-10).reverse().map((data, idx) => (
              <div key={idx} className="text-gray-300 flex items-center gap-4">
                <span className="text-gray-500 w-32">
                  {data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : '--:--:--'}
                </span>
                <span className="text-blue-400">TEMP: {data.temperature?.toFixed(1)}°C</span>
                <span className="text-green-400">HUM: {data.humidity?.toFixed(1)}%</span>
                <span className="text-purple-400">PRES: {data.pressure?.toFixed(1)}hPa</span>
                <span className="text-yellow-400">VIB: {data.vibration?.toFixed(2)}Hz</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MonitoringView;
