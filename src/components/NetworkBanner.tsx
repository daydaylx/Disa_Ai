import React from "react";
import { useOnline } from "../hooks/useOnline";

export function NetworkBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div className="w-full bg-orange-900/80 text-orange-100 text-sm text-center py-2 border-b border-orange-700/50">
      Offline – Prüfe deine Verbindung. Senden ist vorübergehend deaktiviert.
    </div>
  );
}
