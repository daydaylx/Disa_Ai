import React from "react";
export function SidebarLeft() {
  return (
    <aside className="hidden shrink-0 border-r border-[hsl(var(--text-muted)/0.2)] bg-[hsl(var(--bg-elevated)/0.5)] md:flex md:w-[280px]">
      <div className="w-full p-3">
        <div className="u-card u-glass u-shadow-soft p-3">
          <div className="u-muted mb-2 text-sm">Threads</div>
          <ul className="space-y-2 text-sm">
            <li className="u-card hover:u-ring cursor-pointer p-2">Welcome</li>
            <li className="u-card hover:u-ring cursor-pointer p-2">UI‑Umbau</li>
            <li className="u-card hover:u-ring cursor-pointer p-2">Experimente</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
