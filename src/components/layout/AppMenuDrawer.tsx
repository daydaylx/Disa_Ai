import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";
import { Typography } from "@/ui/Typography";

import { BrandWordmark } from "../../app/components/BrandWordmark";
import { Cpu, History, Home, Settings, Users, X } from "../../lib/icons";
import { cn } from "../../lib/utils";

interface AppMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function AppMenuDrawer({ isOpen, onClose, className }: AppMenuDrawerProps) {
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
        last.focus();
      }
    } else if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const focusFirst = () => closeButtonRef.current?.focus({ preventScroll: true });

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Sekundäre Navigation (progressive Disclosure)
  const secondaryNavigation = [
    {
      label: "Hauptfunktionen",
      items: [
        {
          label: "Chat",
          href: "/",
          icon: <Home className="h-4 w-4" />,
          description: "Unterhaltungen & Verlauf",
        },
        {
          label: "Modelle",
          href: "/models",
          icon: <Cpu className="h-4 w-4" />,
          description: "Katalog & Bewertungen",
        },
        {
          label: "Rollen",
          href: "/roles",
          icon: <Users className="h-4 w-4" />,
          description: "Persona-Templates",
        },
      ],
    },
    {
      label: "Erweiterte Funktionen",
      items: [
        {
          label: "Verlauf",
          href: "/chat/history",
          icon: <History className="h-4 w-4" />,
          description: "Gespeicherte Gespräche",
        },
        {
          label: "Einstellungen",
          href: "/settings",
          icon: <Settings className="h-4 w-4" />,
          description: "API, Daten & Darstellung",
        },
      ],
    },
    {
      label: "Rechtliches",
      items: [
        { label: "Impressum", href: "/impressum" },
        { label: "Datenschutz", href: "/datenschutz" },
      ],
    },
  ];

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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
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
            "h-full w-[clamp(18rem,80vw,24rem)] sm:w-[clamp(22rem,70vw,28rem)] sm:rounded-3xl rounded-none overflow-y-auto relative bg-surface-1 shadow-raiseLg with-spine",
            "transition-transform duration-220 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
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
          <div className="flex items-center justify-between sticky top-0 bg-surface-1 z-10 py-4 px-4 sm:px-5 border-b border-surface-2">
            <Typography variant="body-lg" className="text-text-primary font-semibold">
              <BrandWordmark showTagline={false} />
            </Typography>
            <button
              onClick={onClose}
              ref={closeButtonRef}
              className="p-[var(--spacing-3)] min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-text-primary bg-surface-2 hover:bg-surface-3 shadow-raise focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors tap-target-icon"
              aria-label="Menü schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Section mit progressiver Disclosure */}
          <div className="space-y-6">
            {secondaryNavigation.map((section) => (
              <div key={section.label}>
                <Typography
                  variant="body-xs"
                  className="text-text-secondary uppercase tracking-[0.2em] mb-3 font-semibold"
                >
                  {section.label}
                </Typography>

                <div className="space-y-2">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={`${section.label}-${item.label}`}
                        to={item.href}
                        onClick={onClose}
                        className="block"
                      >
                        <MaterialCard
                          variant={isActive ? "inset" : "raised"}
                          className="p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                        >
                          <div className="flex items-center gap-3">
                            {"icon" in item && (
                              <div
                                className={cn(
                                  "flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg",
                                  isActive ? "bg-accent-primary/20" : "bg-surface-1",
                                )}
                              >
                                {item.icon}
                              </div>
                            )}
                            <div className="flex-1">
                              <Typography
                                variant="body-sm"
                                className={cn(
                                  "font-medium mb-0.5",
                                  isActive ? "text-accent-primary" : "text-text-primary",
                                )}
                              >
                                {item.label}
                              </Typography>
                              <Typography variant="body-xs" className="text-text-secondary">
                                {"description" in item ? item.description : "\u00A0"}
                              </Typography>
                            </div>
                          </div>
                        </MaterialCard>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-surface-1">
            <Typography variant="body-xs" className="text-text-secondary text-center">
              © 2025 Disa AI
            </Typography>
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
    <Button
      onClick={onClick}
      variant="secondary"
      size="icon"
      className={cn("relative group tap-target-icon", className)}
      aria-label="Menü öffnen"
    >
      {/* Hamburger Icon */}
      <div className="flex flex-col justify-center space-y-1 w-5 h-5">
        <div className="w-full h-0.5 bg-current rounded-full" />
        <div className="w-full h-0.5 bg-current rounded-full" />
        <div className="w-full h-0.5 bg-current rounded-full" />
      </div>

      {/* Badge */}
      {badge && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[var(--color-primary-500)] text-white text-xs font-medium flex items-center justify-center">
          {badge}
        </span>
      )}
    </Button>
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
