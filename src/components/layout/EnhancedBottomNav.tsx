import { useEffect, useState } from "react";

import { appRouter } from "../../app/router";
import { isNavItemActive, PRIMARY_NAV_ITEMS } from "../../config/navigation";
import { cn } from "../../lib/utils";

export function EnhancedBottomNav() {
  const [activePath, setActivePath] = useState(() => appRouter.state.location.pathname);

  useEffect(() => {
    setActivePath(appRouter.state.location.pathname);
    const unsubscribe = appRouter.subscribe((state) => {
      setActivePath(state.location.pathname);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Navigation durchführen
  const handleNavigation = (path: string) => {
    void appRouter.navigate(path);
  };

  // Prüfen, ob ein Navigationspunkt aktiv ist
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-glass border-t border-line backdrop-blur-xl">
      <div className="flex justify-around items-center py-2 px-2">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(item, activePath);
          const Icon = item.Icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-medium)] border border-[var(--glass-border-subtle)] relative group transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)] min-w-[70px]",
                isActive
                  ? "bg-[var(--glass-surface-strong)] backdrop-blur-[var(--backdrop-blur-strong)] border border-[var(--glass-border-aurora)] text-primary shadow-[var(--shadow-glow-primary)] animate-pulse scale-105"
                  : "hover:bg-[var(--glass-surface-strong)] hover:backdrop-blur-[var(--backdrop-blur-strong)] hover:border-[var(--glass-border-medium)] hover:shadow-[var(--shadow-glow-soft)] hover:scale-105 text-text-secondary hover:text-primary",
              )}
              aria-label={item.label}
            >
              {/* Aktiv-Indikator */}
              {isActive && (
                <div className="absolute inset-x-2 top-0 h-1 rounded-b-full bg-accent" />
              )}

              <div
                className={cn(
                  "mb-1 transition-transform duration-200",
                  isActive ? "scale-110" : "scale-100",
                )}
              >
                <Icon className="w-6 h-6" />
              </div>

              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "font-semibold" : "font-normal",
                )}
              >
                {item.label}
              </span>

              {/* Glaseffekt für aktive Elemente */}
              {isActive && <div className="absolute inset-0 rounded-xl bg-accent/10" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
