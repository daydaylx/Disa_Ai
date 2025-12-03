import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface BookPageAnimatorProps {
  children: ReactNode;
  pageKey: string; // Key to trigger transition (e.g. conversation ID)
  direction?: "forward" | "backward"; // Could be used for history navigation
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 20, // Slight slide from right (like a new page)
    rotateY: 5, // Slight 3D perspective
    transformOrigin: "left center",
  },
  animate: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const, // Ease-out cubic (smooth landing)
    },
  },
  exit: {
    opacity: 0,
    x: -10, // Slight slide to left
    transition: {
      duration: 0.2,
      ease: "easeIn",
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
