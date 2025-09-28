import React from "react";
export function RightDrawer() {
  return (
    <aside className="hidden shrink-0 border-l border-[hsl(var(--text-muted)/0.2)] bg-[hsl(var(--bg-elevated)/0.45)] lg:flex lg:w-[320px]">
      <div className="w-full p-4">
        <div className="u-card u-glass u-shadow-soft p-3">
          <h3 className="u-muted mb-2 text-sm">Personas & Styles</h3>
          <div className="space-y-2 text-sm">
            <div className="u-card p-2">Default</div>
            <div className="u-card p-2">Developer</div>
            <div className="u-card p-2">Creative</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
