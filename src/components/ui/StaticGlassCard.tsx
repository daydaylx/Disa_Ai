import type { ReactNode } from "react";

import type { GlassTint } from "../../lib/theme/glass";
import { cn } from "../../lib/utils";

interface StaticGlassCardProps {
  tint: GlassTint;
  contrastOverlay?: boolean;
  className?: string;
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
}

const baseClass =
  "card-glass relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] text-left text-white shadow-[0_8px_28px_-8px_rgba(0,0,0,0.55),_inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-md transition-colors duration-200";

const paddingMap: Record<Required<StaticGlassCardProps>["padding"], string> = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function StaticGlassCard({
  tint,
  contrastOverlay = false,
  className,
  children,
  padding = "md",
}: StaticGlassCardProps) {
  return (
    <div className={cn(baseClass, paddingMap[padding], className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-80"
        style={{
          background: `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%)`,
        }}
      />
      {contrastOverlay ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black/20"
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
