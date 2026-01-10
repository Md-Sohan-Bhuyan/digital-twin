import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Activity, 
  Zap, 
  AlertCircle,
  CheckCircle2 
} from 'lucide-react';

const iconMap = {
  temperature: Thermometer,
  humidity: Droplets,
  pressure: Gauge,
  vibration: Activity,
  energy: Zap,
};

const colorMap = {
  temperature: { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', icon: 'text-red-500' },
  humidity: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', icon: 'text-blue-500' },
  pressure: { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', icon: 'text-purple-500' },
  vibration: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400', icon: 'text-yellow-500' },
  energy: { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400', icon: 'text-green-500' },
};

function MetricCard({ type, value, unit, label, status = 'normal', trend = null }) {
  const Icon = iconMap[type] || Activity;
  const colors = colorMap[type] || colorMap.temperature;
  const StatusIcon = status === 'warning' ? AlertCircle : CheckCircle2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${colors.bg} ${colors.border} border rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.icon} p-3 rounded-lg bg-black/20`}>
          <Icon size={24} />
        </div>
        <StatusIcon 
          size={20} 
          className={status === 'warning' ? 'text-yellow-500' : 'text-green-500'} 
        />
      </div>

      <div className="space-y-1">
        <p className={`${colors.text} text-3xl font-bold`}>
          {typeof value === 'number' ? value.toFixed(1) : value}
          <span className="text-lg ml-1">{unit}</span>
        </p>
        <p className="text-gray-400 text-sm">{label}</p>
        
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span className={`text-xs ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </span>
            <span className="text-gray-500 text-xs">vs last hour</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default MetricCard;
