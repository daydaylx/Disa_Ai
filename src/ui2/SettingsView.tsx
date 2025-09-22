import React, { useEffect, useState } from "react";

import SettingsRoles from "./settings/SettingsRoles";
import SettingsStyle from "./settings/SettingsStyle";

type TabKey = "general" | "style" | "roles" | "app";

export default function SettingsView() {
  const [tab, setTab] = useState<TabKey>("roles");

  useEffect(() => {
    const h = window.location.hash;
    const anchor = h.split("#")[2];
    if (anchor === "style") setTab("style");
    if (anchor === "roles") setTab("roles");
  }, []);

  return (
    <div className="flex h-full flex-col">
      <header className="safe-pt safe-px sticky top-0 z-10">
        <div className="glass flex items-center justify-between rounded-xl px-3 py-2 shadow-sm">
          <div>
            <div className="text-sm text-muted/80">Einstellungen</div>
            <h1 className="text-base font-semibold">Stile & Rollen</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("roles")}
              className={
                "rounded-lg border px-2 py-1 " + (tab === "roles" ? "bg-primary/25" : "bg-white/5")
              }
            >
              Rollen
            </button>
            <button
              onClick={() => setTab("style")}
              className={
                "rounded-lg border px-2 py-1 " + (tab === "style" ? "bg-primary/25" : "bg-white/5")
              }
            >
              Stile
            </button>
          </div>
        </div>
      </header>

      <main className="safe-px with-bottomnav flex-1 overflow-y-auto pt-3">
        {tab === "roles" && <SettingsRoles />}
        {tab === "style" && <SettingsStyle />}
        {tab === "general" && <div className="text-sm text-muted/80">Allgemein folgt.</div>}
        {tab === "app" && <div className="text-sm text-muted/80">App-Settings folgt.</div>}
      </main>
    </div>
  );
}
