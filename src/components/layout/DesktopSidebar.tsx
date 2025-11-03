import { Link, useLocation } from "react-router-dom";

import { cn } from "../../lib/utils";
import { NAV_ITEMS } from "./GlobalNav";

export function DesktopSidebar() {
  const location = useLocation();
  const activePath =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.path ?? "/chat";

  return (
    <aside className="fixed top-0 left-0 z-50 h-full w-64 flex-col border-r border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-base)] p-4 shadow-[var(--shadow-neumorphic-lg)]">
      <div className="mb-8 flex items-center justify-center">
        <h1 className="text-xl font-bold text-text-primary">Disa AI</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <li key={`desktop-nav-${item.path}`}>
              <Link
                to={item.path}
                className={cn(
                  "group flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-text-secondary transition-colors",
                  activePath === item.path
                    ? "bg-[var(--color-accent-surface)] text-text-on-accent shadow-neo-sm"
                    : "hover:bg-[var(--surface-neumorphic-raised)] hover:text-text-primary",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
