import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Box, 
  BarChart3, 
  Settings, 
  Activity,
  X,
  Menu,
  TrendingUp,
  GitCompare,
  Server,
  Bell,
  Shield,
  Users,
  MessageSquare
} from 'lucide-react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import useAuthStore, { ROLES } from '../../store/useAuthStore';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.OPERATOR, ROLES.VIEWER, ROLES.MAINTENANCE] },
  { id: '3d-view', label: '3D View', icon: Box, roles: [ROLES.ADMIN, ROLES.OPERATOR, ROLES.VIEWER, ROLES.MAINTENANCE] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: [ROLES.ADMIN, ROLES.OPERATOR, ROLES.VIEWER, ROLES.MAINTENANCE] },
  { id: 'predictive', label: 'Predictive Analytics', icon: TrendingUp, roles: [ROLES.ADMIN, ROLES.OPERATOR, ROLES.VIEWER] },
  { id: 'comparison', label: 'Data Comparison', icon: GitCompare, roles: [ROLES.ADMIN, ROLES.OPERATOR] },
  { id: 'devices', label: 'Device Management', icon: Server, roles: [ROLES.ADMIN, ROLES.OPERATOR] },
  { id: 'employees', label: 'Employee Management', icon: Users, roles: [ROLES.ADMIN] },
  { id: 'alerts-config', label: 'Alert Configuration', icon: Bell, roles: [ROLES.ADMIN, ROLES.OPERATOR] },
  { id: 'monitoring', label: 'Live Monitoring', icon: Activity, roles: [ROLES.ADMIN, ROLES.OPERATOR, ROLES.VIEWER, ROLES.MAINTENANCE] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: [ROLES.ADMIN, ROLES.OPERATOR, ROLES.VIEWER, ROLES.MAINTENANCE] },
];

function Sidebar() {
  const { uiState, setSelectedView, toggleSidebar } = useDigitalTwinStore();
  const { user } = useAuthStore();
  
  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <>
      {/* Mobile Overlay */}
      {uiState.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: uiState.sidebarOpen ? 0 : -280,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Box className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Digital Twin</h1>
              <p className="text-gray-400 text-xs">Industry Platform</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = uiState.selectedView === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setSelectedView(item.id);
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {user && (
            <div className="bg-gray-800/50 rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-4 border border-blue-500/30">
            <p className="text-white text-sm font-semibold mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-gray-400 text-xs">All Systems Operational</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;
