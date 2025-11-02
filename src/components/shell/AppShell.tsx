import React from "react";
import { twMerge } from "tailwind-merge";

import { SkipLink } from "../accessibility/SkipLink";

type AppShellProps = {
  children: React.ReactNode;
  className?: string;
  /** Enable dramatic neomorphic canvas effect */
  dramatic?: boolean;
  /** Add ambient lighting effects */
  ambient?: "subtle" | "medium" | "strong";
};

export function AppShell({
  children,
  className,
  dramatic = true,
  ambient = "medium",
}: AppShellProps) {
  const shellClasses = twMerge(
    // Base Layout
    "flex flex-col overflow-hidden",
    "safe-y safe-x",

    // Dramatic Neomorphic Canvas
    dramatic && [
      // Deep Canvas Background
      "bg-[var(--surface-neumorphic-base)]",

      // Ambient Lighting Gradient
      "bg-gradient-to-br from-[var(--surface-neumorphic-base)] via-[var(--surface-neumorphic-raised)] to-[var(--surface-neumorphic-base)]",

      // Subtle Texture Overlay
      "before:absolute before:inset-0 before:opacity-5",
      "before:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]",
      "before:pointer-events-none",

      // Enhanced Safe Areas for Mobile
      "relative isolate",
    ],

    // Ambient Lighting Effects
    ambient === "subtle" && "shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)]",
    ambient === "medium" && [
      "shadow-[inset_0_2px_6px_rgba(255,255,255,0.15)]",
      "before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1)_0%,transparent_70%)]",
    ],
    ambient === "strong" && [
      "shadow-[inset_0_4px_12px_rgba(255,255,255,0.2)]",
      "before:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]",
    ],

    // Dark Mode Optimization
    "dark:bg-[var(--surface-neumorphic-base)]",
    "dark:before:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)]",

    className,
  );

  return (
    <div
      className={shellClasses}
      style={{
        minHeight: "var(--vh, 100dvh)",
        // Enhanced CSS custom properties for dynamic lighting
        "--app-ambient-opacity":
          ambient === "subtle" ? "0.1" : ambient === "medium" ? "0.15" : "0.2",
      }}
    >
      <SkipLink />

      {/* Ambient Light Sources (Dramatic Mode) */}
      {dramatic && (
        <>
          {/* Top Light Source */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 opacity-10 pointer-events-none z-0"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Side Light Accents */}
          <div
            className="absolute top-1/4 -left-24 w-48 h-48 opacity-5 pointer-events-none z-0"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute bottom-1/4 -right-24 w-48 h-48 opacity-5 pointer-events-none z-0"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </>
      )}

      {/* Content Container with Enhanced Z-Index */}
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </div>
  );
}
