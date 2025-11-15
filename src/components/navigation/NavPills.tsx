import { Link } from "react-router-dom";

import type { AppNavItem } from "../../config/navigation";
import { isNavItemActive } from "../../config/navigation";
import { cn } from "../../lib/utils";

interface NavPillsProps {
  items: AppNavItem[];
  pathname: string;
}

export function NavPills({ items, pathname }: NavPillsProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[var(--surface-base)/0.6] to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[var(--surface-base)/0.6] to-transparent" />
      <nav
        aria-label="Primäre Navigation"
        className="relative flex w-full gap-3 overflow-x-auto px-page-padding-x py-3"
      >
        {items.map((item) => {
          const isActive = isNavItemActive(item, pathname);
          const Icon = item.Icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-soft)]",
                isActive
                  ? "bg-[color-mix(in_srgb,var(--accent)_20%,var(--surface-base))] text-text-primary shadow-[0_12px_30px_rgba(97,231,255,0.3)]"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-2xl border transition-colors",
                  isActive
                    ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--glass-border-soft)] text-text-secondary",
                )}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-max">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
