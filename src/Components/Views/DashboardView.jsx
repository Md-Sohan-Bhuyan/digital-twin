import React from 'react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import MetricCard from '../Dashboard/MetricCard';
import DataChart from '../Dashboard/DataChart';
import { motion } from 'framer-motion';

function DashboardView() {
  const { sensorData, historicalData } = useDigitalTwinStore();

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
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Real-time monitoring of all systems and sensors</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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

      {/* System Status Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30 mt-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-xl font-semibold mb-2">System Health</h3>
            <p className="text-gray-400">
              All systems are operating within normal parameters. Last maintenance: 2 days ago
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-400 mb-1">98%</div>
            <div className="text-gray-400 text-sm">Efficiency</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardView;
