export function Header() {
  return (
    <header className="sticky top-0 z-[var(--z-header)] brand-aurora">
      <div className="header-shell">
        <div className="mx-auto max-w-screen-lg h-full px-4 flex items-center justify-between">
          <span className="text-[color:var(--text-secondary)] text-sm">Disa AI</span>
          <nav className="flex items-center gap-2">
            <button
              className="h-10 px-4 rounded-lg bg-[color:var(--accent)] text-black hover:opacity-90 focus-visible:[box-shadow:var(--ring-outline)]"
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
