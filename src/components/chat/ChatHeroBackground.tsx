import { useMemo } from "react";

import { cn } from "@/lib/utils";
import type { CoreStatus } from "@/types/orb";

/**
 * ChatHeroBackground Component
 *
 * Replaces the previous "Orb/Planet" visualization with a subtle, organic
 * animated gradient background ("Blobs").
 *
 * Purpose:
 * - Provides a high-quality, neon-like backdrop for the empty chat state.
 * - Uses pure CSS/Tailwind animations (transform/opacity) for performance.
 * - Respects prefers-reduced-motion via Tailwind's `motion-reduce` utility.
 *
 * Animation Logic:
 * - 3 Blobs are positioned absolutely behind the content.
 * - Each blob moves independently using `blob-float-1`, `blob-float-2`, etc.
 * - Movement is slow (16-21s), infinite, and alternate to create an organic feel.
 * - Colors: Cyan (#32e0ff) -> Violet (#7b5cff) -> Magenta (#ff4fd8).
 */

interface ChatHeroBackgroundProps {
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

export function ChatHeroBackground({ status, lastErrorMessage }: ChatHeroBackgroundProps) {
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
        // Idle: Cyan -> Violet default as requested for general theme
        return "from-indigo-400/60 via-cyan-400/60 to-fuchsia-500/60 text-indigo-50";
    }
  }, [status]);

  return (
    <div
      className="relative flex w-full flex-col items-center justify-center overflow-hidden py-12 md:py-20"
      style={{ minHeight: "40vh" }}
      data-testid="chat-hero-background"
    >
      {/*
        Background Layer: Animated Blobs
        Positioned absolutely to sit behind the text content.
        Using motion-reduce:animate-none to respect accessibility settings.
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">

        {/* Blob 1: Cyan -> Violet (Top Center/Left) */}
        <div
          className={cn(
            "absolute left-1/2 top-1/4 h-[50vw] w-[50vw] -translate-x-1/2 rounded-full",
            "bg-gradient-to-r from-[#32e0ff] to-[#7b5cff]",
            "opacity-20 blur-[80px] md:blur-[100px]",
            "animate-blob-float-1 motion-reduce:animate-none"
          )}
        />

        {/* Blob 2: Magenta -> Violet (Bottom Left) */}
        <div
          className={cn(
            "absolute bottom-0 left-0 h-[60vw] w-[60vw] -translate-x-1/3 translate-y-1/4 rounded-full",
            "bg-gradient-to-tr from-[#ff4fd8] to-[#7b5cff]",
            "opacity-20 blur-[90px] md:blur-[120px]",
            "animate-blob-float-2 motion-reduce:animate-none"
          )}
        />

        {/* Blob 3: Additional Accent (Top Right) - slightly smaller/subtler */}
        <div
          className={cn(
            "absolute right-0 top-0 h-[45vw] w-[45vw] translate-x-1/4 -translate-y-1/4 rounded-full",
            "bg-gradient-to-bl from-[#7b5cff] via-[#32e0ff] to-transparent",
            "opacity-15 blur-[70px] md:blur-[90px]",
            "animate-blob-float-3 motion-reduce:animate-none"
          )}
        />
      </div>

      {/*
        Content Layer
        Z-index ensured to be above blobs.
      */}
      <div className="relative z-10 flex flex-col items-center space-y-5 px-4 text-center">

        {/* Badge */}
        <div className="flex justify-center">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium shadow-[0_0_35px_-18px_rgba(255,255,255,0.4)]",
              "border border-white/10 bg-surface-2/40 backdrop-blur-md", // More glass-like
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

        {/* Headline */}
        <h2 className="max-w-md text-2xl font-semibold text-ink-primary drop-shadow-sm md:text-3xl">
          {copy.title}
        </h2>

        {/* Subtext */}
        <p className="max-w-sm text-sm leading-relaxed text-ink-secondary/90 md:text-base">
          {copy.description}
        </p>
      </div>
    </div>
  );
}
