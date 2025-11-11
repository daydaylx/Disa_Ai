import { Link, useLocation } from "react-router-dom";

import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { path: "/chat", label: "Chat" },
  { path: "/models", label: "Modelle" },
  { path: "/roles", label: "Rollen" },
  { path: "/settings", label: "Einstellungen" },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="z-bottom-nav fixed inset-x-0 bottom-0 border-t border-line-subtle bg-surface-base/95 backdrop-blur-sm"
      aria-label="Hauptnavigation"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-1 px-4 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "touch-target flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 text-[10px] font-medium transition-all",
                isActive
                  ? "bg-surface-muted text-text-primary shadow-sm"
                  : "text-text-secondary hover:bg-surface-muted/70 hover:text-text-primary",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "mb-0.5 h-1 w-6 rounded-full",
                  isActive ? "bg-accent" : "bg-transparent",
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
