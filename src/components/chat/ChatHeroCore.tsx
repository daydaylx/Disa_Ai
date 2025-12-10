import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type CoreStatus = "idle" | "thinking" | "streaming" | "error";

interface ChatHeroCoreProps {
  status: CoreStatus;
  modelName: string;
  toneLabel: string;
  creativityLabel: string;
  lastErrorMessage?: string;
}

type EnergyVisualConfig = {
  coreColor: string;
  glowColor: string;
  ringColor: string;
  particleColor: string;
  rotationSpeed: number;
};

const ENERGY_VISUAL_CONFIG: Record<CoreStatus, EnergyVisualConfig> = {
  idle: {
    coreColor: "from-cyan-500 via-blue-500 to-indigo-500",
    glowColor: "bg-blue-500/20",
    ringColor: "border-blue-400/30",
    particleColor: "bg-blue-400",
    rotationSpeed: 20,
  },
  thinking: {
    coreColor: "from-violet-500 via-purple-500 to-fuchsia-500",
    glowColor: "bg-violet-500/30",
    ringColor: "border-violet-400/40",
    particleColor: "bg-violet-400",
    rotationSpeed: 5, // Faster (duration is lower)
  },
  streaming: {
    coreColor: "from-emerald-400 via-cyan-400 to-blue-500",
    glowColor: "bg-cyan-500/40",
    ringColor: "border-cyan-400/50",
    particleColor: "bg-cyan-300",
    rotationSpeed: 3, // Fastest
  },
  error: {
    coreColor: "from-red-600 via-orange-600 to-red-500",
    glowColor: "bg-red-500/40",
    ringColor: "border-red-500/40",
    particleColor: "bg-red-500",
    rotationSpeed: 50, // Very slow or erratic
  },
};

export function ChatHeroCore({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: ChatHeroCoreProps) {
  const config = ENERGY_VISUAL_CONFIG[status];
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (status === "error") {
      setGlitching(true);
      const timer = setTimeout(() => setGlitching(false), 600);
      return () => clearTimeout(timer);
    }
    setGlitching(false);
    return undefined;
  }, [status]);

  const [tapPulse, setTapPulse] = useState(false);

  const handleTap = () => {
    setTapPulse(true);
    // Haptic feedback if available (navigator.vibrate) - usually 10-20ms is enough for a "click" feel
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
    setTimeout(() => setTapPulse(false), 300);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-6 pt-2 w-full animate-fade-in">
      {/* Energy Sphere Container - Now Interactive & Floating */}
      <motion.div
        className={cn("relative w-40 h-40 flex items-center justify-center cursor-pointer")}
        animate={{
          y: [0, -8, 0], // Gentle levitation
          scale: status === "idle" && !tapPulse ? [1, 1.02, 1] : 1, // Breathing effect when idle and not tapped
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }, // Slower for breathing
        }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
      >
        {/* Background Ambient Glow - Pulsing */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-3xl transition-all duration-700 opacity-40 animate-pulse",
            config.glowColor,
            glitching && "animate-pulse",
            tapPulse && "opacity-80 scale-110 duration-150", // Flash on tap
            // Synchronize glow with breathing effect
            status === "idle" && !tapPulse && "animate-pulse-subtle", // Custom pulse for breathing
          )}
        />

        {/* Secondary Static Glow for Depth */}
        <div
          className={cn(
            "absolute inset-4 rounded-full blur-2xl transition-colors duration-700 opacity-30 mix-blend-screen",
            config.glowColor,
          )}
        />

        {/* Shockwave Effect (Expanding Ring) */}
        {(status === "thinking" || status === "streaming" || tapPulse) && (
          <div
            className={cn(
              "absolute inset-0 rounded-full border opacity-0",
              config.ringColor,
              "animate-ping-slow",
            )}
            style={{ animationDuration: tapPulse ? "0.6s" : "3s" }}
          />
        )}

        {/* Core Energy Ball */}
        <div className="relative w-16 h-16 flex items-center justify-center z-10">
          {/* Base Core Gradient */}
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br blur-md opacity-80 transition-all duration-700",
              config.coreColor,
              tapPulse && "brightness-150 scale-105",
            )}
          />

          {/* Internal Plasma/Turbulence (Spinning Conic) */}
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-60 mix-blend-overlay">
            <div
              className={cn(
                "w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.5)_180deg,transparent_360deg)] animate-spin-slow",
                tapPulse && "duration-[500ms]", // Spin faster on tap
              )}
            />
          </div>

          {/* Core Highlight/Rim */}
          <div
            className={cn(
              "absolute inset-1 rounded-full bg-gradient-to-tl mix-blend-screen transition-all duration-700",
              config.coreColor,
              "animate-pulse-glow",
            )}
          />
        </div>

        {/* Rotating Rings (Orbits) */}
        {/* Ring 1 - Outer Horizontal-ish - Complex Segmented */}
        <motion.div
          className={cn(
            "absolute w-36 h-36 rounded-full border border-dashed opacity-40",
            config.ringColor,
            tapPulse && "border-solid opacity-80",
          )}
          style={{ borderTopColor: "transparent", borderBottomColor: "transparent" }}
          animate={{
            rotateX: [70, 70],
            rotateY: [0, 360],
            rotateZ: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: tapPulse ? 0.5 : config.rotationSpeed * 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Ring 2 - Vertical-ish - Fine Dotted */}
        <motion.div
          className={cn(
            "absolute w-32 h-32 rounded-full border-[1.5px] border-dotted opacity-60",
            config.ringColor,
          )}
          style={{ borderLeftColor: "transparent", borderRightColor: "transparent" }}
          animate={{
            rotateX: [0, 360],
            rotateY: [30, 30],
            rotateZ: [0, -360],
          }}
          transition={{
            duration: tapPulse ? 0.5 : config.rotationSpeed * 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Ring 3 - Inner Fast Orbit - Solid Arc */}
        <motion.div
          className={cn(
            "absolute w-24 h-24 rounded-full border-[2px] opacity-70",
            config.ringColor,
          )}
          style={{
            borderTopColor: "transparent",
            borderLeftColor: "transparent",
            borderRightColor: "transparent", // Only 1/4 circle
          }}
          animate={{
            rotateX: [45, 225],
            rotateY: [45, 225],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: tapPulse ? 0.5 : config.rotationSpeed * 0.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Ring 4 - Counter Rotation Arc */}
        <motion.div
          className={cn(
            "absolute w-28 h-28 rounded-full border border-solid opacity-30",
            config.ringColor,
          )}
          style={{
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderRightColor: "transparent",
          }}
          animate={{
            rotateX: [20, -20],
            rotateY: [0, -360],
            rotateZ: [10, -10],
          }}
          transition={{
            duration: tapPulse ? 1 : config.rotationSpeed,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating Particles - Layer 1 (Slow) */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <div
              className={cn(
                "absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full blur-[1px]",
                config.particleColor,
              )}
            />
            <div
              className={cn(
                "absolute bottom-8 right-1/4 w-1 h-1 rounded-full blur-[0.5px] opacity-70",
                config.particleColor,
              )}
            />
            <div
              className={cn(
                "absolute top-1/3 left-4 w-1 h-1 rounded-full blur-[0.5px] opacity-60",
                config.particleColor,
              )}
            />
          </motion.div>

          {/* Floating Particles - Layer 2 (Fast Counter) */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <div
              className={cn(
                "absolute bottom-2 right-1/2 w-1.5 h-1.5 rounded-full blur-[1px]",
                config.particleColor,
              )}
            />
            <div
              className={cn(
                "absolute top-6 left-1/4 w-1 h-1 rounded-full blur-[0.5px] opacity-70",
                config.particleColor,
              )}
            />
          </motion.div>

          {/* Floating Particles - Layer 3 (Vertical Orbit) */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotateX: 360, rotateY: 45 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <div
              className={cn(
                "absolute top-0 left-1/2 w-1 h-1 rounded-full bg-white blur-[0.5px] opacity-80",
              )}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Text Content */}
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
