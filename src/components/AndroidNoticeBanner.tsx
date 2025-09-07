import React from "react";

function isAndroidUA() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent || "");
}

const KEY = "disa:dismiss:android-notice";

export default function AndroidNoticeBanner() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    try {
      const dismissed = localStorage.getItem(KEY) === "1";
      if (!isAndroidUA() && !dismissed) setShow(true);
    } catch (e) {
      void e;
      // ignore
    }
  }, []);

  if (!show) return null;

  return (
    <div className="net-banner" data-testid="android-notice">
      <div
        className="mx-auto mt-2 flex w-fit max-w-[92vw] items-center gap-3 rounded-lg bg-blue-500/90 px-3 py-1 text-sm text-black shadow"
        role="status"
        aria-live="polite"
      >
        <span>Optimiert für Android (mobil).</span>
        <button
          className="rounded-md border border-black/20 bg-black/10 px-2 py-0.5 text-xs"
          onClick={() => {
            try { localStorage.setItem(KEY, "1"); } catch (e) { void e; }
            setShow(false);
          }}
          aria-label="Hinweis schließen"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
