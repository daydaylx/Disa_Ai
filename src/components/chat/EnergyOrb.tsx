import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";

export type CoreStatus = "idle" | "thinking" | "streaming" | "error";

interface EnergyOrbProps {
  status: CoreStatus;
  modelName: string;
  toneLabel: string;
  creativityLabel: string;
  lastErrorMessage?: string;
}

// Color palette - Tailwind color values for Three.js
// Note: Three.js requires hex colors, so we use the Tailwind palette values
const COLORS = {
  cyan400: 0x22d3ee,
  violet400: 0xa78bfa,
  fuchsia400: 0xe879f9,
  purple400: 0xc084fc,
  blue400: 0x60a5fa,
  sky400: 0x38bdf8,
  red400: 0xf87171,
  orange400: 0xfb923c,
} as const;

// Status-based configuration
const STATUS_CONFIG = {
  idle: {
    color: new THREE.Color(COLORS.cyan400),
    accentColor: new THREE.Color(COLORS.violet400),
    emissiveIntensity: 0.4,
    rotationSpeed: 0.3,
    particleSpeed: 0.5,
    glowIntensity: 0.3,
    lightningActive: false,
  },
  thinking: {
    color: new THREE.Color(COLORS.fuchsia400),
    accentColor: new THREE.Color(COLORS.purple400),
    emissiveIntensity: 0.7,
    rotationSpeed: 1.0,
    particleSpeed: 1.2,
    glowIntensity: 0.6,
    lightningActive: true,
  },
  streaming: {
    color: new THREE.Color(COLORS.blue400),
    accentColor: new THREE.Color(COLORS.sky400),
    emissiveIntensity: 0.9,
    rotationSpeed: 1.5,
    particleSpeed: 2.0,
    glowIntensity: 0.8,
    lightningActive: true,
  },
  error: {
    color: new THREE.Color(COLORS.red400),
    accentColor: new THREE.Color(COLORS.orange400),
    emissiveIntensity: 0.6,
    rotationSpeed: 0.1,
    particleSpeed: 0.3,
    glowIntensity: 0.5,
    lightningActive: true,
  },
};

// Core Sphere with Glow
function CoreSphere({ status }: { status: CoreStatus }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = STATUS_CONFIG[status];

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * config.rotationSpeed;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={config.color}
        emissive={config.color}
        emissiveIntensity={config.emissiveIntensity}
        roughness={0.3}
        metalness={0.8}
        toneMapped={false}
      />
    </mesh>
  );
}

// Orbital Rings
function OrbitalRings({ status }: { status: CoreStatus }) {
  const groupRef = useRef<THREE.Group>(null);
  const config = STATUS_CONFIG[status];

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.2 * config.rotationSpeed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.03, 16, 100]} />
        <meshStandardMaterial
          color={config.accentColor}
          emissive={config.accentColor}
          emissiveIntensity={config.emissiveIntensity * 0.5}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>

      {/* Inner Ring - Tilted */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.3, 0.025, 16, 100]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={config.emissiveIntensity * 0.6}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Floating Particles
function Particles({ status }: { status: CoreStatus }) {
  const pointsRef = useRef<THREE.Points>(null);
  const config = STATUS_CONFIG[status];

  // Generate particle positions
  const particleCount = 60;
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.1 * config.particleSpeed;
      pointsRef.current.rotation.x += delta * 0.05 * config.particleSpeed;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={config.accentColor}
        transparent
        opacity={0.8}
        toneMapped={false}
      />
    </points>
  );
}

// Lightning Bolts (Simple Lines)
function Lightning({ status }: { status: CoreStatus }) {
  const groupRef = useRef<THREE.Group>(null);
  const config = STATUS_CONFIG[status];

  const bolts = useMemo(() => {
    if (!config.lightningActive) return [];
    const boltCount = 8;
    const bolts = [];

    for (let i = 0; i < boltCount; i++) {
      const points = [];
      const startRadius = 1.2;
      const endRadius = 2.0;
      const angle = (i / boltCount) * Math.PI * 2;

      // Start point (on sphere)
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * startRadius,
          Math.sin(angle) * startRadius,
          (Math.random() - 0.5) * 0.5,
        ),
      );

      // Mid point (jagged)
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * ((startRadius + endRadius) / 2) + (Math.random() - 0.5) * 0.3,
          Math.sin(angle) * ((startRadius + endRadius) / 2) + (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.8,
        ),
      );

      // End point
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * endRadius + (Math.random() - 0.5) * 0.2,
          Math.sin(angle) * endRadius + (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.3,
        ),
      );

      bolts.push(points);
    }

    return bolts;
  }, [config.lightningActive]);

  useFrame((state) => {
    if (groupRef.current && config.lightningActive) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      // Flicker effect
      groupRef.current.visible = Math.random() > 0.3;
    }
  });

  // Don't render if lightning is not active
  if (bolts.length === 0) return null;

  return (
    <group ref={groupRef}>
      {bolts.map((points, i) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const boltPoints = curve.getPoints(20);
        const geometry = new THREE.BufferGeometry().setFromPoints(boltPoints);

        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial
              color={config.color}
              transparent
              opacity={0.6}
              linewidth={2}
              toneMapped={false}
            />
          </line>
        );
      })}
    </group>
  );
}

// Main Scene
function Scene({ status }: { status: CoreStatus }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      <CoreSphere status={status} />
      <OrbitalRings status={status} />
      <Particles status={status} />
      <Lightning status={status} />

      <EffectComposer>
        <Bloom
          intensity={STATUS_CONFIG[status].glowIntensity}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}

// Main Component
export function EnergyOrb({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: EnergyOrbProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-8 pt-4 w-full animate-fade-in">
      {/* 3D Canvas Container */}
      <motion.div
        className={cn(
          "relative flex items-center justify-center",
          "w-[clamp(200px,45vw,280px)] h-[clamp(200px,45vw,280px)]",
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-3xl opacity-40 transition-all duration-1000",
            status === "error"
              ? "bg-red-500/60"
              : status === "thinking"
                ? "bg-fuchsia-500/60"
                : status === "streaming"
                  ? "bg-blue-500/60"
                  : "bg-cyan-500/60",
          )}
        />

        {/* 3D Canvas */}
        <Canvas
          className="w-full h-full"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Scene status={status} />
        </Canvas>
      </motion.div>

      {/* Text Content */}
      <div className="text-center space-y-2 max-w-sm px-4">
        <motion.h2
          className="text-xl font-semibold text-ink-primary"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {status === "error" ? "Ein Fehler ist aufgetreten" : "Was kann ich für dich tun?"}
        </motion.h2>

        <motion.p
          className="text-sm text-ink-secondary"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {status === "error" && lastErrorMessage
            ? lastErrorMessage
            : "Tippe unten eine Frage ein oder wähle einen der Vorschläge."}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wider text-ink-tertiary mt-2 pt-2 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.3 }}
        >
          <span
            className={cn(
              "font-medium transition-colors duration-500",
              status === "streaming" || status === "thinking" ? "text-accent-chat" : "",
            )}
          >
            {status === "idle"
              ? "Bereit"
              : status === "error"
                ? "Fehler"
                : status === "streaming"
                  ? "Antwortet..."
                  : "Denkt nach..."}
          </span>
          <span>•</span>
          <span className="truncate max-w-[80px] sm:max-w-[120px]">{modelName}</span>
          <span>•</span>
          <span>{toneLabel}</span>
          <span>•</span>
          <span>{creativityLabel}</span>
        </motion.div>
      </div>
    </div>
  );
}
