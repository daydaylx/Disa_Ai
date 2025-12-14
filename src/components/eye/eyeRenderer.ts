import * as THREE from "three";

import {
  type EyeOrbMaterialUniforms,
  eyeOrbVertexShader,
  makeEyeOrbFragmentShader,
} from "./eyeShaders";
import type { EyeOrbQualityTier } from "./qualityTier";
import type { EyeOrbPhase, EyeOrbVec2 } from "./types";

export type EyeOrbRendererOptions = {
  canvas: HTMLCanvasElement;
  tier: Exclude<EyeOrbQualityTier, "low">;
  prefersReducedMotion: boolean;
  pixelRatio: number;
};

export type EyeOrbRenderer = {
  setSize: (width: number, height: number) => void;
  setTier: (tier: Exclude<EyeOrbQualityTier, "low">, pixelRatio: number) => void;
  setPrefersReducedMotion: (prefersReducedMotion: boolean) => void;
  setPhase: (phase: EyeOrbPhase) => void;
  setLookTarget: (look: EyeOrbVec2) => void;
  flashError: () => void;
  updateAndRender: (nowMs: number) => { needsAnotherFrame: boolean; nextFrameInMs: number | null };
  dispose: () => void;
};

type InternalState = {
  lastNowMs: number | null;
  phase: EyeOrbPhase;
  targetActivity: number;
  activity: number;
  look: THREE.Vector2;
  targetLook: THREE.Vector2;
  errorFlashStartMs: number | null;
  prefersReducedMotion: boolean;
};

const PHASE_ACTIVITY: Record<EyeOrbPhase, number> = {
  idle: 0.14,
  thinking: 0.32,
  streaming: 0.42,
  error: 0.14,
};

function readCssColorVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const raw = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw || fallback;
}

function colorFromCss(value: string): THREE.Color {
  // THREE.Color can parse hex and rgb/rgba strings.
  // For rgba, alpha is ignored, which is what we want for shader base colors.
  return new THREE.Color(value);
}

function easeExp(dtSeconds: number, speed: number): number {
  // Converts a "speed" to a stable lerp factor independent of frame rate.
  return 1 - Math.exp(-dtSeconds * speed);
}

export function createEyeOrbRenderer(options: EyeOrbRendererOptions): EyeOrbRenderer {
  const { canvas } = options;

  let tier: Exclude<EyeOrbQualityTier, "low"> = options.tier;
  let pixelRatio = options.pixelRatio;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: tier === "high",
    powerPreference: tier === "high" ? "high-performance" : "low-power",
    premultipliedAlpha: false,
    depth: false,
    stencil: false,
  });

  renderer.setClearColor(new THREE.Color("black"), 0);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();

  // Perspective keeps the eye feeling dimensional without needing camera motion.
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0, 12.5);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  let geometry = new THREE.SphereGeometry(
    1.0,
    tier === "high" ? 64 : 48,
    tier === "high" ? 64 : 48,
  );

  const scleraCss = readCssColorVar("--text-primary", "rgb(250, 250, 250)");
  const surfaceCss = readCssColorVar("--bg-surface-1", "rgb(24, 24, 27)");
  const irisA_Css = readCssColorVar("--accent-chat", "rgb(139, 92, 246)");
  const irisB_Css = readCssColorVar("--accent-models", "rgb(6, 182, 212)");
  const glowCss = readCssColorVar("--accent-chat-glow", "rgba(139, 92, 246, 0.25)");

  const scleraColor = colorFromCss(scleraCss).lerp(colorFromCss(surfaceCss), 0.18);
  const irisA = colorFromCss(irisA_Css);
  const irisB = colorFromCss(irisB_Css);
  const glow = colorFromCss(glowCss);

  const uniforms: EyeOrbMaterialUniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_look: { value: new THREE.Vector2(0, 0) },
    u_activity: { value: 0.12 },
    u_errorFlash: { value: 0 },
    u_sclera: { value: scleraColor },
    u_irisA: { value: irisA },
    u_irisB: { value: irisB },
    u_glow: { value: glow },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: eyeOrbVertexShader,
    fragmentShader: makeEyeOrbFragmentShader(tier),
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const state: InternalState = {
    lastNowMs: null,
    phase: "idle",
    targetActivity: PHASE_ACTIVITY.idle,
    activity: PHASE_ACTIVITY.idle,
    look: new THREE.Vector2(0, 0),
    targetLook: new THREE.Vector2(0, 0),
    errorFlashStartMs: null,
    prefersReducedMotion: options.prefersReducedMotion,
  };

  const microVec = new THREE.Vector2(0, 0);
  const desiredLook = new THREE.Vector2(0, 0);

  const setSize = (width: number, height: number) => {
    const safeW = Math.max(1, Math.floor(width));
    const safeH = Math.max(1, Math.floor(height));
    renderer.setSize(safeW, safeH, false);
    camera.aspect = safeW / safeH;
    camera.updateProjectionMatrix();
    uniforms.u_resolution.value.set(safeW, safeH);
  };

  const setTier = (nextTier: Exclude<EyeOrbQualityTier, "low">, nextPixelRatio: number) => {
    if (nextTier !== tier) {
      tier = nextTier;
      material.fragmentShader = makeEyeOrbFragmentShader(tier);
      material.needsUpdate = true;

      // Geometry resolution is tier-dependent.
      geometry.dispose();
      geometry = new THREE.SphereGeometry(
        1.0,
        tier === "high" ? 64 : 48,
        tier === "high" ? 64 : 48,
      );
      mesh.geometry = geometry;
    }

    if (nextPixelRatio !== pixelRatio) {
      pixelRatio = nextPixelRatio;
      renderer.setPixelRatio(pixelRatio);
    }
  };

  const setPrefersReducedMotion = (prefersReduced: boolean) => {
    state.prefersReducedMotion = prefersReduced;
  };

  const setPhase = (phase: EyeOrbPhase) => {
    state.phase = phase;
    state.targetActivity = PHASE_ACTIVITY[phase] ?? PHASE_ACTIVITY.idle;
  };

  const setLookTarget = (look: EyeOrbVec2) => {
    state.targetLook.set(look.x, look.y);
  };

  const flashError = () => {
    state.errorFlashStartMs = performance.now();
  };

  const updateAndRender = (nowMs: number) => {
    const last = state.lastNowMs ?? nowMs;
    state.lastNowMs = nowMs;

    const dtMs = Math.min(80, Math.max(0, nowMs - last));
    const dt = dtMs / 1000;

    // Smooth transitions (no jitter).
    const activityAlpha = easeExp(dt, 3.2);
    state.activity += (state.targetActivity - state.activity) * activityAlpha;

    // Micro-motion: extremely slow drift, disabled for reduced motion.
    const microEnabled =
      !state.prefersReducedMotion && (state.phase === "thinking" || state.phase === "streaming");
    const t = nowMs / 1000;
    if (microEnabled) {
      microVec.set(Math.sin(t * 0.16), Math.cos(t * 0.13)).multiplyScalar(0.035 * state.activity);
    } else {
      microVec.set(0, 0);
    }

    desiredLook.copy(state.targetLook).add(microVec);

    const lookAlpha = easeExp(dt, 6.0);
    state.look.lerp(desiredLook, lookAlpha);
    uniforms.u_look.value.copy(state.look);

    // u_activity drives subtle shading. Keep it calm and stable.
    uniforms.u_activity.value = state.activity;

    // Error flash is short-lived (200ms), and does not keep the eye "red".
    let flash = 0;
    if (state.errorFlashStartMs !== null) {
      const elapsed = nowMs - state.errorFlashStartMs;
      const phase01 = THREE.MathUtils.clamp(elapsed / 200, 0, 1);
      flash = 1 - phase01 * phase01;
      if (elapsed >= 220) state.errorFlashStartMs = null;
    }
    uniforms.u_errorFlash.value = flash;

    // Time is only used for very subtle noise evolution (no flicker).
    uniforms.u_time.value = t;

    renderer.render(scene, camera);

    const easingLeft =
      Math.abs(state.activity - state.targetActivity) > 0.004 ||
      state.look.distanceTo(desiredLook) > 0.003 ||
      flash > 0.001;

    const needsAnotherFrame = easingLeft || microEnabled;
    const nextFrameInMs = needsAnotherFrame ? (microEnabled ? 40 : 33) : null;
    return { needsAnotherFrame, nextFrameInMs };
  };

  const dispose = () => {
    scene.remove(mesh);
    material.dispose();
    mesh.geometry.dispose();

    renderer.dispose();
    // Best-effort context loss to avoid GPU leaks on hot-reloads / route changes.
    try {
      renderer.forceContextLoss();
    } catch {
      // ignore
    }
  };

  return {
    setSize,
    setTier,
    setPrefersReducedMotion,
    setPhase,
    setLookTarget,
    flashError,
    updateAndRender,
    dispose,
  };
}
