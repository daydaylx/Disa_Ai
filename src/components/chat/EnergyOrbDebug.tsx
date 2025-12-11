import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Simple test to verify Three.js is working
function SimpleTestMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={0x00e5ff} toneMapped={false} />
    </mesh>
  );
}

export function EnergyOrbDebug() {
  return (
    <div className="w-full h-64 bg-gray-900">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <SimpleTestMesh />
      </Canvas>
    </div>
  );
}
