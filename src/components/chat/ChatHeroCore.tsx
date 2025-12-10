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

/**
 * Configuration object for the Energy Orb Core.
 * Controls all visual parameters and animation speeds per status.
 */
type OrbCoreConfig = {
  // Iris rotation speed (Tailwind animation class)
  irisRotationClass: string;
  // Pupil pulsing animation
  pupilAnimationClass: string;
  // Enable wave effect (for streaming)
  waveEnabled: boolean;
  // Main orb color tokens
  irisColorFrom: string;
  irisColorTo: string;
  irisColorVia?: string;
  glowColor: string;
  glowOpacity: string;
  // Halo particle intensity (0–1 scale, controls opacity/flicker)
  haloIntensity: number;
};

const ORB_CORE_CONFIG: Record<CoreStatus, OrbCoreConfig> = {
  idle: {
    irisRotationClass: "animate-orb-rotate-slow", // 40s rotation
    pupilAnimationClass: "animate-orb-pupil-idle", // slow pulse
    waveEnabled: false,
    irisColorFrom: "from-brand-primary", // violet
    irisColorTo: "to-brand-secondary", // indigo
    irisColorVia: "via-brand-secondary",
    glowColor: "bg-brand-primary",
    glowOpacity: "opacity-20",
    haloIntensity: 0.4,
  },
  thinking: {
    irisRotationClass: "animate-orb-rotate-medium", // 15s rotation
    pupilAnimationClass: "animate-orb-pupil-thinking", // medium pulse
    waveEnabled: false,
    irisColorFrom: "from-brand-primary",
    irisColorTo: "to-accent-chat",
    irisColorVia: "via-brand-secondary",
    glowColor: "bg-brand-primary",
    glowOpacity: "opacity-30",
    haloIntensity: 0.6,
  },
  streaming: {
    irisRotationClass: "animate-orb-rotate-medium", // keep medium, add wave
    pupilAnimationClass: "animate-orb-pupil-streaming", // fast pulse
    waveEnabled: true,
    irisColorFrom: "from-accent-chat",
    irisColorTo: "to-brand-primary",
    irisColorVia: "via-brand-secondary",
    glowColor: "bg-accent-chat",
    glowOpacity: "opacity-40",
    haloIntensity: 0.8,
  },
  error: {
    irisRotationClass: "animate-none", // stop rotation
    pupilAnimationClass: "scale-90", // contracted pupil
    waveEnabled: false,
    irisColorFrom: "from-status-error",
    irisColorTo: "to-red-600",
    glowColor: "bg-status-error",
    glowOpacity: "opacity-40",
    haloIntensity: 0.3,
  },
};

/**
 * ChatHeroCore: Energy Orb Eye
 *
 * A living, multi-layered orb resembling an abstract AI eye with:
 * - Outer glow backdrop
 * - Particle halo (ring of small light points)
 * - Energy iris (rotating, segmented ring)
 * - Pupil with highlight
 * - Status-driven animations (rotation, pulsing, waves, glitch)
 */
export function ChatHeroCore({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: ChatHeroCoreProps) {
  const config = ORB_CORE_CONFIG[status];
  const [glitching, setGlitching] = useState(false);

  // Trigger glitch animation on error
  useEffect(() => {
    if (status === "error") {
      setGlitching(true);
      const timer = setTimeout(() => setGlitching(false), 600);
      return () => clearTimeout(timer);
    }
    setGlitching(false);
    return undefined;
  }, [status]);

  // Container animation: breathe when idle, shake on error
  const containerAnimationClass = glitching ? "animate-orb-shake" : "animate-orb-breathe";

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-6 pt-2 w-full animate-fade-in">
      {/* Orb Container */}
      <div
        className={cn(
          "relative w-28 h-28 flex items-center justify-center",
          containerAnimationClass,
        )}
      >
        {/* Layer 1: Outer Glow Backdrop */}
        <div
          className={cn(
            "absolute -inset-8 rounded-full blur-2xl transition-all duration-700",
            config.glowColor,
            config.glowOpacity,
          )}
        />

        {/* Layer 2: Particle Halo (small glowing dots around the orb) */}
        <ParticleHalo intensity={config.haloIntensity} status={status} />

        {/* Streaming Wave Effect (expands outward from iris) */}
        {config.waveEnabled && (
          <div
            className={cn(
              "absolute inset-0 rounded-full border-2 animate-orb-wave pointer-events-none",
              "border-accent-chat/30",
            )}
          />
        )}

        {/* Layer 3: Main Orb Body (Sclera/Background) */}
        <div className="relative w-full h-full rounded-full bg-surface-inset shadow-2xl overflow-hidden border border-white/5 ring-1 ring-black/50">
          {/* Subtle gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          {/* Layer 4: Energy Iris (Rotating Ring) */}
          <div
            className={cn(
              "absolute inset-[12%] rounded-full transition-all duration-700",
              config.irisRotationClass,
            )}
          >
            {/* Conic gradient iris with radial structure */}
            <div
              className={cn(
                "absolute inset-0 rounded-full opacity-80 mix-blend-screen transition-all duration-700",
                "bg-[conic-gradient(var(--tw-gradient-stops))]",
                config.irisColorFrom,
                config.irisColorTo,
                config.irisColorVia ? config.irisColorVia : "",
              )}
            />

            {/* Iris Texture: Radial Segments (Striations) */}
            <div
              className={cn(
                "absolute inset-0 rounded-full opacity-40 mix-blend-overlay",
                "bg-[repeating-conic-gradient(transparent_0deg,transparent_2deg,rgba(0,0,0,0.5)_3deg,transparent_4deg)]",
              )}
            />
          </div>

          {/* Layer 5: Pupil (Dark Core) */}
          <div
            className={cn(
              "absolute inset-[38%] rounded-full transition-transform duration-500",
              "bg-[#050505] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]",
              config.pupilAnimationClass,
            )}
          >
            {/* Tiny Pupil Highlight */}
            <div className="absolute top-[20%] left-[25%] w-[15%] h-[15%] bg-white/20 rounded-full blur-[0.5px]" />
          </div>

          {/* Layer 6: Specular Highlights (Static relative to sclera) */}
          {/* Top Glare */}
          <div className="absolute top-[14%] left-[20%] w-[40%] h-[18%] bg-gradient-to-b from-white/20 to-transparent rounded-[100%] -rotate-45 blur-[2px] opacity-60" />

          {/* Hard Specular Highlight */}
          <div className="absolute top-[24%] left-[26%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_white] opacity-90" />

          {/* Bottom Rim Light */}
          <div className="absolute bottom-[6%] inset-x-[22%] h-[14%] bg-gradient-to-t from-white/10 to-transparent rounded-[100%] opacity-30 blur-md" />
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center space-y-2 max-w-sm px-4">
        <h2 className="text-xl font-semibold text-ink-primary transition-all duration-300">
          {status === "error" ? "Ein Fehler ist aufgetreten" : "Was kann ich für dich tun?"}
        </h2>

        <p className="text-sm text-ink-secondary transition-all duration-300">
          {status === "error" && lastErrorMessage
            ? lastErrorMessage
            : "Tippe unten eine Frage ein oder wähle einen der Vorschläge."}
        </p>

        {/* Status Line */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wider text-ink-tertiary mt-2 pt-2 border-t border-white/5 transition-all duration-300">
          <span
            className={cn(
              "font-medium transition-colors",
              status === "streaming" ? "text-accent-chat" : "",
              status === "error" ? "text-status-error" : "",
            )}
          >
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
        </div>
      </div>
    </div>
  );
}

/**
 * ParticleHalo: Ring of small glowing particles around the orb
 * Particles flicker subtly based on intensity.
 */
function ParticleHalo({ intensity, status }: { intensity: number; status: CoreStatus }) {
  // Generate 16 particles in a ring
  const particleCount = 16;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * 360;
    // Radius from center (orb is w-28 = 7rem = 112px, so radius ~56px, halo at ~70px)
    const radius = 58; // px
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    // Vary size and opacity slightly for organic feel
    const size = 2 + Math.random() * 2; // 2–4px
    const baseOpacity = 0.3 + Math.random() * 0.3; // 0.3–0.6
    const finalOpacity = baseOpacity * intensity;

    // Stagger animation delay for flicker effect
    const delay = Math.random() * 2000; // 0–2s

    return { x, y, size, opacity: finalOpacity, delay, angle };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute rounded-full transition-all duration-700",
            status === "streaming" ? "animate-pulse" : "",
            status === "thinking" ? "animate-pulse" : "",
          )}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            transform: "translate(-50%, -50%)",
            backgroundColor: status === "error" ? "#ef4444" : "#8b5cf6",
            opacity: p.opacity,
            animationDelay: `${p.delay}ms`,
            animationDuration: status === "streaming" ? "1s" : "2s",
          }}
        />
      ))}
    </div>
  );
}
