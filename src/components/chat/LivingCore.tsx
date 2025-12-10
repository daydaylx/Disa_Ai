import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import type { CoreStatus } from "@/types/core";

export type { CoreStatus };

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
  irisGradient: string;
  irisVeins: string;
  irisRings: string;
  rimGradient: string;
  glowColor: string;
  haloColor: string;
  particleColor: string;
  particleAccent: string;
  dataSegmentColor: string;
  innerSegmentColor: string;
  highlightColor: string;
  scanlineColor: string;
  waveColor: string;
  breathRange: [number, number];
  pupilPulseRange: [number, number];
  irisDuration: number;
  detailDuration: number;
  segmentDuration: number;
  scanlineDuration: number;
  glareDuration: number;
  waveDelay?: number;
};

const LIVING_CORE_CONFIG: Record<CoreStatus, LivingCoreVisualConfig> = {
  idle: {
    irisGradient:
      "conic-gradient(from 0deg, rgba(14,165,233,0.95) 0deg, rgba(124,58,237,0.9) 140deg, rgba(14,165,233,0.95) 360deg)",
    irisVeins:
      "repeating-conic-gradient(from 10deg, rgba(255,255,255,0.09) 0deg, transparent 4deg, rgba(255,255,255,0.06) 8deg, transparent 12deg)",
    irisRings:
      "radial-gradient(circle at 50% 50%, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 54%, rgba(255,255,255,0.07) 58%, transparent 65%)",
    rimGradient: "linear-gradient(135deg, rgba(59,201,255,0.22), rgba(129,140,248,0.2))",
    glowColor: "rgba(34,211,238,0.25)",
    haloColor: "rgba(129,140,248,0.18)",
    particleColor: "rgba(165,243,252,0.95)",
    particleAccent: "rgba(59,130,246,0.8)",
    dataSegmentColor: "rgba(180,198,255,0.8)",
    innerSegmentColor: "rgba(132,204,255,0.9)",
    highlightColor: "rgba(255,255,255,0.9)",
    scanlineColor: "rgba(255,255,255,0.08)",
    waveColor: "rgba(59,201,255,0.18)",
    breathRange: [0.97, 1.02],
    pupilPulseRange: [0.96, 1.03],
    irisDuration: 32,
    detailDuration: 44,
    segmentDuration: 18,
    scanlineDuration: 12,
    glareDuration: 9,
  },
  thinking: {
    irisGradient:
      "conic-gradient(from 0deg, rgba(168,85,247,0.95) 0deg, rgba(217,70,239,0.9) 150deg, rgba(168,85,247,0.95) 360deg)",
    irisVeins:
      "repeating-conic-gradient(from 20deg, rgba(255,255,255,0.16) 0deg, transparent 4deg, rgba(255,255,255,0.1) 10deg, transparent 14deg)",
    irisRings:
      "radial-gradient(circle at 50% 50%, transparent 44%, rgba(255,255,255,0.18) 50%, transparent 56%, rgba(255,255,255,0.12) 62%, transparent 70%)",
    rimGradient: "linear-gradient(145deg, rgba(192,132,252,0.25), rgba(236,72,153,0.22))",
    glowColor: "rgba(139,92,246,0.3)",
    haloColor: "rgba(236,72,153,0.24)",
    particleColor: "rgba(233,213,255,0.95)",
    particleAccent: "rgba(217,70,239,0.85)",
    dataSegmentColor: "rgba(244,200,255,0.92)",
    innerSegmentColor: "rgba(233,140,255,0.92)",
    highlightColor: "rgba(255,255,255,0.95)",
    scanlineColor: "rgba(255,255,255,0.12)",
    waveColor: "rgba(226,119,255,0.18)",
    breathRange: [0.98, 1.05],
    pupilPulseRange: [0.95, 1.06],
    irisDuration: 18,
    detailDuration: 22,
    segmentDuration: 12,
    scanlineDuration: 10,
    glareDuration: 8,
  },
  streaming: {
    irisGradient:
      "conic-gradient(from 0deg, rgba(6,182,212,0.95) 0deg, rgba(59,130,246,0.92) 140deg, rgba(16,185,129,0.9) 280deg, rgba(6,182,212,0.95) 360deg)",
    irisVeins:
      "repeating-conic-gradient(from 12deg, rgba(255,255,255,0.16) 0deg, transparent 3deg, rgba(255,255,255,0.1) 9deg, transparent 13deg)",
    irisRings:
      "radial-gradient(circle at 50% 50%, transparent 42%, rgba(255,255,255,0.22) 48%, transparent 54%, rgba(255,255,255,0.14) 60%, transparent 68%)",
    rimGradient:
      "linear-gradient(150deg, rgba(16,185,129,0.28), rgba(6,182,212,0.26), rgba(59,130,246,0.24))",
    glowColor: "rgba(56,189,248,0.32)",
    haloColor: "rgba(6,182,212,0.26)",
    particleColor: "rgba(204,251,241,0.95)",
    particleAccent: "rgba(125,211,252,0.9)",
    dataSegmentColor: "rgba(152,251,210,0.92)",
    innerSegmentColor: "rgba(125,211,252,0.95)",
    highlightColor: "rgba(255,255,255,0.98)",
    scanlineColor: "rgba(255,255,255,0.16)",
    waveColor: "rgba(103,232,249,0.3)",
    breathRange: [0.99, 1.07],
    pupilPulseRange: [0.94, 1.07],
    irisDuration: 12,
    detailDuration: 16,
    segmentDuration: 8,
    scanlineDuration: 8,
    glareDuration: 7,
    waveDelay: 1.6,
  },
  error: {
    irisGradient:
      "conic-gradient(from 0deg, rgba(239,68,68,0.95) 0deg, rgba(249,115,22,0.92) 160deg, rgba(239,68,68,0.95) 360deg)",
    irisVeins:
      "repeating-conic-gradient(from 18deg, rgba(255,255,255,0.2) 0deg, transparent 4deg, rgba(255,255,255,0.14) 8deg, transparent 12deg)",
    irisRings:
      "radial-gradient(circle at 50% 50%, transparent 44%, rgba(255,255,255,0.18) 50%, transparent 56%, rgba(255,255,255,0.12) 62%, transparent 70%)",
    rimGradient: "linear-gradient(145deg, rgba(239,68,68,0.28), rgba(249,115,22,0.26))",
    glowColor: "rgba(248,113,113,0.3)",
    haloColor: "rgba(251,146,60,0.24)",
    particleColor: "rgba(254,215,170,0.9)",
    particleAccent: "rgba(248,113,113,0.85)",
    dataSegmentColor: "rgba(255,237,213,0.9)",
    innerSegmentColor: "rgba(254,178,128,0.95)",
    highlightColor: "rgba(255,255,255,0.95)",
    scanlineColor: "rgba(255,255,255,0.18)",
    waveColor: "rgba(252,211,77,0.28)",
    breathRange: [0.98, 1.03],
    pupilPulseRange: [0.95, 1.02],
    irisDuration: 50,
    detailDuration: 28,
    segmentDuration: 16,
    scanlineDuration: 9,
    glareDuration: 7,
  },
};

function IrisTexture({ status, config }: { status: CoreStatus; config: LivingCoreVisualConfig }) {
  const radialRays = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, index) => ({
        id: index,
        rotation: (360 / 36) * index + (index % 2 === 0 ? 6 : -4),
        opacity: 0.2 + (index % 5) * 0.12,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-[-45%] w-[190%] h-[190%]"
        style={{ background: config.irisGradient }}
        animate={{ rotate: 360 }}
        transition={{ duration: config.irisDuration, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute inset-[-30%] w-[160%] h-[160%] opacity-70"
        style={{ background: config.irisVeins }}
        animate={{ rotate: status === "thinking" || status === "streaming" ? -360 : -90 }}
        transition={{ duration: config.detailDuration, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-0" style={{ backgroundImage: config.irisRings }} />

      <div
        className="absolute inset-[8%] rounded-full opacity-60 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.2) 0deg 2deg, transparent 2deg 4deg)",
        }}
      />

      <div
        className="absolute inset-[12%] rounded-full mix-blend-screen opacity-70"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 12deg, rgba(255,255,255,0.08) 0deg 1.5deg, transparent 1.5deg 4deg)",
          maskImage:
            "radial-gradient(circle at 50% 50%, transparent 0%, black 55%, transparent 70%)",
        }}
      />

      <div
        className="absolute inset-[6%] rounded-full opacity-30 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.35), transparent 35%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2), transparent 35%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 0.7px, transparent 0.7px)",
          backgroundSize: "10px 10px",
        }}
      />

      {radialRays.map((ray) => (
        <div
          key={`ray-${ray.id}`}
          className="absolute left-1/2 top-1/2 h-[18%] w-[0.75px] origin-bottom bg-white/30"
          style={{
            transform: `rotate(${ray.rotation}deg) translateY(-36%)`,
            opacity: ray.opacity,
          }}
        />
      ))}

      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_14px_rgba(0,0,0,0.65)]" />
    </div>
  );
}

function Pupil({ status, config }: { status: CoreStatus; config: LivingCoreVisualConfig }) {
  return (
    <div className="absolute inset-[30%] rounded-full z-20 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-[-12%] rounded-full bg-gradient-to-b from-black/20 via-black/10 to-white/5 opacity-50 mix-blend-screen" />
      <motion.div
        className="absolute inset-0 rounded-full shadow-[0_0_28px_rgba(0,0,0,0.45)] bg-gradient-to-b from-slate-950 via-black to-slate-950"
        animate={{
          scale: [config.pupilPulseRange[0], config.pupilPulseRange[1], config.pupilPulseRange[0]],
        }}
        transition={{
          duration: status === "thinking" ? 1.6 : status === "streaming" ? 1.1 : 2.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-[14%] rounded-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 shadow-inner" />
      <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-black via-slate-950 to-black" />
      <div
        className="absolute inset-[38%] rounded-full"
        style={{ background: config.highlightColor }}
      />
      <motion.div
        className="absolute h-5 w-5 rounded-full bg-white/70 blur-[8px]"
        style={{ top: "22%", left: "30%" }}
        animate={{
          x: [0, status === "streaming" ? 3 : 2, 0],
          y: [0, status === "streaming" ? -3 : -2, 0],
          opacity: [0.55, 0.9, 0.55],
          scale: [0.94, 1.06, 0.94],
        }}
        transition={{
          duration: status === "streaming" ? 2.2 : 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function BinaryRings({ status, config }: { status: CoreStatus; config: LivingCoreVisualConfig }) {
  const outerSegments = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, index) => ({
        rotation: (360 / 32) * index,
        long: index % 3 === 0,
      })),
    [],
  );

  const innerSegments = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, index) => ({
        rotation: (360 / 18) * index + (index % 2 === 0 ? 6 : -8),
      })),
    [],
  );

  const segmentAnimationClass =
    status === "streaming"
      ? "animate-orb-bit-chase-fast"
      : status === "thinking"
        ? "animate-orb-bit-chase"
        : "";

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-visible rounded-full">
      <motion.div
        className="absolute inset-[-4%]"
        animate={{ rotate: status === "idle" ? 0 : 360 }}
        transition={{ duration: config.segmentDuration, repeat: Infinity, ease: "linear" }}
      >
        {outerSegments.map((segment, index) => (
          <span
            key={`segment-${segment.rotation}`}
            className={cn(
              "absolute left-1/2 top-1/2 origin-left rounded-full shadow-[0_0_8px_rgba(255,255,255,0.12)]",
              segmentAnimationClass,
            )}
            style={{
              height: segment.long ? 6 : 4,
              width: segment.long ? 10 : 7,
              backgroundColor: config.dataSegmentColor,
              transform: `rotate(${segment.rotation}deg) translateX(52%)`,
              animationDelay: `${index * 45}ms`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-[3%]"
        animate={{ rotate: status === "idle" ? 0 : -360 }}
        transition={{ duration: config.segmentDuration * 1.1, repeat: Infinity, ease: "linear" }}
      >
        {innerSegments.map((segment, index) => (
          <span
            key={`inner-${segment.rotation}`}
            className={cn(
              "absolute left-1/2 top-1/2 origin-left rounded-full",
              segmentAnimationClass || "opacity-80",
            )}
            style={{
              height: 3,
              width: 8,
              backgroundColor: config.innerSegmentColor,
              transform: `rotate(${segment.rotation}deg) translateX(35%)`,
              boxShadow: "0 0 6px rgba(255,255,255,0.18)",
              animationDelay: `${index * 65}ms`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function ParticleBelt({
  count,
  radiusPercent,
  color,
  accent,
  speedDuration,
  reverse = false,
  activity,
}: {
  count: number;
  radiusPercent: number;
  color: string;
  accent: string;
  speedDuration: number;
  reverse?: boolean;
  activity: number;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, index) => ({
        angle: (index / count) * 360 + (index % 2 === 0 ? -8 : 12),
        size: 1 + Math.random() * 2.5,
        opacity: 0.35 + Math.random() * 0.5,
        offset: Math.random() * 12,
        accent: index % 4 === 0,
      })),
    [count],
  );

  const topPosition = `${50 - radiusPercent / 2}%`;

  return (
    <motion.div
      className="absolute inset-[-60%] w-[220%] h-[220%] pointer-events-none flex items-center justify-center"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration: speedDuration, repeat: Infinity, ease: "linear" }}
    >
      {particles.map((particle, index) => (
        <div
          key={`belt-${index}`}
          className="absolute inset-0 flex justify-center"
          style={{ rotate: `${particle.angle}deg` }}
        >
          <span
            className="rounded-full animate-orb-particle-jitter mix-blend-screen"
            style={{
              width: particle.size,
              height: particle.size,
              marginTop: topPosition,
              opacity: particle.opacity * activity,
              background: particle.accent ? accent : color,
              transform: `translateY(${particle.offset}px)`,
              animationDuration: `${1.6 + (index % 6) * 0.2}s`,
              animationDelay: `${index * 35}ms`,
            }}
          />
        </div>
      ))}
    </motion.div>
  );
}

function Overlays({ status, config }: { status: CoreStatus; config: LivingCoreVisualConfig }) {
  return (
    <>
      <div className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,transparent_40%)] pointer-events-none z-30" />

      <div className="absolute inset-0 rounded-full overflow-hidden z-20 opacity-20 pointer-events-none mix-blend-overlay">
        <div
          className="w-full h-[220%] bg-[length:100%_5px] animate-orb-scan-glide"
          style={{
            animationDuration: `${status === "idle" ? config.scanlineDuration * 1.4 : config.scanlineDuration}s`,
            backgroundImage: `linear-gradient(transparent 55%, ${config.scanlineColor} 55%)`,
          }}
        />
      </div>

      <div
        className={cn(
          "absolute inset-[-6%] rounded-full opacity-35 mix-blend-screen pointer-events-none",
          status === "error"
            ? "from-white/10 via-white/14 to-white/12"
            : "from-white/12 via-white/20 to-white/16",
          "bg-gradient-to-tr animate-orb-glare-sweep",
        )}
        style={{ animationDuration: `${config.glareDuration}s` }}
      />
    </>
  );
}

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

  const containerSizeClass =
    size === "mobile"
      ? "w-[clamp(5rem,16vw,6.25rem)] h-[clamp(5rem,16vw,6.25rem)]"
      : size === "desktop"
        ? "w-[clamp(6.5rem,12vw,10.5rem)] h-[clamp(6.5rem,12vw,10.5rem)]"
        : "w-[clamp(5rem,18vw,7.5rem)] h-[clamp(5rem,18vw,7.5rem)] sm:w-[clamp(6rem,14vw,9.5rem)] md:w-[clamp(6.5rem,12vw,10.5rem)]";

  const opacityMod = intensity === "subtle" ? 0.65 : intensity === "strong" ? 1 : 0.85;

  useEffect(() => {
    if (status === "error") {
      setGlitching(true);
      const timer = setTimeout(() => setGlitching(false), 700);
      return () => clearTimeout(timer);
    }
    setGlitching(false);
    return undefined;
  }, [status]);

  const handleTap = () => {
    setTapPulse(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setTimeout(() => setTapPulse(false), 320);
  };

  const activityMultiplier = status === "streaming" ? 1 : status === "thinking" ? 0.85 : 0.55;

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-8 pt-[calc(env(safe-area-inset-top,0px)+10px)] w-full animate-fade-in relative z-0">
      <motion.div
        className={cn(
          "relative flex items-center justify-center cursor-pointer",
          containerSizeClass,
          "max-w-[11rem] min-w-[4.5rem]",
        )}
        animate={{
          y: [0, -9, 0],
          scale: tapPulse
            ? 0.96
            : [config.breathRange[0], config.breathRange[1], config.breathRange[0]],
          x: glitching ? [0, -6, 4, -3, 2, 0] : 0,
        }}
        transition={{
          y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          x: { duration: glitching ? 0.45 : 0 },
        }}
        whileTap={{ scale: 0.94 }}
        onClick={handleTap}
        style={{ opacity: opacityMod }}
      >
        <div
          className="absolute inset-[-14%] rounded-full blur-3xl transition-all duration-700"
          style={{ backgroundColor: config.haloColor, opacity: tapPulse ? 0.9 : 0.7 }}
        />
        <div
          className="absolute inset-[-8%] rounded-full blur-2xl transition-all duration-700 opacity-70"
          style={{ backgroundColor: config.glowColor }}
        />

        <div className="absolute inset-0">
          <div
            className="absolute inset-[-6%] rounded-full border border-white/5 opacity-80"
            style={{ background: config.rimGradient }}
          />

          <BinaryRings status={status} config={config} />

          <ParticleBelt
            count={26}
            radiusPercent={152}
            color={config.particleColor}
            accent={config.particleAccent}
            speedDuration={40}
            activity={activityMultiplier}
          />
          <ParticleBelt
            count={18}
            radiusPercent={118}
            color={config.particleColor}
            accent={config.particleAccent}
            speedDuration={22}
            reverse
            activity={activityMultiplier + 0.15}
          />
        </div>

        <div
          className={cn(
            "relative inset-0 w-full h-full rounded-full overflow-visible bg-gradient-to-br shadow-2xl ring-1 ring-white/10",
            glitching && "animate-orb-shake",
            tapPulse && "scale-[1.01] duration-150",
          )}
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))",
          }}
        >
          <div className="absolute inset-[6%] rounded-full border border-white/8 shadow-[0_0_16px_rgba(255,255,255,0.06)] bg-white/5" />
          <motion.div
            className="absolute inset-[8%] rounded-full"
            style={{
              backgroundImage:
                "conic-gradient(from 120deg, rgba(255,255,255,0.14), transparent 36deg, rgba(255,255,255,0.08) 210deg, transparent 270deg, rgba(255,255,255,0.14))",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: config.irisDuration * 1.05, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="absolute inset-[14%] rounded-full overflow-hidden shadow-inner"
            style={{ background: config.irisGradient }}
            animate={{ rotate: status === "idle" ? 0 : 360 }}
            transition={{ duration: config.irisDuration, repeat: Infinity, ease: "linear" }}
          >
            <IrisTexture status={status} config={config} />
            <BinaryRings status={status} config={config} />
            <Pupil status={status} config={config} />
            <Overlays status={status} config={config} />
          </motion.div>

          {status === "streaming" && (
            <motion.div
              className="absolute inset-[10%] rounded-full border"
              style={{ borderColor: config.innerSegmentColor, backgroundColor: config.waveColor }}
              animate={{ scale: [0.92, 1.55], opacity: [0.6, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: config.waveDelay ?? 1.6,
                ease: "easeOut",
              }}
            />
          )}

          {status === "error" && glitching && (
            <motion.div
              className="absolute inset-[9%] rounded-full border border-orange-300/60 mix-blend-screen"
              animate={{ x: [-3, 2, -1, 0], opacity: [0.8, 1, 0.7, 0.9] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          )}
        </div>
      </motion.div>

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
