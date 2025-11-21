import React from "react";

import { cn } from "@/lib/utils";

interface MaterialPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * MaterialPanel
 * Neumorphism/Soft-Depth Panel Component
 * - NO backdrop-blur, NO borders
 * - Raised shadow for depth
 */
export const MaterialPanel = React.forwardRef<HTMLDivElement, MaterialPanelProps>(
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

MaterialPanel.displayName = "MaterialPanel";
