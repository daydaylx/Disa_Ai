/* eslint-disable no-restricted-syntax */
import "./shaders/EnergyEyeShader";

import { PerspectiveCamera, shaderMaterial, Trail } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

import type { CoreStatus } from "@/types/orb";

type StatusTheme = {
  main: string;
  iris: string;
  edge: string;
  glow: number;
  intensity: number;
  ringSpeed: number;
  particleSpeed: number;
  shock: number;
  chroma: number;
  background: string;
};

const STATUS_VALUE: Record<CoreStatus, number> = {
  idle: 0,
  thinking: 1,
  streaming: 2,
  error: 3,
};

const STATUS_THEME: Record<CoreStatus, StatusTheme> = {
  idle: {
    main: "#60e6ff",
    iris: "#c084fc",
    edge: "#7dd3fc",
    glow: 0.8,
    intensity: 0.45,
    ringSpeed: 0.18,
    particleSpeed: 0.22,
    shock: 0.05,
    chroma: 0.001,
    background: "#050515",
  },
  thinking: {
    main: "#f472ff",
    iris: "#c084fc",
    edge: "#93c5fd",
    glow: 1.0,
    intensity: 0.8,
    ringSpeed: 0.32,
    particleSpeed: 0.55,
    shock: 0.15,
    chroma: 0.0017,
    background: "#07071c",
  },
  streaming: {
    main: "#7ad7ff",
    iris: "#60a5fa",
    edge: "#d946ef",
    glow: 1.25,
    intensity: 1.25,
    ringSpeed: 0.64,
    particleSpeed: 1.05,
    shock: 0.45,
    chroma: 0.0025,
    background: "#06081a",
  },
  error: {
    main: "#ff8b60",
    iris: "#ff4d6d",
    edge: "#ffb347",
    glow: 0.95,
    intensity: 0.95,
    ringSpeed: 0.82,
    particleSpeed: 0.48,
    shock: 0.25,
    chroma: 0.0033,
    background: "#17070b",
  },
};

const PARTICLE_COUNT = 360;

const SparkMaterial = shaderMaterial(
  {
    u_time: 0,
    u_status: 0,
    u_color: new THREE.Color("#9ad8ff"),
    u_gain: 1,
  },
  /* glsl */ `
    attribute float aTheta;
    attribute float aRadius;
    attribute float aSpeed;
    varying float vAlpha;

    uniform float u_time;
    uniform float u_status;
    uniform float u_gain;

    void main() {
      float t = u_time * aSpeed * (0.4 + u_status * 0.2);
      float radius = aRadius + sin(t * 1.3 + aTheta * 1.7) * 0.08 * (0.6 + u_gain);

      vec3 pos = vec3(
        cos(aTheta + t * 0.8) * radius,
        sin(aTheta * 1.2 + t * 0.6) * radius * 0.28,
        sin(aTheta + t * 0.5) * radius * 0.48
      );

      vAlpha = 0.35 + 0.45 * sin(t + aTheta * 1.5);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = (9.0 + u_status * 3.0) * (1.0 / -mvPosition.z) * (1.2 + u_gain * 0.4);
    }
  `,
  /* glsl */ `
    varying float vAlpha;
    uniform vec3 u_color;

    void main() {
      vec2 pc = gl_PointCoord - 0.5;
      float d = length(pc);
      float mask = smoothstep(0.55, 0.0, d);
      gl_FragColor = vec4(u_color, mask * vAlpha);
    }
  `,
);

extend({ SparkMaterial });

interface ThreeEnergyEyeSceneProps {
  status: CoreStatus;
}

type EnergyEyeMaterialRef = THREE.ShaderMaterial & {
  u_time: number;
  u_status: number;
  u_intensity: number;
  u_glow: number;
  u_shock: number;
  u_colorCore: THREE.Color;
  u_colorIris: THREE.Color;
  u_colorEdge: THREE.Color;
};

type SparkMaterialRef = THREE.ShaderMaterial & {
  u_time: number;
  u_status: number;
  u_gain: number;
  u_color: THREE.Color;
};

function CameraRig({ status }: { status: CoreStatus }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sway = 0.22 + STATUS_THEME[status].intensity * 0.05;
    const jitter = status === "error" ? Math.sin(t * 17.0) * 0.02 : 0;
    const x = Math.sin(t * 0.35) * sway + jitter;
    const y = Math.cos(t * 0.25) * sway * 0.4 + jitter * 0.4;
    const z = 4.35 + Math.sin(t * 0.2) * 0.25;

    camera.position.lerp(new THREE.Vector3(x, y, z), 0.08);
    camera.lookAt(target);
  });
  return null;
}

function EnergyCore({ status }: { status: CoreStatus }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<EnergyEyeMaterialRef>(null);

  const theme = STATUS_THEME[status];

  const colorCore = useMemo(() => new THREE.Color(theme.main), [theme.main]);
  const colorIris = useMemo(() => new THREE.Color(theme.iris), [theme.iris]);
  const colorEdge = useMemo(() => new THREE.Color(theme.edge), [theme.edge]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.u_time = state.clock.elapsedTime;
      materialRef.current.u_status = STATUS_VALUE[status];
      materialRef.current.u_intensity = THREE.MathUtils.lerp(
        materialRef.current.u_intensity ?? theme.intensity,
        theme.intensity,
        delta * 2,
      );
      materialRef.current.u_glow = THREE.MathUtils.lerp(
        materialRef.current.u_glow ?? theme.glow,
        theme.glow,
        delta * 2,
      );
      materialRef.current.u_shock = THREE.MathUtils.lerp(
        materialRef.current.u_shock ?? theme.shock,
        status === "streaming" ? theme.shock : theme.shock * 0.5,
        delta * 3,
      );

      materialRef.current.u_colorCore.lerp(colorCore, delta * 4);
      materialRef.current.u_colorIris.lerp(colorIris, delta * 4);
      materialRef.current.u_colorEdge.lerp(colorEdge, delta * 4);
    }

    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.y = t * 0.25;
      meshRef.current.rotation.x = Math.sin(t * 0.22) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.32, 6]} />
      {/* @ts-ignore material is registered via extend */}
      <energyEyeMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        u_intensity={theme.intensity}
        u_glow={theme.glow}
        u_shock={theme.shock}
        u_status={STATUS_VALUE[status]}
        u_colorCore={colorCore}
        u_colorIris={colorIris}
        u_colorEdge={colorEdge}
      />
    </mesh>
  );
}

function HaloRings({ status }: { status: CoreStatus }) {
  const groupRef = useRef<THREE.Group>(null!);
  const theme = STATUS_THEME[status];

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * (0.35 + theme.ringSpeed);
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.28;
      groupRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI * 0.5, 0, 0]}>
        <torusGeometry args={[1.55, 0.04, 48, 220]} />
        <meshBasicMaterial
          color={theme.edge}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[Math.PI * 0.5, Math.PI * 0.3, 0]}>
        <torusKnotGeometry args={[1.35, 0.02, 180, 32, 2, 5]} />
        <meshBasicMaterial
          color={theme.main}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <Trail
        width={0.42}
        length={6}
        attenuation={(t) => (1 - t) * 0.8}
        color={theme.edge}
        decay={0.65}
        target={groupRef}
      >
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.6, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </Trail>
    </group>
  );
}

function PulseRings({ status }: { status: CoreStatus }) {
  const rings = useRef<THREE.Mesh[]>([]);
  const theme = STATUS_THEME[status];

  useFrame((state) => {
    const t = state.clock.elapsedTime * (1.2 + theme.ringSpeed);
    rings.current.forEach((ring, index) => {
      if (!ring) return;
      const phase = (t + index * 0.65) % 2.8;
      const scale = 1.1 + phase * 1.2;
      ring.scale.setScalar(scale);

      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, 1 - phase * 0.65) * (0.35 + theme.shock * 0.6);
    });
  });

  return (
    <group>
      {Array.from({ length: 4 }).map((_, idx) => (
        <mesh
          key={idx}
          ref={(node) => {
            if (node) rings.current[idx] = node;
          }}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <ringGeometry args={[1.08, 1.12, 128]} />
          <meshBasicMaterial
            color={STATUS_THEME[status].edge}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField({ status }: { status: CoreStatus }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<SparkMaterialRef>(null);

  const theme = STATUS_THEME[status];

  const attributes = useMemo(() => {
    const theta = new Float32Array(PARTICLE_COUNT);
    const radius = new Float32Array(PARTICLE_COUNT);
    const speed = new Float32Array(PARTICLE_COUNT);
    const positions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      theta[i] = Math.random() * Math.PI * 2;
      radius[i] = 1.3 + Math.random() * 1.8;
      speed[i] = 0.6 + Math.random() * 1.4;
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }

    return { theta, radius, speed, positions };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * (0.18 + theme.particleSpeed * 0.6);
      pointsRef.current.rotation.z += delta * 0.06;
    }
    if (materialRef.current) {
      materialRef.current.u_time = state.clock.elapsedTime * (0.8 + theme.particleSpeed);
      materialRef.current.u_status = STATUS_VALUE[status];
      materialRef.current.u_gain = theme.intensity;
      materialRef.current.u_color.lerp(new THREE.Color(theme.main), delta * 4);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={attributes.positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTheta"
          array={attributes.theta}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRadius"
          array={attributes.radius}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          array={attributes.speed}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      {/* @ts-ignore */}
      <sparkMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        u_color={new THREE.Color(theme.main)}
      />
    </points>
  );
}

export function ThreeEnergyEyeScene({ status }: ThreeEnergyEyeSceneProps) {
  const theme = STATUS_THEME[status];
  const chromaOffset = useMemo(
    () => new THREE.Vector2(theme.chroma, theme.chroma * 0.6),
    [theme.chroma],
  );

  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      className="w-full h-full"
    >
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.background, 3.2, 7.5]} />
      <PerspectiveCamera makeDefault position={[0, 0, 4.4]} fov={42} />

      <Suspense fallback={null}>
        <CameraRig status={status} />
        <group rotation={[0.08, -0.1, 0]}>
          <EnergyCore status={status} />
          <HaloRings status={status} />
          <PulseRings status={status} />
          <ParticleField status={status} />
        </group>
      </Suspense>

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.18}
          luminanceSmoothing={0.95}
          intensity={1.6 + theme.glow * 0.6}
          height={720}
        />
        <ChromaticAberration
          offset={chromaOffset}
          blendFunction={BlendFunction.ADD}
          radialModulation
          modulationOffset={0.35}
        />
        <Noise premultiply opacity={0.16 + theme.intensity * 0.08} />
        <Vignette eskil={false} offset={0.1} darkness={0.86} />
      </EffectComposer>
    </Canvas>
  );
}
