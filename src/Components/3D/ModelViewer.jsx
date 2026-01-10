import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, PerspectiveCamera, Html } from '@react-three/drei';
import useDigitalTwinStore from '../../store/useDigitalTwinStore';
import * as THREE from 'three';

// Animated Machine Component
function MachineModel({ position = [0, 0, 0] }) {
  const meshRef = useRef();
  const { sensorData, modelState } = useDigitalTwinStore();

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
        <meshStandardMaterial color={getColor()} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top Component */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.5, 32]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Side Components */}
      <mesh position={[-1.2, 1, 0]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#34495e" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.2, 1, 0]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#34495e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Base Platform */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color="#7f8c8d" />
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

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
        
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

        {/* Machine Model */}
        <Suspense fallback={null}>
          <MachineModel position={[0, 0, 0]} />
          <SensorOverlay sensorData={sensorData} />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          autoRotate={false}
        />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <div className="space-y-2">
          <button
            onClick={resetModel}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
          >
            Reset View
          </button>
          <div className="text-white text-xs space-y-1 pt-2 border-t border-white/10">
            <div>Rotation: X:{modelState.rotation.x.toFixed(1)}°</div>
            <div>Y:{modelState.rotation.y.toFixed(1)}°</div>
            <div>Z:{modelState.rotation.z.toFixed(1)}°</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelViewer;
