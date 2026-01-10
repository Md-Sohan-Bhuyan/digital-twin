import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  MessageSquare,
  Settings,
  BarChart3,
  Server,
  Clock,
  MapPin
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useEmployeeStore from '../../store/useEmployeeStore';
import useDeviceStore from '../../store/useDeviceStore';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import useChatStore from '../../store/useChatStore';
import useActivityStore from '../../store/useActivityStore';
import { format } from 'date-fns';
import { playNotificationSound, timeAgo } from '../../utils/realtimeUtils';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  const { user } = useAuthStore();
  const { employees, getActiveAssignments, sectors } = useEmployeeStore();
  const { devices } = useDeviceStore();
  const { sensorData, historicalData, alerts, notifications, performanceMetrics } = useDigitalTwinStore();
  const { conversations, unreadCount } = useChatStore();
  const { addActivity, getFilteredActivities, getActivityStats } = useActivityStore();
  const [selectedView, setSelectedView] = useState('overview');
  const [liveStats, setLiveStats] = useState({
    totalProduction: 0,
    efficiency: 98,
    uptime: 99.8,
    activeShifts: 2,
  });

  const onlineEmployees = employees.filter((e) => e.status === 'online').length;
  const activeAssignments = getActiveAssignments();
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && !a.acknowledged);
  const operationalDevices = devices.filter((d) => d.status === 'operational').length;
  const activities = getFilteredActivities().slice(0, 10);
  const activityStats = getActivityStats('24h');

  // Real-time updates and activity logging
  useEffect(() => {
    // Log admin login activity
    addActivity({
      type: 'login',
      userId: user?.id,
      userName: user?.name,
      description: `${user?.name} logged in to admin dashboard`,
      severity: 'info',
    });

    // Real-time stats updates
    const statsInterval = setInterval(() => {
      setLiveStats((prev) => ({
        totalProduction: prev.totalProduction + Math.floor(Math.random() * 10),
        efficiency: Math.max(95, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 0.5)),
        uptime: Math.max(98, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
        activeShifts: prev.activeShifts,
      }));

      // Log activity updates
      if (Math.random() > 0.8) {
        addActivity({
          type: 'system',
          userId: user?.id,
          userName: user?.name,
          description: 'System metrics updated',
          severity: 'info',
        });
      }
    }, 3000); // Update every 3 seconds

    // Real-time employee status updates
    const employeeInterval = setInterval(() => {
      useEmployeeStore.getState().employees.forEach((emp) => {
        if (emp.status === 'online' && Math.random() > 0.95) {
          useEmployeeStore.getState().updateEmployeeStatus(emp.id, 'online');
          addActivity({
            type: 'employee',
            userId: emp.id,
            userName: emp.name,
            description: `${emp.name} status updated`,
            severity: 'info',
          });
        }
      });
    }, 5000);

    // Check for critical alerts and play sound
    const alertInterval = setInterval(() => {
      const currentAlerts = useDigitalTwinStore.getState().alerts;
      const newCriticalAlerts = currentAlerts.filter(
        (a) => a.severity === 'critical' && !a.acknowledged && 
        new Date(a.timestamp) > new Date(Date.now() - 5000) // Last 5 seconds
      );
      
      if (newCriticalAlerts.length > 0) {
        playNotificationSound('alert');
      }
    }, 2000);

    // Real-time notification updates
    const notificationInterval = setInterval(() => {
      const recentNotifications = useDigitalTwinStore.getState().notifications.slice(0, 1);
      recentNotifications.forEach((notif) => {
        if (new Date(notif.timestamp) > new Date(Date.now() - 3000)) {
          playNotificationSound('message');
        }
      });
    }, 3000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(employeeInterval);
      clearInterval(alertInterval);
      clearInterval(notificationInterval);
    };
  }, [user, addActivity]);

  const stats = [
    {
      label: 'Total Employees',
      value: employees.length,
      icon: Users,
      color: 'blue',
      change: '+2 this month',
    },
    {
      label: 'Online Now',
      value: onlineEmployees,
      icon: Activity,
      color: 'green',
      change: `${((onlineEmployees / employees.length) * 100).toFixed(0)}% active`,
    },
    {
      label: 'Active Assignments',
      value: activeAssignments.length,
      icon: MapPin,
      color: 'purple',
      change: `${devices.length - activeAssignments.length} machines available`,
    },
    {
      label: 'Critical Alerts',
      value: criticalAlerts.length,
      icon: AlertTriangle,
      color: 'red',
      change: criticalAlerts.length > 0 ? 'Action required' : 'All clear',
    },
    {
      label: 'Operational Devices',
      value: operationalDevices,
      icon: Server,
      color: 'blue',
      change: `${((operationalDevices / devices.length) * 100).toFixed(0)}% operational`,
    },
    {
      label: 'Unread Messages',
      value: unreadCount,
      icon: MessageSquare,
      color: 'yellow',
      change: `${conversations.length} conversations`,
    },
    {
      label: 'Production Today',
      value: liveStats.totalProduction,
      icon: TrendingUp,
      color: 'green',
      change: '+5.2% from yesterday',
    },
    {
      label: 'System Efficiency',
      value: `${liveStats.efficiency.toFixed(1)}%`,
      icon: BarChart3,
      color: 'blue',
      change: liveStats.efficiency > 98 ? 'Optimal' : 'Good',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-400">
          Welcome back, {user?.name}. Monitor and manage all operations in real-time.
        </p>
      </motion.div>

      {/* Real-time Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-500/30 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-white font-semibold">Live</span>
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-400 text-sm">
            Last updated: {format(new Date(), 'HH:mm:ss')}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-400">Uptime: </span>
            <span className="text-white font-semibold">{liveStats.uptime.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-gray-400">Efficiency: </span>
            <span className="text-green-400 font-semibold">{liveStats.efficiency.toFixed(1)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-500/20 rounded-lg`}>
                  <Icon className={`text-${stat.color}-400`} size={24} />
                </div>
                <div className="text-right">
                  <motion.div
                    key={stat.value}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-bold text-white"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-gray-400 mt-1">{stat.change}</div>
                </div>
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
              {(stat.label.includes('Production') || stat.label.includes('Efficiency')) && (
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                  <motion.div
                    className="bg-green-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${typeof stat.value === 'number' ? Math.min(100, stat.value / 100 * 100) : parseFloat(stat.value.replace('%', ''))}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Assignments */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <MapPin size={20} />
              Active Assignments
            </h2>
            <span className="text-gray-400 text-sm">
              {activeAssignments.length} active
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activeAssignments.length > 0 ? (
              activeAssignments.map((assignment) => {
                const employee = employees.find((e) => e.id === assignment.employeeId);
                const device = devices.find((d) => d.id === assignment.machineId);
                const sector = sectors.find((s) => s.id === assignment.sectorId);
                return (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-900/50 rounded-lg p-4 border border-white/5 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            employee?.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                          }`} />
                          <span className="text-white font-semibold">{employee?.name}</span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-400 text-sm">{employee?.role}</span>
                        </div>
                        <div className="text-gray-400 text-sm mb-1">
                          <span className="text-blue-400">{device?.name}</span>
                          <span className="mx-2">•</span>
                          <span className="text-purple-400">{sector?.name}</span>
                        </div>
                        <div className="text-gray-500 text-xs">
                          Task: {assignment.task}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          Started: {format(new Date(assignment.startTime), 'MMM dd, HH:mm')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 mb-1">Duration</div>
                        <div className="text-white font-semibold">
                          {Math.floor((Date.now() - new Date(assignment.startTime).getTime()) / 3600000)}h
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                No active assignments
              </div>
            )}
          </div>
        </motion.div>

        {/* Real-time Activity & Alerts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Activity Feed */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <Activity size={20} />
                Live Activity Feed
              </h2>
              <div className="text-xs text-gray-400">
                {activityStats.total} today
              </div>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-900/50 rounded-lg p-3 border border-white/5"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                        activity.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{activity.description}</div>
                        <div className="text-gray-400 text-xs mt-1">
                          {activity.userName} • {activity.type}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {timeAgo(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No recent activity
                </div>
              )}
            </div>
          </div>

          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <div className="bg-red-600/20 rounded-xl p-6 border border-red-500/30">
              <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={20} />
                Critical Alerts ({criticalAlerts.length})
              </h3>
              <div className="space-y-2">
                {criticalAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="bg-red-900/30 rounded-lg p-3 border border-red-500/20">
                    <div className="text-white text-sm font-medium">{alert.ruleName}</div>
                    <div className="text-red-200 text-xs mt-1">{alert.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Performance Metrics Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
      >
        <h2 className="text-white font-semibold text-lg mb-4">Real-time Performance Metrics</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData.slice(-20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                name="Temperature"
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Humidity"
              />
              <Area
                type="monotone"
                dataKey="vibration"
                stroke="#eab308"
                fill="#eab308"
                fillOpacity={0.3}
                name="Vibration"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-white/10"
      >
        <h2 className="text-white font-semibold text-lg mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Sectors</div>
            <div className="text-2xl font-bold text-white">{sectors.length}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Machines</div>
            <div className="text-2xl font-bold text-white">{devices.length}</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">System Health</div>
            <div className="text-2xl font-bold text-green-400">
              {sensorData.status === 'operational' ? '98%' : '85%'}
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Data Points</div>
            <div className="text-2xl font-bold text-white">{historicalData.length}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
