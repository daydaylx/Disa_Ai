import { shaderMaterial } from "@react-three/drei";
import type { ReactThreeFiber } from "@react-three/fiber";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  ShaderMaterial,
  Vector2,
} from "three";

import type { CoreStatus } from "@/types/core";

const energyVertex = /* glsl */ `
  uniform float u_time;
  uniform float u_status;
  uniform float u_intensity;
  uniform float u_pulse;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;

  void main() {
    vUv = uv;
    vNormal = normal;
    vec3 displaced = position;
    float ripple = sin((position.y + position.x + position.z) * 4.0 + u_time * (1.5 + u_status)) * 0.02;
    float breathing = sin(u_time * 0.65 + u_status) * 0.015 * u_intensity;
    displaced += normal * (ripple + breathing);
    vPos = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const energyFragment = /* glsl */ `
  precision highp float;
  uniform float u_time;
  uniform float u_status;
  uniform float u_intensity;
  uniform float u_pulse;
  uniform vec3 u_colorMain;
  uniform vec3 u_colorAccent;
  uniform vec3 u_glow;
  uniform float u_errorShift;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.6;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      sum += amp * noise(p * freq);
      freq *= 2.0;
      amp *= 0.55;
    }
    return sum;
  }

  vec3 ringLayers(vec2 uv, float t) {
    float r = length(uv - 0.5);
    float angle = atan(uv.y - 0.5, uv.x - 0.5);
    float digital = smoothstep(0.0, 0.015, abs(fract((angle + t * 0.25) / 0.32) - 0.5));
    float radial = smoothstep(0.36, 0.38, r) * smoothstep(0.62, 0.6, r);
    float pulse = sin((r * 12.0 - t * 4.0) + u_status * 0.5) * 0.35 + 0.35;
    float shock = smoothstep(0.0, 0.03, abs(r - fract(t * 0.22) * 0.92));
    float trail = smoothstep(0.15, 0.55, r) * (0.55 + 0.45 * sin(t * 2.0 + r * 12.0));
    float data = digital * radial * (0.4 + 0.6 * u_intensity) + shock * 0.4;
    return vec3(pulse * radial + data + trail * 0.18);
  }

  vec3 iris(vec2 uv, float t) {
    vec2 centered = uv - 0.5;
    float dist = length(centered);
    float angle = atan(centered.y, centered.x);
    float grain = fbm(centered * 12.0 + t * (1.2 + u_status * 0.4));
    float petal = sin(angle * 16.0 + t * 0.8) * 0.08;
    float irisBody = smoothstep(0.48, 0.2, dist + petal) * (0.45 + grain * 0.4);
    float pupil = smoothstep(0.22 + 0.02 * sin(t * 2.0 + u_status), 0.05, dist);
    float glare = smoothstep(0.0, 0.6, 1.0 - dist) * 0.35;
    float dataSpin = smoothstep(0.35, 0.0, abs(fract((angle + t * (0.6 + u_status * 0.5)) / 0.16) - 0.5));

    float shockwave = sin((dist - fract(t * 0.4)) * 12.0 - t * 8.0) * 0.18;
    float statusHeat = mix(0.08, 0.32, clamp(u_status / 2.5, 0.0, 1.0));
    float irisMask = smoothstep(0.62, 0.25, dist + irisBody * 0.2);
    vec3 base = mix(u_colorMain, u_colorAccent, grain * 0.45 + irisBody * 0.4);
    base += u_glow * (glare + shockwave * statusHeat);
    base += vec3(0.9, 0.95, 1.0) * dataSpin * 0.3;
    base *= irisMask;

    // pupil darkening
    base *= 1.0 - pupil;

    return base;
  }

  void main() {
    float t = u_time;
    vec2 uv = vUv;
    if (u_status > 2.2) {
      // subtle uv jitter on error
      uv += vec2(noise(uv * 12.0 + t * 2.5), noise(uv * 14.0 - t * 2.0)) * 0.015 * u_errorShift;
    }

    vec3 irisColor = iris(uv, t);
    vec3 rings = ringLayers(uv, t * (0.9 + u_status * 0.2));

    float rim = smoothstep(0.48, 0.5 + 0.04 * u_intensity, length(uv - 0.5));
    float facing = pow(abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 1.5);
    float bloomEdge = smoothstep(0.35, 0.65, length(uv - 0.5));

    vec3 color = irisColor;
    color += rings * u_colorAccent;
    color += u_glow * bloomEdge * (0.6 + u_pulse * 0.6);
    color += vec3(0.75, 0.85, 1.0) * facing * 0.12;

    float vignette = smoothstep(0.55, 0.28, length(uv - 0.5));
    color *= vignette;

    gl_FragColor = vec4(color + rim * 0.08, 1.0);
  }
`;

const EnergyEyeMaterial = shaderMaterial(
  {
    u_time: 0,
    u_status: 0,
    u_intensity: 1,
    u_pulse: 0,
    u_colorMain: new Color("rgb(111 197 255)"),
    u_colorAccent: new Color("rgb(168 85 247)"),
    u_glow: new Color("rgb(125 211 252)"),
    u_errorShift: 0,
  },
  energyVertex,
  energyFragment,
);

extend({ EnergyEyeMaterial });

export type EnergyEyeMaterialType = ShaderMaterial & {
  u_time: number;
  u_status: number;
  u_intensity: number;
  u_pulse: number;
  u_colorMain: Color;
  u_colorAccent: Color;
  u_glow: Color;
  u_errorShift: number;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      energyEyeMaterial: ReactThreeFiber.Object3DNode<
        EnergyEyeMaterialType,
        typeof EnergyEyeMaterial
      >;
    }
  }
}

type StatusVisual = {
  main: Color;
  accent: Color;
  glow: Color;
  intensity: number;
  pulseSpeed: number;
  ringDrift: number;
  particleDrift: number;
  ringOpacity: number;
  chroma: number;
  shockwave: number;
};

const STATUS_VISUALS: Record<CoreStatus, StatusVisual> = {
  idle: {
    main: new Color("rgb(91 123 255)"),
    accent: new Color("rgb(110 231 255)"),
    glow: new Color("rgb(125 211 252)"),
    intensity: 0.45,
    pulseSpeed: 0.45,
    ringDrift: 0.08,
    particleDrift: 0.12,
    ringOpacity: 0.35,
    chroma: 0.0018,
    shockwave: 0.2,
  },
  thinking: {
    main: new Color("rgb(124 58 237)"),
    accent: new Color("rgb(168 85 247)"),
    glow: new Color("rgb(192 132 252)"),
    intensity: 0.7,
    pulseSpeed: 0.9,
    ringDrift: 0.16,
    particleDrift: 0.3,
    ringOpacity: 0.48,
    chroma: 0.0025,
    shockwave: 0.36,
  },
  streaming: {
    main: new Color("rgb(34 211 238)"),
    accent: new Color("rgb(96 165 250)"),
    glow: new Color("rgb(103 232 249)"),
    intensity: 1.1,
    pulseSpeed: 1.6,
    ringDrift: 0.35,
    particleDrift: 0.6,
    ringOpacity: 0.72,
    chroma: 0.0035,
    shockwave: 0.8,
  },
  error: {
    main: new Color("rgb(248 113 113)"),
    accent: new Color("rgb(251 146 60)"),
    glow: new Color("rgb(249 115 22)"),
    intensity: 0.9,
    pulseSpeed: 1.4,
    ringDrift: 0.22,
    particleDrift: 0.4,
    ringOpacity: 0.7,
    chroma: 0.004,
    shockwave: 0.52,
  },
};

const statusValueMap: Record<CoreStatus, number> = {
  idle: 0,
  thinking: 1,
  streaming: 2,
  error: 3,
};

function EyeSphere({ status }: { status: CoreStatus }) {
  const materialRef = useRef<EnergyEyeMaterialType>(null);
  const groupRef = useRef<Group>(null);
  const visual = STATUS_VISUALS[status];
  const statusValue = statusValueMap[status];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.5 + 0.5 * Math.sin(t * visual.pulseSpeed * 1.2);

    if (groupRef.current) {
      const tilt = 0.08 + visual.intensity * 0.02;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * tilt;
      groupRef.current.rotation.y = Math.cos(t * 0.24) * tilt * 1.1;
    }

    if (materialRef.current) {
      materialRef.current.u_time = t;
      materialRef.current.u_status = statusValue;
      materialRef.current.u_intensity = visual.intensity;
      materialRef.current.u_pulse = pulse;
      materialRef.current.u_errorShift = status === "error" ? 0.6 + 0.4 * Math.sin(t * 3.5) : 0;
      materialRef.current.u_colorMain.copy(visual.main);
      materialRef.current.u_colorAccent.copy(visual.accent);
      materialRef.current.u_glow.copy(visual.glow);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1, 128, 128]} />
        <energyEyeMaterial ref={materialRef} toneMapped={false} />
      </mesh>
    </group>
  );
}

function GlowingRing({
  status,
  radius,
  thickness,
  speed,
  offset = 0,
}: {
  status: CoreStatus;
  radius: number;
  thickness: number;
  speed: number;
  offset?: number;
}) {
  const ringRef = useRef<Mesh>(null);
  const visual = STATUS_VISUALS[status];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * speed + offset) * 0.06 * visual.intensity;
    const opacity = Math.max(0, visual.ringOpacity + 0.15 * Math.sin(t * speed * 1.4 + offset));
    if (ringRef.current) {
      ringRef.current.rotation.z = t * (visual.ringDrift + 0.1);
      ringRef.current.scale.setScalar(s);
      const mat = ringRef.current.material as MeshBasicMaterial;
      mat.opacity = opacity;
    }
  });

  return (
    <mesh ref={ringRef} rotation-x={Math.PI / 2}>
      <torusGeometry args={[radius, thickness, 32, 180]} />
      <meshBasicMaterial
        color={visual.accent}
        transparent
        opacity={visual.ringOpacity}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function ShockwavePulse({ status }: { status: CoreStatus }) {
  const ringRef = useRef<Mesh>(null);
  const visual = STATUS_VISUALS[status];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const cycle = (t * (0.25 + visual.shockwave)) % 1;
    if (ringRef.current) {
      const scale = 1.05 + cycle * 1.25;
      ringRef.current.scale.setScalar(scale);
      const mat = ringRef.current.material as MeshBasicMaterial;
      mat.opacity = 0.45 * (1.0 - cycle);
    }
  });

  return (
    <mesh ref={ringRef} rotation-x={Math.PI / 2}>
      <torusGeometry args={[1.05, 0.045, 16, 220]} />
      <meshBasicMaterial
        color={STATUS_VISUALS[status].glow}
        transparent
        opacity={0.2}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function ParticlesLayer({
  status,
  count = 220,
  radius = 1.45,
}: {
  status: CoreStatus;
  count?: number;
  radius?: number;
}) {
  const visual = STATUS_VISUALS[status];
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (i % 7) * 0.003 + Math.random() * 0.05;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const z = (Math.random() - 0.5) * 0.15;
      arr.set([x, y, z], i * 3);
    }
    return arr;
  }, [count, radius]);

  const speeds = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = 0.2 + Math.random() * 0.8;
    }
    return arr;
  }, [count]);

  const pointsRef = useRef<Points>(null);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const positionsAttr = pointsRef.current.geometry.getAttribute("position");
    for (let i = 0; i < count; i++) {
      const speed = speeds[i] ?? 0;
      const angle = (i / count) * Math.PI * 2 + t * visual.particleDrift * speed;
      const r = radius + Math.sin(t * 0.5 + i * 0.2) * 0.04;
      positionsAttr.setXYZ(
        i,
        Math.cos(angle) * r,
        Math.sin(angle) * r,
        Math.sin(t * 0.4 + i) * 0.08,
      );
    }
    positionsAttr.needsUpdate = true;
    pointsRef.current.rotation.z = t * (0.08 + visual.particleDrift * 0.6);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={visual.accent}
        transparent
        opacity={0.65}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function InnerSparkLayer({ status, count = 120 }: { status: CoreStatus; count?: number }) {
  const visual = STATUS_VISUALS[status];
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.45 + Math.random() * 0.25;
      const z = (Math.random() - 0.5) * 0.4;
      arr.set([Math.cos(angle) * radius, Math.sin(angle) * radius, z], i * 3);
    }
    return arr;
  }, [count]);

  const pointsRef = useRef<Points>(null);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.z = t * (0.4 + visual.intensity * 0.2);
    const mat = pointsRef.current.material as PointsMaterial;
    mat.opacity = 0.45 + 0.25 * Math.sin(t * (0.6 + visual.intensity * 0.8));
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={visual.glow}
        transparent
        opacity={0.52}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingHalo() {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      const mat = ref.current.material as MeshBasicMaterial;
      mat.opacity = 0.22 + 0.08 * Math.sin(t * 0.8);
    }
  });

  return (
    <mesh ref={ref} rotation-x={Math.PI / 2} position={[0, 0, -0.15]}>
      <ringGeometry args={[1.2, 1.6, 64]} />
      <meshBasicMaterial
        color={new Color("rgb(14 165 233)")}
        transparent
        opacity={0.25}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export function ThreeEnergyEyeScene({ status }: { status: CoreStatus }) {
  const visual = STATUS_VISUALS[status];
  const chromaOffset = useMemo(() => new Vector2(visual.chroma, -visual.chroma), [visual.chroma]);
  const supportsResizeObserver =
    typeof window !== "undefined" && typeof window.ResizeObserver !== "undefined";

  if (!supportsResizeObserver) {
    return (
      <div className="relative flex items-center justify-center w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-indigo-700/60 via-sky-500/40 to-slate-900/90">
        <div className="absolute inset-[-10%] rounded-full bg-sky-400/30 blur-3xl" />
        <div className="absolute inset-[-20%] rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.35),transparent_45%)] mix-blend-screen" />
        <div className="absolute inset-3 rounded-full border border-white/10" />
        <div className="absolute inset-6 rounded-full border border-cyan-400/25 animate-pulse" />
        <div className="absolute inset-0 animate-spin-slow" aria-hidden>
          <div className="absolute inset-[14%] rounded-full border border-white/10" />
        </div>
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 3.2], fov: 30 }}
      className="w-full h-full"
    >
      <color attach="background" args={["rgb(5 6 20)"]} />
      <fog attach="fog" args={["rgb(5 6 20)", 5, 10]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[2, 2, 3]} intensity={1.2} color={visual.glow} />
      <pointLight position={[-2, -1, -2]} intensity={0.8} color={visual.main} />

      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
          <FloatingHalo />
          <ShockwavePulse status={status} />
          <GlowingRing status={status} radius={1.1} thickness={0.06} speed={0.8} />
          <GlowingRing status={status} radius={1.35} thickness={0.045} speed={1.2} offset={1.2} />
          <GlowingRing status={status} radius={1.55} thickness={0.035} speed={1.6} offset={2.4} />
          <ParticlesLayer status={status} />
          <InnerSparkLayer status={status} />
          <EyeSphere status={status} />
        </group>

        <EffectComposer enableNormalPass={false}>
          <Bloom
            mipmapBlur
            intensity={1.1 + visual.intensity * 0.6}
            luminanceThreshold={0.2}
            radius={0.9}
          />
          <ChromaticAberration
            offset={chromaOffset}
            radialModulation={false}
            modulationOffset={0.15}
          />
          <Noise opacity={0.08 + visual.intensity * 0.05} premultiply />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
