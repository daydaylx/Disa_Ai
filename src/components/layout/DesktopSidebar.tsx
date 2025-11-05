import { Link, useLocation } from "react-router-dom";
import UseAnimations from "react-useanimations";
import bot from "react-useanimations/lib/infinity";
import messageCircle from "react-useanimations/lib/messageCircle";
import settings from "react-useanimations/lib/settings";
import users from "react-useanimations/lib/users";

import { useChat } from "../../hooks/useChat";
import { cn } from "../../lib/utils";
import { ModelSelect } from "../ui/ModelSelect";
import Ripple from "../ui/Ripple";
import { RoleSelect } from "../ui/RoleSelect";

const NAV_ITEMS = [
  { path: "/chat", label: "Chat", icon: messageCircle },
  { path: "/roles", label: "Rollen", icon: users },
  { path: "/models", label: "Modelle", icon: bot },
  { path: "/settings", label: "Einstellungen", icon: settings },
];

export function DesktopSidebar() {
  const location = useLocation();
  const { model, setModel, role, setRole } = useChat();
  const activePath =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.path ?? "/chat";

  return (
    <aside className="fixed top-0 left-0 z-50 h-full w-64 flex-col border-r border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-base)] shadow-[var(--shadow-neumorphic-lg)]">
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b border-[var(--border-neumorphic-subtle)] px-4">
        <h1 className="text-headline">Disa AI</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activePath === item.path;

            return (
              <li key={`desktop-nav-${item.path}`}>
                <Link
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg p-3 font-medium transition-all duration-200 text-body relative",
                    isActive
                      ? "bg-[var(--color-accent-surface)] text-[var(--color-text-on-accent)] shadow-[var(--shadow-glow-accent-subtle)] border border-[var(--color-accent-border)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--surface-neumorphic-raised)] hover:text-[var(--color-text-primary)] hover:shadow-[var(--shadow-neumorphic-sm)]",
                  )}
                >
                  <UseAnimations animation={item.icon} size={20} />
                  <span>{item.label}</span>
                  <Ripple />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Model and Role Selection */}
      <div className="p-4 space-y-4">
        <ModelSelect model={model} setModel={setModel} />
        <RoleSelect role={role} setRole={setRole} />
      </div>

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
