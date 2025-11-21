import { useEffect, useState } from "react";

import { useToasts } from "@/ui";
import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";

import { usePWAInstall } from "../../hooks/usePWAInstall";
import { Download, Smartphone, X } from "../../lib/icons";
import { cn } from "../../lib/utils";

interface PWAInstallPromptProps {
  className?: string;
}

export function PWAInstallPrompt({ className }: PWAInstallPromptProps) {
  const { canInstall, requestInstall, installed } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const toasts = useToasts();

  useEffect(() => {
    // Check if user has dismissed the prompt before
    const wasDismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return undefined;
    }

    if (canInstall && !dismissed) {
      // Show after 5 seconds (less aggressive)
      const showTimer = setTimeout(() => setIsVisible(true), 5000);

      // Auto-dismiss after 15 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 20000); // 5s delay + 15s visible

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
    return undefined;
  }, [canInstall, dismissed]);

  const handleInstall = async () => {
    try {
      const outcome = await requestInstall();
      if (outcome === "accepted") {
        toasts.push({
          kind: "success",
          title: "Installation gestartet",
          message: "Folge den Anweisungen deines Browsers, um die App zu installieren.",
        });
        setIsVisible(false);
      } else {
        toasts.push({
          kind: "info",
          title: "Installation abgelehnt",
          message: "Du kannst die Installation später erneut versuchen.",
        });
      }
    } catch (error) {
      console.error("[PWA] Installation failed:", error);
      toasts.push({
        kind: "error",
        title: "Installation fehlgeschlagen",
        message: "Die App konnte nicht installiert werden. Versuche es später erneut.",
      });
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    // Remember dismissal for 7 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem("pwa-prompt-dismissed", expiryDate.toISOString());
  };

  if (installed || !canInstall || !isVisible || dismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        // WCAG: Less intrusive - positioned at top, smaller, auto-dismisses
        "fixed top-20 right-4 z-notification max-w-xs",
        "animate-in slide-in-from-top-4 duration-500",
        className,
      )}
    >
      <MaterialCard className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="p-2 rounded-xl bg-[var(--surface-2)] text-[var(--accent-primary)]">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              Als App installieren
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Schnellerer Zugriff & Offline-Nutzung
            </p>

            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm" className="flex-1 text-xs">
                <Download className="mr-1 h-3.5 w-3.5" />
                Installieren
              </Button>
              <Button onClick={handleDismiss} size="sm" variant="ghost" className="px-3 text-xs">
                Später
              </Button>
            </div>
          </div>

          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-1 flex-shrink-0"
            aria-label="Installations-Prompt schließen"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </MaterialCard>
    </div>
  );
}
