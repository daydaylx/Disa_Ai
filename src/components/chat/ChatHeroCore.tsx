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

const CORE_VISUAL_CONFIG: Record<
  CoreStatus,
  {
    ringVisible: boolean;
    waveEnabled: boolean;
    baseColorClass: string;
    accentColorClass: string;
    glowColorClass: string;
  }
> = {
  idle: {
    ringVisible: false,
    waveEnabled: false,
    baseColorClass: "bg-brand-primary",
    accentColorClass: "bg-brand-secondary",
    glowColorClass: "shadow-glow-md",
  },
  thinking: {
    ringVisible: true,
    waveEnabled: false,
    baseColorClass: "bg-brand-primary",
    accentColorClass: "bg-brand-secondary",
    glowColorClass: "shadow-glow-lg",
  },
  streaming: {
    ringVisible: true,
    waveEnabled: true,
    baseColorClass: "bg-brand-primary",
    accentColorClass: "bg-accent-chat",
    glowColorClass: "shadow-glow-lg",
  },
  error: {
    ringVisible: false,
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

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-6 pt-2 w-full animate-fade-in">
      {/* Visual Core Container */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background Glow Layer */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-500",
            status === "error" ? "bg-red-500" : "bg-brand-primary",
            status === "thinking" || status === "streaming" ? "scale-125 opacity-50" : "scale-100",
          )}
        />

        {/* Outer Ring (Thinking/Streaming) */}
        {config.ringVisible && (
          <div className="absolute inset-0 animate-core-ring-spin">
            <div className="w-full h-full rounded-full border border-white/20 border-t-brand-primary/80 border-r-transparent" />
          </div>
        )}

        {/* Waves (Streaming) */}
        {config.waveEnabled && (
          <>
            <div className="absolute inset-0 rounded-full border border-brand-primary/30 animate-core-wave" />
            <div
              className="absolute inset-0 rounded-full border border-brand-primary/30 animate-core-wave"
              style={{ animationDelay: "0.8s" }}
            />
          </>
        )}

        {/* The Core Itself */}
        <div
          className={cn(
            "relative w-16 h-16 rounded-full flex items-center justify-center z-10 transition-colors duration-500",
            config.baseColorClass,
            config.glowColorClass,
            "bg-gradient-to-br from-white/20 to-transparent", // Inner highlight
            // Always animate pulse unless error shake is active
            showErrorShake ? "animate-core-error-shake" : "animate-core-pulse",
          )}
        >
          {/* Inner accent dot */}
          <div className="w-6 h-6 rounded-full bg-white/20 blur-[1px]" />
        </div>
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
