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

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-6 pt-2 w-full animate-fade-in">
      {/* Energy Sphere Container */}
      <div className={cn("relative w-40 h-40 flex items-center justify-center")}>
        {/* Background Ambient Glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-3xl transition-colors duration-700 opacity-40",
            config.glowColor,
            glitching && "animate-pulse"
          )}
        />

        {/* Core Energy Ball */}
        <div className="relative w-16 h-16 flex items-center justify-center z-10">
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br blur-md opacity-80 transition-all duration-700",
              config.coreColor
            )}
          />
          <div
            className={cn(
              "absolute inset-1 rounded-full bg-gradient-to-tl mix-blend-screen transition-all duration-700",
              config.coreColor,
              "animate-pulse-glow"
            )}
          />
        </div>

        {/* Rotating Rings (Orbits) */}
        {/* Ring 1 - Outer Horizontal-ish */}
        <motion.div
          className={cn(
            "absolute w-32 h-32 rounded-full border border-dashed opacity-60",
            config.ringColor
          )}
          style={{ borderTopColor: "transparent", borderBottomColor: "transparent" }}
          animate={{
            rotateX: [60, 60],
            rotateY: [0, 360],
            rotateZ: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: config.rotationSpeed,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Ring 2 - Vertical-ish */}
        <motion.div
          className={cn(
            "absolute w-28 h-28 rounded-full border-[1.5px] border-dotted opacity-50",
            config.ringColor
          )}
          style={{ borderLeftColor: "transparent", borderRightColor: "transparent" }}
          animate={{
            rotateX: [0, 360],
            rotateY: [45, 45],
            rotateZ: [0, -360],
          }}
          transition={{
            duration: config.rotationSpeed * 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Ring 3 - Inner Fast Orbit */}
        <motion.div
          className={cn(
            "absolute w-20 h-20 rounded-full border border-solid opacity-40",
            config.ringColor
          )}
          style={{
            borderTopColor: "transparent",
            borderLeftColor: "transparent",
            borderWidth: "1px",
          }}
          animate={{
            rotateX: [45, 225],
            rotateY: [45, 225],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: config.rotationSpeed * 0.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
           {/* We can use simple CSS animation for particles or just static positions with a parent rotation */}
           <motion.div 
             className="absolute inset-0"
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           >
              <div className={cn("absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full blur-[1px]", config.particleColor)} />
              <div className={cn("absolute bottom-4 right-1/4 w-1 h-1 rounded-full blur-[0.5px] opacity-70", config.particleColor)} />
              <div className={cn("absolute top-1/3 left-2 w-1 h-1 rounded-full blur-[0.5px] opacity-60", config.particleColor)} />
           </motion.div>
           
           <motion.div 
             className="absolute inset-0"
             animate={{ rotate: -360 }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           >
              <div className={cn("absolute bottom-0 right-1/2 w-1.5 h-1.5 rounded-full blur-[1px]", config.particleColor)} />
              <div className={cn("absolute top-4 left-1/4 w-1 h-1 rounded-full blur-[0.5px] opacity-70", config.particleColor)} />
           </motion.div>
        </div>

      </div>

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
              status === "streaming" || status === "thinking" ? "text-accent-chat" : ""
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