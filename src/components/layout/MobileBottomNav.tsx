import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

import { appRouter } from "../../app/router";
import { isNavItemActive, PRIMARY_NAV_ITEMS } from "../../config/navigation";
import { useFeatureFlag } from "../../hooks/useFeatureFlags";
import { cn } from "../../lib/utils";

const MobileBottomNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePath, setActivePath] = useState(() => appRouter.state.location.pathname);
  const isNewNavEnabled = useFeatureFlag("enhancedNavigation");

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

  // Navigation durchführen
  const handleNavigation = (path: string) => {
    void appRouter.navigate(path);
    setIsExpanded(false);
  };

  // Toggle für erweiterte Navigation
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Aurora Premium Enhanced Navigation
  if (isNewNavEnabled) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Premium Aurora Glass Background */}
        <div className="bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)] border-t border-[var(--glass-border-medium)] shadow-[var(--shadow-premium-medium)]">
          {/* Safe Area Bottom Padding */}
          <div className="pb-[var(--safe-bottom)]">
            <div className="flex justify-around items-center py-3 px-2">
              {primaryItems.map((item) => {
                const isActive = isNavItemActive(item, activePath);
                const Icon = item.Icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      // Aurora Premium Button Base
                      "relative flex flex-col items-center justify-center py-3 px-3 rounded-[var(--radius-lg)] transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)] min-w-[68px]",
                      // Touch-optimiert
                      "min-h-[var(--touch-target-compact)] select-none touch-manipulation",
                      // Premium Interactive States
                      "hover:bg-[var(--glass-surface-subtle)] hover:scale-[1.02] active:scale-[0.98]",
                      isActive
                        ? "text-[var(--aurora-primary-400)] bg-[var(--glass-surface-subtle)] shadow-[var(--shadow-glow-primary)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                    )}
                    aria-label={item.label}
                  >
                    {/* Premium Aurora Active Glow Overlay */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--aurora-primary-500)]/10 to-[var(--aurora-lila-500)]/5 rounded-[var(--radius-lg)] pointer-events-none" />
                    )}

                    {/* Aurora Active Indicator - Modernized */}
                    {isActive && (
                      <div className="absolute inset-x-3 top-0 h-1 rounded-b-full bg-gradient-to-r from-[var(--aurora-primary-500)] to-[var(--aurora-lila-500)] shadow-[var(--shadow-glow-primary)] animate-pulse" />
                    )}

                    <div className="relative z-10 flex flex-col items-center">
                      <Icon
                        className={cn(
                          "mb-1 w-5 h-5 transition-transform duration-[var(--motion-medium)]",
                          isActive && "scale-110",
                        )}
                      />
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Aurora Premium Glass Background - Standard Mode */}
      <div className="bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)] border-t border-[var(--glass-border-medium)] shadow-[var(--shadow-premium-medium)]">
        {/* Safe Area Bottom Padding */}
        <div className="pb-[var(--safe-bottom)]">
          {/* Haupt-Navigation */}
          <div className="flex justify-around items-center py-3 px-2">
            {primaryItems.map((item) => {
              const isActive = isNavItemActive(item, activePath);
              const Icon = item.Icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    // Aurora Premium Button Base
                    "relative flex flex-col items-center justify-center py-3 px-3 rounded-[var(--radius-lg)] transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)] min-w-[72px]",
                    // Touch-optimiert
                    "min-h-[var(--touch-target-comfortable)] select-none touch-manipulation",
                    // Premium Interactive States
                    "hover:bg-[var(--glass-surface-subtle)] hover:scale-[1.02] active:scale-[0.98]",
                    isActive
                      ? "text-[var(--aurora-primary-400)] bg-[var(--glass-surface-subtle)] shadow-[var(--shadow-glow-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  )}
                  aria-label={item.label}
                >
                  {/* Premium Aurora Active Glow Overlay */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--aurora-primary-500)]/10 to-[var(--aurora-lila-500)]/5 rounded-[var(--radius-lg)] pointer-events-none" />
                  )}

                  {/* Aurora Active Indicator */}
                  {isActive && (
                    <div className="absolute inset-x-3 top-0 h-1 rounded-b-full bg-gradient-to-r from-[var(--aurora-primary-500)] to-[var(--aurora-lila-500)] shadow-[var(--shadow-glow-primary)] animate-pulse" />
                  )}

                  <div className="relative z-10 flex flex-col items-center">
                    <Icon
                      className={cn(
                        "mb-1 w-6 h-6 transition-transform duration-[var(--motion-medium)]",
                        isActive && "scale-110",
                      )}
                    />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Erweiterte Navigation (nur bei Bedarf) */}
          {hasSecondaryItems && isExpanded && (
            <div className="border-t border-[var(--glass-border-subtle)] py-3 px-2">
              <div className="flex justify-around items-center">
                {secondaryItems.map((item) => {
                  const isActive = isNavItemActive(item, activePath);
                  const Icon = item.Icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        // Konsistentes Aurora-Styling wie Hauptnavigation
                        "relative flex flex-col items-center justify-center py-3 px-3 rounded-[var(--radius-lg)] transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)] min-w-[72px]",
                        "min-h-[var(--touch-target-comfortable)] select-none touch-manipulation",
                        "hover:bg-[var(--glass-surface-subtle)] hover:scale-[1.02] active:scale-[0.98]",
                        isActive
                          ? "text-[var(--aurora-green-400)] bg-[var(--glass-surface-subtle)] shadow-[var(--shadow-glow-green)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                      )}
                      aria-label={item.label}
                    >
                      {/* Aurora Green für Secondary Items */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--aurora-green-500)]/10 to-[var(--aurora-lila-500)]/5 rounded-[var(--radius-lg)] pointer-events-none" />
                      )}

                      {/* Green Active Indicator für Secondary */}
                      {isActive && (
                        <div className="absolute inset-x-3 top-0 h-1 rounded-b-full bg-gradient-to-r from-[var(--aurora-green-500)] to-[var(--aurora-lila-500)] shadow-[var(--shadow-glow-green)] animate-pulse" />
                      )}

                      <div className="relative z-10 flex flex-col items-center">
                        <Icon
                          className={cn(
                            "mb-1 w-5 h-5 transition-transform duration-[var(--motion-medium)]",
                            isActive && "scale-110",
                          )}
                        />
                        <span className="text-xs font-medium">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Aurora Premium Toggle-Button */}
          {hasSecondaryItems && (
            <div className="flex justify-center py-2">
              <button
                onClick={toggleExpanded}
                className={cn(
                  // Aurora Glass Toggle Button
                  "p-3 rounded-full transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
                  "bg-[var(--glass-surface-subtle)] border border-[var(--glass-border-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface-medium)]",
                  "hover:shadow-[var(--shadow-glow-soft)] hover:scale-105 active:scale-95",
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
