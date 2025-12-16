import React from "react";

import { cn } from "@/lib/utils";

export interface NotchFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  size?: "sm" | "md";
  corner?: "top-right" | "top-left";
  variant?: "glass" | "solid";
  borderless?: boolean;
}

/**
 * NotchFrame
 * A container with a "notched" corner effect.
 *
 * Uses clip-path for performance and visual consistency on glass backgrounds.
 */
export function NotchFrame({
  children,
  className,
  active = false,
  size = "sm",
  corner = "top-right",
  variant = "glass",
  borderless = false,
  ...props
}: NotchFrameProps) {
  // Map size to pixel values matching CSS variables
  const notchPx = size === "sm" ? 10 : 14;

  // Clip Path Generation
  // We construct a polygon that cuts the corner.
  // Standard rounded-2xl is approx 16px.
  // We want a straight cut at the corner.
  // "top-right":
  // Start top-left (radius), line to top-right (minus notch), line to right-top (plus notch), line to bottom-right...

  // Note: CSS clip-path with rounded corners and a straight diagonal cut is complex.
  // Simpler approach for "NotchFrame":
  // Just use a polygon for the cut. Rounded corners elsewhere are hard with pure polygon(),
  // but we can use `mask-image` or accept that the notched corner is sharp and others are rounded via border-radius.
  // However, `clip-path` cuts off `border-radius`.
  //
  // Strategy:
  // Use `clip-path` for the shape.
  // Use a pseudo-element for the border (if needed) with the same clip-path.

  // Actually, for "Glass" with a Notch, the best way to get *rounded* corners on 3 corners and a *sharp* cut on 1
  // is using `clip-path: polygon(...)` but then you lose the rounded corners unless you use a very complex polygon.
  //
  // ALTERNATIVE (Variant A - Pseudo Overlay) for Solid/Dark backgrounds:
  // Works great.
  //
  // HYBRID FOR GLASS:
  // If we want the "notch" to be transparent (a hole), we MUST use mask or clip-path.
  // If we accept the notch is "filled" with a panel color, we can use Variant A.
  // The Prompt says: "Pseudo-Element Notch (kein echtes Loch) ... eine kleine 'Notch-Fläche' die den Border an der Ecke unterbricht".
  // This confirms: The Notch is NOT a hole in the app background, but a visual detail on the container.
  // So "Variant A" is correct. We place a small element on the corner to hide the original border and draw the diagonal.

  return (
    <div
      className={cn(
        "relative transition-all duration-300 group",
        // Base rounded shape
        "rounded-2xl",
        // Border handling: The container has the main border.
        // We will hide the corner of the border using the notch element.
        !borderless && "border border-white/10",
        // Background
        variant === "glass" && "bg-surface-glass backdrop-blur-xl",
        variant === "solid" && "bg-surface-1",
        // Active states
        active && "border-white/20 shadow-glow-sm",
        className,
      )}
      {...props}
    >
      {/* Notch Overlay */}
      <div
        className={cn(
          "absolute pointer-events-none z-10",
          corner === "top-right" ? "-top-[1px] -right-[1px]" : "-top-[1px] -left-[1px]",
          "flex items-start justify-end",
        )}
        style={{
          width: `${notchPx + 8}px`, // Slight overshoot to cover curve
          height: `${notchPx + 8}px`,
        }}
      >
        {/*
          The Notch Shape.
          It needs to cover the existing rounded corner border.
          It needs to draw the diagonal line.
        */}
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${notchPx + 8} ${notchPx + 8}`}
          className="fill-bg-app" // Use app background color to "mask" the corner? No, that's opaque.
          // Problem: If the card is glass, an opaque mask looks bad.
          // But "Variant A" implies an illusion.
          // If we can't do opaque mask, we have to live with the corner being visible OR use clip-path.
          // Let's try to match the "Surface" color if possible.
          // If variant is glass, we can't easily mask without clip-path.
        >
          {/*
            Actually, let's implement the 'Visual Notch' as a decorative element ON TOP of the rounded corner,
            rather than trying to cut it.
            A 'Tech' overlay that looks like a bracket or corner piece.
            If the user insists on the 'Cut', clip-path is the only way for Glass.
            Let's use a simple CSS class approach that creates the 'Notch' via a pseudo element
            that is styled to look like a 'cap' on the corner.
          */}
        </svg>

        {/* CSS-only implementation of the "Patch" */}
        {/*
           We place a div that is the "Notch Cutout".
           Background: Same as parent (to blend in) or App background (to cut out).
           Since it's glass, we probably just want a high-tech border accent.
           Let's follow the "Edge Highlight" instruction.
        */}
      </div>

      {/* Real Implementation using Clip Path for the 'Cut' effect if desired,
          but user said 'Variant A (Pseudo-Element)' is recommended.
          Let's implement Variant A:
          1. Container has border-radius.
          2. ::before is a triangle in the corner with the background color of the PAGE (bg-app).
             This 'hides' the corner of the card, creating a visual hole.
      */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute w-[20px] h-[20px] z-10",
          corner === "top-right" ? "-top-[1px] -right-[1px]" : "-top-[1px] -left-[1px]",
          // The magic: Linear gradient to create the triangle "cut"
          // We paint the corner with the APP BACKGROUND COLOR to simulate a cut.
          // This assumes the card is on the main background.
          // Gradient from top-right (opaque) to center (transparent)
        )}
        style={{
           // Linear gradient that is solid 'bg-app' in the top right corner, transparent elsewhere.
           // Angle depends on corner.
           background: corner === 'top-right'
             ? `linear-gradient(225deg, var(--bg-app) ${notchPx - 2}px, transparent ${notchPx - 1}px)`
             : `linear-gradient(135deg, var(--bg-app) ${notchPx - 2}px, transparent ${notchPx - 1}px)`
        }}
      >
        {/* Border Reconstruction line for the diagonal */}
        <div
          className={cn(
            "absolute w-[150%] h-[1px]",
            active ? "bg-white/40 shadow-[0_0_4px_rgba(255,255,255,0.5)]" : "bg-white/10",
            "transition-colors duration-300"
          )}
          style={{
             top: 0,
             right: 0,
             transformOrigin: corner === 'top-right' ? 'top right' : 'top left',
             transform: corner === 'top-right'
               ? `rotate(-45deg) translateY(${notchPx - 1}px)`
               : `rotate(45deg) translateY(${notchPx - 1}px)`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-0 h-full">
        {children}
      </div>
    </div>
  );
}
