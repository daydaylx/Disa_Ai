import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

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
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

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

  // Lock background scroll
  useEffect(() => {
    if (!isOpen) return;
    
    const scrollY = window.scrollY;
    // Capture original styles to restore later
    const originalStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width
    };

    // Lock body
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      // Restore styles
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.position = originalStyles.position;
      document.body.style.top = originalStyles.top;
      document.body.style.width = originalStyles.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Prepare Navigation Items
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

  if (!isOpen) return null;

  const drawerContent = (
    <div
      className="fixed inset-0 z-drawer bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={cn(
          "absolute top-0 bottom-0 left-0 w-[85vw] max-w-[360px]",
          "glass-3 border-r border-white/5",
          "flex flex-col shadow-2xl",
          "animate-in slide-in-from-left duration-300 ease-out",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigationsmenü"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <BrandWordmark className="text-base text-white/90" />
          <button
            onClick={onClose}
            ref={closeButtonRef}
            className={cn(
              "p-2 -mr-2 rounded-lg text-white/60 transition-colors",
              "hover:text-white hover:bg-white/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
            )}
            aria-label="Menü schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-8">
          {/* Main Navigation */}
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = isNavItemActive(item, location.pathname);
              const Icon = item.Icon;
              
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-brand-primary/15 text-white shadow-[inset_0_0_0_1px_rgba(139,92,246,0.2)]"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 shrink-0 transition-colors",
                      isActive ? "text-brand-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" : "text-white/50 group-hover:text-white/80"
                    )} />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-sm tracking-wide">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className={cn(
                          "text-[11px] truncate mt-0.5",
                          isActive ? "text-brand-primary/80" : "text-white/30 group-hover:text-white/50"
                        )}>
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
            <div className="space-y-3 pt-2">
              <div className="px-3.5 text-xs font-medium text-white/30 uppercase tracking-wider">
                Weitere Links
              </div>
              <ul className="space-y-0.5">
                {secondaryPages.map((page) => {
                  const isActive = isNavItemActive(page, location.pathname);
                  const Icon = page.Icon;
                  
                  return (
                    <li key={page.id}>
                      <Link
                        to={page.path}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors text-sm",
                          isActive
                            ? "text-white bg-white/10 font-medium"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {Icon && <Icon className="w-4 h-4 opacity-70" />}
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
        <div className="px-5 py-4 border-t border-white/5 bg-white/[0.02]">
          <p className="text-[10px] text-white/30 text-center uppercase tracking-widest">
            © 2025 Disa AI
          </p>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return drawerContent;
  return createPortal(drawerContent, document.body);
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
        className
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
