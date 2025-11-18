import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { isNavItemActive, PRIMARY_NAV_ITEMS } from "../../config/navigation";
import { X } from "../../lib/icons";
import { cn } from "../../lib/utils";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstNavItemRef = useRef<HTMLButtonElement>(null);

  // Focus management: Focus close button when drawer opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation: ESC closes drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap: Keep focus within drawer when open
  useEffect(() => {
    if (!isOpen) return;

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift+Tab: If on first element, go to last
        if (document.activeElement === firstElement && lastElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: If on last element, go to first
        if (document.activeElement === lastElement && firstElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleFocusTrap);
    return () => {
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleNavigation = (path: string) => {
    void navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw]",
          "bg-[var(--surface-card)] border-r border-[var(--glass-border-medium)]",
          "shadow-[var(--shadow-premium-strong)]",
          "flex flex-col",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--glass-border-soft)] px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Menü
            </p>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Navigation</h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className={cn(
              "flex min-h-[44px] min-w-[44px] items-center justify-center",
              "rounded-xl border border-[var(--glass-border-soft)]",
              "bg-[var(--surface)] text-[var(--text-secondary)]",
              "transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]",
            )}
            aria-label="Menü schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {PRIMARY_NAV_ITEMS.map((item, index) => {
              const isActive = isNavItemActive(item, location.pathname);
              const Icon = item.Icon;

              return (
                <li key={item.id}>
                  <button
                    ref={index === 0 ? firstNavItemRef : undefined}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3 rounded-xl",
                      "transition-all duration-200",
                      "min-h-[48px]",
                      isActive
                        ? [
                            "bg-[var(--aurora-primary-500)]/15",
                            "border border-[var(--aurora-primary-500)]/30",
                            "text-[var(--aurora-primary-400)]",
                            "shadow-[var(--shadow-glow-primary)]",
                          ]
                        : [
                            "bg-[var(--surface)]/50",
                            "border border-transparent",
                            "text-[var(--text-secondary)]",
                            "hover:bg-[var(--surface-soft)]",
                            "hover:border-[var(--glass-border-soft)]",
                            "hover:text-[var(--text-primary)]",
                          ],
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--glass-border-soft)] px-6 py-4">
          <div className="space-y-2">
            <button
              onClick={() => handleNavigation("/impressum")}
              className="w-full text-left text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2"
            >
              Impressum
            </button>
            <button
              onClick={() => handleNavigation("/datenschutz")}
              className="w-full text-left text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
