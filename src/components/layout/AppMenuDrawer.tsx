import { useState } from "react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";

interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  isActive?: boolean;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

interface AppMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sections: MenuSection[];
  className?: string;
}

export function AppMenuDrawer({ isOpen, onClose, sections, className }: AppMenuDrawerProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleItemClick = (item: MenuItem) => {
    item.onClick?.();
    if (item.href) {
      // Navigation würde hier stattfinden
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Rechte Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 w-[80%] max-w-sm",
          "bg-[var(--surface-soft)] backdrop-blur-[18px]",
          "rounded-l-3xl p-4 space-y-3 overflow-y-auto",
          "border-l border-[var(--glass-border-strong)]",
          "shadow-[var(--shadow-heavy)]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-4">
          <Typography variant="body-lg" className="text-[var(--text-primary)] font-semibold">
            Disa AI
          </Typography>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Menü schließen"
          >
            ×
          </Button>
        </div>

        {/* Menu Sections */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <Typography
                  variant="body-xs"
                  className="text-[var(--text-muted)] uppercase tracking-[0.16em] mb-3 px-3"
                >
                  {section.title}
                </Typography>
              )}

              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "w-full h-11 rounded-xl px-3 flex items-center justify-between",
                      "text-left transition-colors duration-200",
                      "hover:bg-white/5 focus:bg-white/5 focus:outline-none",
                      item.isActive
                        ? "text-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10"
                        : "text-[var(--text-primary)] hover:text-[var(--color-primary-500)]",
                    )}
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          item.isActive
                            ? "bg-[var(--color-primary-500)]/20 text-[var(--color-primary-500)]"
                            : "bg-[var(--color-neutral-600)] text-[var(--text-muted)]",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-[var(--glass-border-soft)]">
          <Typography variant="body-xs" className="text-[var(--text-muted)] text-center">
            © 2025 Disa AI · Mobile Studio Preview
          </Typography>
        </div>
      </div>
    </div>
  );
}

// Default Menu Items für die Navigation
export const defaultMenuSections: MenuSection[] = [
  {
    title: "Navigation",
    items: [
      { label: "Chat", href: "/" },
      { label: "Rollen", href: "/roles" },
      { label: "Modelle", href: "/models" },
      { label: "Einstellungen", href: "/settings" },
      { label: "API", href: "/api" },
      { label: "Verlauf", href: "/history" },
      { label: "Filter", href: "/filters" },
      { label: "Darstellung", href: "/appearance" },
      { label: "Daten", href: "/data" },
    ],
  },
  {
    title: "Sekundäre Seiten",
    items: [
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
    ],
  },
];

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
        "relative p-2 rounded-lg text-[var(--text-secondary)]",
        "hover:text-[var(--text-primary)] hover:bg-[var(--glass-border-soft)]/20",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 focus:ring-offset-[var(--bg-0)]",
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
