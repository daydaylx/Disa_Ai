import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/chat": "Chat",
  "/models": "Modelle",
  "/roles": "Rollen",
  "/impressum": "Impressum",
  "/datenschutz": "Datenschutz",
};

export function TopAppBar() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "Disa AI";

  return (
    <header className="app-header bg-surface-base/90 fixed top-0 z-20 w-full border-b border-border backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[var(--max-content-width)] items-center justify-between px-4">
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
        {/* Placeholder for actions like settings */}
        <div className="touch-target w-10 h-10"></div>
      </div>
    </header>
  );
}