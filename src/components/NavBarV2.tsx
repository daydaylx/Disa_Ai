import React from "react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  {
    to: "/",
    label: "Chat",
    testId: "nav-bottom-chat-v2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8Z" />
      </svg>
    ),
  },
  {
    to: "/models",
    label: "Modelle",
    testId: "nav-bottom-models-v2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z" />
      </svg>
    ),
  },
  {
    to: "/settings",
    label: "Einstellungen",
    testId: "nav-bottom-settings-v2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
      </svg>
    ),
  },
];

export function NavBarV2() {
  const location = useLocation();

  return (
    <nav
      className="safe-px safe-pb fixed bottom-0 left-0 right-0 z-50"
      style={{ height: "var(--bottom-nav-h)" }}
      aria-label="Main Navigation V2"
    >
      {/* Enhanced glass morphism background with stronger blur */}
      <div className="glass-backdrop-strong grid grid-cols-3 gap-3 rounded-t-2xl p-3 shadow-elevated backdrop-blur-xl">
        {tabs.map((t) => {
          const active = location.pathname === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              data-testid={t.testId}
              className={`
                group relative flex flex-col items-center justify-center space-y-1
                rounded-xl px-3 py-2 transition-all duration-200 ease-in-out
                hover:scale-105 active:scale-95
                ${active
                  ? "bg-accent/20 text-accent shadow-aurora-violet"
                  : "text-glass-text-muted hover:bg-glass-bg-medium hover:text-glass-text-medium"
                }
              `}
            >
              {/* Enhanced active indicator */}
              {active && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/10 to-purple/10 animate-pulse" />
              )}

              {/* Icon with improved animations */}
              <div className={`
                relative transition-all duration-200
                ${active ? "scale-110" : "group-hover:scale-105"}
              `}>
                {t.icon}
              </div>

              {/* Label with better typography */}
              <span className="text-xs font-medium leading-none">
                {t.label}
              </span>

              {/* Active dot indicator */}
              {active && (
                <div className="absolute -top-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-accent shadow-aurora-violet animate-fade-in" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}