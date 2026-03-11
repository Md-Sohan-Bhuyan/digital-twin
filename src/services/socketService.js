import { io } from 'socket.io-client';
import useRealtimeStore from '../store/useRealtimeStore';
import useActivityStore from '../store/useActivityStore';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this._simulationInterval = null;
    this._latencyInterval = null;
  }

  connect(url = import.meta.env?.VITE_SOCKET_URL || 'http://localhost:3001') {
    if (this.socket?.connected) {
      return;
    }

    useRealtimeStore.getState().setStatus('connecting', {
      transport: 'socket.io',
      lastError: null,
    });
    useActivityStore.getState().addActivity({
      type: 'realtime',
      description: 'Realtime connecting…',
      severity: 'info',
    });

    this.socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      useRealtimeStore.getState().setStatus('connected', {
        socketId: this.socket.id,
        lastConnectedAt: new Date().toISOString(),
        lastError: null,
      });
      useActivityStore.getState().addActivity({
        type: 'realtime',
        description: 'Realtime connected',
        severity: 'success',
        meta: { socketId: this.socket.id },
      });
      this.startLatencyProbe();
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      useRealtimeStore.getState().setStatus('disconnected', {
        socketId: null,
        lastDisconnectedAt: new Date().toISOString(),
      });
      useActivityStore.getState().addActivity({
        type: 'realtime',
        description: 'Realtime disconnected',
        severity: 'warning',
      });
      this.stopLatencyProbe();
    });

    this.socket.on('connect_error', (error) => {
      useRealtimeStore.getState().setStatus('error', {
        lastError: error?.message || 'Connection error',
      });
      useActivityStore.getState().addActivity({
        type: 'realtime',
        description: `Realtime error: ${error?.message || 'Connection error'}`,
        severity: 'error',
      });
    });

    this.socket.on('error', (error) => {
      useRealtimeStore.getState().setStatus('error', {
        lastError: error?.message || 'Socket error',
      });
      useActivityStore.getState().addActivity({
        type: 'realtime',
        description: `Realtime socket error: ${error?.message || 'Socket error'}`,
        severity: 'error',
      });
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
    this.stopSimulation();
    this.stopLatencyProbe();
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  // Simulate sensor data for demo (remove in production)
  startSimulation(callback, { intervalMs = 2000 } = {}) {
    this.stopSimulation();
    const safeInterval = Number.isFinite(intervalMs) ? Math.max(250, Math.min(60000, Math.round(intervalMs))) : 2000;

    if (!this.socket || !this.isConnected) {
      // Fallback: Simulate data locally
      this._simulationInterval = setInterval(() => {
        const simulatedData = {
          temperature: 20 + Math.random() * 15,
          humidity: 40 + Math.random() * 30,
          pressure: 1000 + Math.random() * 50,
          vibration: Math.random() * 10,
          energy: 50 + Math.random() * 30,
          status: Math.random() > 0.9 ? 'warning' : 'operational',
        };
        callback(simulatedData);
      }, safeInterval);

      return () => this.stopSimulation();
    }

    // Real socket listener
    this.on('sensor-data', callback);
    return () => this.off('sensor-data', callback);
  }

  stopSimulation() {
    if (this._simulationInterval) {
      clearInterval(this._simulationInterval);
      this._simulationInterval = null;
    }
  }

  startLatencyProbe({ intervalMs = 5000, timeoutMs = 1200 } = {}) {
    this.stopLatencyProbe();
    if (!this.socket) return;

    const safeInterval = Number.isFinite(intervalMs) ? Math.max(1500, Math.min(30000, Math.round(intervalMs))) : 5000;
    const safeTimeout = Number.isFinite(timeoutMs) ? Math.max(300, Math.min(5000, Math.round(timeoutMs))) : 1200;

    const tick = () => {
      if (!this.socket || !this.isConnected) return;

      // Requires server to acknowledge 'dt:ping'. If not supported, we keep latency as null.
      const sentAt = Date.now();
      try {
        this.socket
          .timeout(safeTimeout)
          .emit('dt:ping', { t: sentAt }, (err) => {
            if (err) return;
            const rtt = Date.now() - sentAt;
            useRealtimeStore.getState().setLatency(rtt);
          });
      } catch {
        // ignore
      }
    };

    tick();
    this._latencyInterval = setInterval(tick, safeInterval);
  }

  stopLatencyProbe() {
    if (this._latencyInterval) {
      clearInterval(this._latencyInterval);
      this._latencyInterval = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;
