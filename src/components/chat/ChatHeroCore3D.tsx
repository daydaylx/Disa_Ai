import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { CoreStatus } from "@/types/orb";

import { ThreeEnergyEyeScene } from "./ThreeEnergyEyeScene";

interface ChatHeroCore3DProps {
  status: CoreStatus;
  modelName: string;
  toneLabel: string;
  creativityLabel: string;
  lastErrorMessage?: string;
}

const STATUS_META: Record<
  CoreStatus,
  { label: string; subline: string; glow: string; chip: string; border: string }
> = {
  idle: {
    label: "Bereit",
    subline: "Warte auf deine Eingabe",
    glow: "from-cyan-500/40 via-indigo-600/30 to-blue-500/35",
    chip: "bg-cyan-500/15 text-cyan-100 border border-cyan-500/30",
    border: "border-cyan-500/25 shadow-[0_0_32px_rgba(6,182,212,0.25)]",
  },
  thinking: {
    label: "Denken",
    subline: "Strukturieren & planen",
    glow: "from-fuchsia-500/45 via-violet-600/30 to-indigo-500/35",
    chip: "bg-fuchsia-500/15 text-fuchsia-100 border border-fuchsia-500/30",
    border: "border-fuchsia-500/25 shadow-[0_0_40px_rgba(217,70,239,0.28)]",
  },
  streaming: {
    label: "Streaming",
    subline: "Antwort wird übertragen",
    glow: "from-sky-500/45 via-cyan-500/35 to-fuchsia-500/35",
    chip: "bg-sky-500/15 text-sky-100 border border-sky-500/30",
    border: "border-sky-400/30 shadow-[0_0_44px_rgba(125,211,252,0.32)]",
  },
  error: {
    label: "Fehler",
    subline: "Bitte erneut senden",
    glow: "from-red-500/45 via-orange-500/35 to-amber-500/35",
    chip: "bg-red-500/15 text-red-100 border border-red-500/40",
    border: "border-red-500/30 shadow-[0_0_36px_rgba(239,68,68,0.26)]",
  },
};

function InfoChip({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 rounded-xl px-3 py-2 bg-white/5 border border-white/10",
        "backdrop-blur-md text-left min-w-[5.5rem]",
        className,
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-tertiary">
        {label}
      </span>
      <span className="text-xs font-semibold text-ink-primary truncate">{value}</span>
    </div>
  );
}

export function ChatHeroCore3D({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: ChatHeroCore3DProps) {
  const meta = STATUS_META[status];

  return (
    <div className="w-full flex flex-col items-center gap-5 pb-6 pt-[calc(env(safe-area-inset-top,0px)+6px)] animate-fade-in">
      <motion.div
        className="relative flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 12, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div
          className={cn(
            "absolute inset-[-16%] rounded-full blur-3xl pointer-events-none",
            "bg-gradient-to-br opacity-60",
            meta.glow,
          )}
        />

        <div
          className={cn(
            "relative flex items-center justify-center aspect-square",
            "w-[clamp(7.5rem,38vw,12.5rem)] max-w-[14rem] min-w-[6.5rem]",
            "rounded-[28px] backdrop-blur-xl bg-surface-2/50",
            "border border-white/8 overflow-hidden shadow-lg",
            meta.border,
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_48%)]" />
          <div className="absolute inset-px rounded-[26px] bg-surface-1/30 border border-white/5" />
          <div className="relative w-full h-full">
            <ThreeEnergyEyeScene status={status} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-full",
                "backdrop-blur-lg",
                meta.chip,
              )}
            >
              {meta.label}
            </span>
            <span className="text-xs text-ink-tertiary">{meta.subline}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <InfoChip label="Modell" value={modelName} />
            <InfoChip label="Ton" value={toneLabel} />
            <InfoChip label="Kreativität" value={creativityLabel} />
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
