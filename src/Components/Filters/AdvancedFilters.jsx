import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Calendar, Sliders } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';

function AdvancedFilters({ onApplyFilters }) {
  const { uiState, setFilters } = useDigitalTwinStore();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    dateRange: uiState.filters.dateRange || null,
    sensorTypes: uiState.filters.sensorTypes || [],
    statusFilter: uiState.filters.statusFilter || 'all',
    minValue: null,
    maxValue: null,
  });

  const sensorTypes = ['temperature', 'humidity', 'pressure', 'vibration', 'energy'];
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'operational', label: 'Operational' },
    { value: 'warning', label: 'Warning' },
    { value: 'critical', label: 'Critical' },
  ];

  const quickDateRanges = [
    { label: 'Last 24 Hours', value: { start: subDays(new Date(), 1), end: new Date() } },
    { label: 'Last 7 Days', value: { start: subDays(new Date(), 7), end: new Date() } },
    { label: 'Last 30 Days', value: { start: subDays(new Date(), 30), end: new Date() } },
    { label: 'Last 90 Days', value: { start: subDays(new Date(), 90), end: new Date() } },
  ];

  const handleApply = () => {
    setFilters(localFilters);
    onApplyFilters?.(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: null,
      sensorTypes: [],
      statusFilter: 'all',
      minValue: null,
      maxValue: null,
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    onApplyFilters?.(resetFilters);
  };

  const toggleSensorType = (type) => {
    setLocalFilters((prev) => ({
      ...prev,
      sensorTypes: prev.sensorTypes.includes(type)
        ? prev.sensorTypes.filter((t) => t !== type)
        : [...prev.sensorTypes, type],
    }));
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-white/10 transition-colors"
      >
        <Sliders size={18} />
        <span>Filters</span>
        {(uiState.filters.sensorTypes?.length > 0 || uiState.filters.dateRange || uiState.filters.statusFilter !== 'all') && (
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </motion.button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed right-0 top-0 h-full w-96 bg-gray-900 z-50 shadow-2xl border-l border-white/10 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter size={24} className="text-white" />
                  <h2 className="text-white text-xl font-semibold">Advanced Filters</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3 flex items-center gap-2">
                  <Calendar size={18} />
                  Date Range
                </label>
                <div className="space-y-2">
                  {quickDateRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setLocalFilters((prev) => ({ ...prev, dateRange: range.value }))}
                      className={`w-full text-left px-4 py-2 rounded-lg border transition-colors ${
                        JSON.stringify(localFilters.dateRange) === JSON.stringify(range.value)
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-gray-800 border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="date"
                      value={localFilters.dateRange?.start ? format(localFilters.dateRange.start, 'yyyy-MM-dd') : ''}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          dateRange: {
                            start: e.target.value ? startOfDay(new Date(e.target.value)) : null,
                            end: prev.dateRange?.end || null,
                          },
                        }))
                      }
                      className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={localFilters.dateRange?.end ? format(localFilters.dateRange.end, 'yyyy-MM-dd') : ''}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          dateRange: {
                            start: prev.dateRange?.start || null,
                            end: e.target.value ? endOfDay(new Date(e.target.value)) : null,
                          },
                        }))
                      }
                      className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sensor Types */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">Sensor Types</label>
                <div className="space-y-2">
                  {sensorTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={localFilters.sensorTypes.includes(type)}
                        onChange={() => toggleSensorType(type)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-white capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">Status</label>
                <select
                  value={localFilters.statusFilter}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, statusFilter: e.target.value }))}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Value Range */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">Value Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minValue || ''}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minValue: e.target.value ? parseFloat(e.target.value) : null,
                      }))
                    }
                    className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxValue || ''}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        maxValue: e.target.value ? parseFloat(e.target.value) : null,
                      }))
                    }
                    className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleApply}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

export default AdvancedFilters;
