import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "./ui/Button";

export function KeyGuard({ children }: React.PropsWithChildren) {
  const nav = useNavigate();
  const key = typeof localStorage !== "undefined" ? localStorage.getItem("disa_api_key") : null;
  if (!key) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#12121A]/80 p-5">
        <div className="mb-1 text-lg font-semibold">API-Key fehlt</div>
        <div className="mb-3 text-sm text-zinc-400">
          Hinterlege deinen OpenRouter API-Key unter <b>Einstellungen</b>, sonst kann der Chat nicht
          antworten.
        </div>
        <Button onClick={() => nav("/settings")}>Zu Einstellungen</Button>
      </div>
    );
  }
  return <>{children}</>;
}
