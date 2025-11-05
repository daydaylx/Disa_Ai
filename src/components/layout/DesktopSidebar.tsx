import { Bot, MessageCircle, Settings, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { path: "/chat", label: "Chat", icon: MessageCircle },
  { path: "/roles", label: "Rollen", icon: Users },
  { path: "/models", label: "Modelle", icon: Bot },
  { path: "/settings", label: "Einstellungen", icon: Settings },
];

export function DesktopSidebar() {
  const location = useLocation();
  const activePath =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.path ?? "/chat";

  return (
    <aside className="fixed top-0 left-0 z-50 h-full w-64 flex-col border-r border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-base)] shadow-[var(--shadow-neumorphic-lg)]">
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b border-[var(--border-neumorphic-subtle)] px-4">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Disa AI</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;

            return (
              <li key={`desktop-nav-${item.path}`}>
                <Link
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[var(--color-accent-surface)] text-[var(--color-text-on-accent)] shadow-[var(--shadow-glow-accent-subtle)] border border-[var(--color-accent-border)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--surface-neumorphic-raised)] hover:text-[var(--color-text-primary)] hover:shadow-[var(--shadow-neumorphic-sm)]",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border-neumorphic-subtle)] p-4">
        <div className="text-center text-xs text-[var(--color-text-muted)]">
          <p>Desktop Version</p>
          <p className="mt-1">Optimiert für große Bildschirme</p>
        </div>
      </div>
    </aside>
  );
}
