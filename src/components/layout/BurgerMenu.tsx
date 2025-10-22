import { FileText, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { Button } from "../ui/button";

const legalItems = [
  { to: "/impressum", label: "Impressum", icon: FileText },
  { to: "/datenschutz", label: "Datenschutz", icon: FileText },
];

export function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close menu when clicking on a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Close menu when pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleTab);
    firstElement.focus();

    return () => {
      document.removeEventListener("keydown", handleTab);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
        className="h-10 w-10 rounded-full"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}

      {isOpen && (
        <div
          ref={menuRef}
          className="border-border fixed bottom-20 right-2 top-16 z-50 w-64 max-w-[90vw] rounded-xl border bg-surface-card shadow-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="menu-title"
        >
          <div className="p-1">
            <div className="border-border flex items-center justify-between border-b p-4">
              <h2 id="menu-title" className="text-lg font-semibold">
                Menü
              </h2>
              <Button variant="ghost" size="icon" onClick={closeMenu} aria-label="Menü schließen">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col gap-1 p-2">
              {legalItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--glass-focus-ring)] ${
                      isActive
                        ? "bg-[var(--glass-overlay-strong)] text-text-primary"
                        : "hover:bg-[var(--glass-overlay-muted)]"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
