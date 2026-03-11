import { create } from 'zustand';

const useRealtimeStore = create((set) => ({
  connection: {
    status: 'disconnected', // disconnected | connecting | connected | error
    transport: 'socket.io',
    socketId: null,
    lastConnectedAt: null,
    lastDisconnectedAt: null,
    lastError: null,
    latencyMs: null,
    lastPingAt: null,
  },

  setStatus: (status, partial = {}) => {
    set((prev) => ({
      connection: {
        ...prev.connection,
        status,
        ...partial,
      },
    }));
  },

  setLatency: (latencyMs) => {
    const safe = Number.isFinite(latencyMs) ? Math.max(0, Math.min(60000, Math.round(latencyMs))) : null;
    set((prev) => ({
      connection: {
        ...prev.connection,
        latencyMs: safe,
        lastPingAt: new Date().toISOString(),
      },
    }));
  },
}));

export default useRealtimeStore;

