import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

import { BrandWordmark } from "../../app/components/BrandWordmark";
import type { AppNavItem } from "../../config/navigation";
import { isNavItemActive, PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "../../config/navigation";
import { useSwipeGesture } from "../../hooks/useSwipeGesture";
import { Info, Shield, X } from "../../lib/icons";
import { getOverlayRoot, lockActiveScrollOwner } from "../../lib/overlay";
import { cn } from "../../lib/utils";

interface AppMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  navItems?: AppNavItem[];
  secondaryItems?: AppNavItem[];
}

export function AppMenuDrawer({
  isOpen,
  onClose,
  className,
  navItems,
  secondaryItems,
}: AppMenuDrawerProps) {
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Swipe-Down to close
  const { handlers: swipeHandlersNative, dragOffset } = useSwipeGesture({
    onSwipeDown: onClose,
    threshold: 80,
    enableHaptic: true,
  });

  // Wrap native handlers for React
  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent) => swipeHandlersNative.onTouchStart(e.nativeEvent),
    onTouchMove: (e: React.TouchEvent) => swipeHandlersNative.onTouchMove(e.nativeEvent),
    onTouchEnd: () => swipeHandlersNative.onTouchEnd(),
    onTouchCancel: () => swipeHandlersNative.onTouchCancel(),
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Initial focus
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure rendering and transition start
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus({ preventScroll: true });
      });
    }
  }, [isOpen]);

  // Focus Trap
  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key !== "Tab") return;
    const container = drawerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  // Lock active scroll owner
  useEffect(() => {
    if (!isOpen) return;

    return lockActiveScrollOwner();
  }, [isOpen]);

  // Prepare Navigation Items
  const feedbackItem = SECONDARY_NAV_ITEMS.find((item) => item.id === "feedback");
  const secondaryPages: AppNavItem[] = secondaryItems ?? [
    ...(feedbackItem ? [feedbackItem] : []),
    { id: "impressum", label: "Impressum", path: "/impressum", Icon: Info },
    { id: "datenschutz", label: "Datenschutz", path: "/datenschutz", Icon: Shield },
  ];

  const quickstartItem =
    SECONDARY_NAV_ITEMS.find((item) => item.id === "themen") ??
    ({
      id: "themen",
      label: "Quickstarts",
      path: "/themen",
      Icon: X,
      description: "Themen & Beispielprompts",
    } satisfies AppNavItem);

  const navigationItems = navItems ?? [...PRIMARY_NAV_ITEMS, quickstartItem];

  if (!isOpen) return null;

  const drawerContent = (
    <div
      className="fixed inset-0 z-drawer pointer-events-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" />
      <div
        {...swipeHandlers}
        className={cn(
          "absolute top-0 bottom-0 left-0 w-[92vw] max-w-[360px] sm:w-[85vw]",
          "glass-3 border-r border-white/10",
          "flex flex-col shadow-2xl",
          "animate-in slide-in-from-left duration-300 ease-out",
          "transition-transform",
          className,
        )}
        style={{
          transform: `translateY(${Math.max(0, dragOffset.y)}px)`,
          opacity: dragOffset.y > 0 ? Math.max(0.5, 1 - dragOffset.y / 200) : 1,
          background: "rgba(16, 16, 20, 0.74)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigationsmenü"
      >
        {/* Header */}
        <div className="border-b border-white/10 bg-white/[0.02] px-5 py-4">
          <div className="flex items-center justify-between">
            <BrandWordmark className="text-base text-white/90" />
            <button
              onClick={onClose}
              ref={closeButtonRef}
              className={cn(
                "-mr-2 rounded-lg p-2 text-white/60 transition-colors",
                "hover:bg-white/10 hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50",
              )}
              aria-label="Menü schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-xs tracking-wide text-white/45">Schnell zu allen Bereichen</p>
        </div>

        {/* Scrollable Content */}
        <nav className="flex-1 space-y-8 overflow-x-hidden overflow-y-auto px-3 py-6">
          {/* Main Navigation */}
          <ul className="space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = isNavItemActive(item, location.pathname);
              const Icon = item.Icon;

              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 transition-all duration-200",
                      isActive
                        ? "bg-brand-primary/16 text-white shadow-[inset_0_0_0_1px_rgba(139,92,246,0.36)]"
                        : "text-white/65 hover:bg-white/6 hover:text-white",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-r-full transition-opacity",
                        isActive ? "bg-brand-primary opacity-100" : "bg-transparent opacity-0",
                      )}
                    />
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive
                          ? "text-brand-primary drop-shadow-[0_0_6px_rgba(139,92,246,0.45)]"
                          : "text-white/55 group-hover:text-white/85",
                      )}
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="text-sm font-semibold tracking-[0.01em]">{item.label}</span>
                      {item.description && (
                        <span
                          className={cn(
                            "mt-0.5 truncate text-[11px]",
                            isActive
                              ? "text-brand-primary/85"
                              : "text-white/35 group-hover:text-white/55",
                          )}
                        >
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Secondary Navigation */}
          {secondaryPages.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="px-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Service
              </div>
              <ul className="space-y-1">
                {secondaryPages.map((page) => {
                  const isActive = isNavItemActive(page, location.pathname);
                  const Icon = page.Icon;

                  return (
                    <li key={page.id}>
                      <Link
                        to={page.path}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                          isActive
                            ? "bg-white/12 font-medium text-white"
                            : "text-white/55 hover:bg-white/6 hover:text-white",
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 opacity-75" />}
                        <span>{page.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 bg-white/[0.02] px-5 py-4">
          <p className="text-center text-[10px] uppercase tracking-widest text-white/35">
            © 2026 Disa AI
          </p>
        </div>
      </div>
    </div>
  );

  const overlayRoot = getOverlayRoot();
  if (!overlayRoot) return drawerContent;
  return createPortal(drawerContent, overlayRoot);
}

// Header Icon Component
interface MenuIconProps {
  onClick: () => void;
  className?: string;
  badge?: string | number;
}

export function MenuIcon({ onClick, className, badge }: MenuIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-center w-10 h-10 rounded-lg",
        "text-text-primary hover:bg-surface-2 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50",
        className,
      )}
      aria-label="Menü öffnen"
    >
      <div className="flex flex-col gap-[5px] w-5 items-end">
        <span className="w-full h-0.5 bg-current rounded-full" />
        <span className="w-3/4 h-0.5 bg-current rounded-full group-hover:w-full transition-all duration-300" />
        <span className="w-full h-0.5 bg-current rounded-full" />
      </div>

      {badge && (
        <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
        </span>
      )}
    </button>
  );
}

// Hook for Menu State Management
export function useMenuDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
}
