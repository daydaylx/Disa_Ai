import React from "react";

const tabs = [
  { href: "#/chat", label: "Chat", testId: "nav-bottom-chat" },
  { href: "#/models", label: "Models", testId: "nav-bottom-models" },
  { href: "#/settings", label: "Settings", testId: "nav-bottom-settings" },
];

export default function NavBar() {
  const hash = typeof window !== "undefined" ? window.location.hash || "#/chat" : "#/chat";
  return (
    <nav
      className="safe-px safe-pb fixed bottom-0 left-0 right-0 z-50"
      style={{ height: "var(--bottom-nav-h)" }}
      aria-label="Main Navigation"
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
                "rounded-xl border px-3 py-3 text-center text-sm font-medium tracking-wide transition-all duration-300 ease-out",
                active
                  ? "border-accent-teal/50 bg-accent-teal/20 text-white shadow-lg shadow-accent-teal/25"
                  : "bg-glass-surface/12 border-glass-border/30 text-text-secondary/90 hover:border-glass-border/40 hover:bg-glass-surface/20 hover:text-text-primary/95",
              ].join(" ")}
              style={{ minHeight: 48 }}
              data-testid={t.testId}
            >
              <div className="flex items-center justify-center gap-1.5 text-sm font-medium tracking-wide">
                {t.label}
              </div>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
