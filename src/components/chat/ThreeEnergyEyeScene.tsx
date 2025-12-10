/* eslint-disable no-restricted-syntax */
import "./shaders/EnergyEyeShader"; // Register the shader

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type CoreStatus = "idle" | "thinking" | "streaming" | "error";

interface ThreeEnergyEyeSceneProps {
  status: CoreStatus;
}

// Config maps
const STATUS_CONFIG = {
  idle: {
    colorMain: "#06b6d4", // Cyan
    colorAccent: "#8b5cf6", // Violet
    intensity: 0.2,
    speed: 0.5,
    statusVal: 0.0,
  },
  thinking: {
    colorMain: "#d946ef", // Fuchsia
    colorAccent: "#8b5cf6", // Violet
    intensity: 0.8,
    speed: 1.2,
    statusVal: 1.0,
  },
  streaming: {
    colorMain: "#3b82f6", // Blue
    colorAccent: "#06b6d4", // Cyan
    intensity: 1.0,
    speed: 2.0,
    statusVal: 2.0,
  },
  error: {
    colorMain: "#ef4444", // Red
    colorAccent: "#f97316", // Orange
    intensity: 0.6,
    speed: 3.0,
    statusVal: 3.0,
  },
};

function EyeMesh({ status }: { status: CoreStatus }) {
  const materialRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const config = STATUS_CONFIG[status];

  // Lerp targets
  const targetColorMain = useMemo(() => new THREE.Color(config.colorMain), [config.colorMain]);
  const targetColorAccent = useMemo(
    () => new THREE.Color(config.colorAccent),
    [config.colorAccent],
  );

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.u_time = state.clock.elapsedTime;

      // Smooth transitions
      materialRef.current.u_intensity = THREE.MathUtils.lerp(
        materialRef.current.u_intensity,
        config.intensity,
        delta * 2,
      );

      materialRef.current.u_status = config.statusVal;

      materialRef.current.u_colorMain.lerp(targetColorMain, delta * 2);
      materialRef.current.u_colorAccent.lerp(targetColorAccent, delta * 2);
    }

    // Subtle float/rotation of the whole eye
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      {/* @ts-ignore - EnergyEyeMaterial is extended */}
      <energyEyeMaterial
        ref={materialRef}
        transparent
        u_colorMain={targetColorMain}
        u_colorAccent={targetColorAccent}
        u_intensity={config.intensity}
        u_status={config.statusVal}
      />
    </mesh>
  );
}

function DataRings({ status }: { status: CoreStatus }) {
  const groupRef = useRef<THREE.Group>(null);
  const config = STATUS_CONFIG[status];

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate rings
      groupRef.current.rotation.z += delta * 0.1 * config.speed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Ring */}
      <mesh rotation={[1.5, 0, 0]}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshBasicMaterial color={config.colorAccent} transparent opacity={0.3} />
      </mesh>
      {/* Inner Ring - offset */}
      <mesh rotation={[1.2, 0.4, 0]}>
        <torusGeometry args={[1.65, 0.015, 16, 100]} />
        <meshBasicMaterial color={config.colorMain} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Particles({ status }: { status: CoreStatus }) {
  const pointsRef = useRef<THREE.Points>(null);
  const config = STATUS_CONFIG[status];

  // Create random particles
  const particleCount = 150;
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.0 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime;
      pointsRef.current.rotation.y = time * 0.05 * config.speed;
      // Pulse scale
      const scale = 1.0 + Math.sin(time) * 0.05;
      pointsRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={config.colorMain}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ThreeEnergyEyeScene({ status }: ThreeEnergyEyeSceneProps) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]} // Handle high DPI
    >
      <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={45} />

      {/* Scene Content */}
      <group>
        <EyeMesh status={status} />
        <DataRings status={status} />
        <Particles status={status} />
      </group>

      {/* Post Processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}
