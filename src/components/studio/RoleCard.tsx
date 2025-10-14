import { Info } from "lucide-react";
import { type CSSProperties, forwardRef, useState } from "react";

import { cn } from "../../lib/utils";

export interface RoleTint {
  from: string;
  to: string;
}

export interface RoleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  badge?: string;
  tint?: RoleTint;
  isActive?: boolean;
  contrastOverlay?: boolean;
  showDescriptionOnToggle?: boolean;
  badgeStyle?: CSSProperties;
  badgeClassName?: string;
  disabled?: boolean;
  variant?: "tinted" | "surface" | "minimal";
}

/**
 * Glassmorphism role card used on the studio role screen.
 * Renders as an accessible button so it can be focused/tapped.
 */
export const RoleCard = forwardRef<HTMLDivElement, RoleCardProps>(
  (
    {
      title,
      description,
      badge,
      tint,
      isActive = false,
      contrastOverlay: _contrastOverlay = false,
      className,
      style,
      showDescriptionOnToggle = false,
      badgeStyle,
      badgeClassName,
      onClick,
      disabled,
      variant = "tinted",
      ...props
    },
    ref,
  ) => {
    const deriveAccent = (input?: string) => {
      if (!input) return "rgba(255, 255, 255, 0.45)";
      if (/,\s*0\./.test(input)) {
        return input.replace(/,\s*0\.\d+\)/, ", 0.65)");
      }
      return input;
    };

    const accentVariables:
      | (CSSProperties & {
          "--card-tint-from"?: string;
          "--card-tint-to"?: string;
          "--card-overlay-gradient"?: string;
          "--card-glow-shadow"?: string;
        })
      | undefined =
      tint && variant === "tinted"
        ? {
            "--card-tint-from": tint.from,
            "--card-tint-to": tint.to,
          }
        : undefined;

    const mergedStyle = accentVariables ? { ...style, ...accentVariables } : style;
    const accentColor = deriveAccent(tint?.from);
    const isMinimal = variant === "minimal";
    const [expanded, setExpanded] = useState(!showDescriptionOnToggle);

    const handleInfoToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setExpanded((prev) => !prev);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    return (
      <div
        ref={ref}
        aria-pressed={isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "relative flex min-h-[96px] flex-col rounded-2xl border text-left text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35",
          "p-4 sm:p-5",
          !disabled && "cursor-pointer",
          disabled && "cursor-not-allowed opacity-70",
          variant === "tinted" && "glass-card tinted border-transparent hover:-translate-y-[2px]",
          variant === "surface" &&
            "bg-white/8 hover:border-white/16 hover:bg-white/12 border-white/10 shadow-[0_18px_38px_-26px_rgba(6,12,24,0.55)]",
          variant === "minimal" &&
            "border-white/12 bg-white/6 hover:border-white/18 shadow-none hover:bg-white/10",
          isActive &&
            (variant === "minimal"
              ? "border-white/30 ring-1 ring-white/20"
              : "border-white/30 ring-2 ring-white/25"),
          className,
        )}
        role="button"
        tabIndex={0}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        style={mergedStyle}
        {...props}
      >
        <div className={cn("relative z-10 flex h-full flex-col", isMinimal && "gap-3")}>
          {isMinimal ? (
            <span
              aria-hidden="true"
              className="h-1 w-12 rounded-full"
              style={{ background: accentColor, opacity: 0.85 }}
            />
          ) : null}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3
                className={cn(
                  "text-base font-semibold tracking-tight text-white sm:text-lg",
                  isMinimal && "text-sm font-medium text-white/90 sm:text-base",
                )}
              >
                {title}
              </h3>
              {expanded ? (
                <p
                  className={cn(
                    "mt-2 line-clamp-3 text-sm leading-6 text-white/85 sm:text-base sm:leading-7",
                    isMinimal && "text-white/75",
                  )}
                >
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {badge ? (
                <span
                  className={cn(
                    "pointer-events-none rounded-full border px-2.5 py-1 text-[11px] leading-4 text-white/80 backdrop-blur-sm",
                    isMinimal && "border-white/18 text-white/70 backdrop-blur-none",
                    badgeClassName,
                  )}
                  style={badgeStyle}
                >
                  {badge}
                </span>
              ) : null}
              {showDescriptionOnToggle ? (
                <button
                  type="button"
                  onClick={handleInfoToggle}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                    isMinimal ? "hover:bg-white/12 bg-white/10" : "bg-white/12 hover:bg-white/16",
                  )}
                  aria-label={expanded ? "Beschreibung verbergen" : "Beschreibung anzeigen"}
                  aria-expanded={expanded}
                >
                  <Info className="h-4 w-4 text-white/80" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

RoleCard.displayName = "RoleCard";
