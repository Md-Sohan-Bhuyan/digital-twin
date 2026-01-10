import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import useAlertConfigStore from '../../store/useAlertConfigStore';

function AlertConfiguration() {
  const { 
    alertRules, 
    addAlertRule, 
    updateAlertRule, 
    deleteAlertRule, 
    toggleAlertRule 
  } = useAlertConfigStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sensorType: 'temperature',
    condition: 'greaterThan',
    threshold: 30,
    severity: 'warning',
    enabled: true,
    notification: true,
    email: false,
  });

  const sensorTypes = ['temperature', 'humidity', 'pressure', 'vibration', 'energy'];
  const conditions = [
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'equals', label: 'Equals' },
    { value: 'outOfRange', label: 'Out of Range' },
    { value: 'inRange', label: 'In Range' },
  ];
  const severities = [
    { value: 'info', label: 'Info', icon: Info, color: 'blue' },
    { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'yellow' },
    { value: 'critical', label: 'Critical', icon: AlertCircle, color: 'red' },
  ];

  const handleAdd = () => {
    if (!formData.name) return;
    
    const rule = {
      ...formData,
      threshold: formData.condition === 'outOfRange' || formData.condition === 'inRange'
        ? { min: formData.threshold, max: formData.threshold + 10 }
        : formData.threshold,
    };
    
    addAlertRule(rule);
    setIsAdding(false);
    resetForm();
  };

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setFormData({
      name: rule.name,
      sensorType: rule.sensorType,
      condition: rule.condition,
      threshold: typeof rule.threshold === 'object' ? rule.threshold.min : rule.threshold,
      severity: rule.severity,
      enabled: rule.enabled,
      notification: rule.notification,
      email: rule.email,
    });
  };

  const handleUpdate = () => {
    if (!formData.name) return;
    
    const rule = {
      ...formData,
      threshold: formData.condition === 'outOfRange' || formData.condition === 'inRange'
        ? { min: formData.threshold, max: formData.threshold + 10 }
        : formData.threshold,
    };
    
    updateAlertRule(editingId, rule);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sensorType: 'temperature',
      condition: 'greaterThan',
      threshold: 30,
      severity: 'warning',
      enabled: true,
      notification: true,
      email: false,
    });
  };

  const getSeverityIcon = (severity) => {
    const severityObj = severities.find(s => s.value === severity);
    return severityObj ? severityObj.icon : AlertTriangle;
  };

  const getSeverityColor = (severity) => {
    const severityObj = severities.find(s => s.value === severity);
    return severityObj ? severityObj.color : 'yellow';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alert Configuration</h1>
          <p className="text-gray-400">Configure custom alerts and notifications</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <Plus size={20} />
          Add Alert Rule
        </motion.button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-white font-semibold mb-4">
            {editingId ? 'Edit Alert Rule' : 'Add New Alert Rule'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Alert Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.sensorType}
              onChange={(e) => setFormData({ ...formData, sensorType: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sensorTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {conditions.map(cond => (
                <option key={cond.value} value={cond.value}>{cond.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Threshold"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: parseFloat(e.target.value) || 0 })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {severities.map(sev => (
                <option key={sev.value} value={sev.value}>{sev.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notification}
                onChange={(e) => setFormData({ ...formData, notification: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Browser Notification</span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Email Alert</span>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <Check size={18} />
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                resetForm();
              }}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Alert Rules List */}
      <div className="space-y-4">
        {alertRules.map((rule) => {
          const SeverityIcon = getSeverityIcon(rule.severity);
          const severityColor = getSeverityColor(rule.severity);
          
          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 bg-${severityColor}-500/20 rounded-lg flex items-center justify-center`}>
                      <SeverityIcon className={`text-${severityColor}-500`} size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{rule.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {rule.sensorType} {rule.condition} {typeof rule.threshold === 'object' 
                          ? `${rule.threshold.min} - ${rule.threshold.max}`
                          : rule.threshold}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Bell size={14} />
                      {rule.notification ? 'Notifications On' : 'Notifications Off'}
                    </span>
                    {rule.email && (
                      <span className="text-blue-400">Email Alerts Enabled</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlertRule(rule.id)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {rule.enabled ? (
                      <ToggleRight className="text-green-500" size={24} />
                    ) : (
                      <ToggleLeft className="text-gray-600" size={24} />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(rule)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this alert rule?')) {
                        deleteAlertRule(rule.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {alertRules.length === 0 && (
        <div className="text-center py-12">
          <Bell className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-400">No alert rules configured. Add your first alert rule to get started.</p>
        </div>
      )}
    </div>
  );
}

export default AlertConfiguration;
