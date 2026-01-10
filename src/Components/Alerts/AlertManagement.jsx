import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle, Clock, Filter, Info } from 'lucide-react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import { format } from 'date-fns';

function AlertManagement() {
  const { alerts, acknowledgeAlert, sensorData } = useDigitalTwinStore();
  const [filter, setFilter] = useState('all'); // all, active, acknowledged

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'active') return !alert.acknowledged;
    if (filter === 'acknowledged') return alert.acknowledged;
    return true;
  });

  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return XCircle;
      case 'warning':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl p-6 border border-red-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Alerts</p>
              <p className="text-3xl font-bold text-white">{activeAlerts.length}</p>
            </div>
            <AlertTriangle className="text-red-400" size={32} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 rounded-xl p-6 border border-yellow-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Critical</p>
              <p className="text-3xl font-bold text-white">{criticalAlerts.length}</p>
            </div>
            <XCircle className="text-yellow-400" size={32} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-600/20 to-green-500/20 rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Acknowledged</p>
              <p className="text-3xl font-bold text-white">
                {alerts.filter((a) => a.acknowledged).length}
              </p>
            </div>
            <CheckCircle2 className="text-green-400" size={32} />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter size={18} className="text-gray-400" />
        <div className="flex gap-2">
          {['all', 'active', 'acknowledged'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
            <p>No alerts found</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const SeverityIcon = getSeverityIcon(alert.severity);
            const colors = getSeverityColor(alert.severity);

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${colors} border rounded-xl p-5 ${
                  !alert.acknowledged ? 'ring-2 ring-blue-500/30' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <SeverityIcon size={24} className="mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold">{alert.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {format(new Date(alert.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                        </div>
                        {alert.source && (
                          <span>Source: {alert.source}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors ml-4"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.acknowledged && (
                    <div className="ml-4 flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle2 size={18} />
                      <span>Acknowledged</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AlertManagement;
