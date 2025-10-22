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
      className="border-danger/30 bg-danger/20 text-danger fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transform animate-pulse rounded-full border px-4 py-2 text-sm"
      role="status"
      aria-live="polite"
      aria-label="Offline-Status"
    >
      📶 Offline – Eingaben werden gepuffert
    </div>
  );
}

export default NetworkBanner;
