import { Home, MessageSquare, Settings, Sparkles, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { cn } from "../../lib/utils";

// Typdefinition für die Navigationselemente
type NavItem = {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  activePattern?: RegExp;
};

export function EnhancedBottomNav() {
  const [activePath, setActivePath] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Navigationselemente mit Icons und Pfaden
  const navItems: NavItem[] = [
    {
      id: "studio",
      label: "Studio",
      icon: <Home className="w-6 h-6" />,
      path: "/studio",
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessageSquare className="w-6 h-6" />,
      path: "/chat",
      activePattern: /^\/chat/,
    },
    {
      id: "discover",
      label: "Entdecken",
      icon: <Sparkles className="w-6 h-6" />,
      path: "/models",
    },
    {
      id: "roles",
      label: "Rollen",
      icon: <Users className="w-6 h-6" />,
      path: "/roles",
      activePattern: /^\/roles/,
    },
    {
      id: "settings",
      label: "Einstellungen",
      icon: <Settings className="w-6 h-6" />,
      path: "/settings",
      activePattern: /^\/settings/,
    },
  ];

  // Aktiven Pfad setzen
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Navigation durchführen
  const handleNavigation = (path: string) => {
    void navigate(path);
  };

  // Prüfen, ob ein Navigationspunkt aktiv ist
  const isItemActive = (item: NavItem) => {
    if (item.activePattern) {
      return item.activePattern.test(activePath);
    }
    return activePath === item.path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-glass border-t border-line backdrop-blur-xl">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const isActive = isItemActive(item);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-[70px] relative",
                isActive ? "text-accent" : "text-text-secondary hover:text-text-primary",
              )}
              aria-label={item.label}
            >
              {/* Aktiv-Indikator */}
              {isActive && (
                <div className="absolute inset-x-2 top-0 h-1 rounded-b-full bg-accent" />
              )}

              <div
                className={cn(
                  "mb-1 transition-transform duration-200",
                  isActive ? "scale-110" : "scale-100",
                )}
              >
                {item.icon}
              </div>

              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "font-semibold" : "font-normal",
                )}
              >
                {item.label}
              </span>

              {/* Glaseffekt für aktive Elemente */}
              {isActive && <div className="absolute inset-0 rounded-xl bg-accent/10" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
