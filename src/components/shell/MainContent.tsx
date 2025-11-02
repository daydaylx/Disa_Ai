import React from "react";
import { twMerge } from "tailwind-merge";

type MainContentProps = {
  children: React.ReactNode;
  className?: string;
  /** Create inset container effect */
  inset?: boolean;
  /** Add content well wrapper */
  well?: boolean;
  /** Scroll behavior variant */
  scroll?: "normal" | "smooth" | "hidden";
};

export function MainContent({
  children,
  className,
  inset = true,
  well = false,
  scroll = "smooth",
}: MainContentProps) {
  const mainContentClasses = twMerge(
    // Base Layout
    "flex-1 relative",

    // Scroll Behavior
    scroll === "normal" && "overflow-y-auto",
    scroll === "smooth" && "overflow-y-auto scroll-smooth",
    scroll === "hidden" && "overflow-hidden",

    // Dramatic Inset Container Effect
    inset && [
      // Deep Inset Background
      "bg-[var(--surface-neumorphic-base)]",

      // Internal Shadows for Depth
      "shadow-[inset_0_4px_12px_rgba(9,12,20,0.15),inset_0_-2px_6px_rgba(255,255,255,0.05)]",

      // Subtle Inner Border
      "border-[var(--border-neumorphic-dark)]",
    ],

    // Enhanced Scrollbar Styling
    scroll !== "hidden" && [
      "scrollbar-thin",
      "scrollbar-track-[var(--surface-neumorphic-base)]",
      "scrollbar-thumb-[var(--surface-neumorphic-raised)]",
      "scrollbar-thumb-rounded-full",
      "hover:scrollbar-thumb-[var(--surface-neumorphic-floating)]",
    ],

    // Responsive Padding
    "p-4 sm:p-6 lg:p-8",

    // Dark Mode Optimization
    "dark:bg-[var(--surface-neumorphic-base)]",
    "dark:shadow-[inset_0_4px_12px_rgba(0,0,0,0.2),inset_0_-2px_6px_rgba(255,255,255,0.03)]",

    className,
  );

  const wellClasses = twMerge(
    // Content Well Container
    "relative max-w-7xl mx-auto",

    // Floating Content Effect
    well && [
      "bg-[var(--surface-neumorphic-floating)]",
      "shadow-[var(--shadow-neumorphic-lg)]",
      "rounded-[var(--radius-2xl)]",
      "border-[var(--border-neumorphic-light)]",
      "p-6 sm:p-8 lg:p-10",
      "my-4 sm:my-6 lg:my-8",

      // Gradient Overlay for Enhanced Depth
      "before:absolute before:inset-0 before:rounded-[var(--radius-2xl)]",
      "before:bg-gradient-to-br before:from-white/10 before:to-transparent",
      "before:pointer-events-none",
    ],
  );

  return (
    <main id="main" className={mainContentClasses}>
      {/* Inner Lighting Effect */}
      {inset && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 opacity-5 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
            filter: "blur(20px)",
          }}
        />
      )}

      {/* Content Container */}
      <div className={well ? wellClasses : "relative max-w-7xl mx-auto"}>
        {/* Content Well Inner Light */}
        {well && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-16 opacity-10 pointer-events-none z-0"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)",
              filter: "blur(15px)",
            }}
          />
        )}

        {/* Main Content */}
        <div className={well ? "relative z-10" : ""}>{children}</div>
      </div>
    </main>
  );
}
