import { useDrag } from "@use-gesture/react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface BookPageAnimatorProps {
  children: ReactNode;
  activeChatId: string | null;
  swipeStack: string[];
  onSwipeLeft: () => void; // New Page
  onSwipeRight: () => void; // Go Back
  canSwipeRight: boolean;
  canSwipeLeft: boolean;
}

const SWIPE_THRESHOLD_PERCENT = 0.25; // 25% of container width
const ROTATION_FACTOR = 15; // Max rotation in degrees
const SCALE_FACTOR = 0.05; // Max scale reduction

export function BookPageAnimator({
  children,
  activeChatId,
  swipeStack,
  onSwipeLeft,
  onSwipeRight,
  canSwipeLeft,
  canSwipeRight,
}: BookPageAnimatorProps) {
  const [direction, setDirection] = useState(0); // 1 = Left Swipe (New Page), -1 = Right Swipe (Back)
  const prevIdRef = useRef<string | null>(activeChatId);
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0); // MotionValue for 1:1 drag
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine direction for page transition when activeChatId changes
  useEffect(() => {
    const prevId = prevIdRef.current;
    const currentId = activeChatId;

    if (prevId !== currentId) {
      const prevIndex = swipeStack.indexOf(prevId || "");
      const currentIndex = swipeStack.indexOf(currentId || "");

      if (prevIndex === -1 && currentIndex === 0) {
        // New chat created, wasn't in stack, now at 0
        setDirection(1);
      } else if (currentIndex < prevIndex) {
        // Navigating to a newer page in the stack (e.g., from index 1 to 0)
        setDirection(1);
      } else if (currentIndex > prevIndex) {
        // Navigating to an older page in the stack (e.g., from index 0 to 1)
        setDirection(-1);
      } else {
        // Default or initial load: assume new page effect
        setDirection(1);
      }
      prevIdRef.current = currentId;
    }
  }, [activeChatId, swipeStack]);

  const bind = useDrag(
    ({ movement: [mx, my], active, last, event }) => {
      // Gesten-Sicherheit: Check if the drag originated from a code block or table
      const target = event.target as HTMLElement;
      if (target && (target.closest("pre") || target.closest("table"))) {
        return; // Suppress swipe if it originates from a scrollable content area
      }

      // Ignore if vertical movement is too high (scrolling)
      if (Math.abs(my) > Math.abs(mx) * 2) return; // Prioritize horizontal drag

      const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
      const swipeThreshold = containerWidth * SWIPE_THRESHOLD_PERCENT;

      if (active) {
        x.set(mx); // 1:1 movement
      } else if (last) {
        // Gesture ended
        if (mx < -swipeThreshold && canSwipeLeft) {
          onSwipeLeft();
          // Animate out completely (Framer Motion's exit variant will handle this for the old page)
          // The new page will enter from the right
          x.set(-containerWidth); // Set it off-screen to trigger exit correctly
        } else if (mx > swipeThreshold && canSwipeRight) {
          onSwipeRight();
          // Animate out completely
          x.set(containerWidth); // Set it off-screen to trigger exit correctly
        } else {
          // Snap back if not past threshold
          x.set(0);
        }
      }
    },
    {
      filterTaps: true,
      rubberband: true,
      axis: "x", // Only allow horizontal drag
    },
  );

  const rotateY =
    (x.get() / (containerRef.current?.offsetWidth || window.innerWidth)) * ROTATION_FACTOR;
  const scale =
    1 -
    (Math.abs(x.get()) / (containerRef.current?.offsetWidth || window.innerWidth)) * SCALE_FACTOR;

  // Variants for Page Transitions, now reactive to drag
  const variants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? "100%" : "-100%",
      opacity: shouldReduceMotion ? 0 : 0.5,
      rotateY: shouldReduceMotion ? 0 : dir > 0 ? ROTATION_FACTOR : -ROTATION_FACTOR,
      scale: shouldReduceMotion ? 1 : 1 - SCALE_FACTOR,
      zIndex: 10,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      zIndex: 20,
      transition: {
        type: shouldReduceMotion ? "tween" : "spring",
        duration: shouldReduceMotion ? 0.3 : undefined,
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      },
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? "-100%" : "100%", // Exit fully off-screen
      opacity: shouldReduceMotion ? 0 : 0.5,
      scale: shouldReduceMotion ? 1 : 1 - SCALE_FACTOR,
      rotateY: shouldReduceMotion ? 0 : dir > 0 ? -ROTATION_FACTOR : ROTATION_FACTOR, // Rotate opposite
      zIndex: 0,
      transition: { duration: 0.25 },
    }),
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden perspective-1000 bg-bg-page"
    >
      {/* Desktop Navigation Arrows/Hotspots */}
      <div className="hidden md:block">
        {canSwipeLeft && (
          <motion.button
            onClick={onSwipeLeft}
            whileHover={{ scale: 1.1, x: 5 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-16 h-24 bg-gradient-to-r from-ink-primary/10 to-transparent flex items-center justify-start pl-2 rounded-r-md text-ink-primary opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            &lt;
          </motion.button>
        )}
        {canSwipeRight && (
          <motion.button
            onClick={onSwipeRight}
            whileHover={{ scale: 1.1, x: -5 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-16 h-24 bg-gradient-to-l from-ink-primary/10 to-transparent flex items-center justify-end pr-2 rounded-l-md text-ink-primary opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            &gt;
          </motion.button>
        )}
      </div>

      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div
          key={activeChatId ?? "draft"}
          {...bind()} // Apply drag bindings here
          style={{ x, rotateY, scale }} // Bind x, rotateY, scale directly to motion values
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 h-full w-full origin-center bg-bg-page shadow-2xl rounded-none sm:rounded-2xl overflow-hidden border border-border-ink/50 cursor-grab"
          whileTap={{ cursor: "grabbing" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Visual Stack Hints (Pages behind) - Dynamische Dicke */}
      {!shouldReduceMotion && swipeStack.length > 1 && (
        <>
          <motion.div
            initial={{
              x: direction > 0 ? "5%" : "-5%",
              rotateY: direction > 0 ? -2 : 2,
              opacity: 0,
            }}
            animate={{ x: 0, rotateY: 0, opacity: 0.6 }}
            exit={{ x: direction > 0 ? "-5%" : "5%", rotateY: direction > 0 ? 2 : -2, opacity: 0 }}
            transition={{ duration: 0.2, type: "tween" }}
            className="absolute inset-0 z-[-1] translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 bg-surface-2 rounded-none sm:rounded-2xl border border-black/5 opacity-60 pointer-events-none"
          />
          {swipeStack.length > 2 && (
            <motion.div
              initial={{
                x: direction > 0 ? "10%" : "-10%",
                rotateY: direction > 0 ? -4 : 4,
                opacity: 0,
              }}
              animate={{ x: 0, rotateY: 0, opacity: 0.3 }}
              exit={{
                x: direction > 0 ? "-10%" : "10%",
                rotateY: direction > 0 ? 4 : -4,
                opacity: 0,
              }}
              transition={{ duration: 0.2, type: "tween" }}
              className="absolute inset-0 z-[-2] translate-x-6 translate-y-6 sm:translate-x-8 sm:translate-y-8 bg-surface-1 rounded-none sm:rounded-2xl border border-black/5 opacity-30 pointer-events-none"
            />
          )}
        </>
      )}
    </div>
  );
}
