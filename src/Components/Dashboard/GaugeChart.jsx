import React from 'react';
import { motion } from 'framer-motion';

function GaugeChart({ value, min = 0, max = 100, label, unit, color = '#4ecdc4', size = 200 }) {
  const percentage = ((value - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const angle = (clampedPercentage / 100) * 180 - 90; // -90 to 90 degrees
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2 + 10;

  // Calculate arc path
  const getArcPath = (startAngle, endAngle) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    const x1 = centerX + radius * Math.cos(start);
    const y1 = centerY + radius * Math.sin(start);
    const x2 = centerX + radius * Math.cos(end);
    const y2 = centerY + radius * Math.sin(end);
    const largeArc = end - start > Math.PI ? 1 : 0;
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getColor = () => {
    if (clampedPercentage < 30) return '#ef4444';
    if (clampedPercentage < 70) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} className="overflow-visible">
        {/* Background arc */}
        <path
          d={getArcPath(-90, 90)}
          fill="none"
          stroke="#374151"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Value arc */}
        <motion.path
          d={getArcPath(-90, angle)}
          fill="none"
          stroke={getColor()}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: clampedPercentage / 100 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: `${centerX}px ${centerY}px` }}
        >
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + radius * 0.7}
            y2={centerY}
            stroke={getColor()}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={centerX} cy={centerY} r="6" fill={getColor()} />
        </motion.g>

        {/* Labels */}
        <text x={centerX} y={centerY - 10} textAnchor="middle" fill="#fff" fontSize="32" fontWeight="bold">
          {value.toFixed(1)}
        </text>
        <text x={centerX} y={centerY + 15} textAnchor="middle" fill="#9ca3af" fontSize="14">
          {unit}
        </text>
      </svg>
      <p className="text-gray-400 text-sm mt-2">{label}</p>
    </div>
  );
}

export default GaugeChart;
