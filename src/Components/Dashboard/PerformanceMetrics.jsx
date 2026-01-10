import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import GaugeChart from './GaugeChart';

function PerformanceMetrics() {
  const { performanceMetrics, calculateHealthScore } = useDigitalTwinStore();
  const healthScore = calculateHealthScore();

  const metrics = [
    {
      label: 'Uptime',
      value: performanceMetrics.uptime,
      unit: '%',
      icon: Activity,
      color: '#10b981',
      max: 100,
    },
    {
      label: 'Response Time',
      value: performanceMetrics.responseTime,
      unit: 'ms',
      icon: Clock,
      color: '#3b82f6',
      max: 1000,
    },
    {
      label: 'Throughput',
      value: performanceMetrics.dataThroughput,
      unit: 'req/s',
      icon: Zap,
      color: '#8b5cf6',
      max: 2000,
    },
    {
      label: 'Error Rate',
      value: performanceMetrics.errorRate,
      unit: '%',
      icon: AlertTriangle,
      color: '#ef4444',
      max: 1,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Performance Metrics</h1>
        <p className="text-gray-400">System performance and health monitoring</p>
      </motion.div>

      {/* Health Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-400" size={24} />
              <h2 className="text-white text-2xl font-bold">System Health Score</h2>
            </div>
            <p className="text-gray-400">Overall system performance indicator</p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold text-green-400 mb-1">{healthScore}</div>
            <div className="text-gray-400 text-sm">out of 100</div>
          </div>
        </div>
      </motion.div>

      {/* Gauge Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-center mb-4">
                <GaugeChart
                  value={metric.value}
                  min={0}
                  max={metric.max}
                  label={metric.label}
                  unit={metric.unit}
                  color={metric.color}
                  size={180}
                />
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Icon size={16} className={metric.color} style={{ color: metric.color }} />
                <span className="text-gray-400 text-sm">{metric.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10"
        >
          <div className="text-gray-400 text-sm mb-1">Average Response Time</div>
          <div className="text-2xl font-bold text-white">{performanceMetrics.responseTime}ms</div>
          <div className="text-green-400 text-xs mt-1">↓ 5% from last hour</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10"
        >
          <div className="text-gray-400 text-sm mb-1">Data Throughput</div>
          <div className="text-2xl font-bold text-white">{performanceMetrics.dataThroughput} req/s</div>
          <div className="text-green-400 text-xs mt-1">↑ 12% from last hour</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10"
        >
          <div className="text-gray-400 text-sm mb-1">Error Rate</div>
          <div className="text-2xl font-bold text-white">{performanceMetrics.errorRate}%</div>
          <div className="text-green-400 text-xs mt-1">↓ 0.01% from last hour</div>
        </motion.div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;
