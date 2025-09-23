import React from "react";

const tabs = [
  {
    href: "#/chat",
    label: "Chat",
    testId: "nav-bottom-chat",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8Z" />
      </svg>
    ),
  },
  {
    href: "#/models",
    label: "Models",
    testId: "nav-bottom-models",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z" />
      </svg>
    ),
  },
  {
    href: "#/settings",
    label: "Settings",
    testId: "nav-bottom-settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
      </svg>
    ),
  },
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
                "group transform rounded-xl border px-3 py-3 text-center text-sm font-medium tracking-wide transition-all duration-300 ease-out hover:scale-105",
                active
                  ? "scale-105 border-accent-teal/50 bg-accent-teal/20 text-white shadow-lg shadow-accent-teal/25"
                  : "bg-glass-surface/12 border-glass-border/30 text-text-secondary/90 hover:border-accent-teal/30 hover:bg-glass-surface/20 hover:text-text-primary/95 hover:shadow-md",
              ].join(" ")}
              style={{ minHeight: 48 }}
              data-testid={t.testId}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <div
                  className={`transition-all duration-200 ${active ? "text-white" : "text-text-secondary/80 group-hover:text-accent-teal/90"}`}
                >
                  {t.icon}
                </div>
                <span className="text-xs font-medium tracking-wide">{t.label}</span>
              </div>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
