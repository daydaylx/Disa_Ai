import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

type GlassBackdropVariant = "tile" | "panel" | "bar" | "compact";

const variantMap: Record<
  GlassBackdropVariant,
  {
    beam?: string;
    top?: string;
    bottom?: string;
  }
> = {
  tile: {
    beam: "-left-1/4 top-2 h-[150%] w-[55%] md:w-[45%]",
    top: "inset-x-5 top-1 h-px",
    bottom: "inset-x-6 bottom-0 h-16 rounded-b-[inherit]",
  },
  panel: {
    beam: "-left-1/3 top-4 h-[160%] w-[48%] md:w-[40%]",
    top: "inset-x-6 top-2 h-px",
    bottom: "inset-x-8 bottom-0 h-20 rounded-b-[inherit]",
  },
  bar: {
    beam: "-left-14 top-0 h-[160%] w-36",
    top: "inset-x-4 top-1 h-0.5",
    bottom: "inset-x-4 bottom-0 h-10 rounded-b-[inherit]",
  },
  compact: {
    beam: "-left-1/3 top-1 h-[150%] w-[45%]",
    top: "inset-x-3 top-1 h-0.5",
    bottom: "inset-x-4 bottom-0 h-12 rounded-b-[inherit]",
  },
};

interface GlassBackdropProps {
  variant?: GlassBackdropVariant;
  className?: string;
  glowClassName?: string;
  gradientClassName?: string;
  children?: ReactNode;
}

export function GlassBackdrop({
  variant = "panel",
  className,
  glowClassName,
  gradientClassName,
  children,
}: GlassBackdropProps) {
  const config = variantMap[variant];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {gradientClassName && <div className={cn("absolute inset-0", gradientClassName)} />}
      {config.beam && (
        <div
          className={cn(
            "via-white/8 absolute bg-gradient-to-br from-white/20 to-transparent opacity-55 blur-2xl",
            config.beam,
          )}
        />
      )}
      {config.top && (
        <div
          className={cn(
            "absolute bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-70",
            config.top,
          )}
        />
      )}
      {config.bottom && (
        <div
          className={cn(
            "from-white/16 via-white/6 absolute bg-gradient-to-t to-transparent opacity-75",
            config.bottom,
          )}
        />
      )}
      {glowClassName && <div className={cn("absolute inset-0", glowClassName)} />}
      {children}
    </div>
  );
}
