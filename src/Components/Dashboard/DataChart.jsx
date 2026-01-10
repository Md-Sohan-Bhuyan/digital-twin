import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';

function DataChart({ data, type = 'line', dataKey, color = '#4ecdc4', name }) {
  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  const formattedData = data.map((item) => ({
    ...item,
    time: item.timestamp ? format(new Date(item.timestamp), 'HH:mm:ss') : '',
  }));

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
      <h3 className="text-white text-lg font-semibold mb-4">{name || 'Data Trend'}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          {type === 'area' ? (
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fillOpacity={1}
              fill={`url(#color${dataKey})`}
              name={name}
            />
          ) : (
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              name={name}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}

export default DataChart;
