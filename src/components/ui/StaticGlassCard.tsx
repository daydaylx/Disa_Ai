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
    ? { background: `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%)`, opacity: 0.5 } // Opazität leicht reduziert
    : {};

  return (
    <div
      className={cn(
        "card-glass", // HIER die neue, zentrale Klasse verwenden
        className,
      )}
      {...props}
    >
      {/* Tint gradient layer - bleibt wie es ist */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={tintStyle} />

      {/* Sheen/Reflection wird jetzt von .card-glass::before gehandhabt, kann entfernt werden */}

      {/* Content container */}
      <div className={cn("relative z-10", paddingClasses[padding])}>{children}</div>
    </div>
  );
}
