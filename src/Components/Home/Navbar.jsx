import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BarChart3, 
  Cpu, 
  Settings, 
  Bell, 
  Zap, 
  Globe,
  User,
  ChevronDown,
  Menu,
  X,
  Server,
  Wifi,
  Shield,
  Cloud,
  Battery,
  RefreshCw,
  Layers
} from 'lucide-react';

const Navbar = () => {
  const [lastUpdate, setLastUpdate] = useState('Just now');
  const [liveData, setLiveData] = useState({
    activeConnections: 1247,
    systemHealth: 98,
    latency: '12ms',
    bandwidth: '1.2 Gbps',
    temperature: '42°C',
    uptime: '99.9%'
  });
  const [notifications, setNotifications] = useState(3);
  const [time, setTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      // Add subtle pulse effect every 5 seconds
      if (new Date().getSeconds() % 5 === 0) {
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 1000);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time data updates with enhanced effects
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate('Just now');
      setLiveData(prev => ({
        activeConnections: Math.max(1000, prev.activeConnections + Math.floor(Math.random() * 20 - 10)),
        systemHealth: 95 + Math.floor(Math.random() * 6),
        latency: `${8 + Math.floor(Math.random() * 15)}ms`,
        bandwidth: `${(1 + Math.random() * 0.5).toFixed(1)} Gbps`,
        temperature: `${38 + Math.floor(Math.random() * 8)}°C`,
        uptime: `${(99.7 + Math.random() * 0.4).toFixed(1)}%`
      }));
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 800);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Dashboard', active: true, badge: 'Live' },
    { icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Monitoring', badge: '12+' },
    { icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Analytics', badge: 'AI' },
    { icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5" />, label: '3D View', badge: 'New' },
    { icon: <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Cloud Sync' },
    { icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Settings' }
  ];

  const notificationItems = [
    { id: 1, text: 'System optimization completed', time: '2 min ago', type: 'success' },
    { id: 2, text: 'New device connected to network', time: '5 min ago', type: 'info' },
    { id: 3, text: 'Security scan in progress', time: '10 min ago', type: 'warning' }
  ];

  return (
    <div className="relative font-sans">
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 pointer-events-none"></div>
      
      <nav className={`relative bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900 shadow-2xl border-b transition-all duration-300 ${
        isScrolled 
          ? 'border-blue-500/20 bg-gray-900/95 backdrop-blur-lg' 
          : 'border-blue-500/30'
      }`}>
        <div className="max-w-8xl mx-auto px-3 sm:px-5 lg:px-7 xl:px-9">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Logo Section with Animated Glow */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center shadow-2xl border border-cyan-500/20 group-hover:border-cyan-400/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl"></div>
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300 animate-spin-slow" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-gray-900 animate-ping-slow"></div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-lg sm:text-2xl font-bold bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300">
                    QuantumSync
                  </span>
                  <div className="px-1.5 py-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-md border border-green-500/30">
                    <span className="text-[10px] sm:text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-300">
                      PRO
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide">
                    REAL-TIME DIGITAL TWIN PLATFORM
                  </span>
                </div>
              </div>
            </div>

            {/* Live Dashboard - Desktop */}
            <div className="hidden xl:flex items-center space-x-5 flex-1 justify-center mx-6">
              <div className={`relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-xl border transition-all duration-500 ${
                pulseAnimation ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/10' : 'border-blue-500/20'
              }`}>
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-2.5 h-2.5 text-white" />
                    <span className="text-[10px] font-bold text-white">LIVE</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 px-5 py-2.5">
                  {[
                    { icon: <Server className="w-4 h-4 text-cyan-400" />, value: liveData.activeConnections.toLocaleString(), label: 'Nodes', color: 'text-cyan-300' },
                    { icon: <Activity className="w-4 h-4 text-emerald-400" />, value: `${liveData.systemHealth}%`, label: 'Health', color: 'text-emerald-300' },
                    { icon: <Wifi className="w-4 h-4 text-blue-400" />, value: liveData.latency, label: 'Latency', color: 'text-blue-300' },
                    { icon: <Battery className="w-4 h-4 text-green-400" />, value: liveData.uptime, label: 'Uptime', color: 'text-green-300' },
                    { icon: <Shield className="w-4 h-4 text-purple-400" />, value: liveData.bandwidth, label: 'Bandwidth', color: 'text-purple-300' },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 group">
                      <div className="p-1.5 bg-gray-800/50 rounded-lg group-hover:bg-gray-700/50 transition-colors">
                        {stat.icon}
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last Updated with Refresh */}
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-400 font-mono">
                  Updated: <span className="text-cyan-300 font-semibold">{lastUpdate}</span>
                </div>
                <button className="p-1.5 rounded-lg bg-gray-800/40 hover:bg-gray-700/60 border border-gray-700/50 hover:border-cyan-500/30 transition-all group">
                  <RefreshCw className="w-3.5 h-3.5 text-gray-400 group-hover:text-cyan-300 group-hover:rotate-180 transition-transform" />
                </button>
              </div>
            </div>

            {/* Navigation Menu - Desktop */}
            <div className="hidden lg:flex items-center space-x-0.5 bg-gradient-to-b from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-xl p-1 border border-gray-700/50 shadow-inner">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 group ${
                    item.active 
                      ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {item.active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg"></div>
                  )}
                  <div className={`transition-transform group-hover:scale-110 ${
                    item.active ? 'text-cyan-300' : 'text-gray-400 group-hover:text-cyan-300'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm tracking-wide">{item.label}</span>
                  {item.badge && (
                    <span className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badge === 'Live' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      item.badge === 'New' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden relative p-2.5 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-700/60 hover:to-gray-800/60 border border-gray-700/50 hover:border-cyan-500/30 transition-all group"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-xl transition-all"></div>
                {isMobileMenuOpen ? 
                  <X className="w-5 h-5 text-cyan-300" /> : 
                  <Menu className="w-5 h-5 text-gray-300 group-hover:text-cyan-300" />
                }
              </button>

              {/* Notifications with Dropdown */}
              <div className="relative group">
                <button className="relative p-2.5 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-700/60 hover:to-gray-800/60 border border-gray-700/50 hover:border-cyan-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-xl transition-all"></div>
                  <Bell className="w-5 h-5 text-gray-300 group-hover:text-cyan-300" />
                  {notifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-full border-2 border-gray-900 flex items-center justify-center animate-bounce">
                      <span className="text-[10px] font-bold text-white">{notifications}</span>
                    </div>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-80 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-white">Notifications</h3>
                      <span className="text-xs text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-full">3 New</span>
                    </div>
                    <div className="space-y-2">
                      {notificationItems.map(notif => (
                        <div key={notif.id} className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/60 border border-gray-700/50 transition-all cursor-pointer">
                          <div className="flex items-start space-x-3">
                            <div className={`p-1.5 rounded-lg ${
                              notif.type === 'success' ? 'bg-emerald-500/20' :
                              notif.type === 'warning' ? 'bg-yellow-500/20' :
                              'bg-blue-500/20'
                            }`}>
                              <div className={`w-2.5 h-2.5 rounded-full ${
                                notif.type === 'success' ? 'bg-emerald-400' :
                                notif.type === 'warning' ? 'bg-yellow-400' :
                                'bg-blue-400'
                              }`}></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white">{notif.text}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Time */}
              <div className="hidden lg:block text-sm font-mono bg-gradient-to-br from-gray-900/60 to-gray-800/60 px-3.5 py-2 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="text-cyan-300 font-bold tracking-wider">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-gray-400">
                    {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* User Profile with Gradient */}
              <div className="group relative">
                <div className="flex items-center space-x-2.5 sm:space-x-3 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl px-3 sm:px-4 py-2.5 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center border border-cyan-500/20">
                      <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-300" />
                    </div>
                  </div>
                  <div className="hidden xl:block">
                    <div className="text-sm font-bold text-white tracking-wide">Alexander Chen</div>
                    <div className="text-xs text-gray-300 flex items-center space-x-1">
                      <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent font-semibold">
                        Enterprise Plan
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">Admin</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-cyan-300 transition-transform group-hover:rotate-180 duration-300" />
                </div>
                
                {/* User Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Alexander Chen</div>
                        <div className="text-xs text-gray-300">alex@quantumsync.io</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {['Profile Settings', 'Team Members', 'Billing', 'API Keys', 'Audit Log'].map((item, idx) => (
                        <a key={idx} href="#" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700/50 text-sm text-gray-300 hover:text-white transition-colors">
                          <span>{item}</span>
                          {idx === 2 && <span className="text-xs bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 px-2 py-1 rounded-full">Active</span>}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800/50 shadow-2xl backdrop-blur-xl z-40 animate-slideDown">
            <div className="px-4 py-6">
              {/* Mobile Status Dashboard */}
              <div className="mb-6 p-4 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                      <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Live Dashboard</div>
                      <div className="text-xs text-gray-400">Updated: {lastUpdate}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-full">
                    REAL-TIME
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <Server className="w-4 h-4" />, value: liveData.activeConnections.toLocaleString(), label: 'Active Nodes', color: 'from-cyan-500 to-blue-500' },
                    { icon: <Activity className="w-4 h-4" />, value: `${liveData.systemHealth}%`, label: 'System Health', color: 'from-emerald-500 to-green-500' },
                    { icon: <Wifi className="w-4 h-4" />, value: liveData.latency, label: 'Network Latency', color: 'from-blue-500 to-indigo-500' },
                    { icon: <Shield className="w-4 h-4" />, value: liveData.bandwidth, label: 'Bandwidth', color: 'from-purple-500 to-pink-500' },
                  ].map((stat, idx) => (
                    <div key={idx} className="p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stat.color}/20`}>
                          <div className={`text-white`}>{stat.icon}</div>
                        </div>
                        <div className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="mb-6">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3 px-1">Navigation</div>
                <div className="space-y-1">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        item.active 
                          ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/30' 
                          : 'hover:bg-gray-800/50 border border-transparent'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg ${
                          item.active 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                            : 'bg-gray-800'
                        }`}>
                          <div className={item.active ? 'text-white' : 'text-gray-400'}>{item.icon}</div>
                        </div>
                        <span className={`font-medium ${item.active ? 'text-white' : 'text-gray-300'}`}>
                          {item.label}
                        </span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          item.badge === 'Live' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          item.badge === 'New' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile User Info */}
              <div className="p-4 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-30"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center border border-cyan-500/20">
                      <User className="w-6 h-6 text-cyan-300" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">Alexander Chen</div>
                    <div className="text-sm text-gray-300">Enterprise Administrator</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 rounded-full">
                        Verified
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Status Bar */}
        <div className="lg:hidden bg-gradient-to-r from-gray-900/95 via-gray-900/95 to-gray-900/95 border-t border-gray-800/50 backdrop-blur-lg">
          <div className="px-3 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-300">SYNC</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-xs">
                    <span className="text-gray-400">Nodes: </span>
                    <span className="text-white font-bold">{liveData.activeConnections}</span>
                  </div>
                  <div className="hidden xs:block text-xs">
                    <span className="text-gray-400">Health: </span>
                    <span className="text-emerald-300 font-bold">{liveData.systemHealth}%</span>
                  </div>
                </div>
              </div>
              <div className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-full">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .shadow-inner {
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Navbar;