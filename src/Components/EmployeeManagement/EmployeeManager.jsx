import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  UserPlus,
  Building
} from 'lucide-react';
import useEmployeeStore from '../../store/useEmployeeStore';
import useDeviceStore from '../../store/useDeviceStore';
import { format } from 'date-fns';

function EmployeeManager() {
  const { 
    employees, 
    sectors, 
    assignments,
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    assignEmployeeToMachine,
    unassignEmployee,
    getEmployeeByMachine,
  } = useEmployeeStore();
  const { devices } = useDeviceStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'operator',
    department: '',
    sector: '',
    phone: '',
    shift: 'Day',
    location: '',
    skills: [],
  });

  const handleAdd = () => {
    if (!formData.name || !formData.email) return;
    addEmployee(formData);
    setIsAdding(false);
    resetForm();
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      sector: employee.sector,
      phone: employee.phone,
      shift: employee.shift,
      location: employee.location,
      skills: employee.skills || [],
    });
  };

  const handleUpdate = () => {
    if (!formData.name || !formData.email) return;
    updateEmployee(editingId, formData);
    setEditingId(null);
    resetForm();
  };

  const handleAssign = (employeeId) => {
    setAssigningId(employeeId);
  };

  const handleAssignConfirm = (machineId, sectorId, task) => {
    assignEmployeeToMachine(assigningId, machineId, sectorId, task);
    setAssigningId(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'operator',
      department: '',
      sector: '',
      phone: '',
      shift: 'Day',
      location: '',
      skills: [],
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Employee Management</h1>
          <p className="text-gray-400">Manage employees, assignments, and sectors</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <UserPlus size={20} />
          Add Employee
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
            {editingId ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="operator">Operator</option>
              <option value="maintenance">Maintenance</option>
              <option value="supervisor">Supervisor</option>
            </select>
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Sector</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.name}>{sector.name}</option>
              ))}
            </select>
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Day">Day Shift</option>
              <option value="Night">Night Shift</option>
              <option value="Flexible">Flexible</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => {
          const assignment = assignments.find(
            (a) => a.employeeId === employee.id && a.status === 'active'
          );
          const assignedDevice = assignment ? devices.find((d) => d.id === assignment.machineId) : null;
          
          return (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {employee.name.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900 ${
                      employee.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{employee.name}</h3>
                    <p className="text-gray-400 text-sm capitalize">{employee.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this employee?')) {
                        deleteEmployee(employee.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail size={14} />
                  <span className="text-white">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone size={14} />
                  <span className="text-white">{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Building size={14} />
                  <span className="text-white">{employee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={14} />
                  <span className="text-white">{employee.sector}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={14} />
                  <span className="text-white">{employee.shift} Shift</span>
                </div>
              </div>

              {assignment && assignedDevice && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Current Assignment</div>
                  <div className="text-sm text-blue-400 font-medium">{assignedDevice.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Task: {assignment.task}
                  </div>
                </div>
              )}

              {!assignment && (
                <button
                  onClick={() => handleAssign(employee.id)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Assign to Machine
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Assignment Modal */}
      {assigningId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-white/10"
          >
            <h3 className="text-white font-semibold mb-4">Assign Employee to Machine</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Select Machine</label>
                <select
                  id="machine-select"
                  className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Machine</option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name} - {device.location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Select Sector</label>
                <select
                  id="sector-select"
                  className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Sector</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name} - {sector.location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Task Description</label>
                <input
                  type="text"
                  id="task-input"
                  placeholder="Enter task description"
                  className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  const machineId = document.getElementById('machine-select').value;
                  const sectorId = document.getElementById('sector-select').value;
                  const task = document.getElementById('task-input').value;
                  if (machineId && sectorId && task) {
                    handleAssignConfirm(machineId, sectorId, task);
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Assign
              </button>
              <button
                onClick={() => setAssigningId(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default EmployeeManager;
