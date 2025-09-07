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
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-[#e5e7eb] backdrop-blur-md shadow-[0_0_18px_rgba(255,0,255,0.15)]">
        <span>App installieren für schnelleren Zugriff &amp; Offline-Nutzung.</span>
        <div className="flex gap-2">
          <button className="btn bg-transparent text-[#e5e7eb] hover:shadow-[0_0_16px_#00ffff55]" onClick={() => setHidden(true)} data-testid="install-later">
            Später
          </button>
          <button
            className="btn text-[#0a0a0a] bg-gradient-to-r from-[#ff00ff] to-[#00ffff] shadow-[0_0_18px_#ff00ff66] hover:shadow-[0_0_26px_#ff00ffaa]"
            onClick={async () => {
              await deferred.prompt();
              setHidden(true);
            }}
            data-testid="install-now"
          >
            Installieren
          </button>
        </div>
      </div>
    </div>
  );
}
