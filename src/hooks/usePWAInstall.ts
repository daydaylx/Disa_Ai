import * as React from "react";

/** Chromium-spezifisches Event (nicht in lib.dom.d.ts) */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
}

/** Navigator-Erweiterung für iOS Standalone */
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

const LS_KEY_DISMISSED = "disa:pwa:dismissed";

function isStandalone(): boolean {
  try {
    if (navigator.standalone) return true;
  } catch {
    // absichtlich ignoriert
    void 0;
  }
  try {
    return window.matchMedia("(display-mode: standalone)").matches;
  } catch {
    return false;
  }
}
function isIOS(): boolean {
  const ua = navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua);
}

export function usePWAInstall() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = React.useState<boolean>(() => isStandalone());
  const [dismissed, setDismissed] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem(LS_KEY_DISMISSED) === "true";
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    if (isStandalone()) setInstalled(true);

    const onBeforeInstall = (e: Event) => {
      const be = e as BeforeInstallPromptEvent;
      if (typeof be.prompt === "function") {
        e.preventDefault();
        setDeferred(be);
      }
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function requestInstall() {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome !== "accepted") {
        try {
          localStorage.setItem(LS_KEY_DISMISSED, "true");
        } catch {
          // ignore storage errors
          void 0;
        }
        setDismissed(true);
      }
    } catch {
      try {
        localStorage.setItem(LS_KEY_DISMISSED, "true");
      } catch {
        // ignore storage errors
        void 0;
      }
      setDismissed(true);
    } finally {
      setDeferred(null);
    }
  }

  function dismiss() {
    try {
      localStorage.setItem(LS_KEY_DISMISSED, "true");
    } catch {
      // ignore storage errors
      void 0;
    }
    setDismissed(true);
  }

  const canInstall = !!deferred && !installed && !dismissed && !isIOS(); // Chromium prompt()
  const showIOSHowTo = isIOS() && !installed && !dismissed; // iOS: kein prompt()
  const visible = canInstall || showIOSHowTo; // Banner-Sichtbarkeit
  const canPrompt = canInstall; // Alias für Alt-Code

  return {
    // neue Felder
    canInstall,
    installed,
    dismissed,
    requestInstall,
    dismiss,
    // Abwärtskompatibilität
    visible,
    canPrompt,
    showIOSHowTo,
  } as const;
}
