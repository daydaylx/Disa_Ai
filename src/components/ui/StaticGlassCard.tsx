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
    ? {
        background: `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%)`,
        opacity: 0.4,
      }
    : {};

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "border-white/8 border",
        "backdrop-blur-xl backdrop-filter",
        "bg-black/5", // A fallback background if no tint is provided
        className,
      )}
      {...props}
    >
      {/* Tint gradient layer */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={tintStyle} />

      {/* Sheen/Reflection overlay for a more realistic glass feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        }}
      />

      {/* Content container */}
      <div className={cn("relative z-10", paddingClasses[padding])}>{children}</div>
    </div>
  );
}
