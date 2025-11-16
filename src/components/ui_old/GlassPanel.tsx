import { forwardRef } from "react";

import { cn } from "../../lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

/**
 * GlassPanel kapselt die wiederkehrende Soft-Depth-Fläche mit Blur, Border und Schatten.
 * Verwendet Design-Tokens für Konsistenz.
 */
export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  { className, padded = true, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--glass-border-soft)] bg-surface-panel/95 text-text-primary shadow-[var(--shadow-lg)] backdrop-blur-[var(--glass-backdrop-blur-md)]",
        padded && "p-[var(--space-padding-sm)] sm:p-[var(--space-padding-md)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
