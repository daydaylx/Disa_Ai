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

type CubeVariant = "A" | "B";

type CubeVisualConfig = {
  strokeClass: string;
  accentClass: string;
  glowClass: string;
  orbitVisible: boolean;
  waveVisible: boolean;
  shadowClass: string;
};

const CUBE_VISUAL_CONFIG: Record<CoreStatus, CubeVisualConfig> = {
  idle: {
    strokeClass: "text-brand-primary",
    accentClass: "text-brand-secondary",
    glowClass: "bg-brand-primary/25",
    orbitVisible: false,
    waveVisible: false,
    shadowClass: "shadow-glow-md",
  },
  thinking: {
    strokeClass: "text-brand-primary",
    accentClass: "text-brand-secondary",
    glowClass: "bg-brand-primary/30",
    orbitVisible: true,
    waveVisible: false,
    shadowClass: "shadow-glow-lg",
  },
  streaming: {
    strokeClass: "text-accent-chat",
    accentClass: "text-brand-primary",
    glowClass: "bg-accent-chat/30",
    orbitVisible: true,
    waveVisible: true,
    shadowClass: "shadow-glow-lg",
  },
  error: {
    strokeClass: "text-status-error",
    accentClass: "text-status-error",
    glowClass: "bg-status-error/30",
    orbitVisible: false,
    waveVisible: false,
    shadowClass: "shadow-[0_0_20px_rgba(239,68,68,0.35)]",
  },
};

type CubeWireframeProps = {
  variant: CubeVariant;
  animationStatus: CoreStatus;
  strokeClass: string;
  accentClass: string;
  glitching: boolean;
};

function getCubeAnimationClass(
  animationStatus: CoreStatus,
  variant: CubeVariant,
  glitching: boolean,
) {
  if (glitching) return "animate-cube-glitch";
  if (animationStatus === "thinking")
    return variant === "A" ? "animate-cube-a-thinking" : "animate-cube-b-thinking";
  if (animationStatus === "streaming")
    return variant === "A" ? "animate-cube-a-streaming" : "animate-cube-b-streaming";
  if (animationStatus === "error") return "animate-cube-glitch";
  return variant === "A" ? "animate-cube-a-idle" : "animate-cube-b-idle";
}

function CubeWireframe({
  variant,
  animationStatus,
  strokeClass,
  accentClass,
  glitching,
}: CubeWireframeProps) {
  const animationClass = getCubeAnimationClass(animationStatus, variant, glitching);

  return (
    <div
      data-testid={`cube-${variant.toLowerCase()}`}
      className={cn(
        "absolute inset-0 flex items-center justify-center pointer-events-none [transform-style:preserve-3d]",
        variant === "A" ? "z-20" : "z-10",
        animationClass,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 80 80"
        className={cn(
          "w-[76%] h-[76%] transition-[filter] duration-500",
          variant === "B" ? "scale-95" : "scale-100",
        )}
        role="presentation"
      >
        <g
          className={cn("opacity-90", strokeClass)}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <rect x="18" y="22" width="32" height="32" rx="3" />
          <rect x="26" y="14" width="32" height="32" rx="3" />
          <line x1="18" y1="22" x2="26" y2="14" />
          <line x1="50" y1="22" x2="58" y2="14" />
          <line x1="50" y1="54" x2="58" y2="46" />
          <line x1="18" y1="54" x2="26" y2="46" />
        </g>

        <g
          className={cn("opacity-70 transition-opacity duration-500", accentClass)}
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <line x1="26" y1="14" x2="58" y2="14" strokeDasharray="6 8" />
          <line x1="18" y1="22" x2="50" y2="22" strokeDasharray="8 10" />
          <line x1="26" y1="46" x2="58" y2="46" strokeDasharray="6 8" />
          <line x1="18" y1="54" x2="50" y2="54" strokeDasharray="8 10" />
          <line x1="26" y1="46" x2="26" y2="14" strokeDasharray="4 8" />
          <line x1="50" y1="54" x2="50" y2="22" strokeDasharray="4 8" />
        </g>
      </svg>
    </div>
  );
}

export function ChatHeroCore({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: ChatHeroCoreProps) {
  const config = CUBE_VISUAL_CONFIG[status];
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (status === "error") {
      setGlitching(true);
      const timer = setTimeout(() => setGlitching(false), 750);
      return () => clearTimeout(timer);
    }
    setGlitching(false);
    return undefined;
  }, [status]);

  const animationStatus: CoreStatus = glitching ? "error" : status === "error" ? "idle" : status;

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-6 pt-2 w-full animate-fade-in">
      <div
        className={cn("relative w-32 h-32 flex items-center justify-center", config.shadowClass)}
        data-testid="cube-core"
      >
        <div
          className={cn(
            "absolute inset-4 rounded-[28%] blur-2xl opacity-40 transition-all duration-500 pointer-events-none",
            config.glowClass,
            status === "thinking" || status === "streaming" ? "opacity-60" : "",
            status === "error" ? "opacity-70" : "",
          )}
        />

        {config.orbitVisible && (
          <div
            data-testid="cube-orbit"
            className={cn(
              "absolute inset-[-8px] rounded-[32%] border border-dashed animate-cube-orbit opacity-60 pointer-events-none",
              status === "streaming" ? "border-accent-chat/30" : "border-brand-primary/25",
            )}
          />
        )}

        {config.waveVisible && (
          <>
            <div
              data-testid="cube-wave"
              className="absolute inset-0 rounded-[30%] border border-accent-chat/25 opacity-70 animate-cube-wave pointer-events-none"
            />
            <div
              className="absolute inset-0 rounded-[30%] border border-accent-chat/20 opacity-60 animate-cube-wave pointer-events-none"
              style={{ animationDelay: "0.9s" }}
            />
          </>
        )}

        <CubeWireframe
          variant="A"
          animationStatus={animationStatus}
          strokeClass={config.strokeClass}
          accentClass={config.accentClass}
          glitching={glitching}
        />
        <CubeWireframe
          variant="B"
          animationStatus={animationStatus}
          strokeClass={config.strokeClass}
          accentClass={config.accentClass}
          glitching={glitching}
        />
      </div>

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
