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
    </div>
  );
}
