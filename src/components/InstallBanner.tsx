import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onBefore = (e: Event) => {
      // vor iOS 16.4 nicht standardisiert, daher manuell typisieren
      const be = e as BeforeInstallPromptEvent;
      be.prompt?.bind?.(be);
      e.preventDefault?.();
      setDeferred(be);
    };
    window.addEventListener("beforeinstallprompt", onBefore);
    return () => window.removeEventListener("beforeinstallprompt", onBefore);
  }, []);

  if (hidden || !deferred) return null;

  return (
    <div className="mx-auto mb-2 w-full max-w-3xl">
      <div className="card flex items-center justify-between gap-3 text-sm text-text-secondary">
        <span>App installieren für schnelleren Zugriff &amp; Offline-Nutzung.</span>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setHidden(true)}
            data-testid="install-later"
          >
            Später
          </button>
          <button
            className="btn btn-primary btn-sm"
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
