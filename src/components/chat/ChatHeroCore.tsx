import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export type CoreStatus = "idle" | "thinking" | "streaming" | "error";

interface ChatHeroCoreProps {
  status: CoreStatus;
  modelName: string;
  toneLabel: string;
  creativityLabel: string;
  lastErrorMessage?: string;
}

type OrbLayerConfig = {
  coreGradient: string;
  irisGradient: string;
  rimGradient: string;
  glowColor: string;
  ringColor: string;
  particleColor: string;
  segmentColor: string;
  highlightColor: string;
  scanlineColor: string;
  waveColor: string;
  arcColor: string;
  arcGlow: string;
  irisDuration: number;
  segmentDuration: number;
  scanlineDuration: number;
  glareDuration: number;
  breathRange: [number, number];
  waveDelay?: number;
};

const ORB_CORE_CONFIG: Record<CoreStatus, OrbLayerConfig> = {
  idle: {
    coreGradient: "from-cyan-500 via-indigo-500 to-violet-600",
    irisGradient: "from-slate-950 via-slate-900 to-slate-800",
    rimGradient: "from-cyan-200/70 via-indigo-200/60 to-violet-200/60",
    glowColor: "bg-cyan-500/18",
    ringColor: "border-cyan-300/35",
    particleColor: "bg-cyan-200/70",
    segmentColor: "bg-indigo-200/70",
    highlightColor: "bg-white/80",
    scanlineColor: "rgba(255,255,255,0.08)",
    waveColor: "rgba(59, 207, 255, 0.28)",
    arcColor: "rgba(178, 235, 255, 0.75)",
    arcGlow: "rgba(83, 205, 255, 0.45)",
    irisDuration: 36,
    segmentDuration: 18,
    scanlineDuration: 12,
    glareDuration: 10,
    breathRange: [0.97, 1.02],
  },
  thinking: {
    coreGradient: "from-violet-500 via-fuchsia-500 to-indigo-400",
    irisGradient: "from-slate-950 via-indigo-900 to-slate-800",
    rimGradient: "from-violet-200/80 via-fuchsia-200/70 to-indigo-200/70",
    glowColor: "bg-violet-500/24",
    ringColor: "border-violet-300/45",
    particleColor: "bg-violet-200/85",
    segmentColor: "bg-fuchsia-200/85",
    highlightColor: "bg-white/90",
    scanlineColor: "rgba(255,255,255,0.12)",
    waveColor: "rgba(232, 121, 249, 0.26)",
    arcColor: "rgba(250, 232, 255, 0.8)",
    arcGlow: "rgba(212, 145, 255, 0.55)",
    irisDuration: 18,
    segmentDuration: 10,
    scanlineDuration: 8,
    glareDuration: 8,
    breathRange: [0.98, 1.04],
  },
  streaming: {
    coreGradient: "from-emerald-400 via-cyan-400 to-blue-500",
    irisGradient: "from-slate-950 via-cyan-900 to-slate-800",
    rimGradient: "from-emerald-200/80 via-cyan-200/80 to-blue-200/80",
    glowColor: "bg-cyan-500/30",
    ringColor: "border-cyan-300/60",
    particleColor: "bg-cyan-200",
    segmentColor: "bg-emerald-200/90",
    highlightColor: "bg-white/95",
    scanlineColor: "rgba(255,255,255,0.16)",
    waveColor: "rgba(103, 232, 249, 0.34)",
    arcColor: "rgba(199, 246, 255, 0.92)",
    arcGlow: "rgba(90, 230, 255, 0.6)",
    irisDuration: 12,
    segmentDuration: 6,
    scanlineDuration: 6,
    glareDuration: 6,
    breathRange: [0.99, 1.05],
    waveDelay: 1.8,
  },
  error: {
    coreGradient: "from-red-600 via-orange-600 to-amber-500",
    irisGradient: "from-black via-red-950 to-amber-900",
    rimGradient: "from-orange-200/80 via-red-200/70 to-amber-200/70",
    glowColor: "bg-red-500/30",
    ringColor: "border-orange-300/60",
    particleColor: "bg-orange-200",
    segmentColor: "bg-orange-200/90",
    highlightColor: "bg-white",
    scanlineColor: "rgba(255,255,255,0.18)",
    waveColor: "rgba(252, 211, 77, 0.32)",
    arcColor: "rgba(255, 226, 204, 0.9)",
    arcGlow: "rgba(255, 185, 120, 0.6)",
    irisDuration: 50,
    segmentDuration: 20,
    scanlineDuration: 10,
    glareDuration: 7,
    breathRange: [0.98, 1.03],
  },
};

const innerParticles = Array.from({ length: 14 }, (_, index) => ({
  angle: (360 / 14) * index + (index % 2 === 0 ? 6 : -4),
  radius: 37 + (index % 3) * 2,
  size: index % 3 === 0 ? 3 : 2,
  opacity: 0.5 + (index % 4) * 0.1,
}));

const outerParticles = Array.from({ length: 20 }, (_, index) => ({
  angle: (360 / 20) * index + (index % 2 === 0 ? -8 : 10),
  radius: 46 + (index % 5) * 1.5,
  size: index % 4 === 0 ? 3 : 2,
  opacity: 0.35 + (index % 5) * 0.07,
}));

const dataSegments = Array.from({ length: 28 }, (_, index) => ({
  angle: (360 / 28) * index,
  long: index % 3 === 0,
}));

const lightningArcs = Array.from({ length: 12 }, (_, index) => ({
  angle: (360 / 12) * index + (index % 2 === 0 ? 8 : -6),
  radius: 14 + (index % 4) * 4,
  length: 20 + (index % 3) * 8,
  thickness: index % 4 === 0 ? 2.5 : 1.75,
}));

export function ChatHeroCore({
  status,
  modelName,
  toneLabel,
  creativityLabel,
  lastErrorMessage,
}: ChatHeroCoreProps) {
  const config = ORB_CORE_CONFIG[status];
  const [glitching, setGlitching] = useState(false);
  const [tapPulse, setTapPulse] = useState(false);

  useEffect(() => {
    if (status === "error") {
      setGlitching(true);
      const timer = setTimeout(() => setGlitching(false), 800);
      return () => clearTimeout(timer);
    }
    setGlitching(false);
    return undefined;
  }, [status]);

  const handleTap = () => {
    setTapPulse(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
    setTimeout(() => setTapPulse(false), 320);
  };

  const particleFlickerDurations = useMemo(
    () =>
      innerParticles.map((_, index) =>
        status === "streaming"
          ? 1200 + index * 35
          : status === "thinking"
            ? 1400 + index * 45
            : 1800 + index * 50,
      ),
    [status],
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-8 pt-[calc(env(safe-area-inset-top,0px)+8px)] w-full animate-fade-in">
      <motion.div
        className={cn(
          "relative flex items-center justify-center aspect-square",
          "w-[clamp(5.5rem,16vw,7.75rem)] h-[clamp(5.5rem,16vw,7.75rem)]",
          "md:w-[clamp(6.25rem,12vw,9rem)] md:h-[clamp(6.25rem,12vw,9rem)]",
          "max-w-[10rem] min-w-[4.75rem]", // keep mobile friendly
        )}
        animate={{
          y: [0, -10, 0],
          scale: tapPulse
            ? 0.98
            : [config.breathRange[0], config.breathRange[1], config.breathRange[0]],
        }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        whileTap={{ scale: 0.96 }}
        onClick={handleTap}
      >
        {/* Ambient Glow */}
        <div
          className={cn(
            "absolute inset-[-10%] rounded-full blur-3xl transition-all duration-700 opacity-60",
            config.glowColor,
            glitching && "animate-orb-shake",
            tapPulse && "opacity-90",
          )}
        />
        <div
          className={cn(
            "absolute inset-2 rounded-full blur-2xl opacity-40 mix-blend-screen transition-colors duration-700",
            config.glowColor,
          )}
        />

        {/* Outer shell and particle belts */}
        <div className="absolute inset-0">
          {/* scope container */}
          <div
            className={cn(
              "absolute inset-[-4%] rounded-full border border-white/5 bg-gradient-to-br opacity-80",
              config.ringColor,
            )}
          />

          {/* Outer data ring with micro segments */}
          <motion.div
            className="absolute inset-[-6%]"
            animate={{ rotate: 360 }}
            transition={{ duration: config.segmentDuration, repeat: Infinity, ease: "linear" }}
          >
            {dataSegments.map((segment, index) => (
              <span
                key={`segment-${segment.angle}`}
                className={cn(
                  "absolute left-1/2 top-1/2 origin-left rounded-full",
                  segment.long ? "h-[3px] w-3" : "h-[2px] w-2",
                  config.segmentColor,
                  "shadow-[0_0_8px_rgba(255,255,255,0.08)]",
                  status === "streaming"
                    ? "animate-orb-bits-fast"
                    : status === "thinking"
                      ? "animate-orb-bits"
                      : "opacity-80",
                )}
                style={{
                  transform: `rotate(${segment.angle}deg) translateX(48%)`,
                  animationDelay: `${index * 40}ms`,
                }}
              />
            ))}
          </motion.div>

          {/* Outer particle belt */}
          <motion.div
            className="absolute inset-[-8%]"
            animate={{ rotate: status === "streaming" ? 360 : status === "thinking" ? 200 : 120 }}
            transition={{ duration: config.irisDuration, repeat: Infinity, ease: "linear" }}
          >
            {outerParticles.map((particle, index) => (
              <span
                key={`outer-${index}`}
                className={cn(
                  "absolute left-1/2 top-1/2 origin-center rounded-full",
                  config.particleColor,
                  "mix-blend-screen animate-orb-twinkle",
                )}
                style={{
                  width: particle.size,
                  height: particle.size,
                  opacity: particle.opacity,
                  transform: `rotate(${particle.angle}deg) translateX(${particle.radius}%)`,
                  animationDelay: `${index * 55}ms`,
                  animationDuration: `${particleFlickerDurations[index % particleFlickerDurations.length]}ms`,
                }}
              />
            ))}
          </motion.div>

          {/* Inner particle belt */}
          <motion.div
            className="absolute inset-[-2%]"
            animate={{
              rotate: status === "streaming" ? -300 : status === "thinking" ? -200 : -120,
            }}
            transition={{ duration: config.segmentDuration, repeat: Infinity, ease: "linear" }}
          >
            {innerParticles.map((particle, index) => (
              <span
                key={`inner-${index}`}
                className={cn(
                  "absolute left-1/2 top-1/2 origin-center rounded-full",
                  config.particleColor,
                  "mix-blend-screen animate-orb-twinkle",
                )}
                style={{
                  width: particle.size,
                  height: particle.size,
                  opacity: particle.opacity,
                  transform: `rotate(${particle.angle}deg) translateX(${particle.radius}%)`,
                  animationDelay: `${index * 35}ms`,
                  animationDuration: `${particleFlickerDurations[index % particleFlickerDurations.length]}ms`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Main Orb body */}
        <div
          className={cn(
            "relative inset-0 w-full h-full rounded-full overflow-visible bg-gradient-to-br",
            config.coreGradient,
            glitching && "animate-orb-shake",
            tapPulse && "scale-[1.01] duration-150",
          )}
        >
          {/* Soft rim and chromatic ring */}
          <div
            className={cn(
              "absolute inset-[4%] rounded-full bg-gradient-to-br opacity-50 blur-[1px]",
              config.rimGradient,
            )}
          />
          <div className="absolute inset-[6%] rounded-full border border-white/10 shadow-glow-md bg-gradient-to-tr from-white/4 via-white/2 to-white/4" />
          <div
            className="absolute inset-[8%] rounded-full opacity-70 mix-blend-screen"
            style={{
              backgroundImage:
                "conic-gradient(from 0deg, rgba(255,255,255,0.2), transparent 45deg, rgba(255,255,255,0.16) 90deg, transparent 135deg, rgba(255,255,255,0.12) 180deg, transparent 225deg, rgba(255,255,255,0.2) 270deg, transparent 315deg)",
              filter: "drop-shadow(0 0 18px rgba(255,255,255,0.08))",
            }}
          />
          <motion.div
            className="absolute inset-[10%] rounded-full"
            style={{
              backgroundImage:
                "conic-gradient(from 120deg, rgba(255,255,255,0.12), transparent 30deg, rgba(255,255,255,0.08) 210deg, transparent 260deg, rgba(255,255,255,0.12))",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: config.irisDuration * 1.1, repeat: Infinity, ease: "linear" }}
          />

          {/* Iris */}
          <motion.div
            className={cn(
              "absolute inset-[15%] rounded-full bg-gradient-to-br overflow-hidden shadow-inner",
              config.irisGradient,
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: config.irisDuration, repeat: Infinity, ease: "linear" }}
          >
            {/* Iris radial texture */}
            <div
              className="absolute inset-0 opacity-70 mix-blend-overlay"
              style={{
                backgroundImage:
                  "conic-gradient(from 0deg, rgba(255,255,255,0.08), rgba(255,255,255,0.0) 35deg, rgba(255,255,255,0.12) 90deg, transparent 120deg, rgba(255,255,255,0.08) 160deg, rgba(255,255,255,0.0) 210deg, rgba(255,255,255,0.08) 260deg, transparent 310deg)",
              }}
            />
            <motion.div
              className="absolute inset-[6%] rounded-full opacity-80"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25), rgba(255,255,255,0.05) 45%, rgba(0,0,0,0.35) 65%, transparent 70%)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: config.irisDuration * 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div
              className="absolute inset-[18%] rounded-full opacity-30 mix-blend-screen"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.18), transparent 40%)",
                backgroundSize: "120% 120%",
              }}
            />
            <div
              className="absolute inset-0 opacity-30 mix-blend-screen"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 0.7px, transparent 0.7px)",
                backgroundSize: "12px 12px",
              }}
            />

            {/* Electric veins */}
            <motion.div
              className="absolute inset-[10%]"
              animate={{ rotate: status === "streaming" ? 65 : 40 }}
              transition={{
                duration: status === "streaming" ? 5 : 9,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {lightningArcs.map((arc, index) => (
                <span
                  key={`arc-${arc.angle}-${index}`}
                  className="absolute left-1/2 top-1/2 origin-left rounded-full blur-[0.2px]"
                  style={{
                    height: `${arc.thickness}px`,
                    width: `${arc.length}%`,
                    transform: `rotate(${arc.angle}deg) translateX(${arc.radius}%) skewX(${index % 2 === 0 ? -8 : 6}deg)`,
                    background: `linear-gradient(90deg, transparent, ${config.arcColor} 30%, ${config.arcGlow} 55%, ${config.arcColor} 80%, transparent)`,
                    boxShadow: `0 0 8px ${config.arcGlow}`,
                    animationDelay: `${index * 90}ms`,
                  }}
                />
              ))}
            </motion.div>

            <div
              className="absolute inset-[12%] rounded-full opacity-50 mix-blend-screen animate-orb-arc-flicker"
              style={{
                backgroundImage:
                  "conic-gradient(from 45deg, rgba(255,255,255,0.14) 0deg 12deg, transparent 12deg 22deg, rgba(255,255,255,0.12) 22deg 32deg, transparent 32deg 42deg, rgba(255,255,255,0.18) 42deg 52deg, transparent 52deg 70deg)",
              }}
            />

            {/* Data belt overlay */}
            <motion.div
              className="absolute inset-[6%]"
              animate={{ rotate: -360 }}
              transition={{
                duration: config.segmentDuration * 1.6,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {dataSegments.slice(0, 16).map((segment, index) => (
                <span
                  key={`inner-segment-${segment.angle}`}
                  className={cn(
                    "absolute left-1/2 top-1/2 origin-left h-[2px] w-2 rounded-full",
                    config.segmentColor,
                    "opacity-80 animate-orb-bits-subtle",
                  )}
                  style={{
                    transform: `rotate(${segment.angle * 1.5}deg) translateX(32%)`,
                    animationDelay: `${index * 55}ms`,
                  }}
                />
              ))}
            </motion.div>

            {/* Scanline overlay */}
            <div
              className={cn(
                "absolute inset-[10%] rounded-full overflow-hidden pointer-events-none",
                status !== "idle" ? "animate-orb-scanline" : "animate-orb-scanline-slow",
              )}
              style={{ animationDuration: `${config.scanlineDuration}s` }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(180deg, transparent 35%, ${config.scanlineColor} 50%, transparent 65%)`,
                }}
              />
            </div>

            {/* Glare overlay */}
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-gradient-to-tr opacity-40 mix-blend-screen",
                status === "error"
                  ? "from-white/8 via-white/16 to-white/10"
                  : "from-white/10 via-white/20 to-white/14",
                "animate-orb-glare",
              )}
              style={{ animationDuration: `${config.glareDuration}s` }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-[24%] rounded-full border border-white/10 mix-blend-screen"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.16), transparent 55%), conic-gradient(from 90deg, rgba(255,255,255,0.24) 0deg 8deg, transparent 8deg 18deg, rgba(255,255,255,0.16) 18deg 26deg, transparent 26deg 40deg)",
            }}
            animate={{
              rotate: status === "streaming" ? 90 : 60,
              scale: status === "streaming" ? [0.98, 1.04, 0.98] : [0.99, 1.02, 0.99],
              opacity: [0.45, 0.7, 0.45],
            }}
            transition={{
              duration: status === "streaming" ? 4 : 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Pupil with depth */}
          <div className="absolute inset-[40%] rounded-full bg-gradient-to-b from-slate-950 via-black to-slate-950 shadow-[0_0_18px_rgba(0,0,0,0.4)]" />
          <motion.div
            className="absolute inset-[42%] rounded-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 shadow-inner"
            animate={{
              scale: tapPulse
                ? 0.92
                : status === "streaming"
                  ? [0.92, 1.02, 0.92]
                  : status === "thinking"
                    ? [0.95, 1.04, 0.95]
                    : [0.97, 1.02, 0.97],
            }}
            transition={{
              duration: status === "streaming" ? 1.2 : status === "thinking" ? 1.8 : 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute inset-[45%] rounded-full bg-gradient-to-br from-black via-slate-900 to-black" />
          <div className={cn("absolute inset-[52%] rounded-full", config.highlightColor)} />

          {/* Highlight / lens flare */}
          <motion.div
            className="absolute h-5 w-5 rounded-full bg-white/50 blur-[6px]"
            style={{ top: "22%", left: "30%" }}
            animate={{
              x: [0, status === "streaming" ? 3 : 2, 0],
              y: [0, status === "streaming" ? -3 : -2, 0],
              opacity: [0.6, 0.9, 0.6],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: status === "streaming" ? 2.2 : 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Pulsing wave for streaming */}
          {status === "streaming" && (
            <motion.div
              className={cn("absolute inset-[14%] rounded-full border", config.ringColor)}
              style={{ backgroundColor: config.waveColor }}
              animate={{ scale: [0.95, 1.5], opacity: [0.5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: config.waveDelay ?? 2,
                ease: "easeOut",
              }}
            />
          )}

          {/* Glitch sheen for error */}
          {status === "error" && glitching && (
            <div className="absolute inset-[8%] rounded-full border border-orange-300/50 mix-blend-screen animate-orb-shake" />
          )}
        </div>
      </motion.div>

      {/* Text Content */}
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
            : "Tippe unten eine Frage ein oder wähle einen der Vorschläge."}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wider text-ink-tertiary mt-2 pt-2 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.3 }}
        >
          <span
            className={cn(
              "font-medium transition-colors duration-500",
              status === "streaming" || status === "thinking" ? "text-accent-chat" : "",
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
        </motion.div>
      </div>
    </div>
  );
}
