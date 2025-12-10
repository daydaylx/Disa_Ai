import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type CoreStatus = "idle" | "thinking" | "streaming" | "error";

interface LivingCoreProps {
  status: CoreStatus;
  modelName: string;
  toneLabel: string;
  creativityLabel: string;
  lastErrorMessage?: string;
  size?: "mobile" | "desktop" | "auto";
  intensity?: "subtle" | "normal" | "strong";
}

type LivingCoreVisualConfig = {
  // Colors & Gradients
  irisGradient: string;
  pupilColor: string;
  glowColor: string;
  dataRingColor: string;
  particleColor: string;
  strokeColor: string;

  // Animation Parameters
  breathingScale: number;
  rotationDuration: number; // seconds for full rotation
  pulseSpeed: number; // seconds
  particleActivity: number; // 0-1 multiplier
};

const LIVING_CORE_CONFIG: Record<CoreStatus, LivingCoreVisualConfig> = {
  idle: {
    irisGradient: "conic-gradient(from 0deg, #0891b2 0%, #a855f7 45%, #0891b2 100%)", // Cyan -> Purple
    pupilColor: "bg-slate-950",
    glowColor: "shadow-cyan-500/20",
    dataRingColor: "bg-cyan-500/30",
    particleColor: "bg-cyan-400",
    strokeColor: "text-cyan-500",
    breathingScale: 1.05,
    rotationDuration: 60,
    pulseSpeed: 4,
    particleActivity: 0.3,
  },
  thinking: {
    irisGradient: "conic-gradient(from 0deg, #a855f7 0%, #d946ef 50%, #a855f7 100%)", // Purple -> Fuchsia
    pupilColor: "bg-indigo-950",
    glowColor: "shadow-purple-500/40",
    dataRingColor: "bg-fuchsia-500/50",
    particleColor: "bg-fuchsia-400",
    strokeColor: "text-fuchsia-500",
    breathingScale: 1.1,
    rotationDuration: 3,
    pulseSpeed: 1.5,
    particleActivity: 0.8,
  },
  streaming: {
    irisGradient: "conic-gradient(from 0deg, #06b6d4 0%, #3b82f6 50%, #06b6d4 100%)", // Cyan -> Blue
    pupilColor: "bg-slate-900",
    glowColor: "shadow-blue-500/50",
    dataRingColor: "bg-sky-400/60",
    particleColor: "bg-sky-300",
    strokeColor: "text-sky-400",
    breathingScale: 1.15,
    rotationDuration: 8, // Faster than idle, slower than thinking
    pulseSpeed: 1, // Quick pulse
    particleActivity: 1.0,
  },
  error: {
    irisGradient: "conic-gradient(from 0deg, #ef4444 0%, #f97316 50%, #ef4444 100%)", // Red -> Orange
    pupilColor: "bg-red-950",
    glowColor: "shadow-red-500/50",
    dataRingColor: "bg-red-500/70",
    particleColor: "bg-red-500",
    strokeColor: "text-red-500",
    breathingScale: 1.05,
    rotationDuration: 0.5, // Glitchy/Fast
    pulseSpeed: 0.2,
    particleActivity: 0.5,
  },
};

// --- Sub-components for better organization ---

function OrbitalRings({ config }: { config: LivingCoreVisualConfig }) {
  return (
    <div className={cn("absolute inset-[-40%] pointer-events-none z-0", config.strokeColor)}>
      <motion.svg viewBox="0 0 200 200" className="w-full h-full opacity-20 overflow-visible">
        {/* Ring 1 - Tilted */}
        <motion.ellipse
          cx="100"
          cy="100"
          rx="90"
          ry="25"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="10 20"
          initial={{ rotate: -15 }}
          animate={{ rotate: 345 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        {/* Ring 2 - Opposing Tilt */}
        <motion.ellipse
          cx="100"
          cy="100"
          rx="80"
          ry="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          initial={{ rotate: 15 }}
          animate={{ rotate: -345 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>
    </div>
  );
}

function IrisTexture({ status, config }: { status: CoreStatus; config: LivingCoreVisualConfig }) {
  // SVG overlay for the radial lines/rays
  const rays = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="10"
        x2="50"
        y2="40"
        transform={`rotate(${i * 10} 50 50)`}
        stroke="currentColor"
        strokeWidth={i % 2 === 0 ? "0.2" : "0.5"} // Varying width
        strokeOpacity={Math.random() * 0.3 + 0.1}
        strokeDasharray={i % 3 === 0 ? "2 2" : undefined}
      />
    ));
  }, []);

  return (
    <div className="absolute inset-0 rounded-full overflow-hidden">
      {/* Base Conic Gradient */}
      <motion.div
        className="absolute inset-[-50%] w-[200%] h-[200%]"
        style={{ background: config.irisGradient }}
        animate={{ rotate: 360 }}
        transition={{
          duration: config.rotationDuration,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />

      {/* 3D Sphere Radial Gradient Overlay - Adds depth */}
      <div
        className="absolute inset-0 z-10 mix-blend-multiply pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Radial Rays SVG */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full text-white/30 mix-blend-overlay z-0"
        animate={{ rotate: status === "thinking" ? -360 : 0 }}
        transition={{ duration: config.rotationDuration * 1.5, repeat: Infinity, ease: "linear" }}
      >
        {rays}
      </motion.svg>

      {/* Inner Shadow to soften the pupil edge */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] z-20" />
    </div>
  );
}

function Pupil({ config }: { config: LivingCoreVisualConfig }) {
  return (
    <div className="absolute inset-[28%] rounded-full z-20 flex items-center justify-center pointer-events-none">
      {/* Outer Pupil Ring (softer) */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full opacity-90 mix-blend-multiply blur-[1px]",
          config.pupilColor,
        )}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: config.pulseSpeed, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner Pupil Core (Dark & Sharp) */}
      <div className="absolute inset-2 rounded-full bg-black shadow-[inset_0_0_8px_rgba(0,0,0,1)]" />

      {/* Depth/Reflection Highlight - Subtle Lens effect */}
      <motion.div
        className="absolute top-[15%] left-[20%] w-[25%] h-[20%] rounded-[100%] bg-gradient-to-br from-white/20 to-transparent blur-[2px]"
        animate={{
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}

function DataRing({ status, config }: { status: CoreStatus; config: LivingCoreVisualConfig }) {
  // Refined Data Segments
  const segments = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => {
      const isMajor = i % 4 === 0;
      return (
        <motion.div
          key={i}
          className="absolute inset-0 flex justify-center"
          style={{ rotate: `${i * (360 / 48)}deg` }}
        >
          <motion.div
            className={cn("rounded-full", config.dataRingColor)}
            style={{
              width: isMajor ? "2px" : "1px",
              height: isMajor ? "8px" : "4px",
              marginTop: "14%", // Closer to edge
            }}
            initial={{ opacity: 0.1 }}
            animate={{
              opacity:
                status === "thinking"
                  ? [0.1, 0.6, 0.1]
                  : status === "streaming"
                    ? [0.2, 0.5, 0.2]
                    : 0.15,
              height:
                status === "thinking"
                  ? isMajor
                    ? ["8px", "12px", "8px"]
                    : ["4px", "6px", "4px"]
                  : undefined,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.02,
            }}
          />
        </motion.div>
      );
    });
  }, [config.dataRingColor, status]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-full">
      <motion.div
        className="w-full h-full relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        {segments}
      </motion.div>
    </div>
  );
}

function ParticleBelt({
  count,
  radiusPercent,
  config,
  speedDuration,
  reverse = false,
}: {
  count: number;
  radiusPercent: number; // 100 = at the edge of the container
  config: LivingCoreVisualConfig;
  speedDuration: number;
  reverse?: boolean;
}) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      angle: (i / count) * 360 + Math.random() * 20,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      offset: Math.random() * 10,
    }));
  }, [count]);

  const topPosition = `${50 - radiusPercent / 2}%`;

  return (
    <motion.div
      className="absolute inset-[-50%] w-[200%] h-[200%] pointer-events-none flex items-center justify-center"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration: speedDuration, repeat: Infinity, ease: "linear" }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute inset-0 flex justify-center"
          style={{ rotate: `${p.angle}deg` }}
        >
          <div
            className={cn("rounded-full", config.particleColor)}
            style={{
              width: p.size,
              height: p.size,
              marginTop: topPosition,
              opacity: p.opacity,
              transform: `translateY(${p.offset}px)`,
            }}
          />
        </div>
      ))}
    </motion.div>
  );
}

function Overlays({ status }: { status: CoreStatus }) {
  return (
    <>
      {/* Glass Glare/Reflection Top */}
      <div className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,transparent_40%)] pointer-events-none z-30" />

      {/* Scanline Effect - Subtle horizontal lines */}
      <div className="absolute inset-0 rounded-full overflow-hidden z-20 opacity-15 pointer-events-none mix-blend-overlay">
        <motion.div
          className="w-full h-[200%] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"
          animate={{ translateY: status === "idle" ? 0 : "-50%" }}
          transition={{
            duration: status === "idle" ? 0 : 20, // Slow scan on active
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Micro-grid Texture (New Detail) */}
       <div className="absolute inset-0 rounded-full overflow-hidden z-10 opacity-10 pointer-events-none mix-blend-overlay">
           <div className="w-full h-full bg-[url('/noise.svg')] bg-[length:4px_4px]" />
       </div>
    </>
  );
}

// --- Main Component ---

export function LivingCore({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
  size = "auto",
  intensity = "normal",
}: LivingCoreProps) {
  const config = LIVING_CORE_CONFIG[status];
  const [glitching, setGlitching] = useState(false);
  const [tapPulse, setTapPulse] = useState(false);

  // Responsive Size Control - Mobile optimized (smaller base)
  // Mobile: 96px (24) -> SM: 128px (32) -> Desktop: 160px (40)
  const containerSizeClass =
    size === "mobile"
      ? "w-24 h-24"
      : size === "desktop"
        ? "w-40 h-40"
        : "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40";

  // Intensity Logic
  const opacityMod = intensity === "subtle" ? 0.6 : intensity === "strong" ? 1 : 0.85;

  useEffect(() => {
    if (status === "error") {
      setGlitching(true);
      const timer = setTimeout(() => setGlitching(false), 600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [status]);

  const handleTap = () => {
    setTapPulse(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
    setTimeout(() => setTapPulse(false), 300);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-6 pt-4 w-full animate-fade-in relative z-0">
      {/* ORB CONTAINER */}
      <motion.div
        className={cn(
          "relative flex items-center justify-center cursor-pointer",
          containerSizeClass,
        )}
        animate={{
          y: [0, -8, 0], // Gentle levitation
          scale: tapPulse ? 0.95 : [1, config.breathingScale, 1],
          x: glitching ? [0, -5, 5, -2, 2, 0] : 0, // Glitch shake
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 0.4 }, // Fast glitch
        }}
        onClick={handleTap}
        style={{ opacity: opacityMod }}
      >
        {/* 1. ATMOSPHERE / GLOW LAYERS (Cheapest rendering first) */}
        <div
          className={cn(
            "absolute inset-[-20%] rounded-full blur-3xl transition-colors duration-1000",
            status === "error" ? "bg-red-500/20" : "bg-cyan-500/20",
          )}
        />
        <motion.div
          className={cn(
            "absolute inset-[-5%] rounded-full blur-xl transition-all duration-700 opacity-60",
            config.glowColor,
          )}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ boxShadow: `0 0 40px currentColor` }} // Hardware accel glow
        />

        {/* 2. OUTER STRUCTURES */}

        {/* Outer Particle Belt (Loose, slow) */}
        {/* Radius 150% means 50% larger than the container */}
        <ParticleBelt count={12} radiusPercent={150} config={config} speedDuration={45} />

        {/* Inner Particle Belt (Closer, faster) */}
        {/* Radius 110% means just outside the container edge */}
        <ParticleBelt count={18} radiusPercent={110} config={config} speedDuration={25} reverse />

        {/* Orbital Rings - New Detail */}
        <OrbitalRings config={config} />

        {/* 3. MAIN ORB BODY */}
        <div className="absolute inset-0 rounded-full shadow-2xl overflow-hidden z-10 ring-1 ring-white/10">
          <IrisTexture status={status} config={config} />
          <DataRing status={status} config={config} />
          <Pupil config={config} />
          <Overlays status={status} />
        </div>

        {/* 4. ACTIVE STATE RINGS (Streaming/Thinking/Error) */}
        <AnimatePresence>
          {(status === "thinking" || status === "streaming") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.3 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className={cn(
                "absolute inset-0 rounded-full border border-dashed opacity-30 pointer-events-none",
                config.dataRingColor.replace("bg-", "border-"),
              )}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-full h-full rounded-full border-t border-current"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* TEXT CONTENT (Original Layout Preserved) */}
      <div className="text-center space-y-2 max-w-sm px-4 relative z-10">
        <motion.h2
          className="text-xl font-semibold text-ink-primary"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {status === "error" ? "Systemfehler" : "Wie kann ich helfen?"}
        </motion.h2>

        <motion.p
          className="text-sm text-ink-secondary"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {status === "error" && lastErrorMessage
            ? lastErrorMessage
            : "Stelle eine Frage oder wähle ein Thema."}
        </motion.p>

        {/* Status Line */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wider text-ink-tertiary mt-2 pt-2 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3 }}
        >
          <span
            className={cn(
              "font-medium transition-colors duration-500",
              status === "streaming" || status === "thinking" ? "text-accent-chat" : "",
            )}
          >
            <StatusIndicator status={status} />
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

function StatusIndicator({ status }: { status: CoreStatus }) {
  if (status === "idle") return <>Bereit</>;
  if (status === "thinking") return <>Verarbeite...</>;
  if (status === "streaming") return <>Antwortet...</>;
  if (status === "error") return <>Fehler</>;
  return null;
}
