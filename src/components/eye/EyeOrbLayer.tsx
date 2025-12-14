import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import type { EyeOrbRenderer } from "./eyeRenderer";
import { type EyeOrbQualityTier, getInitialEyeOrbQualityTier } from "./qualityTier";
import type { EyeOrbPhase } from "./types";
import { useDeviceOrientation } from "./useDeviceOrientation";

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;

    const handle = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", handle);
    return () => media.removeEventListener("change", handle);
  }, []);

  return prefersReducedMotion;
}

function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === "undefined") return true;
    return document.visibilityState === "visible";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    const onChange = () => setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return isVisible;
}

function getPixelRatioLimit(tier: Exclude<EyeOrbQualityTier, "low">): number {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return tier === "high" ? Math.min(dpr, 1.5) : Math.min(dpr, 1.25);
}

function EyeOrbFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 rounded-full",
        "bg-surface-1/20 border border-white/5",
        className,
      )}
    >
      <div className="absolute inset-0 rounded-full bg-accent-chat-surface blur-2xl opacity-60" />
      <div className="absolute inset-10 rounded-full bg-surface-2/40 border border-white/8" />
      <div className="absolute inset-[28%] rounded-full bg-accent-chat-dim border border-white/10" />
      <div className="absolute inset-[42%] rounded-full bg-surface-inset/80" />
      <div className="absolute -top-6 left-10 h-16 w-20 rounded-full bg-white/10 blur-xl rotate-[-18deg]" />
      <div className="absolute inset-0 rounded-full ring-1 ring-white/5" />
    </div>
  );
}

export type EyeOrbLayerProps = {
  phase: EyeOrbPhase;
  className?: string;
};

/**
 * EyeOrbLayer – Chat Presence Background
 *
 * Entry point: rendered by `src/pages/Chat.tsx` as an absolutely-positioned background layer.
 * Phase is derived from chat state and passed via `phase`.
 * Tiering: High (WebGL + gyro), Medium (WebGL reduced), Low (CSS fallback).
 */
export function EyeOrbLayer({ phase, className }: EyeOrbLayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isPageVisible = usePageVisibility();

  const initialTier = useMemo(() => getInitialEyeOrbQualityTier(), []);
  const [tier, setTier] = useState<EyeOrbQualityTier>(initialTier.tier);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<EyeOrbRenderer | null>(null);

  const rafIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<number | null>(null);
  const scheduledRef = useRef(false);
  const tickRef = useRef<(now: number) => void>(() => {});
  const isFpsProbingRef = useRef(false);
  const didFpsProbeRef = useRef(false);
  const prevPhaseRef = useRef<EyeOrbPhase>("idle");
  const phaseRef = useRef<EyeOrbPhase>(phase);
  phaseRef.current = phase;

  const cancelFrame = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    scheduledRef.current = false;
  }, []);

  const scheduleRender = useCallback(
    (delayMs = 0) => {
      if (!isPageVisible) return;
      if (isFpsProbingRef.current) return;
      if (scheduledRef.current) return;
      if (!rendererRef.current) return;

      scheduledRef.current = true;
      if (delayMs <= 0) {
        rafIdRef.current = requestAnimationFrame((now) => tickRef.current(now));
        return;
      }
      timeoutIdRef.current = window.setTimeout(() => {
        rafIdRef.current = requestAnimationFrame((now) => tickRef.current(now));
      }, delayMs);
    },
    [isPageVisible],
  );

  const gyroEnabled = tier === "high" && !prefersReducedMotion && isPageVisible;
  const onOrientationChange = useCallback(() => {
    scheduleRender(0);
  }, [scheduleRender]);

  const orientation = useDeviceOrientation({
    enabled: gyroEnabled,
    onChange: onOrientationChange,
  });

  useEffect(() => {
    tickRef.current = (now: number) => {
      scheduledRef.current = false;
      if (!isPageVisible) return;
      if (isFpsProbingRef.current) return;

      const renderer = rendererRef.current;
      if (!renderer) return;

      renderer.setLookTarget(orientation.lookTargetRef.current);
      const result = renderer.updateAndRender(now);
      if (result.needsAnotherFrame && typeof result.nextFrameInMs === "number") {
        scheduleRender(result.nextFrameInMs);
      }
    };
  }, [isPageVisible, orientation.lookTargetRef, scheduleRender]);

  // Prefer reduced motion: never keep "high" (gyro + micro-motion).
  useEffect(() => {
    if (!prefersReducedMotion) return;
    setTier((t) => (t === "high" ? "medium" : t));
  }, [prefersReducedMotion]);

  // iOS denied permission: fall back to medium (WebGL, no gyro).
  useEffect(() => {
    if (tier !== "high") return;
    if (!orientation.needsPermission) return;
    if (orientation.permissionState !== "denied") return;
    setTier("medium");
  }, [orientation.needsPermission, orientation.permissionState, tier]);

  // Create / update renderer for WebGL tiers.
  useEffect(() => {
    if (tier === "low") {
      cancelFrame();
      rendererRef.current?.dispose();
      rendererRef.current = null;
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const nextTier = tier === "high" ? "high" : "medium";
    const pixelRatio = getPixelRatioLimit(nextTier);

    let cancelled = false;
    let fpsProbeRafId: number | null = null;

    const ensureRenderer = async () => {
      const existing = rendererRef.current;
      if (existing) {
        existing.setTier(nextTier, pixelRatio);
        existing.setPrefersReducedMotion(prefersReducedMotion);
        scheduleRender(0);
        return;
      }

      try {
        const { createEyeOrbRenderer } = await import("./eyeRenderer");
        if (cancelled) return;

        const renderer = createEyeOrbRenderer({
          canvas,
          tier: nextTier,
          prefersReducedMotion,
          pixelRatio,
        });
        rendererRef.current = renderer;

        const rect = container.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height);

        // Apply current phase immediately (the phase effect may have run before WebGL was ready).
        const currentPhase = phaseRef.current;
        const phaseForRenderer: EyeOrbPhase = currentPhase === "error" ? "idle" : currentPhase;
        renderer.setPhase(phaseForRenderer);
        renderer.setLookTarget(orientation.lookTargetRef.current);
        renderer.setPrefersReducedMotion(prefersReducedMotion);

        if (currentPhase === "error") {
          renderer.flashError();
        }

        // FPS heuristic (~2s warmup) to downgrade on low-end devices.
        if (!didFpsProbeRef.current && isPageVisible) {
          didFpsProbeRef.current = true;
          isFpsProbingRef.current = true;
          cancelFrame();

          let start = 0;
          let frames = 0;

          const probe = (now: number) => {
            if (cancelled) return;
            const active = rendererRef.current;
            if (!active) return;

            if (document.visibilityState !== "visible") {
              fpsProbeRafId = requestAnimationFrame(probe);
              return;
            }

            if (!start) start = now;
            frames += 1;

            active.setPhase("idle");
            active.setLookTarget({ x: 0, y: 0 });
            active.updateAndRender(now);

            if (now - start < 2000) {
              fpsProbeRafId = requestAnimationFrame(probe);
              return;
            }

            isFpsProbingRef.current = false;
            const fps = frames / ((now - start) / 1000);

            // Conservative downgrade thresholds (only if clearly struggling).
            if (nextTier === "high" && fps < 50) {
              setTier("medium");
              return;
            }
            if (nextTier === "medium" && fps < 42) {
              setTier("low");
              return;
            }

            scheduleRender(0);
          };

          fpsProbeRafId = requestAnimationFrame(probe);
          return;
        }

        scheduleRender(0);
      } catch (error) {
        console.warn("[EyeOrb] WebGL init failed, falling back to CSS.", error);
        setTier("low");
      }
    };

    void ensureRenderer();

    return () => {
      cancelled = true;
      if (fpsProbeRafId !== null) cancelAnimationFrame(fpsProbeRafId);
    };
  }, [
    cancelFrame,
    isPageVisible,
    prefersReducedMotion,
    scheduleRender,
    tier,
    orientation.lookTargetRef,
  ]);

  // Keep renderer sized to the orb container (no fullscreen fill-rate).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const applySize = () => {
      const rect = el.getBoundingClientRect();
      const renderer = rendererRef.current;
      if (!renderer) return;
      renderer.setSize(rect.width, rect.height);
      scheduleRender(0);
    };

    const ro = new ResizeObserver(() => applySize());
    ro.observe(el);
    return () => ro.disconnect();
  }, [scheduleRender]);

  // Phase coupling (subtle): error is a brief blink, then returns to idle baseline.
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const phaseForRenderer: EyeOrbPhase = phase === "error" ? "idle" : phase;
    renderer.setPhase(phaseForRenderer);
    renderer.setPrefersReducedMotion(prefersReducedMotion);

    if (phase === "error" && prevPhaseRef.current !== "error") {
      renderer.flashError();
    }

    prevPhaseRef.current = phase;
    scheduleRender(0);
  }, [phase, prefersReducedMotion, scheduleRender]);

  // Visibility: stop ticking when hidden, and re-render when returning.
  useEffect(() => {
    if (isPageVisible) {
      scheduleRender(0);
      return;
    }
    cancelFrame();
  }, [cancelFrame, isPageVisible, scheduleRender]);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      cancelFrame();
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, [cancelFrame]);

  const showMotionButton =
    tier === "high" &&
    !prefersReducedMotion &&
    isPageVisible &&
    orientation.isSupported &&
    orientation.needsPermission &&
    orientation.permissionState === "prompt";

  return (
    <>
      <div
        className={cn("absolute inset-0 z-background pointer-events-none", className)}
        aria-hidden="true"
      >
        <div
          className={cn(
            "absolute inset-0 -mx-4 sm:-mx-6 overflow-hidden",
            "opacity-[0.34] sm:opacity-[0.42]",
            "transition-opacity duration-500",
          )}
        >
          {/* Orb anchor: subtle, partially offscreen so chat stays readable */}
          <div className="absolute right-4 top-4 sm:right-6 sm:top-6 translate-x-1/6 -translate-y-1/6">
            <div
              ref={containerRef}
              className={cn(
                "relative aspect-square",
                "w-[clamp(11rem,50vw,18rem)] sm:w-[clamp(14rem,26vw,22rem)]",
                prefersReducedMotion ? "opacity-70" : "opacity-100",
              )}
              style={{
                WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 82%)",
                maskImage: "radial-gradient(circle, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 82%)",
              }}
            >
              <div className="absolute inset-0 rounded-full bg-accent-chat-surface blur-3xl opacity-70" />
              <div className="absolute inset-0 rounded-full bg-surface-1/20 border border-white/5" />

              {tier === "low" ? (
                <EyeOrbFallback />
              ) : (
                <canvas
                  ref={canvasRef}
                  className="relative h-full w-full"
                  // Prevent accidental pointer interactions on the WebGL canvas.
                  style={{ pointerEvents: "none" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Minimal iOS permission trigger (only when required) */}
      {showMotionButton && (
        <div className="absolute top-3 right-3 pointer-events-auto z-sticky-content">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => void orientation.requestPermission().then(() => scheduleRender(0))}
            className="h-9 px-3 text-xs rounded-full bg-surface-2/80 border border-white/10 backdrop-blur-md"
          >
            Motion aktivieren
          </Button>
        </div>
      )}
    </>
  );
}
