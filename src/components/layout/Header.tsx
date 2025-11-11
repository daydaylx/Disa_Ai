import { useEffect, useState } from "react";

export function Header() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Initialize theme from localStorage or system preference
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
    <header className="sticky top-0 z-header bg-surface-base/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 lg:h-16">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold tracking-wide text-accent">DISA AI</span>
          <span className="hidden text-[11px] text-text-secondary sm:inline">
            Sicheres AI-Studio für produktive Chats
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-muted text-text-primary shadow-neo-xs transition-colors hover:bg-surface-muted/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Zum ${theme === "dark" ? "hellen" : "dunklen"} Modus wechseln`}
            title={`Zum ${theme === "dark" ? "hellen" : "dunklen"} Modus wechseln`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
