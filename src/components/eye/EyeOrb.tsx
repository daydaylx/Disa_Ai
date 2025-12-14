import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import {
  type CoreStatus,
} from "@/types/orb";

import { eyeFragmentShader,eyeVertexShader } from "./shaders/eyeShaders";

// --- Types & Constants ---

interface EyeOrbProps {
  status: CoreStatus;
}

// Minimal permission UI trigger handled by parent or internal state
// Gyro config
const SMOOTHING_FACTOR = 0.05; // Low-pass filter strength (lower is slower/heavier)
const MAX_LOOK_ANGLE = 25; // Degrees

// --- Helper: Gyro Hook ---

function useGyro() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Target rotation in degrees { x: pitch (beta), y: yaw (gamma) }
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if DeviceOrientationEvent is defined
    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      setIsSupported(true);

      // Check for iOS 13+ permission API
      // @ts-ignore
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // Need to wait for user interaction to request
        setPermissionGranted(false);
      } else {
        // Non-iOS or older iOS
        setPermissionGranted(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let { beta, gamma } = event; // beta: front-back (-180 to 180), gamma: left-right (-90 to 90)

      if (beta === null || gamma === null) return;

      // Normalize/Clamp
      // We want to map device tilt to eye look direction.
      // Default holding position is usually beta ~45deg (tilted up)
      // We subtract a base offset to "center" the eye at comfortable viewing angle

      const baseBeta = 45;

      let x = beta - baseBeta; // Pitch
      let y = gamma; // Yaw

      // Clamp to max angle
      x = Math.max(-MAX_LOOK_ANGLE, Math.min(MAX_LOOK_ANGLE, x));
      y = Math.max(-MAX_LOOK_ANGLE, Math.min(MAX_LOOK_ANGLE, y));

      targetRotation.current = { x, y };
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [permissionGranted]);

  const requestPermission = async () => {
    // @ts-ignore
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-ignore
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
        setPermissionGranted(true);
    }
  };

  return { targetRotation, isSupported, permissionGranted, requestPermission };
}


// --- Three.js Component: The Eye ---

function EyeMesh({ status, gyroTarget }: { status: CoreStatus, gyroTarget: React.MutableRefObject<{x: number, y: number}> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Internal state for smoothing
  const currentRotation = useRef({ x: 0, y: 0 });

  // Status-based colors
  const theme = useMemo(() => {
    // Colors from memory/existing theme
    // Idle (Cyan/Blue), Thinking (Purple), Streaming (Sky/Blue), Error (Red)
    switch (status) {
      case 'thinking': return { iris: new THREE.Color(0xc084fc), pupil: new THREE.Color(0x1a0b2e) };
      case 'streaming': return { iris: new THREE.Color(0x60a5fa), pupil: new THREE.Color(0x0f172a) };
      case 'error': return { iris: new THREE.Color(0xef4444), pupil: new THREE.Color(0x2a0a0a) };
      default: return { iris: new THREE.Color(0x3b82f6), pupil: new THREE.Color(0x020617) }; // Idle
    }
  }, [status]);

  // Micro-movement noise offsets
  const noiseOffset = useRef({ x: Math.random() * 100, y: Math.random() * 100 });

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    // 1. Gyro Smoothing (Lerp)
    const targetX = gyroTarget.current.x * (Math.PI / 180);
    const targetY = gyroTarget.current.y * (Math.PI / 180);

    // Damping / Heavy feel
    currentRotation.current.x += (targetX - currentRotation.current.x) * SMOOTHING_FACTOR;
    currentRotation.current.y += (targetY - currentRotation.current.y) * SMOOTHING_FACTOR;

    // 2. Add "Life" (Micro-movements / Saccades)
    const time = state.clock.elapsedTime;
    let microX = 0;
    let microY = 0;

    if (status === 'thinking' || status === 'idle') {
        // Slow breathing movement
        microX = Math.sin(time * 0.5 + noiseOffset.current.x) * 0.05;
        microY = Math.cos(time * 0.3 + noiseOffset.current.y) * 0.05;
    }

    // 3. Apply Rotation
    meshRef.current.rotation.x = currentRotation.current.x + microX;
    meshRef.current.rotation.y = currentRotation.current.y + microY;

    // 4. Update Shader Uniforms
    if (materialRef.current.uniforms.uTime) {
        materialRef.current.uniforms.uTime.value = time;
    }

    // Color transitions
    if (materialRef.current.uniforms.uColorIris) {
        materialRef.current.uniforms.uColorIris.value.lerp(theme.iris, delta * 2.0);
    }
    if (materialRef.current.uniforms.uColorPupil) {
        materialRef.current.uniforms.uColorPupil.value.lerp(theme.pupil, delta * 2.0);
    }

    // Pupil dilation
    let targetPupilScale = 0.25;
    if (status === 'thinking') targetPupilScale = 0.28 + Math.sin(time * 2.0) * 0.02;
    if (status === 'error') targetPupilScale = 0.15;
    if (status === 'streaming') targetPupilScale = 0.3 + Math.sin(time * 10.0) * 0.01;

    if (materialRef.current.uniforms.uPupilScale) {
        const currentPupil = materialRef.current.uniforms.uPupilScale.value.x;
        const newPupil = THREE.MathUtils.lerp(currentPupil, targetPupilScale, delta * 3.0);
        materialRef.current.uniforms.uPupilScale.value.set(newPupil, 1.0);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 64]} />
      {/* 2.5 radius ensures it covers enough screen space but curves nicely */}
      <shaderMaterial
        ref={materialRef}
        vertexShader={eyeVertexShader}
        fragmentShader={eyeFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColorIris: { value: new THREE.Color(0x3b82f6) },
          uColorPupil: { value: new THREE.Color(0x000000) },
          uColorSclera: { value: new THREE.Color(0xffffff) }, // Usually hidden or dark in this style
          uPupilScale: { value: new THREE.Vector2(0.25, 1.0) },
          uLook: { value: new THREE.Vector2(0, 0) }
        }}
        transparent={true}
      />
    </mesh>
  );
}


// --- Main Exported Component ---

export function EyeOrb({ status }: EyeOrbProps) {
  // Gyro logic
  const { targetRotation, isSupported, permissionGranted, requestPermission } = useGyro();

  // Performance / Tiering logic
  const [tier, setTier] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    // Basic tier detection
    const isLowPower = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // @ts-ignore
    const memory = navigator.deviceMemory || 4; // Default to 4GB if unknown

    if (isLowPower || memory < 4) {
      setTier('low');
    }
  }, []);

  if (tier === 'low') {
    // Fallback: simple CSS orb
    return (
      <div className="w-full h-full flex items-center justify-center opacity-30">
        <div className={`w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl`} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Container for the 3D scene */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] opacity-40 sm:opacity-20 transition-opacity duration-1000">
          <Canvas
            dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, 5], fov: 45 }}
          >
            <Suspense fallback={null}>
               <EyeMesh status={status} gyroTarget={targetRotation} />
            </Suspense>
          </Canvas>
      </div>

      {/* iOS Gyro Trigger */}
      {isSupported && !permissionGranted && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto z-10">
           <button
             onClick={requestPermission}
             className="bg-black/20 backdrop-blur-md border border-white/10 text-white/50 text-[10px] px-2 py-1 rounded-full hover:text-white hover:bg-black/40 transition-all"
           >
             Enable Motion
           </button>
        </div>
      )}
    </div>
  );
}
