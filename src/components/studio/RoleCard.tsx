import { forwardRef } from "react";

import { cn } from "../../lib/utils";

export interface RoleTint {
  from: string;
  to: string;
}

export interface RoleCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  description: string;
  badge?: string;
  tint?: RoleTint;
  isActive?: boolean;
  contrastOverlay?: boolean;
}

/**
 * Glassmorphism role card used on the studio role screen.
 * Renders as an accessible button so it can be focused/tapped.
 */
export const RoleCard = forwardRef<HTMLButtonElement, RoleCardProps>(
  (
    {
      title,
      description,
      badge,
      tint = { from: "hsla(220, 26%, 28%, 0.9)", to: "hsla(220, 30%, 20%, 0.78)" },
      isActive = false,
      contrastOverlay: _contrastOverlay = false,
      className,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "glass-card-secondary glass-hover-glow-primary relative flex min-h-[152px] flex-col overflow-hidden rounded-2xl p-5 text-left text-zinc-200 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 active:scale-[0.995]",
          isActive && "border-cyan-400/30 ring-2 ring-cyan-400/25",
          className,
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-25"
          style={{
            background: `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%)`,
          }}
        />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-white/70">{description}</p>
            </div>
            {badge ? (
              <span className="glass-card-tertiary pointer-events-none shrink-0 px-2.5 py-1 text-[11px] leading-4 text-white/85">
                {badge}
              </span>
            ) : null}
          </div>
        </div>
      </button>
    );
  },
);

RoleCard.displayName = "RoleCard";
