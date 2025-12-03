import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface BookPageAnimatorProps {
  children: ReactNode;
  pageKey: string; // Key to trigger transition (e.g. conversation ID)
  direction?: "forward" | "backward"; // Could be used for history navigation
}

// Updated to "Dust Cloud" Fade per Slate & Chalk V1 Spec
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.12, // 80-120ms
      ease: "linear", // Simple dissolve
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: "linear",
    },
  },
};

export function BookPageAnimator({ children, pageKey }: BookPageAnimatorProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transformStyle: "preserve-3d", // Enable 3D for rotateY
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
