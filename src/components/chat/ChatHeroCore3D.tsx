import { Fragment, useMemo } from "react";

import { ThreeEnergyEyeScene } from "@/components/chat/ThreeEnergyEyeScene";
import { cn } from "@/lib/utils";
import type { CoreStatus } from "@/types/core";

export type { CoreStatus };

interface ChatHeroCore3DProps {
  status: CoreStatus;
  modelName: string;
  toneLabel: string;
  creativityLabel: string;
  lastErrorMessage?: string;
}

const statusText: Record<CoreStatus, { label: string; color: string; accent: string }> = {
  idle: { label: "Bereit", color: "text-cyan-200", accent: "bg-cyan-500/40" },
  thinking: { label: "Denkt", color: "text-violet-200", accent: "bg-violet-500/40" },
  streaming: { label: "Streamt", color: "text-sky-100", accent: "bg-emerald-500/40" },
  error: { label: "Fehler", color: "text-amber-100", accent: "bg-amber-500/40" },
};

export function ChatHeroCore3D({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: ChatHeroCore3DProps) {
  const statusInfo = statusText[status];

  const subtitle = useMemo(
    () =>
      [toneLabel, creativityLabel]
        .filter(Boolean)
        .map((text) => text.trim())
        .join(" · "),
    [creativityLabel, toneLabel],
  );

  return (
    <div className="w-full flex flex-col items-center gap-5 pb-6 pt-[calc(env(safe-area-inset-top,0px)+10px)] animate-fade-in">
      <div className="relative">
        <div className="absolute inset-[-18%] rounded-full bg-gradient-to-br from-indigo-600/30 via-sky-500/10 to-cyan-500/25 blur-3xl" />
        <div className="absolute inset-[-10%] rounded-full bg-gradient-to-tr from-white/8 via-white/4 to-transparent blur-2xl" />
        <div
          className={cn(
            "relative aspect-square",
            "w-[clamp(5.5rem,30vw,10.5rem)] h-[clamp(5.5rem,30vw,10.5rem)]",
            "md:w-[clamp(6.25rem,18vw,12rem)] md:h-[clamp(6.25rem,18vw,12rem)]",
            "rounded-full overflow-hidden border border-white/8 shadow-[0_0_60px_rgba(99,102,241,0.25)]",
            "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
          )}
        >
          <div className="absolute inset-0 z-10 pointer-events-none border border-white/10 rounded-full mix-blend-screen" />
          <ThreeEnergyEyeScene status={status} />
        </div>
        <div className="absolute inset-[-14%] rounded-full border border-white/5 opacity-60 blur-xl" />
        <div className="absolute inset-[-22%] rounded-full border border-cyan-400/25 opacity-60 blur-[72px]" />
      </div>

      <div className="flex flex-col items-center text-center gap-1 px-6">
        <span className="text-xs uppercase tracking-[0.18em] text-ink-tertiary">Disa Core</span>
        <h2 className="text-lg font-semibold text-ink-primary drop-shadow-sm">{modelName}</h2>
        <p className="text-sm text-ink-secondary/90">{subtitle}</p>
        <div className="flex items-center gap-3 mt-2">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border border-white/10",
              statusInfo.accent,
              statusInfo.color,
            )}
          >
            <span
              className="inline-block h-2 w-2 rounded-full bg-white/70 shadow-[0_0_20px_rgba(255,255,255,0.8)]"
              aria-hidden
            />
            {statusInfo.label}
          </span>
          <span className="text-xs text-ink-tertiary">{creativityLabel}</span>
        </div>
      </div>

      {status === "error" && lastErrorMessage ? (
        <p className="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-400/20 rounded-xl px-4 py-2 backdrop-blur">
          {lastErrorMessage}
        </p>
      ) : null}

      <div className="w-full max-w-xl flex flex-wrap justify-center gap-2 px-4 text-[11px] text-ink-tertiary">
        {["Volumetrische Iris", "Data-Rings", "Post-Processing Bloom", "GPU Noise"].map((item) => (
          <Fragment key={item}>
            <span className="rounded-full bg-white/5 border border-white/5 px-3 py-1 backdrop-blur-sm text-ink-secondary/80">
              {item}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
