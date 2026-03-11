import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, TriangleAlert, Wifi } from 'lucide-react';
import useRealtimeStore from '../../store/useRealtimeStore';
import socketService from '../../services/socketService';
import useToastStore from '../../store/useToastStore';

function ConnectionBanner() {
  const { connection } = useRealtimeStore();
  const pushToast = useToastStore((s) => s.pushToast);
  const [attempt, setAttempt] = useState(0);

  const visible = connection.status !== 'connected';

  const meta = useMemo(() => {
    if (connection.status === 'connecting') {
      return {
        icon: RefreshCw,
        title: 'Connecting to realtime…',
        message: 'We are restoring live updates. You can keep working.',
        tone: 'border-blue-500/40 bg-blue-500/10',
        spin: true,
      };
    }
    if (connection.status === 'error') {
      return {
        icon: TriangleAlert,
        title: 'Realtime connection error',
        message: connection.lastError || 'Unable to connect. Check server/network and retry.',
        tone: 'border-red-500/40 bg-red-500/10',
        spin: false,
      };
    }
    return {
      icon: WifiOff,
      title: 'Realtime disconnected',
      message: 'Live updates paused. Retry to reconnect.',
      tone: 'border-yellow-500/40 bg-yellow-500/10',
      spin: false,
    };
  }, [connection.lastError, connection.status]);

  useEffect(() => {
    // When we recover, show a small toast.
    if (connection.status === 'connected') {
      pushToast({
        type: 'success',
        title: 'Realtime connected',
        message: connection.socketId ? `Socket: ${connection.socketId}` : 'Live updates resumed.',
        durationMs: 2200,
      });
    }
  }, [connection.socketId, connection.status, pushToast]);

  const onRetry = () => {
    setAttempt((a) => a + 1);
    pushToast({
      type: 'info',
      title: 'Reconnecting…',
      message: 'Trying to restore realtime updates.',
      durationMs: 1800,
    });
    socketService.disconnect();
    socketService.connect();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`${connection.status}-${attempt}`}
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="fixed left-1/2 top-3 z-[90] -translate-x-1/2 w-[min(760px,calc(100vw-1.5rem))]"
        >
          <div className={`backdrop-blur-xl border rounded-2xl shadow-2xl ${meta.tone}`}>
            <div className="px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <meta.icon className={meta.spin ? 'animate-spin' : ''} size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{meta.title}</div>
                  <div className="text-xs text-gray-200/80 truncate">{meta.message}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {connection.status !== 'connecting' ? (
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-3 py-2 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Retry
                  </button>
                ) : null}
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-200/80">
                  <Wifi size={14} />
                  <span className="capitalize">{connection.status}</span>
                  {connection.latencyMs != null ? <span>· {connection.latencyMs}ms</span> : null}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConnectionBanner;

