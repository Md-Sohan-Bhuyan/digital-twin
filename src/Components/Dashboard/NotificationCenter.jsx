import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import { format } from 'date-fns';

const iconMap = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-500/20 border-green-500/50 text-green-400',
  warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  error: 'bg-red-500/20 border-red-500/50 text-red-400',
  info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
};

function NotificationCenter() {
  const { uiState, notifications, toggleNotificationCenter, markNotificationAsRead, clearNotifications } = useDigitalTwinStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {uiState.notificationCenterOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={toggleNotificationCenter}
          />
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-gray-900/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-white" size={24} />
                <div>
                  <h2 className="text-white font-bold text-lg">Notifications</h2>
                  {unreadCount > 0 && (
                    <p className="text-gray-400 text-xs">{unreadCount} unread</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={toggleNotificationCenter}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Bell size={48} className="mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = iconMap[notification.type] || Info;
                  const colors = colorMap[notification.type] || colorMap.info;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        notification.read
                          ? 'bg-gray-800/30 border-white/5'
                          : `${colors} border`
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={20} className="mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                            {notification.title}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {notification.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            {format(new Date(notification.timestamp), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificationCenter;
