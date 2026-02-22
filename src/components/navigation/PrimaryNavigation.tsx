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
        orientation === "bottom" ? "grid grid-cols-4 gap-1 p-2" : "flex flex-1 flex-col gap-1",
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
              "group flex items-center gap-2 rounded-xl text-sm font-medium transition",
              orientation === "bottom"
                ? "min-h-[44px] flex-col justify-center gap-1 px-2 py-2"
                : "flex-row px-3 py-3",
              isActive
                ? "bg-surface-2 text-text-primary ring-1 ring-accent-primary/40"
                : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-full border",
                isActive
                  ? "border-accent-primary/60 bg-accent-primary/15 text-accent-primary"
                  : "border-border-ink/40 bg-surface-1 text-text-secondary",
                orientation === "bottom" ? "h-8 w-8" : "h-10 w-10",
              )}
            >
              <Icon className={orientation === "bottom" ? "h-4 w-4" : "h-5 w-5"} />
            </span>
            <div
              className={cn(
                "min-w-0",
                orientation === "bottom" ? "mt-0.5 text-[11px] font-semibold" : "text-sm",
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
