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
        {/* Background Glow Layer (Square) */}
        <div
          className={cn(
            "absolute inset-0 rounded-3xl blur-2xl opacity-40 transition-all duration-500",
            status === "error" ? "bg-red-500" : "bg-brand-primary",
            status === "thinking" || status === "streaming" ? "scale-110 opacity-50" : "scale-100",
          )}
        />

        {/* Outer Ring (Thinking/Streaming) - Dashed Square */}
        {config.ringVisible && (
          <div className="absolute inset-[-4px] animate-core-ring-spin opacity-60">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <rect
                x="2"
                y="2"
                width="96"
                height="96"
                rx="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="10 10"
                className="text-brand-primary"
              />
            </svg>
          </div>
        )}

        {/* Waves (Streaming) - Expanding Squares */}
        {config.waveEnabled && (
          <>
            <div className="absolute inset-0 rounded-3xl border border-brand-primary/30 animate-core-wave" />
            <div
              className="absolute inset-0 rounded-3xl border border-brand-primary/30 animate-core-wave"
              style={{ animationDelay: "0.8s" }}
            />
          </>
        )}

        {/* The Core Itself (Artifact) */}
        <div
          className={cn(
            "relative w-20 h-20 rounded-3xl flex items-center justify-center z-10 transition-colors duration-500 overflow-hidden border border-white/10",
            config.baseColorClass,
            config.glowColorClass,
            "bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm", // Glassy surface
            // Always animate pulse unless error shake is active
            showErrorShake ? "animate-core-error-shake" : "animate-core-pulse",
          )}
        >
          {/* Internal Tech Grid Pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />

          {/* Corner Accents (Inside) */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/40 rounded-tl-sm" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/40 rounded-tr-sm" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/40 rounded-bl-sm" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/40 rounded-br-sm" />

          {/* Center Element - Floating Diamond */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/20 rotate-45 rounded-sm animate-pulse" />
            <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]" />
          </div>
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
