import * as React from "react";

export function NetworkBanner() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Only update if the value has actually changed to prevent test issues
    const currentOnlineStatus = navigator.onLine;
    if (currentOnlineStatus !== isOnline) {
      setIsOnline(currentOnlineStatus);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]); // Include isOnline to prevent unnecessary updates

  if (isOnline) {
    return null;
  }

  return (
    <div
      data-testid="offline-banner"
      className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transform animate-pulse rounded-full border border-red-400/30 bg-red-900/20 px-4 py-2 text-sm text-red-200 backdrop-blur-sm transition-all duration-300 ease-in-out"
      role="status"
      aria-live="polite"
      aria-label="Offline-Status"
    >
      📶 Offline – Eingaben werden gepuffert
    </div>
  );
}

export default NetworkBanner;
