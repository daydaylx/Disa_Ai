import { useEffect, useState } from "react";

import { appRouter } from "../../app/router";
import { isNavItemActive, PRIMARY_NAV_ITEMS } from "../../config/navigation";
import { ChevronDown, ChevronUp } from "../../lib/icons";
import { cn } from "../../lib/utils";

const MobileBottomNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const navItems = PRIMARY_NAV_ITEMS;
  const primaryItems = navItems.slice(0, 5);
  const secondaryItems = navItems.slice(5);
  const hasSecondaryItems = secondaryItems.length > 0;

  const handleNavigation = (path: string) => {
    void appRouter.navigate(path);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Simplified Glass Background */}
      <div
        className="border-t bg-[var(--glass-surface)]/80 backdrop-blur-xl border-[var(--border)] shadow-lg"
        style={{ borderColor: "var(--glass-border-soft)" }}
      >
        {/* Safe Area Bottom Padding */}
        <div className="pb-[var(--safe-bottom)]">
          {/* Primary Navigation */}
          <div className="flex justify-around items-center py-3 px-2">
            {primaryItems.map((item) => {
              const isActive = isNavItemActive(item, activePath);
              const Icon = item.Icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all min-w-[68px]",
                    "min-h-[var(--touch-target-min)] select-none touch-manipulation",
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  )}
                  aria-label={item.label}
                >
                  {/* Simple Active Indicator */}
                  {isActive && (
                    <div className="absolute inset-x-2 top-0 h-1 rounded-b-full bg-[var(--accent)]" />
                  )}

                  <Icon className="mb-1 w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Navigation (expandable) */}
          {hasSecondaryItems && isExpanded && (
            <div className="border-t border-[var(--glass-border-soft)] py-3 px-2">
              <div className="flex justify-around items-center">
                {secondaryItems.map((item) => {
                  const isActive = isNavItemActive(item, activePath);
                  const Icon = item.Icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all min-w-[68px]",
                        "min-h-[var(--touch-target-min)] select-none touch-manipulation",
                        isActive
                          ? "text-[var(--success)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                      )}
                      aria-label={item.label}
                    >
                      {isActive && (
                        <div className="absolute inset-x-2 top-0 h-1 rounded-b-full bg-[var(--success)]" />
                      )}

                      <Icon className="mb-1 w-5 h-5" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toggle Button */}
          {hasSecondaryItems && (
            <div className="flex justify-center py-2">
              <button
                onClick={toggleExpanded}
                className={cn(
                  "p-3 rounded-full transition-all",
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  "hover:bg-white/5",
                  "select-none touch-manipulation",
                )}
                aria-label={isExpanded ? "Navigation einklappen" : "Navigation erweitern"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
