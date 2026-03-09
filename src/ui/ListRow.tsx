import * as React from "react";

import { cn } from "@/lib/utils";

interface ListRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  topRight?: React.ReactNode;
  accentClassName?: string;
  surfaceVariant?: "default" | "catalogGlass";
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
  surfaceVariant = "default",
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
        "relative overflow-hidden rounded-2xl border border-white/[0.10] px-4 py-4 shadow-surface-subtle transition-all duration-200",
        surfaceVariant === "catalogGlass"
          ? "bg-surface-card/60 ring-1 ring-inset ring-white/[0.03] backdrop-blur-sm"
          : "bg-surface-card",
        onPress &&
          "hover:border-white/[0.14] hover:bg-surface-2/65 active:scale-[0.98] active:translate-y-px",
        active &&
          (surfaceVariant === "catalogGlass"
            ? "border-white/[0.14] bg-surface-2/60 backdrop-blur-md ring-1"
            : "border-white/[0.14] bg-surface-2/70 ring-1"),
        className,
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden
      />

      {accentClassName ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-[3px] rounded-l-2xl",
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
          {subtitle ? <p className="mt-1 truncate text-xs text-ink-tertiary">{subtitle}</p> : null}
        </div>

        {trailing ? (
          <div className="pointer-events-auto relative z-sticky-content">{trailing}</div>
        ) : null}
      </div>

      {children ? (
        <div className="relative z-content mt-3 border-t border-white/[0.06] pt-3">{children}</div>
      ) : null}
    </div>
  );
}
