import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { CoreStatus } from "@/types/orb";

// Removed ThreeEnergyEyeScene import to be "transparent"
// import { ThreeEnergyEyeScene } from "./ThreeEnergyEyeScene";

interface ChatHeroCore3DProps {
  status: CoreStatus;
  lastErrorMessage?: string;
}

const STATUS_META: Record<
  CoreStatus,
  { label: string; subline: string; glow: string; chip: string }
> = {
  idle: {
    label: "Bereit",
    subline: "Warte auf deine Eingabe",
    glow: "from-cyan-500/20 via-indigo-600/15 to-blue-500/18",
    chip: "bg-cyan-500/10 text-cyan-100/90 border border-cyan-500/20",
  },
  thinking: {
    label: "Denken",
    subline: "Strukturieren & planen",
    glow: "from-fuchsia-500/22 via-violet-600/15 to-indigo-500/18",
    chip: "bg-fuchsia-500/10 text-fuchsia-100/90 border border-fuchsia-500/20",
  },
  streaming: {
    label: "Streaming",
    subline: "Antwort wird übertragen",
    glow: "from-sky-500/22 via-cyan-500/18 to-fuchsia-500/18",
    chip: "bg-sky-500/10 text-sky-100/90 border border-sky-500/20",
  },
  error: {
    label: "Fehler",
    subline: "Bitte erneut senden",
    glow: "from-red-500/22 via-orange-500/18 to-amber-500/18",
    chip: "bg-red-500/10 text-red-100/90 border border-red-500/25",
  },
};

export function ChatHeroCore3D({
  status,
  lastErrorMessage,
}: ChatHeroCore3DProps) {
  const meta = STATUS_META[status];

  return (
    <div className="w-full flex flex-col items-center gap-5 pb-6 pt-[calc(env(safe-area-inset-top,0px)+6px)] animate-fade-in relative z-10">
      <motion.div
        className="relative flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 12, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Removed 3D Orb Container, kept Status Text */}

        {/* Invisible spacer to push text down slightly if needed, or just let it float */}
        <div className="h-16 w-full" />

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-full",
                "backdrop-blur-md",
                meta.chip,
              )}
            >
              {meta.label}
            </span>
            <span className="text-xs text-ink-tertiary/80">{meta.subline}</span>
          </div>

          {status === "error" && lastErrorMessage && (
            <p className="text-[11px] text-red-100/90 max-w-xs leading-relaxed">
              {lastErrorMessage}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
