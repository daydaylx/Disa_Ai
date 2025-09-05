import React from "react";

export function NetworkBanner() {
  const [online, setOnline] = React.useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [show, setShow] = React.useState<boolean>(false);

  React.useEffect(() => {
    const on = () => {
      setOnline(true);
      setShow(false);
    };
    const off = () => {
      setOnline(false);
      setShow(true);
    };
    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    // Initial prüfen (Playwright offline toggle)
    if (!navigator.onLine) off();

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!show || online) return null;

  return (
    <div className="net-banner">
      <div
        data-testid="offline-banner"
        className="mx-auto mt-2 w-fit max-w-[92vw] rounded-lg bg-yellow-500/90 px-3 py-1 text-sm text-black shadow"
        role="status"
        aria-live="polite"
      >
        Offline – Eingaben werden gepuffert
      </div>
    </div>
  );
}

export default NetworkBanner;
