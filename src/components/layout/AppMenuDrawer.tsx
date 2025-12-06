import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

import { MaterialCard } from "@/ui/MaterialCard";

import { BrandWordmark } from "../../app/components/BrandWordmark";
import type { AppNavItem } from "../../config/navigation";
import { isNavItemActive, PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "../../config/navigation";
import { X } from "../../lib/icons";
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
  const firstTrapRef = useRef<HTMLSpanElement | null>(null);
  const lastTrapRef = useRef<HTMLSpanElement | null>(null);

  // Escape to close + focus trap
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    // Initial focus on close button
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key !== "Tab") return;
    const container = drawerRef.current;
    if (!container) return;
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
    } else if (document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const focusFirst = () => closeButtonRef.current?.focus({ preventScroll: true });

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Sekundäre Seiten mit Feedback aus SECONDARY_NAV_ITEMS
  const feedbackItem = SECONDARY_NAV_ITEMS.find((item) => item.id === "feedback");

  const secondaryPages: AppNavItem[] = secondaryItems ?? [
    ...(feedbackItem ? [feedbackItem] : []),
    { id: "impressum", label: "Impressum", path: "/impressum", Icon: X },
    { id: "datenschutz", label: "Datenschutz", path: "/datenschutz", Icon: X },
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

  // Lock background scroll while the drawer is open
  useEffect(() => {
    if (!isOpen) return undefined;
    if (typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    const scrollY = window.scrollY;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const drawer = (
    <div
      className="fixed inset-0 z-drawer bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {/* Vollflächiges Overlay */}
      <div
        className={cn(
          "fixed inset-0 flex justify-start p-0 sm:p-[var(--spacing-6)]",
          "transition-all duration-200 ease-out",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <MaterialCard
          variant="hero"
          className={cn(
            "h-[100dvh] w-[80vw] max-w-[320px] sm:rounded-2xl rounded-none overflow-y-auto overscroll-contain relative bg-[rgba(19,19,20,0.96)] border border-[var(--border-chalk)] shadow-[0_0_0_1px_var(--border-chalk),0_18px_40px_rgba(0,0,0,0.45)]",
            "transition-transform duration-200 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
            "motion-safe:animate-[slideInLeft_180ms_ease-out]",
          )}
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigationsmenü"
        >
          <span
            ref={firstTrapRef}
            tabIndex={0}
            onFocus={focusFirst}
            aria-hidden="true"
            className="sr-only"
          />
          {/* Header with Close Button */}
          <div className="flex items-center justify-between sticky top-0 bg-[rgba(19,19,20,0.96)] z-header py-3 px-5 border-b border-[var(--border-chalk)] gap-3">
            <BrandWordmark className="text-base" />
            <button
              onClick={onClose}
              ref={closeButtonRef}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-ink-secondary hover:text-ink-primary hover:bg-[rgba(255,255,255,0.04)] transition-colors border border-transparent hover:border-[var(--border-chalk)] shrink-0"
              aria-label="Menü schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="px-4 py-4">
            <ul className="space-y-1" role="list">
              {navigationItems.map((item) => {
                const isActive = isNavItemActive(item, location.pathname);
                const Icon = item.Icon;

                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors min-h-[48px] border border-transparent",
                        isActive
                          ? "border-[var(--border-chalk-strong)] bg-[rgba(255,255,255,0.04)] text-text-primary"
                          : "text-ink-primary hover:border-[var(--border-chalk)] hover:bg-[rgba(255,255,255,0.03)]",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive ? "text-text-primary" : "text-ink-secondary",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.description && (
                          <p className="text-xs text-ink-tertiary mt-0.5 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {secondaryPages.length > 0 && (
              <>
                {/* Divider */}
                <hr className="my-4 border-[color:hsla(0,0%,92%,0.35)]" />

                {/* Secondary Links */}
                <ul className="space-y-1" role="list">
                  {secondaryPages.map((page) => {
                    const isActive = isNavItemActive(page, location.pathname);
                    const Icon = page.Icon;

                    return (
                      <li key={page.id}>
                        <Link
                          to={page.path}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm min-h-[44px] border border-transparent",
                            isActive
                              ? "text-text-primary border-[var(--border-chalk-strong)] bg-[rgba(255,255,255,0.04)]"
                              : "text-ink-secondary hover:text-ink-primary hover:border-[var(--border-chalk)] hover:bg-[rgba(255,255,255,0.03)]",
                          )}
                        >
                          {Icon && (
                            <Icon
                              className={cn(
                                "h-4 w-4 flex-shrink-0",
                                isActive ? "text-text-primary" : "text-ink-tertiary",
                              )}
                            />
                          )}
                          <span>{page.label}</span>
                          {page.description && (
                            <span className="text-xs text-ink-tertiary ml-auto truncate max-w-[120px]">
                              {page.description}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="px-4 pb-6 pt-2 mt-auto">
            <p className="text-xs text-ink-tertiary text-center">© 2025 Disa AI</p>
          </div>
          <span
            ref={lastTrapRef}
            tabIndex={0}
            onFocus={focusFirst}
            aria-hidden="true"
            className="sr-only"
          />
        </MaterialCard>
      </div>
    </div>
  );

  if (typeof document === "undefined") return drawer;
  return createPortal(drawer, document.body);
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
        "relative flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg",
        "text-ink-primary hover:bg-surface-2 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
        className,
      )}
      aria-label="Menü öffnen"
    >
      {/* Hamburger Icon */}
      <div className="flex flex-col justify-center gap-1 w-5">
        <div className="w-full h-0.5 bg-current rounded-full" />
        <div className="w-full h-0.5 bg-current rounded-full" />
        <div className="w-full h-0.5 bg-current rounded-full" />
      </div>

      {/* Badge */}
      {badge && (
        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent-primary text-white text-[10px] font-medium flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

// Hook für Menu State Management
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
