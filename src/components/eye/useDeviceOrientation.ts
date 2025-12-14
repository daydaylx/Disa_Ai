import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { EyeOrbVec2 } from "./types";

export type DeviceOrientationPermissionState = "granted" | "denied" | "prompt" | "unavailable";

export type UseDeviceOrientationResult = {
  isSupported: boolean;
  needsPermission: boolean;
  permissionState: DeviceOrientationPermissionState;
  requestPermission: () => Promise<DeviceOrientationPermissionState>;
  lookTargetRef: React.MutableRefObject<EyeOrbVec2>;
};

type UseDeviceOrientationOptions = {
  enabled: boolean;
  onChange?: () => void;
  clamp?: number;
  deadzone?: number;
  smoothingTimeConstantMs?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function applyDeadzone(value: number, deadzone: number): number {
  if (Math.abs(value) <= deadzone) return 0;
  const sign = value < 0 ? -1 : 1;
  const normalized = (Math.abs(value) - deadzone) / (1 - deadzone);
  return sign * normalized;
}

const STORAGE_KEY = "eye-orb-gyro-permission";

function readPersistedPermission(): DeviceOrientationPermissionState | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "granted" || stored === "denied") return stored;
  } catch {
    // localStorage unavailable or blocked
  }
  return null;
}

function persistPermission(state: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, state);
  } catch {
    // localStorage unavailable or blocked
  }
}

export function useDeviceOrientation({
  enabled,
  onChange,
  clamp: clampRange = 0.28,
  deadzone = 0.06,
  smoothingTimeConstantMs = 220,
}: UseDeviceOrientationOptions): UseDeviceOrientationResult {
  const isSupported =
    typeof window !== "undefined" && typeof window.DeviceOrientationEvent !== "undefined";

  const needsPermission = useMemo(() => {
    if (!isSupported) return false;
    const maybe = window.DeviceOrientationEvent as unknown as { requestPermission?: () => unknown };
    return typeof maybe.requestPermission === "function";
  }, [isSupported]);

  const [permissionState, setPermissionState] = useState<DeviceOrientationPermissionState>(() => {
    if (!isSupported) return "unavailable";
    if (!needsPermission) return "granted";
    const persisted = readPersistedPermission();
    return persisted ?? "prompt";
  });

  const lookTargetRef = useRef<EyeOrbVec2>({ x: 0, y: 0 });
  const smoothRef = useRef<EyeOrbVec2>({ x: 0, y: 0 });
  const lastEventTimeRef = useRef<number | null>(null);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setPermissionState("unavailable");
      return "unavailable";
    }

    if (!needsPermission) {
      setPermissionState("granted");
      return "granted";
    }

    try {
      const maybe = window.DeviceOrientationEvent as unknown as {
        requestPermission: () => Promise<"granted" | "denied">;
      };
      const result = await maybe.requestPermission();
      const next: DeviceOrientationPermissionState = result === "granted" ? "granted" : "denied";
      persistPermission(next);
      setPermissionState(next);
      return next;
    } catch {
      persistPermission("denied");
      setPermissionState("denied");
      return "denied";
    }
  }, [isSupported, needsPermission]);

  useEffect(() => {
    if (!enabled) return;
    if (!isSupported) return;
    if (needsPermission && permissionState !== "granted") return;

    const handle = (event: DeviceOrientationEvent) => {
      // On iOS, beta/gamma can be null until permission is granted; also guard for safety.
      const beta = typeof event.beta === "number" ? event.beta : 0; // front-back
      const gamma = typeof event.gamma === "number" ? event.gamma : 0; // left-right

      // Map to a subtle, "heavy eye" target. We invert so the eye appears to hold focus.
      const rawX = clamp(-gamma / 45, -1, 1);
      const rawY = clamp(-beta / 60, -1, 1);

      const dzX = applyDeadzone(rawX, deadzone);
      const dzY = applyDeadzone(rawY, deadzone);

      const clampedX = clamp(dzX, -clampRange, clampRange);
      const clampedY = clamp(dzY, -clampRange, clampRange);

      const now = performance.now();
      const last = lastEventTimeRef.current ?? now;
      lastEventTimeRef.current = now;

      const dt = Math.max(0, now - last);
      const alpha = 1 - Math.exp(-dt / smoothingTimeConstantMs);

      smoothRef.current.x += (clampedX - smoothRef.current.x) * alpha;
      smoothRef.current.y += (clampedY - smoothRef.current.y) * alpha;

      const prev = lookTargetRef.current;
      const nextX = smoothRef.current.x;
      const nextY = smoothRef.current.y;

      // Avoid firing too often on tiny changes.
      const changed = Math.abs(nextX - prev.x) + Math.abs(nextY - prev.y) > 0.0015;

      lookTargetRef.current = { x: nextX, y: nextY };
      if (changed) onChange?.();
    };

    window.addEventListener("deviceorientation", handle, { passive: true });
    return () => {
      window.removeEventListener("deviceorientation", handle);
    };
  }, [
    clampRange,
    deadzone,
    enabled,
    isSupported,
    needsPermission,
    onChange,
    permissionState,
    smoothingTimeConstantMs,
  ]);

  // Reset when disabled to avoid snapping after re-enable.
  useEffect(() => {
    if (enabled) return;
    lookTargetRef.current = { x: 0, y: 0 };
    smoothRef.current = { x: 0, y: 0 };
    lastEventTimeRef.current = null;
  }, [enabled]);

  return {
    isSupported,
    needsPermission,
    permissionState,
    requestPermission,
    lookTargetRef,
  };
}
