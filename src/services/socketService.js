import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(url = 'http://localhost:3001') {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
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
  startSimulation(callback) {
    if (!this.socket || !this.isConnected) {
      // Fallback: Simulate data locally
      const interval = setInterval(() => {
        const simulatedData = {
          temperature: 20 + Math.random() * 15,
          humidity: 40 + Math.random() * 30,
          pressure: 1000 + Math.random() * 50,
          vibration: Math.random() * 10,
          energy: 50 + Math.random() * 30,
          status: Math.random() > 0.9 ? 'warning' : 'operational',
        };
        callback(simulatedData);
      }, 2000);

      return () => clearInterval(interval);
    }

    // Real socket listener
    this.on('sensor-data', callback);
    return () => this.off('sensor-data', callback);
  }
}

const socketService = new SocketService();
export default socketService;
