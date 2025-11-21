import React from "react";

import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * MaterialPanel (formerly GlassPanel)
 * Neumorphism/Soft-Depth Panel Component
 * - NO backdrop-blur, NO borders
 * - Raised shadow for depth
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-surface-2 rounded-md p-4 shadow-raise", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

GlassPanel.displayName = "GlassPanel";
