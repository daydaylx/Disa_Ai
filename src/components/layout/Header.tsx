import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("aurora-theme") as "dark" | "light" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    updateTheme(initialTheme);
  }, []);

  const updateTheme = (newTheme: "dark" | "light") => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("aurora-theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  return (
    <header className="sticky top-0 z-header border-b border-line-subtle bg-surface-base/96 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 lg:h-16">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
            Disa AI Studio
          </span>
          <span className="hidden text-[11px] text-text-secondary sm:inline">
            Sicheres AI-Studio fr produktive Chats
          </span>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-3 text-[10px] text-text-secondary sm:flex">
            <a href="/" className="hover:text-accent-soft">
              Studio
            </a>
            <a href="/chat" className="hover:text-accent-soft">
              Chat
            </a>
            <a href="/models" className="hover:text-accent-soft">
              Modelle
            </a>
            <a href="/roles" className="hover:text-accent-soft">
              Rollen
            </a>
            <a href="/settings" className="hover:text-accent-soft">
              Einstellungen
            </a>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-muted text-text-primary shadow-neo-xs transition-colors hover:bg-surface-muted/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Zum ${theme === "dark" ? "hellen" : "dunklen"} Modus wechseln`}
            title={`Zum ${theme === "dark" ? "hellen" : "dunklen"} Modus wechseln`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-muted text-text-primary shadow-neo-xs transition-colors hover:bg-surface-muted/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:hidden"
            aria-label="Hauptmenü öffnen"
          >
            <span className="block h-0.5 w-4 rounded bg-current" />
            <span className="mt-0.5 block h-0.5 w-4 rounded bg-current" />
            <span className="mt-0.5 block h-0.5 w-4 rounded bg-current" />
          </button>
        </div>
      </div>
    </header>
  );
}
