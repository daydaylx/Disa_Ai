import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "./Button";

export function KeyGuard({ children }: React.PropsWithChildren) {
  const nav = useNavigate();
  const key = typeof localStorage !== "undefined" ? localStorage.getItem("disa_api_key") : null;
  if (!key) {
    return (
      <div className="p-5 rounded-2xl border border-white/10 bg-[#12121A]/80">
        <div className="text-lg font-semibold mb-1">API-Key fehlt</div>
        <div className="text-sm text-zinc-400 mb-3">
          Hinterlege deinen OpenRouter API-Key unter <b>Einstellungen</b>, sonst kann der Chat nicht
          antworten.
        </div>
        <Button onClick={() => nav("/settings")}>Zu Einstellungen</Button>
      </div>
    );
  }
  return <>{children}</>;
}
