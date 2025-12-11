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
    emissiveIntensity: 0.6,
    rotationSpeed: 0.3,
    particleSpeed: 0.5,
    glowIntensity: 0.4,
    noiseSpeed: 0.2,
    noiseScale: 2.0,
    pulseSpeed: 0.5,
  },
  thinking: {
    color: new THREE.Color(COLORS.fuchsia400),
    accentColor: new THREE.Color(COLORS.purple400),
    emissiveIntensity: 0.9,
    rotationSpeed: 1.0,
    particleSpeed: 1.2,
    glowIntensity: 0.7,
    noiseSpeed: 0.8,
    noiseScale: 3.0,
    pulseSpeed: 1.5,
  },
  streaming: {
    color: new THREE.Color(COLORS.blue400),
    accentColor: new THREE.Color(COLORS.sky400),
    emissiveIntensity: 1.1,
    rotationSpeed: 1.5,
    particleSpeed: 2.0,
    glowIntensity: 0.9,
    noiseSpeed: 1.2,
    noiseScale: 3.5,
    pulseSpeed: 2.0,
  },
  error: {
    color: new THREE.Color(COLORS.red400),
    accentColor: new THREE.Color(COLORS.orange400),
    emissiveIntensity: 0.7,
    rotationSpeed: 0.1,
    particleSpeed: 0.3,
    glowIntensity: 0.6,
    noiseSpeed: 0.3,
    noiseScale: 1.5,
    pulseSpeed: 0.3,
  },
};

// Simplex-like 3D noise function (approximation)
const noiseGLSL = `
  // Simple 3D noise implementation
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

// Plasma Core Shader (Inner volumetric sphere)
const plasmaCoreVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const plasmaCoreFragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float noiseScale;
  uniform float noiseSpeed;
  uniform float intensity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  ${noiseGLSL}

  void main() {
    // Animated noise layers
    vec3 pos = vPosition * noiseScale;
    float t = time * noiseSpeed;

    float noise1 = snoise(pos + vec3(t, 0.0, 0.0));
    float noise2 = snoise(pos * 2.0 + vec3(0.0, t * 1.3, 0.0));
    float noise3 = snoise(pos * 3.0 + vec3(0.0, 0.0, t * 0.7));

    // Combine noise layers for plasma effect
    float plasma = (noise1 + noise2 * 0.5 + noise3 * 0.25) / 1.75;
    plasma = plasma * 0.5 + 0.5; // Normalize to 0-1

    // Mix colors based on plasma
    vec3 color = mix(color1, color2, plasma);

    // Add glow based on view angle (Fresnel-like)
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.0);

    // Pulsing effect
    float pulse = sin(time * 2.0) * 0.1 + 0.9;

    // Combine everything
    vec3 finalColor = color * (1.0 + fresnel * 0.5) * pulse;
    float alpha = 0.85 + plasma * 0.15;

    gl_FragColor = vec4(finalColor * intensity, alpha);
  }
`;

// Fresnel Shell Shader (Outer rim glow)
const fresnelShellVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fresnelShellFragmentShader = `
  uniform float time;
  uniform vec3 glowColor;
  uniform float intensity;

  varying vec3 vNormal;
  varying vec3 vPosition;

  ${noiseGLSL}

  void main() {
    // Calculate Fresnel effect (rim lighting)
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);

    // Add subtle noise to the rim
    float noise = snoise(vPosition * 2.0 + vec3(time * 0.5)) * 0.1 + 0.9;

    // Pulsing effect
    float pulse = sin(time * 1.5) * 0.15 + 0.85;

    // Combine effects
    float glowStrength = fresnel * noise * pulse * intensity;
    vec3 finalColor = glowColor * glowStrength;

    gl_FragColor = vec4(finalColor, fresnel * 0.6);
  }
`;

// Core Sphere with Custom Plasma Shader
function PlasmaCore({ status }: { status: CoreStatus }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = STATUS_CONFIG[status];

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      color1: { value: config.color },
      color2: { value: config.accentColor },
      noiseScale: { value: config.noiseScale },
      noiseSpeed: { value: config.noiseSpeed },
      intensity: { value: config.emissiveIntensity },
    }),
    [config],
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * config.rotationSpeed;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;

      // Update shader uniforms
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = state.clock.elapsedTime;

      // Smooth transition of colors
      material.uniforms.color1.value.lerp(config.color, 0.05);
      material.uniforms.color2.value.lerp(config.accentColor, 0.05);
      material.uniforms.intensity.value +=
        (config.emissiveIntensity - material.uniforms.intensity.value) * 0.05;
      material.uniforms.noiseSpeed.value = config.noiseSpeed;
      material.uniforms.noiseScale.value = config.noiseScale;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={plasmaCoreVertexShader}
        fragmentShader={plasmaCoreFragmentShader}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Fresnel Glow Shell (Outer layer)
function FresnelShell({ status }: { status: CoreStatus }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = STATUS_CONFIG[status];

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      glowColor: { value: config.accentColor },
      intensity: { value: config.emissiveIntensity * 1.5 },
    }),
    [config],
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * config.rotationSpeed * 0.3;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;

      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = state.clock.elapsedTime;
      material.uniforms.glowColor.value.lerp(config.accentColor, 0.05);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.15, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={fresnelShellVertexShader}
        fragmentShader={fresnelShellFragmentShader}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Enhanced Energy Bands (replacing simple rings)
function EnergyBands({ status }: { status: CoreStatus }) {
  const groupRef = useRef<THREE.Group>(null);
  const config = STATUS_CONFIG[status];

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.3 * config.rotationSpeed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.4;
      groupRef.current.rotation.y += delta * 0.1 * config.rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Band */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.04, 16, 100]} />
        <meshBasicMaterial
          color={config.accentColor}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Inner Band - Tilted */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.4, 0.035, 16, 100]} />
        <meshBasicMaterial color={config.color} transparent opacity={0.5} toneMapped={false} />
      </mesh>

      {/* Diagonal Band */}
      <mesh rotation={[Math.PI / 6, 0, Math.PI / 3]}>
        <torusGeometry args={[1.5, 0.03, 16, 100]} />
        <meshBasicMaterial
          color={config.accentColor}
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Enhanced Particle System
function EnhancedParticles({ status }: { status: CoreStatus }) {
  const pointsRef = useRef<THREE.Points>(null);
  const config = STATUS_CONFIG[status];

  const particleCount = 100;
  const { positions, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 0.08 + 0.02;

      // Vary particle colors slightly
      const colorVariation = Math.random() * 0.3;
      colors[i * 3] = config.accentColor.r * (1 - colorVariation);
      colors[i * 3 + 1] = config.accentColor.g * (1 - colorVariation);
      colors[i * 3 + 2] = config.accentColor.b * (1 - colorVariation);
    }

    return { positions, sizes, colors };
  }, [config.accentColor]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15 * config.particleSpeed;
      pointsRef.current.rotation.x += delta * 0.08 * config.particleSpeed;

      // Update colors smoothly
      const colorAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const currentR = colorAttr.getX(i);
        const currentG = colorAttr.getY(i);
        const currentB = colorAttr.getZ(i);

        const targetR = config.accentColor.r * (1 - Math.random() * 0.3);
        const targetG = config.accentColor.g * (1 - Math.random() * 0.3);
        const targetB = config.accentColor.b * (1 - Math.random() * 0.3);

        colorAttr.setXYZ(
          i,
          currentR + (targetR - currentR) * 0.02,
          currentG + (targetG - currentG) * 0.02,
          currentB + (targetB - currentB) * 0.02,
        );
      }
      colorAttr.needsUpdate = true;
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
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.9}
        vertexColors
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Main Scene
function Scene({ status }: { status: CoreStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.5}
      />

      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color={config.color} />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color={config.accentColor} />

      <PlasmaCore status={status} />
      <FresnelShell status={status} />
      <EnergyBands status={status} />
      <EnhancedParticles status={status} />

      <EffectComposer>
        <Bloom
          intensity={config.glowIntensity}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// Performance check
function shouldUseReducedPerformance(): boolean {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isLowEndDevice = window.devicePixelRatio < 2;
  return prefersReducedMotion || isLowEndDevice;
}

// Fallback Component (for reduced motion or low-end devices)
function StaticOrbFallback({ status }: { status: CoreStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center",
        "rounded-full transition-all duration-1000",
      )}
    >
      {/* Static gradient sphere */}
      <div
        className="w-3/4 h-3/4 rounded-full transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${config.color.getStyle()}, ${config.accentColor.getStyle()})`,
          boxShadow: `0 0 60px ${config.color.getStyle()}, 0 0 100px ${config.accentColor.getStyle()}`,
          opacity: 0.9,
        }}
      />
    </div>
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
  const useReducedPerformance = shouldUseReducedPerformance();

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
            "absolute inset-0 rounded-full blur-3xl opacity-30 transition-all duration-1000",
            status === "error"
              ? "bg-red-500/60"
              : status === "thinking"
                ? "bg-fuchsia-500/60"
                : status === "streaming"
                  ? "bg-blue-500/60"
                  : "bg-cyan-500/60",
          )}
        />

        {/* 3D Canvas or Static Fallback */}
        {useReducedPerformance ? (
          <StaticOrbFallback status={status} />
        ) : (
          <Canvas
            className="w-full h-full"
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            dpr={[1, 2]} // Limit pixel ratio for performance
          >
            <Scene status={status} />
          </Canvas>
        )}
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
