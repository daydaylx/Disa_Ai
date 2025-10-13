import { type CSSProperties, forwardRef } from "react";

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
      style,
      ...props
    },
    ref,
  ) => {
    const accentVariables:
      | (CSSProperties & {
          "--card-tint-from"?: string;
          "--card-tint-to"?: string;
        })
      | undefined = tint
      ? {
          "--card-tint-from": tint.from,
          "--card-tint-to": tint.to,
        }
      : undefined;

    const mergedStyle = accentVariables ? { ...style, ...accentVariables } : style;

    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "glass-card tinted flex min-h-[152px] flex-col p-5 text-left text-white transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.995]",
          isActive && "border-white/30 ring-2 ring-white/25",
          className,
        )}
        style={mergedStyle}
        {...props}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-white/85">{description}</p>
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
