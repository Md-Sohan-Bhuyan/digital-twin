import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Filter, Download, Search, X } from 'lucide-react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import { format } from 'date-fns';
import { exportToCSV } from '../../utils/exportUtils';

const logLevelColors = {
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  error: 'text-red-400 bg-red-500/10 border-red-500/30',
  success: 'text-green-400 bg-green-500/10 border-green-500/30',
  debug: 'text-gray-400 bg-gray-500/10 border-gray-500/30',
};

function SystemLogsViewer() {
  const { systemLogs, addSystemLog } = useDigitalTwinStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const logsEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [systemLogs]);

  // Simulate log generation
  useEffect(() => {
    const interval = setInterval(() => {
      const levels = ['info', 'warning', 'success'];
      const messages = [
        'Sensor data updated successfully',
        'System health check completed',
        'Data synchronization in progress',
        'Cache cleared',
        'Connection established',
        'Temperature threshold reached',
        'Energy optimization active',
      ];

      addSystemLog({
        level: levels[Math.floor(Math.random() * levels.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        source: 'System',
        metadata: {
          component: 'SensorManager',
          action: 'update',
        },
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [addSystemLog]);

  const filteredLogs = systemLogs.filter((log) => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExport = () => {
    exportToCSV(filteredLogs, 'system-logs');
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
            <p className="text-gray-400">Real-time system activity and event logs</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          {['all', 'info', 'warning', 'error', 'success'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Container */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="h-[600px] overflow-y-auto p-4 space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No logs found</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const colors = logLevelColors[log.level] || logLevelColors.info;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${colors} border rounded-lg p-4 font-mono text-sm`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-white">
                          [{log.level.toUpperCase()}]
                        </span>
                        <span className="text-gray-400">
                          {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss.SSS')}
                        </span>
                        {log.source && (
                          <span className="text-gray-500">| {log.source}</span>
                        )}
                      </div>
                      <p className="text-gray-200">{log.message}</p>
                      {log.metadata && (
                        <div className="mt-2 text-xs text-gray-500">
                          {JSON.stringify(log.metadata, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Log Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['all', 'info', 'warning', 'error', 'success'].map((level) => {
          const count = systemLogs.filter((log) => level === 'all' || log.level === level).length;
          return (
            <div
              key={level}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center"
            >
              <p className="text-gray-400 text-sm mb-1 capitalize">{level}</p>
              <p className="text-2xl font-bold text-white">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SystemLogsViewer;
