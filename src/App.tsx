import React from "react";
import ChatPanel from "@/features/chat/ChatPanel";
import { Header } from "@/components/Header";
import SettingsSheet from "@/features/settings/SettingsSheet";
import { PersonaProvider } from "@/entities/persona";
import { ClientProvider } from "@/lib/client";
import { ToastProvider } from "@/shared/ui/Toast";

export default function App() {
  const [open, setOpen] = React.useState<null | "api" | "model" | "style">(null);

  return (
    <PersonaProvider>
      <ClientProvider>
        <ToastProvider>
          <div className="flex flex-col h-dvh">
            <Header onOpenSettings={(t)=>setOpen(t ?? "api")} />
            <div className="flex-1">
              <ChatPanel />
            </div>
          </div>
          {open && <SettingsSheet initial={open} onClose={()=>setOpen(null)} />}
        </ToastProvider>
      </ClientProvider>
    </PersonaProvider>
  );
}
