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
  const isCatalogGlass = surfaceVariant === "catalogGlass";

  return (
    <div
      className={cn(
        "group relative overflow-hidden border px-4 py-4 transition-all duration-200",
        isCatalogGlass
          ? "rounded-[24px] border-white/[0.10] bg-surface-1/82 shadow-[0_14px_36px_-28px_rgba(0,0,0,0.72)] ring-1 ring-inset ring-white/[0.04] sm:rounded-[26px] sm:border-white/[0.12] sm:bg-surface-1/70 sm:shadow-[0_18px_50px_-38px_rgba(0,0,0,0.78)] sm:backdrop-blur-xl"
          : "rounded-2xl border-white/[0.10] bg-surface-card shadow-surface-subtle",
        onPress &&
          (isCatalogGlass
            ? "hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-surface-2/78 hover:shadow-[0_18px_44px_-34px_rgba(0,0,0,0.76)] sm:hover:border-white/[0.18] sm:hover:bg-surface-2/72 sm:hover:shadow-[0_24px_60px_-40px_rgba(0,0,0,0.84)] active:translate-y-px"
            : "hover:border-white/[0.14] hover:bg-surface-2/65 active:scale-[0.98] active:translate-y-px"),
        active &&
          (isCatalogGlass
            ? "border-white/[0.16] bg-surface-2/80 shadow-[0_18px_44px_-34px_rgba(0,0,0,0.8)] ring-1 ring-inset ring-white/[0.06] sm:border-white/[0.18] sm:bg-surface-2/76 sm:shadow-[0_24px_60px_-40px_rgba(0,0,0,0.86)]"
            : "border-white/[0.14] bg-surface-2/70 ring-1"),
        className,
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden
      />
      {isCatalogGlass ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_26%,rgba(0,0,0,0.14)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-8 top-0 hidden h-24 w-24 rounded-full bg-white/[0.05] blur-3xl sm:block"
            aria-hidden
          />
        </>
      ) : null}

      {accentClassName ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-[3px] rounded-l-[26px]",
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
        <div className="pointer-events-auto absolute right-4 top-4 z-sticky-content">
          {topRight}
        </div>
      ) : null}

      <div className={cn("relative z-content flex items-center gap-4", topRight && "pr-[5.75rem]")}>
        {leading ? <div className="shrink-0">{leading}</div> : null}

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate font-semibold text-ink-primary",
              isCatalogGlass ? "text-[15px] tracking-tight" : "text-sm",
            )}
          >
            {title}
          </p>
          {subtitle ? (
            <p
              className={cn(
                "mt-1 truncate",
                isCatalogGlass
                  ? "text-[11px] font-medium text-ink-muted"
                  : "text-xs text-ink-tertiary",
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {trailing ? (
          <div className="pointer-events-auto relative z-sticky-content">{trailing}</div>
        ) : null}
      </div>

      {children ? (
        isCatalogGlass ? (
          <div className="relative z-content mt-4">
            <div className="rounded-[18px] border border-white/[0.06] bg-black/[0.10] p-3 shadow-inner sm:rounded-[20px] sm:bg-black/[0.16]">
              {children}
            </div>
          </div>
        ) : (
          <div className="relative z-content mt-3 border-t border-white/[0.06] pt-3">
            {children}
          </div>
        )
      ) : null}
    </div>
  );
}
