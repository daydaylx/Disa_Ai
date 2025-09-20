import * as React from "react";

export function NetworkBanner() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Also check current status in case it changed before the listener was attached
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div
      data-testid="offline-banner"
      className="mx-auto mt-2 w-fit max-w-[92vw] rounded-full border border-border-strong bg-surface-100 px-3 py-1 text-sm text-text-secondary shadow-elev1"
      role="status"
      aria-live="polite"
    >
      Offline – Eingaben werden gepuffert
    </div>
  );
}

export default NetworkBanner;
