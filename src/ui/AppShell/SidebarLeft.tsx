import React from "react";
export function SidebarLeft() {
  return (
    <aside className="hidden shrink-0 border-r border-outline bg-surface-variant md:flex md:w-[280px]">
      <div className="w-full p-3">
        <div className="u-card u-glass u-shadow-soft p-3">
          <div className="u-muted mb-2 text-sm text-on-surface/70">Threads</div>
          <div className="mb-4">
            <input
              type="search"
              placeholder="Suche..."
              className="w-full rounded-md border border-outline bg-surface p-2 text-on-surface"
            />
          </div>
          <ul className="space-y-2 text-sm">
            <li className="u-card hover:u-ring cursor-pointer bg-surface-variant p-2 text-on-surface">
              Willkommen
            </li>
            <li className="u-card hover:u-ring cursor-pointer bg-surface-variant p-2 text-on-surface">
              UI‑Umbau
            </li>
            <li className="u-card hover:u-ring cursor-pointer bg-surface-variant p-2 text-on-surface">
              Experimente
            </li>
          </ul>
        </div>
        <div className="u-card u-glass u-shadow-soft mt-4 p-3">
          <div className="u-muted mb-2 text-sm text-on-surface/70">Pins</div>
          <ul className="space-y-2 text-sm">
            <li className="u-card hover:u-ring cursor-pointer bg-surface-variant p-2 text-on-surface">
              Wichtiger Thread
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
