import { type LinkProps } from "react-router-dom";
import { NavLink } from "react-router-dom";

import { ChevronRight } from "../../lib/icons";
import { cn } from "../../lib/utils";

interface SettingsLinkProps extends LinkProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  statusLabel?: string;
  statusVariant?: "success" | "warning" | "muted" | "info" | "error";
  meta?: string;
}

const statusClasses: Record<NonNullable<SettingsLinkProps["statusVariant"]>, string> = {
  success: "bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)]",
  warning: "bg-[color-mix(in_srgb,var(--warning)_20%,transparent)] text-[var(--warning)]",
  muted: "bg-surface-inline text-text-secondary",
  info: "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]",
  error: "bg-[color-mix(in_srgb,var(--danger)_15%,transparent)] text-[var(--danger)]",
};

export function SettingsLink({
  icon,
  title,
  description,
  statusLabel,
  statusVariant = "muted",
  meta,
  className,
  ...props
}: SettingsLinkProps) {
  return (
    <NavLink
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-[var(--glass-border-soft)] bg-[color-mix(in_srgb,var(--layer-glass-panel)_92%,transparent)] p-4 text-style-body shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--glass-border-strong)] hover:bg-[color-mix(in_srgb,var(--layer-glass-panel)_98%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)]/30 text-[var(--accent)] shadow-[var(--shadow-xs)]">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-style-body-strong text-text-primary">{title}</span>
            {statusLabel && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
                  statusClasses[statusVariant],
                )}
              >
                {statusLabel}
              </span>
            )}
          </div>
          <p className="text-style-caption text-text-secondary">{description}</p>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-text-tertiary" />
      </div>
      {meta && <p className="text-[11px] uppercase tracking-[0.25em] text-text-muted">{meta}</p>}
    </NavLink>
  );
}
