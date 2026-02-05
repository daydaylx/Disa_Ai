import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

const STORAGE_KEY_DISMISSED = "pwa-install-dismissed";
const STORAGE_KEY_OUTCOME = "pwa-install-outcome";
const COOLDOWN_DAYS = 7;

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(display-mode: standalone)").matches;
  } catch {
    return false;
  }
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua);
}

function checkCooldown(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const dismissedDate = localStorage.getItem(STORAGE_KEY_DISMISSED);
    if (!dismissedDate) return false;

    const dismissedTime = new Date(dismissedDate).getTime();
    const cooldownTime = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() - dismissedTime < cooldownTime;
  } catch {
    return false;
  }
}

interface UsePWAInstallResult {
  isStandalone: boolean;
  canInstall: boolean;
  isIOS: boolean;
  showPrompt: boolean;
  installed: boolean;
  triggerInstall: () => Promise<"accepted" | "dismissed">;
  dismiss: (outcome?: "accepted" | "dismissed") => void;
  hasUserInteracted: boolean;
}

export function usePWAInstall(): UsePWAInstallResult {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  const standalone = isStandalone();
  const ios = isIOS();

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (standalone) {
      setInstalled(true);
      setCanInstall(false);
      setShowPrompt(false);
      return undefined;
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setCanInstall(true);
    };

    const appInstalledHandler = () => {
      setInstalled(true);
      setCanInstall(false);
      setInstallPromptEvent(null);
      setShowPrompt(false);
    };

    window.addEventListener("beforeinstallprompt", handler as any);
    window.addEventListener("appinstalled", appInstalledHandler);

    const scrollHandler = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }
    };

    const clickHandler = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }
    };

    const options = { passive: true };
    window.addEventListener("scroll", scrollHandler, options);
    window.addEventListener("click", clickHandler, options);

    let showTimer: number;

    const checkShouldShow = () => {
      if (checkCooldown()) {
        setShowPrompt(false);
        return;
      }

      if (ios || canInstall) {
        showTimer = window.setTimeout(() => {
          setShowPrompt(true);
        }, 5000);
      }
    };

    if (canInstall) {
      checkShouldShow();
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as any);
      window.removeEventListener("appinstalled", appInstalledHandler);
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("click", clickHandler);
      if (showTimer) clearTimeout(showTimer);
    };
  }, [standalone, hasUserInteracted, canInstall, ios]);

  useEffect(() => {
    if (
      hasUserInteracted &&
      !showPrompt &&
      (ios || canInstall) &&
      !checkCooldown() &&
      !standalone
    ) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [hasUserInteracted, ios, canInstall, standalone, showPrompt]);

  const dismiss = useCallback((outcome?: "accepted" | "dismissed") => {
    setShowPrompt(false);
    setHasUserInteracted(true);

    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + COOLDOWN_DAYS);
      localStorage.setItem(STORAGE_KEY_DISMISSED, expiryDate.toISOString());

      if (outcome) {
        localStorage.setItem(STORAGE_KEY_OUTCOME, outcome);
      }
    } catch {
      console.error("[PWA] Failed to save dismiss state to localStorage");
    }
  }, []);

  const triggerInstall = useCallback(async (): Promise<"accepted" | "dismissed"> => {
    if (!installPromptEvent) {
      return "dismissed";
    }

    try {
      await installPromptEvent.prompt();
      const { outcome } = await installPromptEvent.userChoice;

      if (outcome === "accepted") {
        setInstalled(true);
        setCanInstall(false);
        setInstallPromptEvent(null);
        setShowPrompt(false);
      } else {
        dismiss("dismissed");
      }

      return outcome;
    } catch (error) {
      console.error("[PWA] Installation prompt failed:", error);
      dismiss("dismissed");
      return "dismissed";
    }
  }, [installPromptEvent, dismiss]);

  return {
    isStandalone: standalone,
    canInstall,
    isIOS: ios,
    showPrompt: showPrompt && !checkCooldown() && !standalone,
    installed,
    triggerInstall,
    dismiss,
    hasUserInteracted,
  };
}
