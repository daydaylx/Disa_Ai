import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { useSettings } from "./useSettings";

// Configuration
const MIN_SPAWN_INTERVAL_MS = 60000; // 1 minute cooldown
const MAX_SPAWNS_PER_SESSION = 5;
const CHECK_INTERVAL_MS = 5000; // Check every 5s
const SPAWN_CHANCE = 0.2; // 20% chance every check if cooldown ready

// Allowed routes (whitelist)
const ALLOWED_ROUTES = [
  "/",
  "/about",
  "/impressum",
  "/datenschutz",
  "/settings",
  "/settings/behavior",
  "/settings/appearance",
  "/settings/extras",
  "/models",
];
const BLOCKED_ROUTES_PREFIX = ["/chat"];

/**
 * Calculate adaptive animation duration based on viewport width
 * Mobile devices get longer durations for better visibility and consistent visual speed
 * @returns Duration in milliseconds
 */
function getAdaptiveAnimationDuration(): number {
  if (typeof window === "undefined") return 6000; // SSR fallback
  const vw = window.innerWidth;
  // Mobile (< 640px): 8s - slower for better visibility
  // Tablet (640-1024px): 7s - moderate speed
  // Desktop (> 1024px): 6s - original speed
  if (vw < 640) return 8000;
  if (vw < 1024) return 7000;
  return 6000;
}

type NekoState = "HIDDEN" | "SPAWNING" | "WALKING" | "FLEEING";

interface NekoStatus {
  state: NekoState;
  x: number; // 0-100 percentage
  direction: "left" | "right";
}

export function useNeko() {
  const { settings } = useSettings();
  const location = useLocation();
  const [status, setStatus] = useState<NekoStatus>({
    state: "HIDDEN",
    x: -10,
    direction: "right",
  });

  // Session state (refs to persist without re-renders)
  const lastSpawnTimeRef = useRef<number>(0);
  const spawnCountRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  const despawn = useCallback(() => {
    isVisibleRef.current = false;
    setStatus((prev) => ({ ...prev, state: "HIDDEN" }));
  }, []);

  const animateWalk = useCallback(
    (route: string) => {
      let startTimestamp: number | null = null;
      // Use adaptive duration from incoming changes
      const duration = getAdaptiveAnimationDuration();
      const startX = route === "A" ? -10 : 110;
      const targetX = route === "A" ? 120 : -20; // Move across screen

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        if (!isVisibleRef.current) return; // Stop if fled

        const currentX = startX + (targetX - startX) * progress;

        setStatus((prev) => ({
          ...prev,
          x: currentX,
        }));

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          // Natural despawn
          despawn();
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    },
    [despawn],
  );

  const spawnNeko = useCallback(() => {
    spawnCountRef.current++;
    lastSpawnTimeRef.current = Date.now();
    isVisibleRef.current = true;

    // Determine Route
    // Route A: Left -> Right (slow)
    // Route B: Right -> Middle -> Flee
    const route = Math.random() > 0.5 ? "A" : "B";
    const startX = route === "A" ? -10 : 110;
    const direction = route === "A" ? "right" : "left";

    setStatus({
      state: "SPAWNING",
      x: startX,
      direction,
    });

    // Start Walking after spawn delay
    setTimeout(() => {
      setStatus((prev) => ({ ...prev, state: "WALKING" }));
      animateWalk(route);
    }, 100);
  }, [animateWalk]);

  const triggerFlee = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    setStatus((prev) => ({ ...prev, state: "FLEEING" }));

    // Flee logic: Quick dash to nearest exit
    setStatus((prev) => {
      const currentX = prev.x;
      const fleeTargetX = currentX > 50 ? 120 : -20;
      const fleeDirection = currentX > 50 ? "right" : "left";

      // Quick animation out
      let startTimestamp: number | null = null;
      const duration = 500; // 0.5s flee time

      const fleeStep = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        const newX = currentX + (fleeTargetX - currentX) * progress;

        setStatus((p) => ({ ...p, x: newX }));

        if (progress < 1) {
          requestAnimationFrame(fleeStep);
        } else {
          despawn();
        }
      };

      requestAnimationFrame(fleeStep);

      return { ...prev, direction: fleeDirection };
    });
  }, [despawn]);

  // Interaction Tracking - Only for fleeing, not for preventing spawn
  useEffect(() => {
    if (!settings.enableNeko) return;

    // Explicit tap to scare
    const handleTap = (_e: PointerEvent) => {
      // If visible, maybe flee?
      if (isVisibleRef.current && status.state === "WALKING") {
        triggerFlee();
      }
    };

    window.addEventListener("pointerdown", handleTap);

    return () => {
      window.removeEventListener("pointerdown", handleTap);
    };
  }, [settings.enableNeko, status.state, triggerFlee]);

  // Cleanup Effect: Handle disabling Neko
  useEffect(() => {
    if (!settings.enableNeko && status.state !== "HIDDEN") {
      setStatus((prev) => ({ ...prev, state: "HIDDEN" }));
      isVisibleRef.current = false;
    }
  }, [settings.enableNeko, status.state]);

  // Main Loop (Scheduler)
  useEffect(() => {
    if (!settings.enableNeko) return;

    const checkSpawnCondition = () => {
      const now = Date.now();
      const isCooldownOver = now - lastSpawnTimeRef.current > MIN_SPAWN_INTERVAL_MS;
      const isBelowLimit = spawnCountRef.current < MAX_SPAWNS_PER_SESSION;

      // Check if current path is allowed
      const isAllowedRoute =
        ALLOWED_ROUTES.includes(location.pathname) &&
        !BLOCKED_ROUTES_PREFIX.some((prefix) => location.pathname.startsWith(prefix));

      // Respect reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const appReducedMotion = document.body.classList.contains("reduce-motion");

      if (
        isCooldownOver &&
        isBelowLimit &&
        isAllowedRoute &&
        !isVisibleRef.current &&
        !prefersReducedMotion &&
        !appReducedMotion
      ) {
        // Random Chance Check (My logic)
        if (Math.random() < SPAWN_CHANCE) {
          spawnNeko();
        }
      }
    };

    const interval = setInterval(checkSpawnCondition, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [settings.enableNeko, location.pathname, spawnNeko]);

  return status;
}
