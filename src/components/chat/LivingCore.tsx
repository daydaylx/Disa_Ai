import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
  primaryGradient: string;
  secondaryGradient: string;
  coreGlow: string;
  outerGlow: string;
  ringColor: string;
  particleColors: string[];
  breathingScale: number;
  rotationSpeed: {
    slow: number;
    medium: number;
    fast: number;
  };
  particleIntensity: number;
};

const LIVING_CORE_CONFIG: Record<CoreStatus, LivingCoreVisualConfig> = {
  idle: {
    primaryGradient: "from-cyan-400 via-blue-500 to-indigo-600",
    secondaryGradient: "from-blue-300 to-cyan-400",
    coreGlow: "bg-blue-500/30",
    outerGlow: "bg-cyan-500/20",
    ringColor: "border-cyan-400/40",
    particleColors: ["bg-blue-300", "bg-cyan-300", "bg-indigo-300"],
    breathingScale: 1.08,
    rotationSpeed: { slow: 25, medium: 15, fast: 8 },
    particleIntensity: 0.7,
  },
  thinking: {
    primaryGradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    secondaryGradient: "from-purple-400 to-violet-500",
    coreGlow: "bg-violet-500/40",
    outerGlow: "bg-purple-500/25",
    ringColor: "border-violet-400/50",
    particleColors: ["bg-violet-300", "bg-purple-300", "bg-fuchsia-300"],
    breathingScale: 1.12,
    rotationSpeed: { slow: 8, medium: 5, fast: 3 },
    particleIntensity: 0.9,
  },
  streaming: {
    primaryGradient: "from-emerald-400 via-cyan-500 to-blue-600",
    secondaryGradient: "from-cyan-300 to-emerald-400",
    coreGlow: "bg-cyan-500/45",
    outerGlow: "bg-emerald-500/30",
    ringColor: "border-cyan-400/60",
    particleColors: ["bg-cyan-200", "bg-emerald-300", "bg-blue-300"],
    breathingScale: 1.15,
    rotationSpeed: { slow: 5, medium: 3, fast: 2 },
    particleIntensity: 1.0,
  },
  error: {
    primaryGradient: "from-red-500 via-orange-500 to-red-600",
    secondaryGradient: "from-orange-400 to-red-500",
    coreGlow: "bg-red-500/40",
    outerGlow: "bg-orange-500/25",
    ringColor: "border-red-400/50",
    particleColors: ["bg-red-300", "bg-orange-300", "bg-red-400"],
    breathingScale: 1.05,
    rotationSpeed: { slow: 40, medium: 25, fast: 15 },
    particleIntensity: 0.5,
  },
};

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

  // Size configuration
  const sizeClasses =
    size === "mobile" ? "w-32 h-32" : size === "desktop" ? "w-56 h-56" : "w-40 h-40 sm:w-48 h-48";

  // Intensity modifiers
  const intensityModifiers = {
    subtle: { scale: 0.95, opacity: 0.7, particles: 0.6 },
    normal: { scale: 1, opacity: 0.85, particles: 0.8 },
    strong: { scale: 1.1, opacity: 1, particles: 1 },
  };

  const intensityMod = intensityModifiers[intensity];

  useEffect(() => {
    if (status === "error") {
      setGlitching(true);
      const timer = setTimeout(() => setGlitching(false), 600);
      return () => clearTimeout(timer);
    }
    setGlitching(false);
    return undefined;
  }, [status]);

  const handleTap = () => {
    setTapPulse(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
    setTimeout(() => setTapPulse(false), 300);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-6 pt-2 w-full animate-fade-in">
      {/* Living Core Container */}
      <motion.div
        className={cn("relative flex items-center justify-center cursor-pointer", sizeClasses)}
        animate={{
          y: [0, -10, 0], // Enhanced levitation
          scale: status === "idle" && !tapPulse ? [1, config.breathingScale, 1] : 1, // Enhanced breathing
        }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          scale: {
            duration: status === "thinking" ? 2 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        whileTap={{ scale: 0.9 }}
        onClick={handleTap}
        style={{ scale: intensityMod.scale }}
      >
        {/* Multi-layer Glows */}
        {/* Outer Atmosphere Glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-3xl transition-all duration-700 opacity-30",
            config.outerGlow,
            tapPulse && "opacity-60 scale-125 duration-300",
            status === "streaming" && "animate-pulse",
          )}
          style={{ opacity: intensityMod.opacity * 0.5 }}
        />

        {/* Middle Radiant Glow */}
        <div
          className={cn(
            "absolute inset-2 rounded-full blur-2xl transition-all duration-700 opacity-40 mix-blend-screen",
            config.coreGlow,
            tapPulse && "opacity-80 scale-110 duration-200",
            status === "idle" && "animate-pulse-subtle",
          )}
          style={{ opacity: intensityMod.opacity * 0.6 }}
        />

        {/* Inner Sharp Glow */}
        <div
          className={cn(
            "absolute inset-8 rounded-full blur-xl transition-all duration-700 opacity-50",
            config.coreGlow,
            "animate-pulse-glow",
          )}
          style={{ opacity: intensityMod.opacity * 0.7 }}
        />

        {/* Radial Pulse Rings for Active States */}
        {(status === "thinking" || status === "streaming" || tapPulse) && (
          <>
            <motion.div
              className={cn("absolute inset-0 rounded-full border-2 opacity-0", config.ringColor)}
              animate={{
                scale: [1, 2, 2.5],
                opacity: [0.8, 0.3, 0],
              }}
              transition={{
                duration: status === "streaming" ? 2 : 3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className={cn("absolute inset-0 rounded-full border opacity-0", config.ringColor)}
              animate={{
                scale: [1, 1.8, 2.2],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: status === "streaming" ? 2.5 : 3.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Enhanced Core */}
        <div className="relative w-20 h-20 flex items-center justify-center z-10">
          {/* Primary Core Orb */}
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br shadow-2xl transition-all duration-700",
              config.primaryGradient,
              tapPulse && "brightness-150 scale-110",
            )}
            style={{
              boxShadow: `0 0 ${intensityMod.scale * 60}px ${intensityMod.scale * 20}px currentColor`,
            }}
          />

          {/* Secondary Gradient Overlay */}
          <div
            className={cn(
              "absolute inset-1 rounded-full bg-gradient-to-tl opacity-60 mix-blend-overlay transition-all duration-700",
              config.secondaryGradient,
            )}
          />

          {/* Eye-like Central Focus */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {/* Central Pupil */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className={cn(
                  "w-8 h-8 rounded-full bg-gradient-to-br opacity-90 mix-blend-screen",
                  "from-white/20 to-transparent",
                )}
                animate={{
                  scale:
                    status === "thinking" || status === "streaming" ? [1, 1.3, 1] : [1, 1.1, 1],
                }}
                transition={{
                  duration: status === "thinking" ? 1.5 : 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Enhanced Plasma Turbulence */}
            <div className="absolute inset-0 rounded-full opacity-40 mix-blend-screen">
              <motion.div
                className={cn(
                  "w-[300%] h-[300%] -translate-x-1/3 -translate-y-1/3",
                  "bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.3)_90deg,transparent_180deg,rgba(255,255,255,0.5)_270deg,transparent_360deg)]",
                )}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: tapPulse ? 2 : config.rotationSpeed.slow,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* Counter-rotating Plasma Layer */}
            <div className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay">
              <motion.div
                className={cn(
                  "w-[250%] h-[250%] -translate-x-1/4 -translate-y-1/4",
                  "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_50%)]",
                )}
                animate={{
                  rotate: [360, 0],
                }}
                transition={{
                  duration: tapPulse ? 1.5 : config.rotationSpeed.medium,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </div>

          {/* Central Light Reflection */}
          <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-white/30 blur-md" />
        </div>

        {/* Enhanced Orbital Ring System */}
        {/* Ring 1 - Outer Elliptical */}
        <motion.div
          className={cn(
            "absolute rounded-full border border-dashed opacity-30",
            config.ringColor,
            glitching && "animate-pulse",
          )}
          style={{
            width: "90%",
            height: "70%",
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
          }}
          animate={{
            rotateX: [60, 60],
            rotateY: [0, 360],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: tapPulse ? 1 : config.rotationSpeed.slow,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Ring 2 - Middle Dotted */}
        <motion.div
          className={cn(
            "absolute rounded-full border-[1.5px] border-dotted opacity-40",
            config.ringColor,
          )}
          style={{
            width: "75%",
            height: "75%",
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
          }}
          animate={{
            rotateX: [0, 360],
            rotateY: [45, 45],
            rotateZ: [0, -360],
          }}
          transition={{
            duration: tapPulse ? 0.8 : config.rotationSpeed.medium,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Ring 3 - Inner Solid Arc */}
        <motion.div
          className={cn("absolute rounded-full border-2 opacity-50", config.ringColor)}
          style={{
            width: "60%",
            height: "60%",
            borderTopColor: "transparent",
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
          }}
          animate={{
            rotateX: [30, 210],
            rotateY: [30, 210],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: tapPulse ? 0.6 : config.rotationSpeed.fast,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Enhanced Particle System */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Particle Layer 1 - Slow Orbit */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`slow-${i}`}
                className={cn(
                  "absolute rounded-full blur-[0.5px]",
                  config.particleColors[i % config.particleColors.length],
                )}
                style={{
                  width: Math.random() * 2 + 1 + "px",
                  height: Math.random() * 2 + 1 + "px",
                  top: `${Math.random() * 20}%`,
                  left: `${40 + Math.random() * 20}%`,
                  opacity: (0.3 + Math.random() * 0.4) * intensityMod.particles,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>

          {/* Particle Layer 2 - Medium Counter-Rotation */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`med-${i}`}
                className={cn(
                  "absolute rounded-full blur-sm",
                  config.particleColors[(i + 1) % config.particleColors.length],
                )}
                style={{
                  width: Math.random() * 3 + 1.5 + "px",
                  height: Math.random() * 3 + 1.5 + "px",
                  bottom: `${Math.random() * 30}%`,
                  right: `${30 + Math.random() * 30}%`,
                  opacity: (0.4 + Math.random() * 0.4) * intensityMod.particles,
                }}
              />
            ))}
          </motion.div>

          {/* Particle Layer 3 - Fast Radial Burst */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 720 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`fast-${i}`}
                className={cn("absolute rounded-full bg-white/80", "shadow-lg")}
                style={{
                  width: "2px",
                  height: "2px",
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 90}deg) translateY(-80px)`,
                  opacity: 0.6 * intensityMod.particles * config.particleIntensity,
                  boxShadow: "0 0 6px currentColor",
                }}
              />
            ))}
          </motion.div>

          {/* Explosive Burst Particles (Active States) */}
          {(status === "thinking" || status === "streaming" || tapPulse) && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: tapPulse ? 0.5 : 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`burst-${i}`}
                  className={cn(
                    "absolute w-1 h-1 rounded-full",
                    config.particleColors[i % config.particleColors.length],
                  )}
                  style={{
                    top: "50%",
                    left: "50%",
                    transformOrigin: "0 0",
                  }}
                  animate={{
                    x: [0, Math.cos((i * Math.PI) / 4) * (40 + Math.random() * 20)],
                    y: [0, Math.sin((i * Math.PI) / 4) * (40 + Math.random() * 20)],
                    scale: [1, 0],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: tapPulse ? 0.8 : 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Text Content - Same as original */}
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
