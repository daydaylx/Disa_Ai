import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { GlassCard } from "@/ui/GlassCard";
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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md" onClick={handleBackdropClick}>
      {/* Vollflächiges Overlay */}
      <div
        className={cn(
          "fixed inset-0 flex items-center justify-center p-[var(--spacing-4)] sm:p-[var(--spacing-6)]",
          "transition-all duration-300 ease-out",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard
          variant="primary"
          className="w-full max-w-md max-h-[85vh] overflow-y-auto relative transform scale-100 transition-all duration-300"
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-6">
            <Typography variant="body-lg" className="text-text-primary font-semibold">
              Disa AI
            </Typography>
            <button
              onClick={onClose}
              className="p-[var(--spacing-3)] min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-panel/50 transition-colors"
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
                      <GlassCard
                        className={cn(
                          "p-[var(--spacing-4)] cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                          isActive
                            ? "border-[var(--accent)] bg-[var(--accent-soft)]/30 shadow-lg shadow-[var(--accent)]/10"
                            : "hover:bg-surface-panel/50 border-transparent",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg",
                              isActive ? "bg-[var(--accent)]/20" : "bg-surface-panel/50",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-4 w-4",
                                isActive ? "text-[var(--accent)]" : "text-text-secondary",
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <Typography
                              variant="body-sm"
                              className={cn(
                                "font-medium mb-0.5",
                                isActive ? "text-[var(--accent)]" : "text-text-primary",
                              )}
                            >
                              {item.label}
                            </Typography>
                            <Typography variant="body-xs" className="text-text-secondary">
                              {item.description}
                            </Typography>
                          </div>
                        </div>
                      </GlassCard>
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
                      <GlassCard
                        className={cn(
                          "p-[var(--spacing-4)] cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                          isActive
                            ? "border-[var(--accent)] bg-[var(--accent-soft)]/30 shadow-lg shadow-[var(--accent)]/10"
                            : "hover:bg-surface-panel/50 border-transparent",
                        )}
                      >
                        <Typography
                          variant="body-sm"
                          className={cn(
                            "font-medium",
                            isActive ? "text-[var(--accent)]" : "text-text-primary",
                          )}
                        >
                          {page.label}
                        </Typography>
                      </GlassCard>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[var(--glass-border-soft)]">
            <Typography variant="body-xs" className="text-text-secondary text-center">
              © 2025 Disa AI
            </Typography>
          </div>
        </GlassCard>
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
    <button
      onClick={onClick}
      className={cn(
        "relative p-3 rounded-xl bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-medium)] border border-[var(--glass-border-subtle)] text-text-secondary min-h-[44px] min-w-[44px] flex items-center justify-center group",
        "hover:bg-[var(--glass-surface-strong)] hover:backdrop-blur-[var(--backdrop-blur-strong)] hover:border-[var(--glass-border-medium)] hover:shadow-[var(--shadow-glow-soft)] hover:scale-110 hover:text-primary transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
        "focus:bg-[var(--glass-surface-strong)] focus:backdrop-blur-[var(--backdrop-blur-strong)] focus:border-[var(--glass-border-aurora)] focus:shadow-[var(--shadow-glow-primary)] focus:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50",
        className,
      )}
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
