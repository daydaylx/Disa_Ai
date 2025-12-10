import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type CoreStatus = "idle" | "thinking" | "streaming" | "error";

interface ChatHeroCoreProps {
  status: CoreStatus;
  modelName: string;
  toneLabel: string;
  creativityLabel: string;
  lastErrorMessage?: string;
}

const CORE_VISUAL_CONFIG: Record<
  CoreStatus,
  {
    glowIntensity: number;
    pulseDurationMs: number;
    ringVisible: boolean;
    ringRotationDurationMs: number;
    waveEnabled: boolean;
    baseColorClass: string;
    accentColorClass: string;
    glowColorClass: string;
  }
> = {
  idle: {
    glowIntensity: 0.4,
    pulseDurationMs: 3000,
    ringVisible: false,
    ringRotationDurationMs: 0,
    waveEnabled: false,
    baseColorClass: "bg-brand-primary",
    accentColorClass: "bg-brand-secondary",
    glowColorClass: "shadow-glow-md",
  },
  thinking: {
    glowIntensity: 0.7,
    pulseDurationMs: 1500,
    ringVisible: true,
    ringRotationDurationMs: 6000,
    waveEnabled: false,
    baseColorClass: "bg-brand-primary",
    accentColorClass: "bg-brand-secondary",
    glowColorClass: "shadow-glow-lg",
  },
  streaming: {
    glowIntensity: 0.9,
    pulseDurationMs: 1000,
    ringVisible: true,
    ringRotationDurationMs: 4000,
    waveEnabled: true,
    baseColorClass: "bg-brand-primary",
    accentColorClass: "bg-accent-chat",
    glowColorClass: "shadow-glow-lg",
  },
  error: {
    glowIntensity: 0.6,
    pulseDurationMs: 500,
    ringVisible: false,
    ringRotationDurationMs: 0,
    waveEnabled: false,
    baseColorClass: "bg-status-error",
    accentColorClass: "bg-red-600",
    glowColorClass: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
  },
};

export function ChatHeroCore({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: ChatHeroCoreProps) {
  const config = CORE_VISUAL_CONFIG[status];
  const [showErrorShake, setShowErrorShake] = useState(false);

  useEffect(() => {
    if (status === "error") {
      setShowErrorShake(true);
      const timer = setTimeout(() => setShowErrorShake(false), 600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [status]);

  // Determine variants for the core pulse
  const coreVariants: Variants = useMemo(
    () => ({
      idle: {
        scale: [1, 1.05, 1],
        opacity: [0.9, 1, 0.9],
        transition: {
          duration: config.pulseDurationMs / 1000,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      },
      thinking: {
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
        transition: {
          duration: config.pulseDurationMs / 1000,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      },
      streaming: {
        scale: [1, 1.05, 1], // More subtle pulse during streaming as waves dominate
        transition: {
          duration: config.pulseDurationMs / 1000,
          repeat: Infinity,
          ease: "linear" as const,
        },
      },
      error: {
        x: showErrorShake ? [0, -5, 5, -5, 5, 0] : 0,
        scale: 1,
        transition: { duration: 0.4 },
      },
    }),
    [config, showErrorShake],
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-6 pt-2 w-full animate-fade-in">
      {/* Visual Core Container */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background Glow Layer */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full blur-2xl opacity-40 transition-colors duration-500",
            status === "error" ? "bg-red-500" : "bg-brand-primary",
          )}
          animate={{
            scale: status === "thinking" || status === "streaming" ? 1.2 : 1,
            opacity: status === "idle" ? 0.3 : 0.5,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Outer Ring (Thinking/Streaming) */}
        <AnimatePresence>
          {config.ringVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
              animate={{
                opacity: 1,
                scale: 1.3,
                rotate: 360,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                rotate: {
                  duration: config.ringRotationDurationMs / 1000,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: { duration: 0.5 },
                opacity: { duration: 0.3 },
              }}
              className="absolute inset-0 rounded-full border border-white/20 border-t-brand-primary/80 border-r-transparent"
            />
          )}
        </AnimatePresence>

        {/* Waves (Streaming) */}
        <AnimatePresence>
          {config.waveEnabled && (
            <>
              {[0, 1].map((i) => (
                <motion.div
                  key={`wave-${i}`}
                  className="absolute inset-0 rounded-full border border-brand-primary/30"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* The Core Itself */}
        <motion.div
          className={cn(
            "relative w-16 h-16 rounded-full flex items-center justify-center z-10 transition-colors duration-500",
            config.baseColorClass,
            config.glowColorClass,
            "bg-gradient-to-br from-white/20 to-transparent", // Inner highlight
          )}
          variants={coreVariants}
          animate={status}
        >
          {/* Inner accent dot */}
          <div className="w-6 h-6 rounded-full bg-white/20 blur-[1px]" />
        </motion.div>
      </div>

      {/* Text Block */}
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
            : "Tippe unten eine Frage ein oder wähle einen der Vorschläge"}
        </motion.p>

        {/* Status Line */}
        <motion.div
          className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-ink-tertiary mt-2 pt-2 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3 }}
        >
          <span>{status === "idle" ? "Bereit" : status === "error" ? "Fehler" : "Aktiv"}</span>
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
