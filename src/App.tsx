import React from "react";

import ChatPanel from "@/features/chat/ChatPanel";
import SettingsSheet from "@/features/settings/SettingsSheet";
import { AppShell, SettingsContext } from "@/widgets/shell/AppShell";

export default function App() {
  const [openTab, setOpenTab] = React.useState<null | "api" | "model" | "style">(null);

  return (
    <SettingsContext.Provider value={(t)=>setOpenTab(t)}>
      <AppShell>
        <ChatPanel />
      </AppShell>
      {openTab && <SettingsSheet initial={openTab} onClose={()=>setOpenTab(null)} />}
    </SettingsContext.Provider>
  );
}
