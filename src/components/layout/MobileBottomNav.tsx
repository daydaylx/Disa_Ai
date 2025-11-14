import { Link, useLocation } from "react-router-dom";

import { Brain, MessageSquare, Settings, Sparkles } from "../../lib/icons";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { path: "/", label: "Studio", icon: Sparkles },
  { path: "/chat", label: "Chat", icon: MessageSquare },
  { path: "/models", label: "Modelle", icon: Brain },
  { path: "/settings", label: "Einstellungen", icon: Settings },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-glass/95 backdrop-blur-lg shadow-2"
      aria-label="Hauptnavigation"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-around gap-1 px-2 py-2 pb-safe-bottom">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex min-h-[56px] min-w-[64px] flex-1 flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-1",
                isActive
                  ? "text-accent shadow-glow-accent"
                  : "text-fg-muted hover:bg-surface/50 hover:text-fg",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "icon-std transition-transform duration-1",
                  isActive && "scale-110 text-accent",
                )}
              />
              <span className="text-[11px] leading-tight">{item.label}</span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
