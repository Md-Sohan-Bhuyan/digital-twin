# Digital Twin Platform - Industry Level

একটি সম্পূর্ণ Industry Level Digital Twin Software যা React, Three.js, এবং Real-time Communication ব্যবহার করে তৈরি করা হয়েছে।

## 🚀 Features

### Frontend & Visualization
- **3D Visualization**: React Three Fiber এবং Three.js ব্যবহার করে Interactive 3D Model
- **Real-time Dashboard**: Live sensor data monitoring
- **Analytics**: Advanced data analytics এবং insights
- **Modern UI**: Tailwind CSS এবং Framer Motion দিয়ে তৈরি responsive design

### Technology Stack

#### Frontend
- **React 19** - UI Framework
- **Vite** - Build Tool
- **Three.js / React Three Fiber** - 3D Rendering
- **Zustand** - State Management
- **Socket.io Client** - Real-time Communication
- **Recharts** - Data Visualization
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

#### Backend Ready
- **Socket.io** - Real-time data streaming
- **MQTT** - IoT sensor integration (ready for backend implementation)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── 3D/
│   │   └── ModelViewer.jsx       # 3D visualization component
│   ├── Dashboard/
│   │   ├── MetricCard.jsx        # Sensor metric cards
│   │   └── DataChart.jsx         # Data visualization charts
│   ├── Layout/
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   └── Header.jsx            # Top header
│   └── Views/
│       ├── DashboardView.jsx     # Main dashboard
│       ├── AnalyticsView.jsx     # Analytics page
│       ├── MonitoringView.jsx    # Live monitoring
│       └── SettingsView.jsx      # Settings page
├── pages/
│   └── DigitalTwinPage.jsx       # Main page component
├── store/
│   └── useDigitalTwinStore.js    # Zustand state management
├── services/
│   └── socketService.js          # Socket.io service
└── routes/
    └── router.jsx                # React Router configuration
```

## 🎯 Key Features

### 1. Real-time Sensor Data
- Temperature, Humidity, Pressure, Vibration, Energy monitoring
- Live data updates via Socket.io
- Historical data tracking

### 2. 3D Visualization
- Interactive 3D machine model
- Real-time status visualization
- Orbit controls for navigation
- Dynamic color changes based on sensor data

### 3. Dashboard
- Metric cards with status indicators
- Real-time charts and graphs
- System health monitoring
- Responsive grid layout

### 4. Analytics
- Statistical analysis
- Trend visualization
- Performance insights
- Data retention management

### 5. Live Monitoring
- Real-time data stream
- Alert system
- Status indicators
- System notifications

## 🔌 Backend Integration

### Socket.io Setup
Backend এ Socket.io server setup করুন:

```javascript
// Backend example (Node.js)
const io = require('socket.io')(3001, {
  cors: { origin: "http://localhost:5173" }
});

io.on('connection', (socket) => {
  // Send sensor data
  setInterval(() => {
    socket.emit('sensor-data', {
      temperature: 20 + Math.random() * 15,
      humidity: 40 + Math.random() * 30,
      pressure: 1000 + Math.random() * 50,
      vibration: Math.random() * 10,
      energy: 50 + Math.random() * 30,
      status: 'operational'
    });
  }, 2000);
});
```

### MQTT Integration
MQTT broker এর সাথে connect করার জন্য backend এ MQTT client ব্যবহার করুন:

```javascript
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://your-broker-url');

client.on('message', (topic, message) => {
  const data = JSON.parse(message);
  io.emit('sensor-data', data);
});
```

## 🎨 Customization

### 3D Model পরিবর্তন
`src/components/3D/ModelViewer.jsx` এ আপনার নিজের 3D model load করুন:

```jsx
import { useGLTF } from '@react-three/drei';

function YourModel() {
  const { scene } = useGLTF('/path/to/your/model.glb');
  return <primitive object={scene} />;
}
```

### Sensor Data Structure
`src/store/useDigitalTwinStore.js` এ sensor data structure customize করুন।

## 📱 Responsive Design
- Mobile-friendly sidebar
- Responsive grid layouts
- Touch-friendly controls
- Adaptive charts

## 🚀 Production Deployment

```bash
# Build
npm run build

# Preview production build
npm run preview
```

## 🔐 Environment Variables
`.env` file তৈরি করুন:

```
VITE_SOCKET_URL=http://localhost:3001
VITE_MQTT_BROKER_URL=mqtt://your-broker-url
```

## 📝 License
MIT

## 👨‍💻 Development
এই project industry-level digital twin software এর জন্য তৈরি করা হয়েছে যেখানে:
- Real-time data processing
- 3D visualization
- Advanced analytics
- Scalable architecture

## 🤝 Contributing
Contributions welcome! Please feel free to submit a Pull Request.
