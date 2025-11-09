/**
 * Mobile-Optimized Navigation Component
 * Enhanced touch experience with gestures and haptic feedback
 */

import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useEdgeSwipeDrawer } from "../../hooks/useEdgeSwipe";
import { hapticFeedback } from "../../lib/touch/haptics";
import { cn } from "../../lib/utils";

export interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface MobileNavigationProps {
  items: NavigationItem[];
  className?: string;
  variant?: "bottom" | "drawer" | "tabs";
}

export function MobileNavigation({ items, className, variant = "bottom" }: MobileNavigationProps) {
  const location = useLocation();

  const activePath = useMemo(() => {
    return (
      items.find((item) => location.pathname.startsWith(item.path))?.path ?? items[0]?.path ?? ""
    );
  }, [location.pathname, items]);

  if (variant === "bottom") {
    return <BottomNavigation items={items} activePath={activePath} className={className} />;
  }

  if (variant === "drawer") {
    return <DrawerNavigation items={items} activePath={activePath} className={className} />;
  }

  return <TabNavigation items={items} activePath={activePath} className={className} />;
}

interface NavigationVariantProps {
  items: NavigationItem[];
  activePath: string;
  className?: string;
}

/**
 * Bottom Navigation Bar for Mobile
 */
function BottomNavigation({ items, activePath, className }: NavigationVariantProps) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-card/95 backdrop-blur-lg border-t border-border",
        "safe-padding-bottom",
        className,
      )}
      role="navigation"
      aria-label="Hauptnavigation"
    >
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => (
          <BottomNavItem key={item.path} item={item} isActive={activePath === item.path} />
        ))}
      </div>
    </nav>
  );
}

interface BottomNavItemProps {
  item: NavigationItem;
  isActive: boolean;
}

function BottomNavItem({ item, isActive }: BottomNavItemProps) {
  const handlePress = () => {
    hapticFeedback.select();
  };

  return (
    <Link
      to={item.path}
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
        "min-w-[64px] min-h-[56px] touch-manipulation",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "hover:bg-accent/10",
        isActive ? "text-accent" : "text-muted-foreground hover:text-foreground",
        item.disabled && "opacity-50 pointer-events-none",
      )}
      onTouchStart={handlePress}
      aria-current={isActive ? "page" : undefined}
      aria-label={item.label}
    >
      <div className="relative flex items-center justify-center">
        <span className={cn("w-6 h-6 transition-transform duration-200", isActive && "scale-110")}>
          {item.icon}
        </span>

        {item.badge && (
          <span
            className={cn(
              "absolute -top-1 -right-1 min-w-[16px] h-4 px-1",
              "bg-destructive text-destructive-foreground text-xs font-medium",
              "rounded-full flex items-center justify-center",
            )}
          >
            {item.badge}
          </span>
        )}

        {isActive && <span className="absolute -bottom-4 w-1 h-1 bg-accent rounded-full" />}
      </div>

      <span
        className={cn(
          "text-xs font-medium transition-all duration-200",
          isActive && "text-accent scale-105",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

/**
 * Drawer Navigation for Mobile
 */
function DrawerNavigation({ items, activePath, className }: NavigationVariantProps) {
  const [isOpen, setIsOpen] = useState(false);

  const swipeState = useEdgeSwipeDrawer(isOpen, () => setIsOpen(true), {
    edgeWidth: 20,
    minDX: 50,
    delay: 0,
  });

  const handleClose = () => {
    setIsOpen(false);
    hapticFeedback.tap();
  };

  const handleItemPress = () => {
    hapticFeedback.select();
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={handleClose} />
      )}

      {/* Drawer */}
      <nav
        className={cn(
          "fixed top-0 left-0 bottom-0 w-80 z-50",
          "bg-card/95 backdrop-blur-xl border-r border-border",
          "transform transition-transform duration-300 ease-out",
          "safe-padding-top safe-padding-bottom",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        role="navigation"
        aria-label="Hauptnavigation"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-accent/10 touch-manipulation"
              aria-label="Menü schließen"
            >
              <span className="w-6 h-6">×</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  "min-h-[56px] touch-manipulation",
                  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                  "hover:bg-accent/10",
                  activePath === item.path
                    ? "bg-accent/20 text-accent font-medium"
                    : "text-foreground hover:text-accent",
                  item.disabled && "opacity-50 pointer-events-none",
                )}
                onTouchStart={handleItemPress}
                onClick={handleItemPress}
                aria-current={activePath === item.path ? "page" : undefined}
              >
                <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
                <span className="flex-1">{item.label}</span>

                {item.badge && (
                  <span
                    className={cn(
                      "min-w-[20px] h-5 px-2",
                      "bg-destructive text-destructive-foreground text-xs font-medium",
                      "rounded-full flex items-center justify-center",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Edge Swipe Indicator */}
      {swipeState.isActive && (
        <div className="fixed top-1/2 left-2 transform -translate-y-1/2 z-50">
          <div
            className="w-1 h-12 bg-accent rounded-full transition-all duration-200"
            style={{
              opacity: swipeState.swipeProgress,
              transform: `scaleY(${0.5 + swipeState.swipeProgress * 0.5})`,
            }}
          />
        </div>
      )}
    </>
  );
}

/**
 * Tab Navigation for Mobile
 */
function TabNavigation({ items, activePath, className }: NavigationVariantProps) {
  return (
    <nav
      className={cn(
        "flex bg-muted/30 rounded-xl p-1 backdrop-blur-sm",
        "border border-border/50",
        className,
      )}
      role="tablist"
      aria-label="Hauptnavigation"
    >
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          role="tab"
          aria-selected={activePath === item.path}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
            "min-h-[44px] flex-1 justify-center touch-manipulation",
            "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
            activePath === item.path
              ? "bg-card text-accent shadow-sm font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            item.disabled && "opacity-50 pointer-events-none",
          )}
          onTouchStart={() => hapticFeedback.select()}
        >
          <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
          <span className="text-sm font-medium">{item.label}</span>

          {item.badge && (
            <span
              className={cn(
                "min-w-[16px] h-4 px-1",
                "bg-destructive text-destructive-foreground text-xs font-medium",
                "rounded-full flex items-center justify-center",
              )}
            >
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Mobile Breadcrumb Navigation
 */
export interface MobileBreadcrumbProps {
  items: Array<{
    label: string;
    path?: string;
  }>;
  className?: string;
}

export function MobileBreadcrumb({ items, className }: MobileBreadcrumbProps) {
  return (
    <nav
      className={cn(
        "flex items-center space-x-1 overflow-x-auto scrollbar-none",
        "py-2 px-1",
        className,
      )}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1 whitespace-nowrap">
          {item.path ? (
            <Link
              to={item.path}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground",
                "px-2 py-1 rounded-md touch-manipulation",
                "min-h-[32px] flex items-center",
                "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
              )}
              onTouchStart={() => hapticFeedback.tap()}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm text-foreground font-medium px-2 py-1">{item.label}</span>
          )}

          {index < items.length - 1 && (
            <span className="text-muted-foreground text-sm" aria-hidden="true">
              /
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
