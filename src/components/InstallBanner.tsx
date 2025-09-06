import React, { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onBefore = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBefore as any);
    return () => window.removeEventListener("beforeinstallprompt", onBefore as any);
  }, []);

  if (hidden || !deferred) return null;

  return (
    <div className="mx-auto mb-2 w-full max-w-3xl">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 py-2 text-sm text-neutral-200 shadow-soft backdrop-blur">
        <span>App installieren für schnelleren Zugriff &amp; Offline-Nutzung.</span>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={() => setHidden(true)}>
            Später
          </button>
          <button
            className="btn btn-primary"
            onClick={async () => {
              await deferred.prompt();
              setHidden(true);
            }}
          >
            Installieren
          </button>
        </div>
      </div>
    </div>
  );
}
