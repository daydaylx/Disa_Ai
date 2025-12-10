import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { CoreStatus } from "./ThreeEnergyEyeScene";
import { ThreeEnergyEyeScene } from "./ThreeEnergyEyeScene";

interface ChatHeroCore3DProps {
  status: CoreStatus;
  modelName: string;
  toneLabel: string;
  creativityLabel: string;
  lastErrorMessage?: string;
}

export function ChatHeroCore3D({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: ChatHeroCore3DProps) {
  // Simple error handling/fallback logic can be expanded here if needed

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-6 pt-4 w-full animate-fade-in relative z-0">
      {/* 3D Container - Mobile optimized sizing */}
      <motion.div
        className={cn(
          "relative flex items-center justify-center",
          "w-[clamp(180px,50vw,280px)] h-[clamp(180px,50vw,280px)]", // Bigger container for 3D goodness
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background ambient glow (cheap fallback/enhancement) */}
        <div
          className={cn(
            "absolute inset-[15%] rounded-full blur-3xl opacity-40 transition-colors duration-1000",
            status === "error"
              ? "bg-red-600"
              : status === "thinking"
                ? "bg-fuchsia-600"
                : status === "streaming"
                  ? "bg-blue-600"
                  : "bg-cyan-600",
          )}
        />

        {/* The 3D Scene */}
        <div className="w-full h-full relative z-10">
          <ThreeEnergyEyeScene status={status} />
        </div>
      </motion.div>

      {/* Text Content */}
      <div className="text-center space-y-2 max-w-sm px-4 relative z-10 -mt-4">
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
