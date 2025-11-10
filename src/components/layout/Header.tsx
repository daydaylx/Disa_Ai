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
    <header className="sticky top-0 z-[var(--z-header)] brand-aurora aurora-animated">
      <div className="header-shell">
        <div className="mx-auto max-w-screen-lg h-full px-4 flex items-center justify-between">
          <span className="text-[color:var(--text-secondary)] text-sm font-medium">Disa AI</span>
          <nav className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-lg bg-[color-mix(in_hsl,var(--surface-card)_80%,transparent)] text-[color:var(--text-primary)] hover:opacity-90 focus-visible:[box-shadow:var(--ring-outline)] transition-all duration-200 flex items-center justify-center"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              className="h-10 px-4 rounded-lg bg-[color:var(--accent)] text-black hover:opacity-90 focus-visible:[box-shadow:var(--ring-outline)] aurora-button-glow transition-all duration-200"
              aria-label="Neue Session"
            >
              Neu
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
