import { Link, useLocation } from "react-router-dom";

import { PRIMARY_NAV_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface PrimaryNavigationProps {
  orientation: "bottom" | "side";
}

export function PrimaryNavigation({ orientation }: PrimaryNavigationProps) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        "w-full",
        orientation === "bottom"
          ? "flex items-center justify-between gap-1 px-2"
          : "flex flex-1 flex-col gap-1",
      )}
      aria-label="Hauptnavigation"
    >
      {PRIMARY_NAV_ITEMS.map((item) => {
        const isActive = item.activePattern
          ? item.activePattern.test(location.pathname)
          : location.pathname === item.path;
        const Icon = item.Icon;
        return (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              "group flex flex-1 items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition",
              orientation === "bottom" ? "flex-col" : "flex-row",
              isActive
                ? "bg-accent-primary/10 text-accent-primary shadow-[0_6px_16px_-10px_rgba(0,0,0,0.4)]"
                : "text-ink-secondary hover:bg-surface-2",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border",
                isActive
                  ? "border-accent-primary/40 bg-accent-primary/15 text-accent-primary"
                  : "border-border-ink/30 bg-surface-1 text-ink-secondary",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div
              className={cn(
                "min-w-0",
                orientation === "bottom" ? "text-[11px] font-semibold" : "text-sm",
              )}
            >
              <span className="truncate">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
