export function SidebarLeft() {
  return (
    <aside className="hidden shrink-0 border-r border-[color:var(--color-corporate-border-secondary)] bg-[color:var(--color-corporate-bg-elevated)] md:flex md:w-[280px]">
      <div className="w-full p-3">
        <div className="u-card u-glass u-shadow-soft p-3">
          <div className="u-muted mb-2 text-sm text-[color:var(--color-corporate-text-muted)]">
            Threads
          </div>
          <div className="mb-4">
            <input
              type="search"
              placeholder="Suche..."
              className="w-full rounded-md border border-[color:var(--color-corporate-border-secondary)] bg-[color:var(--color-corporate-bg-card)] p-2 text-[color:var(--color-corporate-text-primary)] placeholder:text-[color:var(--color-corporate-text-muted)]"
            />
          </div>
          <ul className="space-y-2 text-sm">
            <li className="u-card hover:u-ring cursor-pointer bg-[color:var(--color-corporate-bg-card)] p-2 text-[color:var(--color-corporate-text-primary)] transition hover:bg-[color:var(--color-corporate-bg-hover)]">
              Willkommen
            </li>
            <li className="u-card hover:u-ring cursor-pointer bg-[color:var(--color-corporate-bg-card)] p-2 text-[color:var(--color-corporate-text-primary)] transition hover:bg-[color:var(--color-corporate-bg-hover)]">
              UI‑Umbau
            </li>
            <li className="u-card hover:u-ring cursor-pointer bg-[color:var(--color-corporate-bg-card)] p-2 text-[color:var(--color-corporate-text-primary)] transition hover:bg-[color:var(--color-corporate-bg-hover)]">
              Experimente
            </li>
          </ul>
        </div>
        <div className="u-card u-glass u-shadow-soft mt-4 p-3">
          <div className="u-muted mb-2 text-sm text-[color:var(--color-corporate-text-muted)]">
            Pins
          </div>
          <ul className="space-y-2 text-sm">
            <li className="u-card hover:u-ring cursor-pointer bg-[color:var(--color-corporate-bg-card)] p-2 text-[color:var(--color-corporate-text-primary)] transition hover:bg-[color:var(--color-corporate-bg-hover)]">
              Wichtiger Thread
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
