import React from "react";
import { useSettings } from "@/entities/settings/store";
import { PersonaContext } from "@/entities/persona";
import { Button } from "@/shared/ui/Button";

export const SettingsContext = React.createContext<(tab: "api"|"model"|"style") => void>(()=>{});

export function AppShell({ children }: { children: React.ReactNode }) {
  const settings = useSettings();
  const persona = React.useContext(PersonaContext);
  const open = React.useContext(SettingsContext);

  const styleName = React.useMemo(() => {
    return persona.data.styles.find(x => x.id === settings.personaId)?.name ?? "Stil wählen";
  }, [persona.data.styles, settings.personaId]);

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur border-b border-black/10 dark:border-white/10">
        <div className="px-3 py-2 flex items-center gap-2">
          <Button variant="outline" className="max-w-[38vw] truncate" onClick={()=>open("model")} title={settings.modelId ?? "Modell wählen"}>
            {settings.modelId ?? "Modell"}
          </Button>
          <Button variant="outline" className="max-w-[38vw] truncate" onClick={()=>open("style")} title={styleName}>
            {styleName}
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" onClick={()=>open("api")} aria-label="API-Key">API</Button>
        </div>
      </header>
      <main className="flex-1 min-h-0">{children}</main>
    </div>
  );
}
