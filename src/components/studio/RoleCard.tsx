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
  tint: RoleTint;
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
      tint,
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
          "glass-strong before:rounded-inherit relative flex min-h-[152px] flex-col overflow-hidden rounded-2xl p-5 text-left text-zinc-200 transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22),rgba(255,255,255,0.08)_35%,rgba(255,255,255,0)_70%)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_14px_40px_rgba(0,0,0,0.55)] hover:ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.995]",
          isActive && "border-white/30 ring-2 ring-white/25",
          className,
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-50"
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
              <span className="pointer-events-none shrink-0 rounded-full border border-white/[0.14] bg-white/[0.06] px-2.5 py-1 text-[11px] leading-4 text-white/85 backdrop-blur-sm">
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
