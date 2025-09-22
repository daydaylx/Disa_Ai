import React from "react";

const tabs = [
  { href: "#/chat", label: "Chat", icon: "💬", testId: "nav-bottom-chat" },
  { href: "#/models", label: "Modelle", icon: "🤖", testId: "nav-bottom-models" },
  { href: "#/settings", label: "Einstellungen", icon: "⚙️", testId: "nav-bottom-settings" },
];

export default function NavBar() {
  const hash = typeof window !== "undefined" ? window.location.hash || "#/chat" : "#/chat";
  return (
    <nav
      className="safe-px safe-pb fixed bottom-0 left-0 right-0 z-50"
      style={{ height: "var(--bottom-nav-h)" }}
      aria-label="Hauptnavigation"
    >
      <div className="glass grid grid-cols-3 gap-2 rounded-t-2xl p-2 shadow-md">
        {tabs.map((t) => {
          const active = hash.startsWith(t.href);
          return (
            <a
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={[
                "rounded-lg border border-white/10 px-2 py-2 text-center",
                active ? "bg-primary/25" : "bg-white/5 hover:bg-white/10",
              ].join(" ")}
              style={{ minHeight: 44 }}
              data-testid={t.testId}
            >
              <div className="text-sm">
                {t.icon} {t.label}
              </div>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
