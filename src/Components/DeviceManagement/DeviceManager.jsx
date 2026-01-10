import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Settings,
  Activity,
  MapPin,
  Calendar
} from 'lucide-react';
import useDeviceStore from '../../store/useDeviceStore';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';

function DeviceManager() {
  const { devices, addDevice, updateDevice, deleteDevice, setSelectedDevice, selectedDeviceId } = useDeviceStore();
  const { updateSensorData } = useDigitalTwinStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'manufacturing',
    location: '',
    metadata: {
      manufacturer: '',
      model: '',
      serialNumber: '',
    },
  });

  const handleAdd = () => {
    if (!formData.name || !formData.location) return;
    
    const deviceId = addDevice(formData);
    setSelectedDevice(deviceId);
    setIsAdding(false);
    setFormData({
      name: '',
      type: 'manufacturing',
      location: '',
      metadata: {
        manufacturer: '',
        model: '',
        serialNumber: '',
      },
    });
  };

  const handleEdit = (device) => {
    setEditingId(device.id);
    setFormData({
      name: device.name,
      type: device.type,
      location: device.location,
      metadata: device.metadata || {},
    });
  };

  const handleUpdate = () => {
    if (!formData.name || !formData.location) return;
    updateDevice(editingId, formData);
    setEditingId(null);
    setFormData({
      name: '',
      type: 'manufacturing',
      location: '',
      metadata: {},
    });
  };

  const handleDelete = (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      deleteDevice(deviceId);
    }
  };

  const handleSelectDevice = (deviceId) => {
    setSelectedDevice(deviceId);
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      updateSensorData(device.sensorData);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Device Management</h1>
          <p className="text-gray-400">Manage and monitor all connected devices</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <Plus size={20} />
          Add Device
        </motion.button>
      </div>

      {/* Add Device Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-white font-semibold mb-4">Add New Device</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Device Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="manufacturing">Manufacturing</option>
              <option value="quality">Quality Control</option>
              <option value="packaging">Packaging</option>
              <option value="storage">Storage</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Manufacturer"
              value={formData.metadata.manufacturer}
              onChange={(e) => setFormData({
                ...formData,
                metadata: { ...formData.metadata, manufacturer: e.target.value }
              })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <Check size={18} />
              Add
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-gray-800/50 rounded-xl p-6 border ${
              selectedDeviceId === device.id
                ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                : 'border-white/10'
            } hover:border-blue-500/50 transition-all cursor-pointer`}
            onClick={() => handleSelectDevice(device.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">{device.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <MapPin size={14} />
                  {device.location}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    device.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                  } animate-pulse`} />
                  <span className="text-xs text-gray-400 capitalize">{device.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(device);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(device.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white capitalize">{device.type}</span>
              </div>
              {device.metadata?.model && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Model:</span>
                  <span className="text-white">{device.metadata.model}</span>
                </div>
              )}
              {device.lastUpdate && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={12} />
                  {new Date(device.lastUpdate).toLocaleString()}
                </div>
              )}
            </div>

            {selectedDeviceId === device.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Temperature:</span>
                    <span className="text-white ml-2">{device.sensorData?.temperature?.toFixed(1)}°C</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Humidity:</span>
                    <span className="text-white ml-2">{device.sensorData?.humidity?.toFixed(1)}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {devices.length === 0 && (
        <div className="text-center py-12">
          <Activity className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-400">No devices found. Add your first device to get started.</p>
        </div>
      )}
    </div>
  );
}

export default DeviceManager;
