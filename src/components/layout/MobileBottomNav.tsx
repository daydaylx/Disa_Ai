import { ChevronDown, ChevronUp, Cpu, Home, MessageSquare, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { cn } from "../../lib/utils";

// Typdefinition für die Navigationselemente
type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
};

const MobileBottomNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePath, setActivePath] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Navigationselemente mit Icons und Pfaden
  const navItems: NavItem[] = [
    {
      id: "studio",
      label: "Studio",
      icon: <Home className="w-5 h-5" />,
      path: "/studio",
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessageSquare className="w-5 h-5" />,
      path: "/chat",
    },
    {
      id: "models",
      label: "Modelle",
      icon: <Cpu className="w-5 h-5" />,
      path: "/models",
    },
    {
      id: "roles",
      label: "Rollen",
      icon: <Users className="w-5 h-5" />,
      path: "/roles",
    },
    {
      id: "settings",
      label: "Einstellungen",
      icon: <Settings className="w-5 h-5" />,
      path: "/settings",
    },
  ];

  // Aktiven Pfad setzen
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Navigation durchführen
  const handleNavigation = (path: string) => {
    void navigate(path);
    setIsExpanded(false);
  };

  // Toggle für erweiterte Navigation
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-base border-t border-line dark:bg-surface-base dark:border-line">
      {/* Haupt-Navigation */}
      <div className="flex justify-around items-center py-3 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-colors duration-200 min-w-[72px]",
              activePath === item.path
                ? "text-accent bg-accent/10"
                : "text-text-secondary hover:text-text-primary",
            )}
            aria-label={item.label}
          >
            <div className="mb-1 w-6 h-6">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Erweiterte Navigation (nur bei Bedarf) */}
      {isExpanded && (
        <div className="border-t border-line py-3 px-2">
          <div className="flex justify-around items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-colors duration-200 min-w-[72px]",
                  activePath === item.path
                    ? "text-accent bg-accent/10"
                    : "text-text-secondary hover:text-text-primary",
                )}
                aria-label={item.label}
              >
                <div className="mb-1 w-6 h-6">{item.icon}</div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle-Button für erweiterte Navigation */}
      <div className="flex justify-center py-2">
        <button
          onClick={toggleExpanded}
          className="p-2 rounded-full bg-surface-card text-text-secondary hover:bg-surface-muted transition-colors"
          aria-label={isExpanded ? "Navigation einklappen" : "Navigation erweitern"}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
