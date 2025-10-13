import type { CSSProperties } from "react";

import type { GlassTint } from "@/lib/theme/glass";
import { cn } from "@/lib/utils";

interface StaticGlassCardProps extends React.ComponentPropsWithoutRef<"div"> {
  padding?: "sm" | "md" | "lg";
  tint?: GlassTint;
}

export function StaticGlassCard({
  padding = "md",
  className,
  children,
  tint,
  style,
  ...props
}: StaticGlassCardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const accentVariables: CSSProperties | undefined = tint
    ? {
        "--card-tint-from": tint.from,
        "--card-tint-to": tint.to,
      }
    : undefined;

  const mergedStyle = accentVariables ? { ...style, ...accentVariables } : style;

  return (
    <div
      className={cn(
        "glass-card", // Neue, zentrale Klasse
        tint && "tinted",
        className,
      )}
      style={mergedStyle}
      {...props}
    >
      {/* Content container */}
      <div className={cn("relative z-10", paddingClasses[padding])}>{children}</div>
    </div>
  );
}
