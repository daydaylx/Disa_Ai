import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { useSettings } from "./useSettings";

// Configuration
const IDLE_THRESHOLD_MS = 7000; // 7s idle before chance to spawn
const SPAWN_DURATION_MS = 6000; // 6s visible duration
const MIN_SPAWN_INTERVAL_MS = 120000; // 2 minutes cooldown between spawns
const MAX_SPAWNS_PER_SESSION = 3;

// Allowed routes (whitelist)
const ALLOWED_ROUTES = [
  "/",
  "/about",
  "/impressum",
  "/datenschutz",
  "/settings",
  "/settings/extras",
];
const BLOCKED_ROUTES_PREFIX = ["/chat"];

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
  const lastUserActionRef = useRef<number>(Date.now());
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
      const duration = SPAWN_DURATION_MS;
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

  // User Interaction Tracking
  useEffect(() => {
    if (!settings.enableNeko) return;

    const updateActivity = () => {
      lastUserActionRef.current = Date.now();

      // Trigger flee if visible
      if (isVisibleRef.current && status.state === "WALKING") {
        triggerFlee();
      }
    };

    window.addEventListener("pointerdown", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("scroll", updateActivity, { passive: true });
    window.addEventListener("touchstart", updateActivity, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("touchstart", updateActivity);
    };
  }, [settings.enableNeko, status.state, triggerFlee]);

  // Main Loop (Scheduler)
  useEffect(() => {
    if (!settings.enableNeko) {
      setStatus((prev) => ({ ...prev, state: "HIDDEN" }));
      return;
    }

    const checkSpawnCondition = () => {
      const now = Date.now();
      const isIdle = now - lastUserActionRef.current > IDLE_THRESHOLD_MS;
      const isCooldownOver = now - lastSpawnTimeRef.current > MIN_SPAWN_INTERVAL_MS;
      const isBelowLimit = spawnCountRef.current < MAX_SPAWNS_PER_SESSION;
      const isAllowedRoute =
        ALLOWED_ROUTES.includes(location.pathname) &&
        !BLOCKED_ROUTES_PREFIX.some((prefix) => location.pathname.startsWith(prefix));

      // Respect reduced motion preference
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (
        isIdle &&
        isCooldownOver &&
        isBelowLimit &&
        isAllowedRoute &&
        !isVisibleRef.current &&
        !prefersReducedMotion
      ) {
        spawnNeko();
      }
    };

    const interval = setInterval(checkSpawnCondition, 3000);
    return () => clearInterval(interval);
  }, [settings.enableNeko, location.pathname, spawnNeko]);

  return status;
}
