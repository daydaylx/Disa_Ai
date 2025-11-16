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
      className="fixed top-4 left-1/2 z-[var(--z-toast)] -translate-x-1/2 bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)] border border-[var(--aurora-lila-400)] rounded-3xl px-6 py-3 text-sm font-medium shadow-[var(--shadow-glow-lila)] animate-pulse-glow hover:bg-[var(--glass-surface-strong)] hover:backdrop-blur-[var(--backdrop-blur-strong)] hover:border-[var(--glass-border-aurora)] hover:shadow-[var(--shadow-glow-primary)] hover:scale-[1.02] transition-all duration-300 ease-[var(--motion-ease-elastic)]"
      role="status"
      aria-live="polite"
      aria-label="Offline-Status"
    >
      📶 Offline – Eingaben werden lokal gepuffert
    </div>
  );
}

export default NetworkBanner;
