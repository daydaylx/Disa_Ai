import { useEffect, useMemo, useState } from "react";

import type { CoreStatus } from "@/types/orb";

import { useDeviceOrientation } from "./useDeviceOrientation";

interface SimpleCssEyeOrbProps {
  status: CoreStatus;
  isObscured?: boolean;
}

type QualityTier = "high" | "medium" | "low";

/**
 * Simplified CSS-based Eye Orb with Gyro support
 * Replaces the heavy WebGL/Three.js implementation
 */
export function SimpleCssEyeOrb({ status, isObscured = false }: SimpleCssEyeOrbProps) {
  const [tier, setTier] = useState<QualityTier>("high");
  const [, forceUpdate] = useState(0);

  const { isSupported, permissionState, requestPermission, lookTargetRef } = useDeviceOrientation({
    enabled: true,
    onChange: () => forceUpdate((n) => n + 1),
  });

  // Detect quality tier on mount
  useEffect(() => {
    const detectTier = (): QualityTier => {
      // Check for reduced motion preference
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return "low";
      }

      // Check device memory (if available)
      const nav = navigator as Navigator & { deviceMemory?: number };
      if (nav.deviceMemory && nav.deviceMemory <= 4) {
        return "medium";
      }

      return "high";
    };

    setTier(detectTier());
  }, []);

  const permissionGranted = permissionState === "granted";

  // Calculate transform based on gyro input
  const eyeTransform = useMemo(() => {
    if (!permissionGranted) return "rotateX(0deg) rotateY(0deg)";

    // Scale rotation for eye movement (±25 degrees max)
    // lookTargetRef is already smoothed and clamped
    const rotX = lookTargetRef.current.y * 90; // Scale to degrees
    const rotY = lookTargetRef.current.x * 90;

    return `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }, [permissionGranted, lookTargetRef]);

  // Status-based CSS variables
  const statusVars = useMemo(() => {
    const colors = {
      idle: { primary: "hsl(200, 70%, 50%)", secondary: "hsl(210, 65%, 45%)" },
      thinking: { primary: "hsl(280, 70%, 60%)", secondary: "hsl(270, 65%, 55%)" },
      streaming: { primary: "hsl(190, 75%, 55%)", secondary: "hsl(200, 70%, 50%)" },
      error: { primary: "hsl(0, 80%, 60%)", secondary: "hsl(10, 75%, 55%)" },
    };

    return {
      "--eye-color-primary": colors[status].primary,
      "--eye-color-secondary": colors[status].secondary,
    } as React.CSSProperties;
  }, [status]);

  return (
    <div
      className="absolute inset-0 z-[5] pointer-events-none flex items-center justify-center"
      aria-hidden="true"
      style={{
        ...statusVars,
        opacity: isObscured ? 0.1 : 0.95,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Eye Container */}
      <div className="eye-orb-container" data-tier={tier} data-status={status}>
        {/* Eye Sphere with Gyro Transform */}
        <div
          className="eye-sphere"
          style={{
            transform: eyeTransform,
            transition: permissionGranted ? "none" : "transform 0.3s ease",
          }}
        >
          {/* Iris with Status-based Styling */}
          <div className="iris">
            {/* Pupil */}
            <div className="pupil" />

            {/* Highlight (cornea reflection) */}
            <div className="highlight" />
          </div>
        </div>
      </div>

      {/* iOS Gyro Permission Trigger */}
      {isSupported && !permissionGranted && tier !== "low" && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto z-10">
          <button
            onClick={requestPermission}
            className="px-4 py-2 bg-surface-2 border border-border-subtle rounded-full text-xs font-medium text-ink-secondary hover:text-ink-primary transition-colors"
          >
            Motion aktivieren
          </button>
        </div>
      )}
    </div>
  );
}
