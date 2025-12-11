/**
 * AnimatedBlobBackground Component
 *
 * Provides an animated, organic gradient blob background for the chat hero section.
 * Features:
 * - 3 overlapping gradient blobs with Cyan/Magenta/Violet colors
 * - Smooth, slow morph animation (12-20s cycles)
 * - Respects prefers-reduced-motion for accessibility
 * - Pure CSS/Tailwind solution (no Canvas/WebGL)
 * - Text remains readable with balanced opacity
 *
 * Usage:
 * <AnimatedBlobBackground>
 *   <YourContent />
 * </AnimatedBlobBackground>
 */

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface AnimatedBlobBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedBlobBackground({ children, className = "" }: AnimatedBlobBackgroundProps) {
  return (
    <div className={`relative min-h-[40vh] flex flex-col items-center justify-center ${className}`}>
      {/* Blob Layer - Behind Content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1: Cyan to Violet - Center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] rounded-full opacity-30 blur-3xl animate-blob-float-1"
          style={{
            background: "radial-gradient(circle, #32e0ff 0%, #7b5cff 100%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Blob 2: Magenta to Violet - Left Bottom */}
        <motion.div
          className="absolute top-2/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[350px] max-h-[350px] rounded-full opacity-25 blur-3xl animate-blob-float-2"
          style={{
            background: "radial-gradient(circle, #ff4fd8 0%, #7b5cff 100%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        />

        {/* Blob 3: Cyan to Blue - Right Top */}
        <motion.div
          className="absolute top-1/3 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] max-w-[320px] max-h-[320px] rounded-full opacity-20 blur-3xl animate-blob-float-3"
          style={{
            background: "radial-gradient(circle, #00e5ff 0%, #0099ff 100%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Content Layer - Above Blobs */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
