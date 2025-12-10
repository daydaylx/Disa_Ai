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

export function ChatHeroCore3D({ status }: ChatHeroCore3DProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in relative z-0">
      {/* 3D Container - Mobile optimized sizing */}
      <motion.div
        className={cn(
          "relative flex items-center justify-center",
          "w-[clamp(160px,40vw,220px)] h-[clamp(160px,40vw,220px)]", // Optimized size for better balance
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background ambient glow (enhanced depth) */}
        <div
          className={cn(
            "absolute inset-[10%] rounded-full blur-2xl opacity-50 scale-110 transition-all duration-1000",
            status === "error"
              ? "bg-red-500/60 shadow-[0_0_60px_-12px_rgba(239,68,68,0.8)]"
              : status === "thinking"
                ? "bg-fuchsia-500/60 shadow-[0_0_60px_-12px_rgba(217,70,239,0.8)]"
                : status === "streaming"
                  ? "bg-blue-500/60 shadow-[0_0_60px_-12px_rgba(59,130,246,0.8)]"
                  : "bg-cyan-500/60 shadow-[0_0_60px_-12px_rgba(6,182,212,0.8)]",
          )}
        />

        {/* The 3D Scene */}
        <div className="w-full h-full relative z-10">
          <ThreeEnergyEyeScene status={status} />
        </div>

        {/* Subtle frame for structure */}
        <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
      </motion.div>
    </div>
  );
}
