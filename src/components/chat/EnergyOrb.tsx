import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
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

// Color palette - Enhanced for dramatic plasma effect
const COLORS = {
  // Primary plasma colors - brighter and more saturated
  plasmaCyan: 0x00e5ff, // Bright electric cyan
  plasmaBlue: 0x0099ff, // Deep electric blue
  plasmaMagenta: 0xff00ff, // Vivid magenta
  plasmaViolet: 0xaa00ff, // Deep violet
  // Status colors
  cyan400: 0x22d3ee,
  violet400: 0xa78bfa,
  fuchsia400: 0xe879f9,
  purple400: 0xc084fc,
  blue400: 0x60a5fa,
  sky400: 0x38bdf8,
  red400: 0xf87171,
  orange400: 0xfb923c,
} as const;

// Status-based configuration - Enhanced for dramatic visual impact
const STATUS_CONFIG = {
  idle: {
    color: new THREE.Color(COLORS.plasmaCyan), // Bright electric cyan core
    accentColor: new THREE.Color(COLORS.plasmaMagenta), // Vivid magenta outer glow
    emissiveIntensity: 2.5, // Dramatically increased for visibility
    rotationSpeed: 0.28,
    particleSpeed: 0.4,
    glowIntensity: 2.8, // Much higher for strong bloom
    noiseSpeed: 0.25,
    noiseScale: 2.2,
    pulseSpeed: 0.8,
  },
  thinking: {
    color: new THREE.Color(COLORS.plasmaMagenta), // Vivid magenta when thinking
    accentColor: new THREE.Color(COLORS.plasmaViolet), // Deep violet accent
    emissiveIntensity: 3.0, // Very bright when thinking
    rotationSpeed: 0.9,
    particleSpeed: 1.0,
    glowIntensity: 3.2, // Maximum glow
    noiseSpeed: 0.9,
    noiseScale: 3.6,
    pulseSpeed: 1.6,
  },
  streaming: {
    color: new THREE.Color(COLORS.plasmaBlue), // Electric blue for streaming
    accentColor: new THREE.Color(COLORS.plasmaCyan), // Bright cyan accent
    emissiveIntensity: 3.2, // Brightest state
    rotationSpeed: 1.25,
    particleSpeed: 1.8,
    glowIntensity: 3.5, // Maximum bloom when streaming
    noiseSpeed: 1.25,
    noiseScale: 4.0,
    pulseSpeed: 2.1,
  },
  error: {
    color: new THREE.Color(COLORS.red400),
    accentColor: new THREE.Color(COLORS.orange400),
    emissiveIntensity: 2.0, // Bright enough to be visible
    rotationSpeed: 0.15,
    particleSpeed: 0.45,
    glowIntensity: 2.2,
    noiseSpeed: 0.35,
    noiseScale: 1.6,
    pulseSpeed: 0.5,
  },
};

// Simplex-like 3D noise function (approximation)
const noiseGLSL = `
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

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.2;
      amplitude *= 0.55;
    }
    return value;
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
  uniform float pulseStrength;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  ${noiseGLSL}

  void main() {
    float t = time * noiseSpeed;
    vec3 dir = normalize(vPosition);
    float radius = length(vPosition);

    // Multi-layered noise for deeper volumetric effect
    float swirl = fbm(dir * noiseScale + vec3(t * 0.8, t * 1.1, t * 0.6));
    float ripples = fbm(dir * (noiseScale * 1.6) - vec3(t * 0.6, t * 0.4, t * 0.9));
    float turbulence = fbm(dir * (noiseScale * 2.5) + vec3(-t * 0.5, t * 0.8, -t * 0.7));

    // Enhanced plasma with more dramatic variation
    float plasma = clamp(0.5 + swirl * 0.5 + ripples * 0.3 + turbulence * 0.2, 0.3, 1.0);

    // Bright, vibrant color mixing - significantly boosted
    vec3 baseColor = mix(color1 * 2.5, color2 * 2.2, plasma * 0.7 + 0.3);

    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.5);

    // More dramatic pulse and breathing
    float pulse = sin(time * (1.2 + pulseStrength * 0.4)) * 0.15 + 1.0;
    float pulse2 = sin(time * (1.8 + pulseStrength * 0.3) + plasma * 2.0) * 0.1 + 1.0;
    float breathing = 1.0 + sin(time * 0.7) * 0.1;

    // Much stronger glow for visibility
    float innerGlow = smoothstep(0.0, 1.0, 1.0 - radius * 0.5) * 2.5;
    float coreHotspot = smoothstep(0.4, 0.0, radius) * 1.5;
    float edgeGlow = fresnel * 1.2;

    // Bright base lighting with guaranteed minimum brightness
    float totalGlow = innerGlow + edgeGlow + coreHotspot + 1.5;
    vec3 finalColor = baseColor * totalGlow * pulse * pulse2 * breathing;

    // Ensure minimum brightness
    finalColor = max(finalColor, color1 * 0.3);

    float alpha = 0.85 + innerGlow * 0.15;

    gl_FragColor = vec4(finalColor * intensity * 2.0, alpha);
  }
`;

// Lightning filaments shader (branching plasma)
const lightningVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lightningFragmentShader = `
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform float intensity;

  varying vec3 vNormal;
  varying vec3 vPosition;

  ${noiseGLSL}

  void main() {
    float t = time * 1.1;
    vec3 dir = normalize(vPosition);
    float radius = length(vPosition);

    // Enhanced branching with multiple noise octaves for more complex lightning patterns
    float branchNoise = fbm(dir * 10.0 + vec3(t * 0.8, -t * 0.6, t * 1.2));
    float branchNoise2 = fbm(dir * 18.0 - vec3(t * 0.5, t * 0.7, -t * 0.9));

    // More jagged, electric-looking arcs
    float jagged = abs(sin(dir.x * 18.0 + t) * cos(dir.y * 20.0 - t * 0.9));
    float jagged2 = abs(sin(dir.z * 15.0 - t * 1.1) * cos(dir.x * 16.0 + t * 0.8));

    // Combine for more complex, branching patterns
    float arcs = pow(1.0 - jagged, 2.5) * (0.5 + branchNoise * 0.5);
    arcs += pow(1.0 - jagged2, 3.0) * (0.3 + branchNoise2 * 0.4) * 0.6;

    // Broader radial spread for more visible lightning throughout the sphere
    float radialSpread = smoothstep(0.1, 1.0, radius) * (1.4 - radius * 0.5);

    // Lower threshold for more visible filaments
    float filamentMask = smoothstep(0.3, 0.85, arcs) * radialSpread;

    // More dramatic shimmer effect
    float shimmer = sin(t * 2.5 + dir.z * 12.0) * 0.3 + 1.0;
    float shimmer2 = sin(t * 3.0 - dir.y * 10.0) * 0.2 + 1.0;

    // Very bright color mixing for electric visibility
    vec3 color = mix(colorA * 3.0, colorB * 2.8, filamentMask * 0.6 + 0.4) * shimmer * shimmer2;

    float fresnel = pow(1.0 - abs(dot(normalize(cameraPosition - vPosition), vNormal)), 2.0);

    // High alpha for strong visibility
    float alpha = filamentMask * (0.9 + fresnel * 0.6) * intensity * 1.8;

    // Very low discard threshold
    if (alpha < 0.015) discard;

    // Maximum brightness boost
    gl_FragColor = vec4(color * (2.0 + filamentMask * 1.5), alpha);
  }
`;

// Glass shell shader with rim light and subtle distortion
const glassShellVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glassShellFragmentShader = `
  uniform float time;
  uniform vec3 glowColor;
  uniform float intensity;

  varying vec3 vNormal;
  varying vec3 vPosition;

  ${noiseGLSL}

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);

    // Stronger fresnel effect with multiple powers for layered rim light
    float fresnel1 = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.5);
    float fresnel2 = pow(1.0 - abs(dot(viewDirection, vNormal)), 4.0);
    float fresnel = fresnel1 * 0.6 + fresnel2 * 0.4;

    // Animated noise for dynamic glass surface
    float noise = fbm(vNormal * 5.0 + vec3(time * 0.6, time * 0.4, time * 0.7)) * 0.5 + 0.5;
    float noise2 = fbm(vNormal * 8.0 - vec3(time * 0.3, time * 0.5, time * 0.2)) * 0.3 + 0.7;

    // Brighter pulse
    float pulse = sin(time * 1.4) * 0.2 + 1.0;
    float pulse2 = sin(time * 2.0 + noise * 3.14) * 0.15 + 1.0;

    // Much stronger glow
    float glowStrength = (fresnel + 0.3) * (1.0 + noise * 0.5) * pulse * pulse2 * intensity * 2.5;

    // Brighter energy ripples
    float ripple = sin(fresnel * 10.0 - time * 2.0) * 0.2 + 1.0;

    vec3 finalColor = glowColor * glowStrength * noise2 * ripple * 2.5;

    // Higher alpha and base brightness
    float alpha = (glowStrength * 1.3 + 0.2) * (0.8 + fresnel * 0.4);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

function PlasmaCore({ status }: { status: CoreStatus }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = STATUS_CONFIG[status];

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      color1: { value: config.color.clone() },
      color2: { value: config.accentColor.clone() },
      noiseScale: { value: config.noiseScale },
      noiseSpeed: { value: config.noiseSpeed },
      intensity: { value: config.emissiveIntensity },
      pulseStrength: { value: config.pulseSpeed },
    }),
    [config],
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (config.rotationSpeed * 0.6);
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;

      const material = meshRef.current.material as THREE.ShaderMaterial;
      const uniforms = material.uniforms as Record<string, { value: number | THREE.Color }>;

      if (
        uniforms.time &&
        uniforms.color1 &&
        uniforms.color2 &&
        uniforms.intensity &&
        uniforms.noiseSpeed &&
        uniforms.noiseScale &&
        uniforms.pulseStrength
      ) {
        uniforms.time.value = state.clock.elapsedTime;
        (uniforms.color1.value as THREE.Color).lerp(config.color, 0.05);
        (uniforms.color2.value as THREE.Color).lerp(config.accentColor, 0.05);
        const currentIntensity =
          typeof uniforms.intensity.value === "number"
            ? uniforms.intensity.value
            : config.emissiveIntensity;
        uniforms.intensity.value =
          currentIntensity + (config.emissiveIntensity - currentIntensity) * 0.04;
        uniforms.noiseSpeed.value = config.noiseSpeed;
        uniforms.noiseScale.value = config.noiseScale;
        uniforms.pulseStrength.value = config.pulseSpeed;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 96, 96]} />
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

function LightningLayer({ status }: { status: CoreStatus }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = STATUS_CONFIG[status];

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      colorA: { value: config.color.clone() },
      colorB: { value: config.accentColor.clone() },
      intensity: { value: config.emissiveIntensity * 1.25 },
    }),
    [config],
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= state.clock.getDelta() * (config.rotationSpeed * 0.5);
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.1;

      const material = meshRef.current.material as THREE.ShaderMaterial;
      const uniforms = material.uniforms as Record<string, { value: number | THREE.Color }>;

      if (uniforms.time && uniforms.colorA && uniforms.colorB && uniforms.intensity) {
        uniforms.time.value = state.clock.elapsedTime;
        (uniforms.colorA.value as THREE.Color).lerp(config.color, 0.08);
        (uniforms.colorB.value as THREE.Color).lerp(config.accentColor, 0.08);
        const currentIntensity =
          typeof uniforms.intensity.value === "number"
            ? uniforms.intensity.value
            : config.emissiveIntensity * 1.3;
        uniforms.intensity.value =
          currentIntensity + (config.emissiveIntensity * 1.3 - currentIntensity) * 0.05;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.98, 96, 96]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={lightningVertexShader}
        fragmentShader={lightningFragmentShader}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function GlassShell({ status }: { status: CoreStatus }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = STATUS_CONFIG[status];

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      glowColor: { value: config.accentColor.clone() },
      intensity: { value: config.emissiveIntensity * 1.9 }, // Increased from 1.6
    }),
    [config],
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += state.clock.getDelta() * (config.rotationSpeed * 0.25);
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;

      const material = meshRef.current.material as THREE.ShaderMaterial;
      const uniforms = material.uniforms as Record<string, { value: number | THREE.Color }>;

      if (uniforms.time && uniforms.glowColor) {
        uniforms.time.value = state.clock.elapsedTime;
        (uniforms.glowColor.value as THREE.Color).lerp(config.accentColor, 0.04);
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.12, 96, 96]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={glassShellVertexShader}
        fragmentShader={glassShellFragmentShader}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function GlowHalo({ status }: { status: CoreStatus }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = STATUS_CONFIG[status];

  useFrame((state) => {
    if (meshRef.current) {
      // More dramatic pulse for outer glow
      const pulse =
        Math.sin(state.clock.elapsedTime * (0.6 + config.pulseSpeed * 0.2)) * 0.08 + 1.0;
      meshRef.current.scale.setScalar(1.8 * pulse);
      meshRef.current.rotation.z += state.clock.getDelta() * 0.05;

      // Animate opacity based on pulse
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      if (material.opacity !== undefined) {
        const baseOpacity = 0.15; // Increased from 0.08
        const opacityPulse = Math.sin(state.clock.elapsedTime * 1.2) * 0.05 + baseOpacity;
        material.opacity = opacityPulse;
      }
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.4, 1.9, 80]} />
      <meshBasicMaterial
        color={config.accentColor}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function EnhancedParticles({ status }: { status: CoreStatus }) {
  const pointsRef = useRef<THREE.Points>(null);
  const config = STATUS_CONFIG[status];

  const particleCount = 280;

  const { positions, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.9 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 0.07 + 0.02;

      const colorVariation = Math.random() * 0.25;
      colors[i * 3] = config.accentColor.r * (1 - colorVariation);
      colors[i * 3 + 1] = config.accentColor.g * (1 - colorVariation);
      colors[i * 3 + 2] = config.accentColor.b * (1 - colorVariation);
    }

    return { positions, sizes, colors };
  }, [config.accentColor]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.12 * config.particleSpeed;
      pointsRef.current.rotation.x += delta * 0.07 * config.particleSpeed;

      const colorAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const currentR = colorAttr.getX(i);
        const currentG = colorAttr.getY(i);
        const currentB = colorAttr.getZ(i);

        const targetR = config.accentColor.r * (1 - Math.random() * 0.25);
        const targetG = config.accentColor.g * (1 - Math.random() * 0.25);
        const targetB = config.accentColor.b * (1 - Math.random() * 0.25);

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

function Scene({ status }: { status: CoreStatus }) {
  const config = STATUS_CONFIG[status];
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * (0.15 + config.rotationSpeed * 0.15);
      const pulseScale =
        1 + Math.sin(state.clock.elapsedTime * (0.8 + config.pulseSpeed * 0.3)) * 0.02;
      groupRef.current.scale.setScalar(pulseScale);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.6]} fov={42} />

      {/* Enhanced lighting for maximum visibility */}
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 5]} intensity={1.5} color={config.color} />
      <pointLight position={[-5, -3, 4]} intensity={1.4} color={config.accentColor} />
      <pointLight position={[0, 0, -3]} intensity={0.8} color={config.accentColor} />
      <pointLight position={[0, 3, 0]} intensity={1.0} color={new THREE.Color(0xffffff)} />

      <group ref={groupRef}>
        <PlasmaCore status={status} />
        <LightningLayer status={status} />
        <GlassShell status={status} />
        <GlowHalo status={status} />
      </group>

      <EnhancedParticles status={status} />

      <EffectComposer>
        <Bloom
          intensity={config.glowIntensity * 1.5}
          luminanceThreshold={0.01}
          luminanceSmoothing={0.95}
          mipmapBlur
          radius={0.9}
        />
      </EffectComposer>
    </>
  );
}

function shouldUseReducedPerformance(): boolean {
  if (typeof window === "undefined") return false;
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isLowEndDevice = window.devicePixelRatio < 2;
  return prefersReducedMotion || isLowEndDevice;
}

function isWebGLAvailable(): boolean {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  return !!gl;
}

function StaticOrbFallback({ status }: { status: CoreStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center rounded-full overflow-hidden",
        "bg-gradient-to-br from-slate-900/60 via-indigo-900/40 to-black/70",
      )}
    >
      <div
        className="absolute inset-4 rounded-full blur-3xl opacity-40"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${config.color.getStyle()}, ${config.accentColor.getStyle()})`,
        }}
      />
      <img
        src="/plasma-orb-fallback.svg"
        alt="Statischer Plasma Orb"
        className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(56,189,248,0.25)]"
        loading="lazy"
      />
    </div>
  );
}

export function EnergyOrb({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: EnergyOrbProps) {
  const [useReducedPerformance, setUseReducedPerformance] = useState(false);
  const [canUseWebGL, setCanUseWebGL] = useState(false);

  useEffect(() => {
    setUseReducedPerformance(shouldUseReducedPerformance());
    setCanUseWebGL(isWebGLAvailable());
  }, []);

  const shouldRenderCanvas = canUseWebGL && !useReducedPerformance;

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-8 pt-4 w-full animate-fade-in">
      <motion.div
        className={cn(
          "relative flex items-center justify-center",
          "w-[clamp(240px,55vw,340px)] h-[clamp(240px,55vw,340px)]",
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-3xl opacity-50 transition-all duration-1000",
            status === "error"
              ? "bg-red-500/70"
              : status === "thinking"
                ? "bg-fuchsia-500/80"
                : status === "streaming"
                  ? "bg-blue-500/80"
                  : "bg-cyan-500/80",
          )}
        />

        {shouldRenderCanvas ? (
          <Canvas
            className="w-full h-full"
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            dpr={useReducedPerformance ? 1 : [1, 2]}
          >
            <Scene status={status} />
          </Canvas>
        ) : (
          <StaticOrbFallback status={status} />
        )}
      </motion.div>

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
