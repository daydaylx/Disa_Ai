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

type OrbVisualConfig = {
  irisRotationClass: string;
  glowColorClass: string;
  pupilAnimationClass: string;
  waveEnabled: boolean;
  irisColorClass: string;
};

const ORB_VISUAL_CONFIG: Record<CoreStatus, OrbVisualConfig> = {
  idle: {
    irisRotationClass: "animate-orb-rotate-slow",
    glowColorClass: "bg-brand-primary/20",
    pupilAnimationClass: "animate-orb-pupil-idle",
    waveEnabled: false,
    irisColorClass: "from-brand-primary to-brand-secondary",
  },
  thinking: {
    irisRotationClass: "animate-orb-rotate-medium",
    glowColorClass: "bg-brand-primary/30",
    pupilAnimationClass: "animate-orb-pupil-thinking",
    waveEnabled: false,
    irisColorClass: "from-brand-primary to-brand-secondary",
  },
  streaming: {
    irisRotationClass: "animate-orb-rotate-medium", // Slightly faster handled if needed, or keep medium
    glowColorClass: "bg-accent-chat/40",
    pupilAnimationClass: "animate-orb-pupil-streaming",
    waveEnabled: true,
    irisColorClass: "from-accent-chat to-brand-primary",
  },
  error: {
    irisRotationClass: "animate-none",
    glowColorClass: "bg-status-error/40",
    pupilAnimationClass: "scale-90",
    waveEnabled: false,
    irisColorClass: "from-status-error to-red-600",
  },
};

export function ChatHeroCore({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: ChatHeroCoreProps) {
  const config = ORB_VISUAL_CONFIG[status];
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

  const containerAnimationClass = glitching ? "animate-orb-shake" : "animate-orb-breathe";

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-6 pt-2 w-full animate-fade-in">
      {/* Orb Container */}
      <div
        className={cn(
          "relative w-32 h-32 flex items-center justify-center",
          containerAnimationClass,
        )}
      >
        {/* Layer 1: Outer Glow Ring */}
        <div
          className={cn(
            "absolute -inset-4 rounded-full blur-xl transition-colors duration-700 opacity-60",
            config.glowColorClass,
          )}
        />

        {/* Streaming Wave Effect */}
        {config.waveEnabled && (
          <div className="absolute inset-0 rounded-full border-2 border-accent-chat/30 animate-orb-wave pointer-events-none" />
        )}

        {/* Layer 2: Sclera (Eye Body) */}
        <div className="relative w-full h-full rounded-full bg-surface-inset shadow-2xl overflow-hidden border border-white/5 ring-1 ring-black/50">
          {/* Subtle Sclera Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          {/* Layer 3: Iris Container (Rotates) */}
          <div className={cn("absolute inset-[10%] rounded-full", config.irisRotationClass)}>
            {/* Iris Gradient */}
            <div
              className={cn(
                "absolute inset-0 rounded-full opacity-80 mix-blend-screen bg-[conic-gradient(var(--tw-gradient-stops))] transition-all duration-700",
                config.irisColorClass,
                status === "idle" ? "via-brand-secondary" : "via-transparent",
              )}
            />

            {/* Iris Texture / Striations */}
            <div className="absolute inset-0 rounded-full opacity-40 bg-[repeating-conic-gradient(transparent_0deg,transparent_2deg,rgba(0,0,0,0.5)_3deg,transparent_4deg)] mix-blend-overlay" />
          </div>

          {/* Layer 4: Pupil */}
          <div
            className={cn(
              "absolute inset-[36%] bg-[#050505] rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] transition-transform duration-500",
              config.pupilAnimationClass,
            )}
          >
            {/* Tiny Pupil Reflection */}
            <div className="absolute top-[20%] left-[25%] w-[15%] h-[15%] bg-white/20 rounded-full blur-[0.5px]" />
          </div>

          {/* Layer 5: Glare / Reflection (Static relative to Sclera) */}
          {/* Top Glare */}
          <div className="absolute top-[12%] left-[18%] w-[40%] h-[20%] bg-gradient-to-b from-white/20 to-transparent rounded-[100%] -rotate-45 blur-[2px] opacity-60" />

          {/* Hard Specular Highlight */}
          <div className="absolute top-[22%] left-[24%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_white] opacity-90" />

          {/* Bottom Rim Light */}
          <div className="absolute bottom-[5%] inset-x-[20%] h-[15%] bg-gradient-to-t from-white/10 to-transparent rounded-[100%] opacity-30 blur-md" />
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
          <span className={cn("font-medium", status === "streaming" ? "text-accent-chat" : "")}>
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
