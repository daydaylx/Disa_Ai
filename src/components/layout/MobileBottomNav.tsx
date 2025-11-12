import { Link, useLocation } from "react-router-dom";

import { Brain, MessageSquare, Settings } from "../../lib/icons";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { path: "/chat", label: "Chat", icon: MessageSquare },
  { path: "/models", label: "Library", icon: Brain },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[40] border-t border-glass bg-surface-glass-floating/95 backdrop-blur-medium shadow-elevated"
      aria-label="Hauptnavigation"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-around gap-1 px-2 py-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex min-h-[56px] min-w-[64px] flex-1 flex-col items-center justify-center gap-1 rounded-[12px] px-3 py-2 text-xs font-medium transition-all duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)]",
                isActive
                  ? "text-accent shadow-glow-brand-subtle"
                  : "text-text-muted hover:bg-surface-glass-panel/50 hover:text-text-primary",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Icon mit optionalem Glow */}
              <Icon
                className={cn(
                  "h-6 w-6 transition-transform duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)]",
                  isActive && "scale-110",
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />

              {/* Label */}
              <span className="text-[11px] leading-tight">{item.label}</span>

              {/* Active Indicator (kleiner Punkt unter Icon) */}
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
