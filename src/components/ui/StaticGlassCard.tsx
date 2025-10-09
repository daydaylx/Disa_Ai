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
  "relative flex flex-col overflow-hidden rounded-2xl bg-white/4 supports-[backdrop-filter]:backdrop-blur-xl saturate-150 border border-white/15 ring-1 ring-white/8 text-left text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_15px_40px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.3)] before:pointer-events-none before:absolute before:inset-0 before:rounded-inherit before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.25),rgba(255,255,255,0.12)_35%,rgba(255,255,255,0.02)_70%)] transition-all duration-300";

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
      {/* Color gradient layer with radial highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-30"
        style={{
          background: `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%)`,
        }}
      />
      {contrastOverlay ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black/10"
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
