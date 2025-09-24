import React from "react";

export const OfflineBanner: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-white/20 bg-danger-500/10 p-3 text-sm text-white/90"
    >
      Du bist offline. Aktionen werden ggf. fehlschlagen, bis die Verbindung zurück ist.
    </div>
  );
};
