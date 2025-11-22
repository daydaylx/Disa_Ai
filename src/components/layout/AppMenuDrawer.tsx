import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";
import { Typography } from "@/ui/Typography";

import { isNavItemActive, PRIMARY_NAV_ITEMS } from "../../config/navigation";
import { X } from "../../lib/icons";
import { cn } from "../../lib/utils";

interface AppMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function AppMenuDrawer({ isOpen, onClose, className }: AppMenuDrawerProps) {
  const location = useLocation();

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Sekundäre Seiten
  const secondaryPages = [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={handleBackdropClick}>
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
            "h-full w-[min(480px,100%)] sm:rounded-3xl rounded-none overflow-y-auto relative bg-surface-1 shadow-raiseLg with-spine",
            "transition-transform duration-220 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
            "motion-safe:animate-[slideInLeft_180ms_ease-out]",
          )}
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between sticky top-0 bg-surface-1 z-10 py-4 px-4 sm:px-5 border-b border-surface-2">
            <Typography variant="body-lg" className="text-text-primary font-semibold">
              Disa AI
            </Typography>
            <button
              onClick={onClose}
              className="p-[var(--spacing-3)] min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-text-primary bg-surface-2 hover:bg-surface-3 shadow-raise focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-colors"
              aria-label="Menü schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="space-y-6">
            <div>
              <Typography
                variant="body-xs"
                className="text-text-secondary uppercase tracking-[0.2em] mb-3 font-semibold"
              >
                Navigation
              </Typography>

              <div className="space-y-2">
                {PRIMARY_NAV_ITEMS.map((item) => {
                  const isActive = isNavItemActive(item, location.pathname);
                  const Icon = item.Icon;

                  return (
                    <Link key={item.id} to={item.path} onClick={onClose} className="block">
                      <MaterialCard
                        variant={isActive ? "inset" : "raised"}
                        className="p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg",
                              isActive ? "bg-accent-primary/20" : "bg-surface-1",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-4 w-4",
                                isActive ? "text-accent-primary" : "text-text-secondary",
                              )}
                            />
                          </div>
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
                              {item.description}
                            </Typography>
                          </div>
                        </div>
                      </MaterialCard>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sekundäre Seiten */}
            <div>
              <Typography
                variant="body-xs"
                className="text-text-secondary uppercase tracking-[0.2em] mb-3 font-semibold"
              >
                Sekundäre Seiten
              </Typography>

              <div className="space-y-2">
                {secondaryPages.map((page) => {
                  const isActive = location.pathname === page.href;

                  return (
                    <Link key={page.href} to={page.href} onClick={onClose} className="block">
                      <MaterialCard
                        variant={isActive ? "inset" : "raised"}
                        className="p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                      >
                        <Typography
                          variant="body-sm"
                          className={cn(
                            "font-medium",
                            isActive ? "text-accent-primary" : "text-text-primary",
                          )}
                        >
                          {page.label}
                        </Typography>
                      </MaterialCard>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-surface-1">
            <Typography variant="body-xs" className="text-text-secondary text-center">
              © 2025 Disa AI
            </Typography>
          </div>
        </MaterialCard>
      </div>
    </div>
  );
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
      className={cn("relative group", className)}
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
