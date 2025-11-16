import * as React from "react";

export function NetworkBanner() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const currentOnlineStatus = navigator.onLine;
    if (currentOnlineStatus !== isOnline) {
      setIsOnline(currentOnlineStatus);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  if (isOnline) {
    return null;
  }

  return (
    <div
      data-testid="offline-banner"
      className="fixed top-4 left-1/2 z-[var(--z-toast)] -translate-x-1/2 glass-panel--glow-lila rounded-3xl px-6 py-3 text-sm font-medium shadow-glow-lila animate-pulse-glow hover:glass-panel--glow hover:shadow-glow-primary hover:scale-[1.02] transition-all duration-300 ease-[var(--motion-ease-elastic)] border-glass-strong"
      role="status"
      aria-live="polite"
      aria-label="Offline-Status"
    >
      📶 Offline – Eingaben werden lokal gepuffert
    </div>
  );
}

export default NetworkBanner;
