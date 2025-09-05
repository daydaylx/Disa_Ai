import React from "react";
import { useOnlineStatus } from "../../lib/net/online";

export const NetworkBanner: React.FC = () => {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className="sticky top-0 z-40 w-full bg-amber-600 py-1 text-center text-sm text-amber-50">
      Offline – Eingaben werden gepuffert und gesendet, sobald wieder online.
    </div>
  );
};
