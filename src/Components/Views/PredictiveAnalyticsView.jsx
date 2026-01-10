import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import { 
  calculateLinearRegression, 
  predictValue, 
  calculateMovingAverage,
  detectAnomalies,
  calculateTrend,
  forecastValues,
  calculateStatistics
} from '../../utils/analyticsUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

function PredictiveAnalyticsView() {
  const { historicalData } = useDigitalTwinStore();
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [forecastSteps, setForecastSteps] = useState(10);

  const metrics = ['temperature', 'humidity', 'pressure', 'vibration', 'energy'];

  // Calculate analytics for selected metric
  const regression = calculateLinearRegression(historicalData, selectedMetric);
  const trend = calculateTrend(historicalData, selectedMetric);
  const statistics = calculateStatistics(historicalData, selectedMetric);
  const anomalies = detectAnomalies(historicalData, selectedMetric);
  const forecast = forecastValues(historicalData, selectedMetric, forecastSteps);
  const movingAvg = calculateMovingAverage(historicalData, selectedMetric, 5);

  // Prepare chart data
  const chartData = historicalData.map((d, index) => ({
    timestamp: new Date(d.timestamp || Date.now()).toLocaleTimeString(),
    actual: d[selectedMetric],
    movingAvg: movingAvg.find(ma => ma.timestamp === d.timestamp)?.[`${selectedMetric}_ma`] || null,
  }));

  const forecastData = forecast.map((f, index) => ({
    timestamp: `+${index + 1}`,
    forecast: f[selectedMetric],
    isForecast: true,
  }));

  const combinedData = [
    ...chartData.slice(-20).map(d => ({ ...d, isForecast: false })),
    ...forecastData,
  ];

  const getTrendIcon = () => {
    if (trend === 'increasing') return <TrendingUp className="text-green-500" size={20} />;
    if (trend === 'decreasing') return <TrendingDown className="text-red-500" size={20} />;
    return <Activity className="text-blue-500" size={20} />;
  };

  const getTrendColor = () => {
    if (trend === 'increasing') return 'text-green-500';
    if (trend === 'decreasing') return 'text-red-500';
    return 'text-blue-500';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Predictive Analytics</h1>
          <p className="text-gray-400">Advanced analytics and forecasting</p>
        </div>
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
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Trend</span>
            {getTrendIcon()}
          </div>
          <div className={`text-2xl font-bold ${getTrendColor()}`}>
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </div>
          {regression && (
            <div className="text-xs text-gray-500 mt-1">
              R²: {regression.rSquared?.toFixed(3) || 'N/A'}
            </div>
          )}
        </motion.div>

        {statistics && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
            >
              <div className="text-gray-400 text-sm mb-2">Average</div>
              <div className="text-2xl font-bold text-white">{statistics.mean}</div>
              <div className="text-xs text-gray-500 mt-1">Range: {statistics.min} - {statistics.max}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
            >
              <div className="text-gray-400 text-sm mb-2">Median</div>
              <div className="text-2xl font-bold text-white">{statistics.median}</div>
              <div className="text-xs text-gray-500 mt-1">Std Dev: {statistics.stdDev}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
            >
              <div className="text-gray-400 text-sm mb-2">Anomalies</div>
              <div className="text-2xl font-bold text-yellow-500">{anomalies.length}</div>
              <div className="text-xs text-gray-500 mt-1">Detected in dataset</div>
            </motion.div>
          </>
        )}
      </div>

      {/* Forecast Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Trend Analysis & Forecast</h2>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">Forecast Steps:</label>
            <input
              type="number"
              min="5"
              max="50"
              value={forecastSteps}
              onChange={(e) => setForecastSteps(parseInt(e.target.value) || 10)}
              className="w-20 bg-gray-900 border border-white/10 rounded px-2 py-1 text-white text-sm"
            />
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timestamp" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                name="Actual"
              />
              <Area
                type="monotone"
                dataKey="movingAvg"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
                strokeDasharray="5 5"
                name="Moving Average"
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.2}
                strokeDasharray="3 3"
                name="Forecast"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Anomalies */}
      {anomalies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-yellow-500" size={20} />
            <h2 className="text-white font-semibold">Detected Anomalies</h2>
          </div>
          <div className="space-y-2">
            {anomalies.slice(0, 5).map((anomaly, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3">
                <div>
                  <div className="text-white text-sm">
                    Value: {anomaly.value?.toFixed(2)} (Z-score: {anomaly.zScore?.toFixed(2)})
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(anomaly.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="text-yellow-500 text-sm font-semibold">Anomaly</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Prediction Info */}
      {regression && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30"
        >
          <h3 className="text-white font-semibold mb-2">Prediction Model</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Slope</div>
              <div className="text-white font-semibold">{regression.slope?.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-gray-400">Intercept</div>
              <div className="text-white font-semibold">{regression.intercept?.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-400">R² Score</div>
              <div className="text-white font-semibold">{regression.rSquared?.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-gray-400">Next Prediction</div>
              <div className="text-white font-semibold">
                {predictValue(regression, 1, historicalData.length - 1)?.toFixed(2)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default PredictiveAnalyticsView;
