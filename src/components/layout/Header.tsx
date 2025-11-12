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
    <header className="sticky top-0 z-[50] border-b border-line bg-surface-glass/80 backdrop-blur-md shadow-1 pt-safe-top">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
            Disa AI Studio
          </span>
          <span className="hidden text-[11px] text-fg-muted sm:inline">
            Sicheres AI-Studio für produktive Chats
          </span>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-3 text-[10px] text-fg-muted sm:flex">
            <a href="/" className="hover:text-accent">
              Studio
            </a>
            <a href="/chat" className="hover:text-accent">
              Chat
            </a>
            <a href="/models" className="hover:text-accent">
              Modelle
            </a>
            <a href="/roles" className="hover:text-accent">
              Rollen
            </a>
            <a href="/settings" className="hover:text-accent">
              Einstellungen
            </a>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-fg shadow-1 transition-all duration-1 hover:bg-surface-glass hover:shadow-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Zum ${theme === "dark" ? "hellen" : "dunklen"} Modus wechseln`}
            title={`Zum ${theme === "dark" ? "hellen" : "dunklen"} Modus wechseln`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-fg shadow-1 transition-all duration-1 hover:bg-surface-glass hover:shadow-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:hidden"
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
