import React from 'react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import DataChart from '../Dashboard/DataChart';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

function AnalyticsView() {
  const { historicalData, sensorData } = useDigitalTwinStore();

  // Calculate statistics
  const calculateStats = () => {
    if (historicalData.length === 0) return null;

    const temps = historicalData.map(d => d.temperature);
    const energies = historicalData.map(d => d.energy);

    return {
      avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length,
      maxTemp: Math.max(...temps),
      minTemp: Math.min(...temps),
      avgEnergy: energies.reduce((a, b) => a + b, 0) / energies.length,
      totalEnergy: energies.reduce((a, b) => a + b, 0),
    };
  };

  const stats = calculateStats();

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h1>
        <p className="text-gray-400">Deep dive into performance metrics and trends</p>
      </motion.div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold">+5.2%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.avgTemp.toFixed(1)}°C</div>
            <div className="text-gray-400 text-sm">Average Temperature</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Activity className="text-red-400" size={24} />
              </div>
              <span className="text-red-400 text-sm font-semibold">{stats.maxTemp.toFixed(1)}°C</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">Peak</div>
            <div className="text-gray-400 text-sm">Maximum Temperature</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Zap className="text-green-400" size={24} />
              </div>
              <span className="text-green-400 text-sm font-semibold">-2.1%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.avgEnergy.toFixed(1)}kW</div>
            <div className="text-gray-400 text-sm">Average Energy</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingDown className="text-purple-400" size={24} />
              </div>
              <span className="text-blue-400 text-sm font-semibold">Optimal</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalEnergy.toFixed(0)}kW</div>
            <div className="text-gray-400 text-sm">Total Energy</div>
          </motion.div>
        </div>
      )}

      {/* Combined Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          <DataChart
            data={historicalData}
            dataKey="temperature"
            color="#ef4444"
            name="Temperature Analysis"
            type="area"
          />
        </div>
        <div className="h-96">
          <DataChart
            data={historicalData}
            dataKey="energy"
            color="#10b981"
            name="Energy Consumption Analysis"
            type="area"
          />
        </div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30"
      >
        <h3 className="text-white text-xl font-semibold mb-4">Key Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
            <div>
              <p className="text-white font-medium">Temperature Stability</p>
              <p className="text-gray-400 text-sm">
                Temperature has remained stable within optimal range (20-30°C) for the past 24 hours.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
            <div>
              <p className="text-white font-medium">Energy Efficiency</p>
              <p className="text-gray-400 text-sm">
                Energy consumption is 15% lower than last week, indicating improved efficiency.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
            <div>
              <p className="text-white font-medium">Maintenance Recommendation</p>
              <p className="text-gray-400 text-sm">
                Scheduled maintenance recommended in 5 days based on current vibration patterns.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AnalyticsView;
