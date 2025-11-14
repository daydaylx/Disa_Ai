import { forwardRef } from "react";

import { cn } from "../../lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

/**
 * GlassPanel kapselt die wiederkehrende Soft-Depth-Fläche mit Blur, Border und Schatten.
 * Damit müssen komplexe Utility-Strings nicht ständig wiederholt werden und die UI wirkt konsistent.
 */
export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  { className, padded = true, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[1.5rem] border border-[var(--glass-border-soft)] bg-surface-panel/95 text-text-primary shadow-[0_35px_65px_rgba(0,0,0,0.55)] backdrop-blur-2xl",
        padded && "px-4 py-3 sm:px-5 sm:py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
