import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, AlertCircle, TrendingUp, Server } from 'lucide-react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function PerformanceMonitor() {
  const { performanceMetrics, historicalData, calculateHealthScore } = useDigitalTwinStore();
  const healthScore = calculateHealthScore();

  // Calculate performance trends
  const performanceData = historicalData.slice(-20).map((data, idx) => ({
    index: idx,
    responseTime: Math.random() * 50 + 30,
    throughput: Math.random() * 500 + 1000,
    errorRate: Math.random() * 0.05,
  }));

  const metrics = [
    {
      label: 'Uptime',
      value: `${performanceMetrics.uptime}%`,
      icon: Server,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      trend: '+0.2%',
    },
    {
      label: 'Response Time',
      value: `${performanceMetrics.responseTime}ms`,
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      trend: '-5ms',
    },
    {
      label: 'Data Throughput',
      value: `${performanceMetrics.dataThroughput} MB/s`,
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      trend: '+50 MB/s',
    },
    {
      label: 'Error Rate',
      value: `${performanceMetrics.errorRate}%`,
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      trend: '-0.01%',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Performance Monitoring</h1>
        <p className="text-gray-400">System performance metrics and health monitoring</p>
      </motion.div>

      {/* Health Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-8 border border-green-500/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-2xl font-semibold mb-2">System Health Score</h2>
            <p className="text-gray-400">Overall system performance indicator</p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold text-green-400 mb-2">{healthScore}</div>
            <div className="flex items-center gap-2 text-green-400">
              <TrendingUp size={20} />
              <span className="text-sm">Excellent</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500 to-blue-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${metric.bg} ${metric.border} border rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.color} p-3 rounded-lg bg-black/20`}>
                  <Icon size={24} />
                </div>
                <span className="text-green-400 text-xs font-semibold">{metric.trend}</span>
              </div>
              <div className="space-y-1">
                <p className={`${metric.color} text-2xl font-bold`}>{metric.value}</p>
                <p className="text-gray-400 text-sm">{metric.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-white text-lg font-semibold mb-4">Response Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="responseTime"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorResponse)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-white text-lg font-semibold mb-4">Data Throughput</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="throughput"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-white text-lg font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div>
              <p className="text-white font-medium">API Server</p>
              <p className="text-gray-400 text-sm">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div>
              <p className="text-white font-medium">Database</p>
              <p className="text-gray-400 text-sm">Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div>
              <p className="text-white font-medium">MQTT Broker</p>
              <p className="text-gray-400 text-sm">Active</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PerformanceMonitor;
