import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import { format } from 'date-fns';

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: 'text-green-400 bg-green-500/10 border-green-500/30',
  warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  error: 'text-red-400 bg-red-500/10 border-red-500/30',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
};

function NotificationCenter() {
  const { uiState, notifications, markNotificationAsRead, clearNotifications, toggleNotificationCenter } = useDigitalTwinStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!uiState.notificationCenterOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4"
        onClick={toggleNotificationCenter}
      >
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl w-full max-w-md h-[90vh] flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bell className="text-blue-400" size={20} />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">Notifications</h2>
                <p className="text-gray-400 text-xs">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={toggleNotificationCenter}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${colors} border rounded-lg p-4 cursor-pointer hover:scale-[1.02] transition-transform ${
                      !notification.read ? 'ring-2 ring-blue-500/50' : ''
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon size={20} className="mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm mb-1">{notification.title}</p>
                        <p className="text-gray-300 text-xs mb-2">{notification.message}</p>
                        <p className="text-gray-500 text-xs">
                          {format(new Date(notification.timestamp), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default NotificationCenter;
