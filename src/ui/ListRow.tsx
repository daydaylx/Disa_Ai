import * as React from "react";

import { cn } from "@/lib/utils";

interface ListRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  topRight?: React.ReactNode;
  accentClassName?: string;
  active?: boolean;
  onPress?: () => void;
  pressLabel?: string;
  pressed?: boolean;
}

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  topRight,
  accentClassName,
  active = false,
  onPress,
  pressLabel,
  pressed,
  className,
  children,
  ...props
}: ListRowProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-card px-4 py-4 transition-all duration-200",
        onPress && "hover:border-white/[0.14] hover:bg-surface-2/65",
        active && "border-white/[0.14] bg-surface-2/70 ring-1",
        className,
      )}
      {...props}
    >
      {accentClassName ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-1 rounded-l-2xl",
            accentClassName,
          )}
          aria-hidden
        />
      ) : null}

      {onPress ? (
        <div
          className="absolute inset-0 z-sticky-header cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={pressLabel}
          aria-pressed={pressed}
          onClick={onPress}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onPress();
            }
          }}
        />
      ) : null}

      {topRight ? (
        <div className="pointer-events-auto absolute right-3 top-3 z-sticky-content">
          {topRight}
        </div>
      ) : null}

      <div className={cn("relative flex items-center gap-4", topRight && "pr-[5.5rem]")}>
        {leading ? <div className="shrink-0">{leading}</div> : null}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-primary">{title}</p>
          {subtitle ? <p className="mt-1 truncate text-xs text-ink-secondary">{subtitle}</p> : null}
        </div>

        {trailing ? (
          <div className="pointer-events-auto relative z-sticky-content">{trailing}</div>
        ) : null}
      </div>

      {children ? <div className="relative z-content mt-3">{children}</div> : null}
    </div>
  );
}
