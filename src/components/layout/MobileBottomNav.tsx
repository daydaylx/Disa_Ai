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

  // Wenn die neue Navigation aktiviert ist, verwenden wir die erweiterte Version
  if (isNewNavEnabled) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-glass border-t border-line backdrop-blur-xl">
        <div className="flex justify-around items-center py-2 px-2">
          {primaryItems.map((item) => {
            const isActive = isNavItemActive(item, activePath);
            const Icon = item.Icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-[64px] relative",
                  isActive
                    ? "text-accent bg-accent/10"
                    : "text-text-secondary hover:text-text-primary",
                )}
                aria-label={item.label}
              >
                {/* Aktiv-Indikator */}
                {isActive && (
                  <div className="absolute inset-x-2 top-0 h-1 rounded-b-full bg-accent transform scale-x-100 transition-transform duration-200" />
                )}

                <Icon className="mb-1 w-5 h-5" />

                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-glass border-t border-line backdrop-blur-xl">
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
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-[72px] relative",
                isActive
                  ? "text-accent bg-accent/10"
                  : "text-text-secondary hover:text-text-primary",
              )}
              aria-label={item.label}
            >
              {/* Aktiv-Indikator */}
              {isActive && (
                <div className="absolute inset-x-2 top-0 h-1 rounded-b-full bg-accent" />
              )}

              <Icon className="mb-1 h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Erweiterte Navigation (nur bei Bedarf) */}
      {hasSecondaryItems && isExpanded && (
        <div className="border-t border-line py-3 px-2">
          <div className="flex justify-around items-center">
            {secondaryItems.map((item) => {
              const isActive = isNavItemActive(item, activePath);
              const Icon = item.Icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-[72px] relative",
                    isActive
                      ? "text-accent bg-accent/10"
                      : "text-text-secondary hover:text-text-primary",
                  )}
                  aria-label={item.label}
                >
                  {/* Aktiv-Indikator */}
                  {isActive && (
                    <div className="absolute inset-x-2 top-0 h-1 rounded-b-full bg-accent" />
                  )}

                  <Icon className="mb-1 w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toggle-Button für erweiterte Navigation */}
      {hasSecondaryItems && (
        <div className="flex justify-center py-2">
          <button
            onClick={toggleExpanded}
            className="p-2 rounded-full bg-surface-card text-text-secondary hover:bg-surface-muted transition-colors"
            aria-label={isExpanded ? "Navigation einklappen" : "Navigation erweitern"}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileBottomNav;
