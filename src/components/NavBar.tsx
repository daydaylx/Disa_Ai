import React from "react";

const tabs = [
  { href: "#/chat", label: "Chat", testId: "nav-bottom-chat" },
  { href: "#/models", label: "Modelle", testId: "nav-bottom-models" },
  { href: "#/settings", label: "Einstellungen", testId: "nav-bottom-settings" },
];

export default function NavBar() {
  const hash = typeof window !== "undefined" ? window.location.hash || "#/chat" : "#/chat";
  return (
    <nav
      className="safe-px safe-pb fixed bottom-0 left-0 right-0 z-50"
      style={{ height: "var(--bottom-nav-h)" }}
      aria-label="Hauptnavigation"
    >
      <div className="glass glass-depth-3 grid grid-cols-3 gap-2 rounded-t-2xl p-2 shadow-glass">
        {tabs.map((t) => {
          const active = hash.startsWith(t.href);
          return (
            <a
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={[
                "rounded-xl border px-2 py-2 text-center text-sm transition-colors",
                active
                  ? "border-accent-teal/45 bg-accent-teal/15 text-text-primary"
                  : "bg-glass-surface/12 hover:bg-glass-surface/18 border-glass-border/25 text-text-secondary/90",
              ].join(" ")}
              style={{ minHeight: 44 }}
              data-testid={t.testId}
            >
              <div className="flex items-center justify-center gap-1 text-sm">{t.label}</div>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
