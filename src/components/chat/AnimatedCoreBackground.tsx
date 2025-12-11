import { useMemo } from "react";

import { cn } from "@/lib/utils";
import type { CoreStatus } from "@/types/orb";

interface AnimatedCoreBackgroundProps {
  status: CoreStatus;
  lastErrorMessage?: string;
}

const STATUS_COPY: Record<CoreStatus, { title: string; description: string; badge: string }> = {
  idle: {
    title: "Was kann ich für dich tun?",
    description: "Tippe unten eine Frage ein oder wähle einen der Vorschläge.",
    badge: "Bereit",
  },
  thinking: {
    title: "Nachdenken …",
    description: "Der Core sammelt gerade Ideen für deine Anfrage.",
    badge: "Denken",
  },
  streaming: {
    title: "Antwort wird erstellt",
    description: "Disa AI formuliert bereits eine Antwort für dich.",
    badge: "Aktiv",
  },
  error: {
    title: "Ein Fehler ist aufgetreten",
    description: "Bitte versuche es erneut oder passe deine Eingabe an.",
    badge: "Fehler",
  },
};

export function AnimatedCoreBackground({ status, lastErrorMessage }: AnimatedCoreBackgroundProps) {
  const copy = useMemo(() => {
    const baseCopy = STATUS_COPY[status];

    if (status === "error" && lastErrorMessage) {
      return { ...baseCopy, description: lastErrorMessage };
    }

    return baseCopy;
  }, [lastErrorMessage, status]);

  const badgeAccent = useMemo(() => {
    switch (status) {
      case "thinking":
        return "from-fuchsia-500/60 via-violet-400/60 to-indigo-400/50 text-fuchsia-50";
      case "streaming":
        return "from-cyan-400/60 via-sky-400/60 to-indigo-400/50 text-cyan-50";
      case "error":
        return "from-rose-500/70 via-orange-400/70 to-amber-400/60 text-rose-50";
      default:
        return "from-indigo-400/60 via-cyan-400/60 to-fuchsia-500/60 text-indigo-50";
    }
  }, [status]);

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-6 pb-8 pt-4 w-full"
      data-testid="animated-core"
    >
      <div className="animated-core pointer-events-none" aria-hidden>
        <div className="animated-core__layer animated-core__layer--primary" />
        <div className="animated-core__layer animated-core__layer--secondary" />
        <div className="animated-core__halo" />
        <div className="animated-core__pulse" />
        <div className="animated-core__grain" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[68%] w-[68%] rounded-full bg-gradient-to-br from-white/10 via-white/5 to-white/15 blur-3xl opacity-60" />
        </div>
      </div>

      <div className="relative -mt-14 space-y-3 text-center px-4 w-full max-w-xl">
        <div className="flex justify-center">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium shadow-[0_0_35px_-18px_rgba(255,255,255,0.4)]",
              "border border-white/10 bg-surface-2/70 backdrop-blur",
              "bg-gradient-to-r",
              badgeAccent,
            )}
          >
            <span
              className="h-2 w-2 rounded-full bg-white/80 shadow-[0_0_0_2px_rgba(255,255,255,0.08)]"
              aria-hidden
            />
            {copy.badge}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-ink-primary drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
          {copy.title}
        </h2>
        <p className="text-sm text-ink-secondary max-w-xl mx-auto leading-relaxed">
          {copy.description}
        </p>
      </div>
    </div>
  );
}
