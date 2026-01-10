import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Search, User, LogOut, Settings, MessageSquare } from 'lucide-react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import { motion } from 'framer-motion';

function Header({ onChatClick }) {
  const { toggleSidebar, sensorData, toggleNotificationCenter } = useDigitalTwinStore();
  const { user, logout } = useAuthStore();
  const { unreadCount, getUnreadCount } = useChatStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Update unread count
  useEffect(() => {
    if (user?.id) {
      getUnreadCount(user.id);
      const interval = setInterval(() => {
        getUnreadCount(user.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user, getUnreadCount]);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <h2 className="text-white text-xl font-semibold">Digital Twin Dashboard</h2>
            <span className="text-gray-500 text-sm">|</span>
            <span className="text-gray-400 text-sm">
              {sensorData.status === 'operational' ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Operational
                </span>
              ) : (
                <span className="flex items-center gap-2 text-yellow-500">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  Warning
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-800/50 rounded-lg px-4 py-2 border border-white/10">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm w-48"
            />
          </div>

          {/* Messages */}
          {onChatClick && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onChatClick}
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
              <MessageSquare size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>
          )}

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleNotificationCenter}
            className="relative p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Bell size={20} />
            {sensorData.status === 'warning' && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </motion.button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white"
            >
              <User size={20} />
            </motion.button>
            
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-white/10 overflow-hidden z-50"
              >
                {user && (
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white font-semibold text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs capitalize">{user.role}</p>
                  </div>
                )}
                <div className="p-1">
                  <button
                    onClick={() => {
                      useDigitalTwinStore.getState().setSelectedView('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded text-sm transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
