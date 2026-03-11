import React, { useRef, Suspense, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, PerspectiveCamera, Html, Stats } from '@react-three/drei';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import * as THREE from 'three';
import { Maximize2, Minimize2, RotateCcw, Camera, Grid3X3, Layers, Zap } from 'lucide-react';
import useToastStore from '../../store/useToastStore';

// Animated Machine Component
function MachineModel({ position = [0, 0, 0], wireframe = false }) {
  const meshRef = useRef();
  const { sensorData } = useDigitalTwinStore();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate based on vibration data
      const vibration = sensorData.vibration || 0;
      meshRef.current.rotation.y += delta * 0.5 + (vibration * 0.01);
      
      // Pulse effect based on temperature
      const tempFactor = (sensorData.temperature - 20) / 20;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * tempFactor * 0.05);
    }
  });

  // Determine color based on status
  const getColor = () => {
    if (sensorData.status === 'warning') return '#ff6b6b';
    if (sensorData.temperature > 30) return '#ffa500';
    return '#4ecdc4';
  };

  return (
    <group ref={meshRef} position={position}>
      {/* Main Machine Body */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={getColor()} metalness={0.8} roughness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Top Component */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.5, 32]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.9} roughness={0.1} wireframe={wireframe} />
      </mesh>

      {/* Side Components */}
      <mesh position={[-1.2, 1, 0]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#34495e" metalness={0.7} roughness={0.3} wireframe={wireframe} />
      </mesh>
      <mesh position={[1.2, 1, 0]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#34495e" metalness={0.7} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Base Platform */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color="#7f8c8d" wireframe={wireframe} />
      </mesh>

      {/* Status Indicator Light */}
      <pointLight
        position={[0, 2.8, 0]}
        intensity={sensorData.status === 'warning' ? 2 : 0.5}
        color={getColor()}
        distance={5}
      />
    </group>
  );
}

// Sensor Data Overlay
function SensorOverlay({ sensorData }) {
  return (
    <Html position={[0, 3.5, 0]} center>
      <div className="bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
        <div className="text-xs space-y-1">
          <div>Temp: {sensorData.temperature.toFixed(1)}°C</div>
          <div>Humidity: {sensorData.humidity.toFixed(1)}%</div>
          <div>Status: {sensorData.status}</div>
        </div>
      </div>
    </Html>
  );
}

// Main Model Viewer Component
function ModelViewer() {
  const { sensorData, modelState, resetModel } = useDigitalTwinStore();
  const pushToast = useToastStore((s) => s.pushToast);
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const canvasRef = useRef(null);

  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el || typeof document === 'undefined') return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen?.();
        pushToast({ type: 'info', title: '3D View', message: 'Entered fullscreen', durationMs: 1600 });
      } else {
        await document.exitFullscreen?.();
        pushToast({ type: 'info', title: '3D View', message: 'Exited fullscreen', durationMs: 1600 });
      }
    } catch {
      pushToast({ type: 'error', title: 'Fullscreen failed', message: 'Browser blocked fullscreen.', durationMs: 2500 });
    }
  }, [pushToast]);

  const resetView = useCallback(() => {
    resetModel();
    if (cameraRef.current) {
      cameraRef.current.position.set(8, 6, 8);
      cameraRef.current.lookAt(0, 1, 0);
      cameraRef.current.updateProjectionMatrix();
    }
    controlsRef.current?.reset?.();
    pushToast({ type: 'success', title: '3D View', message: 'View reset', durationMs: 1400 });
  }, [pushToast, resetModel]);

  const takeSnapshot = useCallback(async () => {
    try {
      const gl = canvasRef.current;
      if (!gl) return;
      const dataUrl = gl.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `digital-twin-3d-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
      a.click();
      pushToast({ type: 'success', title: 'Snapshot saved', message: 'PNG downloaded', durationMs: 1800 });
    } catch {
      pushToast({ type: 'error', title: 'Snapshot failed', message: 'Unable to export image.', durationMs: 2500 });
    }
  }, [pushToast]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
        onCreated={({ gl }) => {
          canvasRef.current = gl.domElement;
        }}
      >
        <PerspectiveCamera ref={cameraRef} makeDefault position={[8, 6, 8]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />

        {/* Environment */}
        <Environment preset="city" />

        {/* Grid */}
        {showGrid && (
          <Grid
            renderOrder={-1}
            position={[0, -0.01, 0]}
            infiniteGrid
            cellSize={0.6}
            cellThickness={0.6}
            cellColor="#6f6f6f"
            sectionSize={3.3}
            sectionThickness={1.5}
            sectionColor="#9d4b4b"
            fadeDistance={30}
          />
        )}

        {/* Machine Model */}
        <Suspense fallback={null}>
          <MachineModel position={[0, 0, 0]} wireframe={wireframe} />
          {showOverlay && <SensorOverlay sensorData={sensorData} />}
        </Suspense>

        {/* Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
        />

        {showStats && <Stats />}
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
        <div className="grid grid-cols-2 gap-2">
          <button
            data-cursor="control"
            data-cursor-tooltip="Reset camera + model"
            data-cursor-preview="Restores default orbit + view"
            onClick={resetView}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            data-cursor="control"
            data-cursor-tooltip="Snapshot"
            data-cursor-preview="Download PNG"
            onClick={takeSnapshot}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-800/70 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors border border-white/10"
          >
            <Camera size={16} />
            PNG
          </button>
          <button
            data-cursor="control"
            data-cursor-tooltip="Auto-rotate"
            data-cursor-preview={autoRotate ? 'On' : 'Off'}
            onClick={() => setAutoRotate((v) => !v)}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border ${
              autoRotate ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-200' : 'bg-gray-800/70 border-white/10 text-white'
            }`}
          >
            <Zap size={16} />
            Spin
          </button>
          <button
            data-cursor="control"
            data-cursor-tooltip="Fullscreen"
            data-cursor-preview="Immersive 3D"
            onClick={toggleFullscreen}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-800/70 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors border border-white/10"
          >
            <Maximize2 size={16} />
            Full
          </button>
          <button
            data-cursor="control"
            data-cursor-tooltip="Grid"
            data-cursor-preview={showGrid ? 'Visible' : 'Hidden'}
            onClick={() => setShowGrid((v) => !v)}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border ${
              showGrid ? 'bg-white/5 border-white/15 text-white' : 'bg-gray-900/40 border-white/10 text-gray-300'
            }`}
          >
            <Grid3X3 size={16} />
            Grid
          </button>
          <button
            data-cursor="control"
            data-cursor-tooltip="Overlay"
            data-cursor-preview={showOverlay ? 'Visible' : 'Hidden'}
            onClick={() => setShowOverlay((v) => !v)}
            className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border ${
              showOverlay ? 'bg-white/5 border-white/15 text-white' : 'bg-gray-900/40 border-white/10 text-gray-300'
            }`}
          >
            <Layers size={16} />
            HUD
          </button>
          <button
            data-cursor="control"
            data-cursor-tooltip="Wireframe"
            data-cursor-preview={wireframe ? 'On' : 'Off'}
            onClick={() => setWireframe((v) => !v)}
            className={`col-span-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border ${
              wireframe ? 'bg-purple-500/20 border-purple-500/40 text-purple-200' : 'bg-gray-800/70 border-white/10 text-white'
            }`}
          >
            <Layers size={16} />
            Wireframe
          </button>
          <button
            data-cursor="control"
            data-cursor-tooltip="Performance stats"
            data-cursor-preview={showStats ? 'Visible' : 'Hidden'}
            onClick={() => setShowStats((v) => !v)}
            className={`col-span-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border ${
              showStats ? 'bg-green-500/20 border-green-500/40 text-green-200' : 'bg-gray-900/40 border-white/10 text-gray-300'
            }`}
          >
            <Zap size={16} />
            Stats
          </button>
        </div>

        <div className="text-white text-xs space-y-1 pt-3 mt-3 border-t border-white/10">
          <div>Temp: {sensorData.temperature.toFixed(1)}°C · Vib: {sensorData.vibration.toFixed(2)}Hz</div>
          <div>Status: <span className={sensorData.status === 'warning' ? 'text-yellow-300' : 'text-green-300'}>{sensorData.status}</span></div>
          <div className="text-gray-300/70">
            Rotation: X:{modelState.rotation.x.toFixed(1)}° Y:{modelState.rotation.y.toFixed(1)}° Z:{modelState.rotation.z.toFixed(1)}°
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelViewer;
