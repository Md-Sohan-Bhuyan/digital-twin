import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Database, Shield, Palette, Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import { exportToCSV, exportToJSON, exportToExcel, generatePDFReport } from '../../utils/exportUtils';
import useToastStore from '../../store/useToastStore';
import useActivityStore from '../../store/useActivityStore';

function SettingsView() {
  const { sensorData, historicalData, uiState, setRealtimeUpdateIntervalMs } = useDigitalTwinStore();
  const [exportLoading, setExportLoading] = useState(false);
  const pushToast = useToastStore((s) => s.pushToast);
  const addActivity = useActivityStore((s) => s.addActivity);

  const handleExport = async (format) => {
    setExportLoading(true);
    try {
      const data = historicalData.length > 0 ? historicalData : [sensorData];
      switch (format) {
        case 'csv':
          exportToCSV(data, 'digital-twin-data');
          break;
        case 'json':
          exportToJSON(data, 'digital-twin-data');
          break;
        case 'excel':
          exportToExcel(data, 'digital-twin-data');
          break;
        case 'pdf':
          generatePDFReport(data, sensorData, {
            title: 'Digital Twin System Report',
            deviceName: 'Main System',
            filename: 'digital-twin-report',
          });
          break;
        default:
          break;
      }
      addActivity({
        type: 'export',
        description: `Exported data (${format.toUpperCase()})`,
        severity: 'info',
      });
      pushToast({
        type: 'success',
        title: 'Export started',
        message: `Preparing ${format.toUpperCase()} download…`,
        durationMs: 2200,
      });
    } catch (error) {
      console.error('Export error:', error);
      pushToast({
        type: 'error',
        title: 'Export failed',
        message: 'Please try again.',
        durationMs: 3500,
      });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your digital twin platform</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Bell className="text-blue-400" size={24} />
            </div>
            <h3 className="text-white text-xl font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Email Alerts</span>
              <input type="checkbox" className="toggle toggle-primary" defaultChecked />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Push Notifications</span>
              <input type="checkbox" className="toggle toggle-primary" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">SMS Alerts</span>
              <input type="checkbox" className="toggle toggle-primary" />
            </label>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Database className="text-green-400" size={24} />
            </div>
            <h3 className="text-white text-xl font-semibold">Data Management</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Data Retention</label>
              <select className="select select-bordered w-full bg-gray-700 text-white">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Update Frequency</label>
              <select
                className="select select-bordered w-full bg-gray-700 text-white"
                value={String(uiState?.realtime?.updateIntervalMs ?? 2000)}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setRealtimeUpdateIntervalMs(next);
                  addActivity({
                    type: 'settings',
                    description: `Realtime interval set to ${next}ms`,
                    severity: 'info',
                  });
                  pushToast({
                    type: 'info',
                    title: 'Realtime updated',
                    message: `Update interval: ${Math.round(next / 100) / 10}s`,
                    durationMs: 1800,
                  });
                }}
              >
                <option value="250">Real-time (250ms)</option>
                <option value="1000">1 second</option>
                <option value="2000">2 seconds</option>
                <option value="5000">5 seconds</option>
                <option value="10000">10 seconds</option>
              </select>
              <p className="text-gray-500 text-xs mt-2">
                Applies instantly across dashboards, monitoring stream, analytics charts.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Shield className="text-red-400" size={24} />
            </div>
            <h3 className="text-white text-xl font-semibold">Security</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Two-Factor Authentication</span>
              <input type="checkbox" className="toggle toggle-primary" defaultChecked />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">API Key Rotation</span>
              <input type="checkbox" className="toggle toggle-primary" />
            </label>
            <button className="btn btn-primary w-full mt-4">Change Password</button>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Palette className="text-purple-400" size={24} />
            </div>
            <h3 className="text-white text-xl font-semibold">Appearance</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Theme</label>
              <select className="select select-bordered w-full bg-gray-700 text-white">
                <option>Dark</option>
                <option>Light</option>
                <option>Auto</option>
              </select>
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Language</label>
              <select className="select select-bordered w-full bg-gray-700 text-white">
                <option>English</option>
                <option>Bengali</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Data Export */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Download className="text-yellow-400" size={24} />
            </div>
            <h3 className="text-white text-xl font-semibold">Data Export</h3>
          </div>
          <div className="space-y-3">
            <p className="text-gray-400 text-sm mb-4">
              Export your sensor data in various formats for analysis and reporting.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('csv')}
                disabled={exportLoading}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <FileText size={18} />
                <span>CSV</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('json')}
                disabled={exportLoading}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <FileJson size={18} />
                <span>JSON</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('excel')}
                disabled={exportLoading}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <FileSpreadsheet size={18} />
                <span>Excel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('pdf')}
                disabled={exportLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <FileText size={18} />
                <span>PDF Report</span>
              </motion.button>
            </div>
            {exportLoading && (
              <p className="text-gray-400 text-sm text-center">Exporting data...</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SettingsView;
