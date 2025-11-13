import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
  title: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
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
        <div className="flex flex-1 items-center gap-2">
          {/* Placeholder for Logo */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold">
            D
          </div>
          <span className="text-base font-semibold text-text-primary">Disa AI Studio</span>
        </div>

        <div className="flex flex-1 justify-center">
          <h1 className="hidden text-base font-medium text-text-primary sm:block">{title}</h1>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
