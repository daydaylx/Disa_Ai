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
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#232832]/80 px-3 py-2 text-sm text-[#B0B6C0] backdrop-blur-md shadow-[0_0_14px_rgba(79,195,247,0.25)]">
        <span>App installieren für schnelleren Zugriff &amp; Offline-Nutzung.</span>
        <div className="flex gap-2">
          <button className="btn bg-transparent text-[#F0F2F5] hover:bg-white/5" onClick={() => setHidden(true)} data-testid="install-later">
            Später
          </button>
          <button
            className="btn text-[#0a0a0a] bg-gradient-to-r from-[#4FC3F7] to-[#A78BFA] shadow-[0_0_14px_rgba(79,195,247,0.35)] hover:shadow-[0_0_18px_rgba(79,195,247,0.45)]"
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
