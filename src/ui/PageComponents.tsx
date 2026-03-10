import * as React from "react";

import { cn } from "@/lib/utils";

import { Badge } from "./Badge";
import { Card } from "./Card";

type HeroTitleTag = "h1" | "h2" | "p";

interface PageHeroProps {
  title: string;
  titleAs?: HeroTitleTag;
  eyebrow?: string;
  description?: string;
  countLabel?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  meta?: React.ReactNode;
  gradientStyle?: string;
  className?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

export function PageHero({
  title,
  titleAs = "h1",
  eyebrow,
  description,
  countLabel,
  icon,
  action,
  secondaryAction,
  meta,
  gradientStyle,
  className,
  contentClassName,
  children,
}: PageHeroProps) {
  const TitleTag = titleAs;

  return (
    <div className={cn("relative flex-none px-4 pt-3", className)}>
      <Card
        variant="hero"
        padding="none"
        className="relative overflow-hidden rounded-[24px] border-white/[0.10] bg-surface-1/82 shadow-[0_14px_40px_-30px_rgba(0,0,0,0.7)] ring-1 ring-inset ring-white/[0.04] sm:rounded-[28px] sm:border-white/[0.12] sm:bg-surface-1/75 sm:shadow-[0_18px_60px_-40px_rgba(0,0,0,0.75)] sm:backdrop-blur-xl"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-24 right-[-6rem] hidden h-52 w-52 rounded-full bg-white/10 blur-3xl sm:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[-6rem] left-[-4rem] hidden h-44 w-44 rounded-full bg-white/[0.05] blur-3xl sm:block"
          aria-hidden
        />
        {gradientStyle ? (
          <div
            className="pointer-events-none absolute inset-0 opacity-55 transition-all duration-500 sm:opacity-70"
            style={{ background: gradientStyle }}
            aria-hidden
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_24%,rgba(0,0,0,0.14)_100%)]" />

        <div
          className={cn(
            "relative space-y-3 px-4 py-4 sm:space-y-4 sm:px-5 sm:py-5",
            contentClassName,
          )}
        >
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {eyebrow ? (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-tertiary">
                    {eyebrow}
                  </span>
                ) : null}
                {countLabel ? (
                  <Badge
                    size="sm"
                    className="rounded-full border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] text-ink-secondary"
                  >
                    {countLabel}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-3 flex items-start gap-3">
                {icon ? (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-ink-primary shadow-inner sm:h-12 sm:w-12">
                    {icon}
                  </div>
                ) : null}

                <div className="min-w-0 space-y-2">
                  <TitleTag className="text-balance text-xl font-semibold tracking-tight text-ink-primary sm:text-2xl">
                    {title}
                  </TitleTag>
                  {description ? (
                    <p className="max-w-2xl text-sm leading-relaxed text-ink-secondary sm:text-[15px]">
                      {description}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {(secondaryAction || action) && (
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:pt-1">
                {secondaryAction}
                {action}
              </div>
            )}
          </div>

          {meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}

          {children ? (
            <div className="border-t border-white/[0.08] pt-3 sm:pt-4">
              <div className="rounded-[20px] border border-white/[0.05] bg-black/[0.10] p-3 shadow-inner sm:rounded-[22px] sm:bg-black/[0.16]">
                {children}
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

interface PageHeroStatProps {
  label: string;
  value: string;
  helper?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function PageHeroStat({ label, value, helper, icon, className }: PageHeroStatProps) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.05] px-3 py-3 shadow-inner sm:bg-white/[0.04] sm:backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {icon ? <div className="text-ink-tertiary">{icon}</div> : null}
        <p className="truncate text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          {label}
        </p>
      </div>
      <p className="mt-2 text-sm font-semibold text-ink-primary">{value}</p>
      {helper ? <p className="mt-1 text-xs leading-relaxed text-ink-tertiary">{helper}</p> : null}
    </div>
  );
}

interface CatalogHeaderProps {
  /** sr-only H1 text — matches the mobile sticky header title for semantics */
  title: string;
  /** Summary line shown in the gradient card, e.g. "42 Modelle · 3 Favoriten" */
  countLabel: string;
  /** Optional gradient CSS string — use getCategoryStyle(x).roleGradient */
  gradientStyle?: string;
  /** Optional right-side action slot — typically a refresh/reset Button */
  action?: React.ReactNode;
  /** Optional second row — used for filter chip scrollers (Roles page) */
  filterRow?: React.ReactNode;
  description?: string;
  eyebrow?: string;
  icon?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  meta?: React.ReactNode;
  highlights?: React.ReactNode;
  className?: string;
}

/**
 * CatalogHeader - Unified header card for catalog pages (/models, /roles, /themen).
 *
 * Provides:
 * - A screen-reader-only <h1> so each catalog page has exactly one H1
 *   (AppShell suppresses its own H1 when contentScrollMode="content")
 * - A gradient-tinted info card consistent across all three catalog pages
 * - Optional filterRow slot for horizontal chip scrollers (Roles page)
 */
export function CatalogHeader({
  title,
  countLabel,
  gradientStyle,
  action,
  filterRow,
  description,
  eyebrow,
  icon,
  secondaryAction,
  meta,
  highlights,
  className,
}: CatalogHeaderProps) {
  return (
    <PageHero
      title={title}
      titleAs="h1"
      eyebrow={eyebrow}
      description={description}
      countLabel={countLabel}
      icon={icon}
      action={action}
      secondaryAction={secondaryAction}
      meta={meta}
      gradientStyle={gradientStyle}
      className={className}
    >
      {highlights || filterRow ? (
        <div className="space-y-4">
          {highlights ? <div>{highlights}</div> : null}
          {filterRow ? <div>{filterRow}</div> : null}
        </div>
      ) : null}
    </PageHero>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader - Consistent page header for all screens
 */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-lg font-semibold text-ink-primary tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-ink-secondary leading-relaxed mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState - Consistent empty state for lists
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-surface-card/70 px-4 py-16 text-center shadow-surface-subtle backdrop-blur-md",
        "flex flex-col items-center justify-center",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        aria-hidden
      />
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.06] text-ink-tertiary shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium text-ink-primary">{title}</h3>
      {description && <p className="text-sm text-ink-tertiary mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface InfoBannerProps {
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

/**
 * InfoBanner - For status messages, privacy notices, etc.
 */
export function InfoBanner({
  icon,
  title,
  children,
  variant = "default",
  className,
}: InfoBannerProps) {
  const variantStyles = {
    default: "bg-surface-2 border-white/5 text-ink-secondary",
    success: "bg-status-success/10 border-status-success/20 text-status-success",
    warning: "bg-status-warning/10 border-status-warning/20 text-status-warning",
    error: "bg-status-error/10 border-status-error/20 text-status-error",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 backdrop-blur-sm",
        variantStyles[variant],
        className,
      )}
    >
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-medium mb-0.5">{title}</p>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
