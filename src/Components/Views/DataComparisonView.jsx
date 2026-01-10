import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import useDeviceStore from '../../store/useDeviceStore';
import { compareDatasets } from '../../utils/analyticsUtils';
import { exportComparisonReport } from '../../utils/exportUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DataComparisonView() {
  const { devices } = useDeviceStore();
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('temperature');

  const metrics = ['temperature', 'humidity', 'pressure', 'vibration', 'energy'];

  const handleDeviceToggle = (deviceId) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId].slice(0, 4) // Max 4 devices
    );
  };

  const selectedDevicesData = devices.filter((d) => selectedDevices.includes(d.id));

  // Prepare comparison data
  const comparisonData = selectedDevicesData.map((device) => ({
    name: device.name,
    ...device.sensorData,
  }));

  // Calculate statistics comparison
  const comparisons = selectedDevicesData.map((device) => {
    // For demo, we'll use current sensor data
    // In production, you'd compare historical datasets
    const dataset1 = [{ [selectedMetric]: device.sensorData[selectedMetric] }];
    const dataset2 = [{ [selectedMetric]: 0 }]; // Baseline
    return {
      device: device.name,
      value: device.sensorData[selectedMetric],
      ...device.sensorData,
    };
  });

  const handleExport = () => {
    exportComparisonReport(selectedDevicesData, 'device-comparison');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Data Comparison</h1>
          <p className="text-gray-400">Compare metrics across multiple devices</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {metrics.map(metric => (
              <option key={metric} value={metric}>
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </option>
            ))}
          </select>
          {selectedDevices.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Export Report
            </motion.button>
          )}
        </div>
      </div>

      {/* Device Selection */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
        <h2 className="text-white font-semibold mb-4">Select Devices to Compare (Max 4)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => {
            const isSelected = selectedDevices.includes(device.id);
            return (
              <motion.button
                key={device.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDeviceToggle(device.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 bg-gray-900/50 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{device.name}</h3>
                  {isSelected && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  <div>Location: {device.location}</div>
                  <div>Status: <span className="capitalize">{device.status}</span></div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Comparison Chart */}
      {selectedDevices.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-white font-semibold mb-4">Comparison Chart</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Legend />
                {metrics.map((metric, index) => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={`hsl(${index * 60}, 70%, 50%)`}
                    strokeWidth={2}
                    name={metric.charAt(0).toUpperCase() + metric.slice(1)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Comparison Table */}
      {selectedDevices.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-white/10 overflow-x-auto"
        >
          <h2 className="text-white font-semibold mb-4">Detailed Comparison</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 font-semibold p-3">Device</th>
                {metrics.map((metric) => (
                  <th key={metric} className="text-right text-gray-400 font-semibold p-3">
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedDevicesData.map((device) => (
                <tr key={device.id} className="border-b border-white/5 hover:bg-gray-900/50">
                  <td className="text-white font-medium p-3">{device.name}</td>
                  {metrics.map((metric) => (
                    <td key={metric} className="text-right text-white p-3">
                      {device.sensorData[metric]?.toFixed(2) || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {selectedDevices.length === 0 && (
        <div className="text-center py-12">
          <GitCompare className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-400">Select devices to compare their metrics</p>
        </div>
      )}
    </div>
  );
}

export default DataComparisonView;
