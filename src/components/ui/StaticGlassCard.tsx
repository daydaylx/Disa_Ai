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
  ...props
}: StaticGlassCardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const tintStyle = tint
    ? { background: `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%)` }
    : {};

  return (
    <div
      className={cn(
        "glass-card", // Neue, zentrale Klasse
        className,
      )}
      {...props}
    >
      {/* Tint gradient layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={tintStyle}
      />

      {/* Content container */}
      <div className={cn("relative z-10", paddingClasses[padding])}>{children}</div>
    </div>
  );
}
