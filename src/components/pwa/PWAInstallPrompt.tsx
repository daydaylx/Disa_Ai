import { useEffect, useState } from "react";

import { usePWAInstall } from "../../hooks/usePWAInstall";
import { Download, Smartphone, X } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useToasts } from "../ui/toast/ToastsProvider";

interface PWAInstallPromptProps {
  className?: string;
}

export function PWAInstallPrompt({ className }: PWAInstallPromptProps) {
  const { canInstall, requestInstall, installed } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const toasts = useToasts();

  useEffect(() => {
    if (canInstall) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [canInstall]);

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
  };

  if (installed || !canInstall || !isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 z-notification md:left-auto md:right-4 md:max-w-sm lg:max-w-md",
        className,
      )}
    >
      <div className="max-h-[40vh] overflow-y-auto rounded-3xl bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)] border border-[var(--aurora-green-400)] shadow-[var(--shadow-glow-green)] p-6 sm:max-h-none sm:p-8 animate-in slide-in-from-bottom-8 duration-500 ease-[var(--motion-ease-elastic)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[var(--glass-surface-strong)] backdrop-blur-[var(--backdrop-blur-strong)] border border-[var(--glass-border-medium)] text-primary shadow-[var(--shadow-glow-primary)]">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">Disa AI als App installieren</h3>
                <p className="text-sm text-text-secondary">
                  Schnellerer Zugriff, volle Offline-Fähigkeiten & Push-Notifications
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleInstall}
                size="lg"
                className="order-1 flex-1 bg-[var(--glass-surface-strong)] backdrop-blur-[var(--backdrop-blur-strong)] border border-[var(--glass-border-medium)] shadow-[var(--shadow-glow-soft)] group hover:shadow-[var(--shadow-glow-green)] hover:scale-[1.02] transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]"
              >
                <Download className="mr-2 h-5 w-5" />
                Jetzt installieren
              </Button>
              <Button
                onClick={handleDismiss}
                size="lg"
                variant="ghost"
                className="order-2 sm:order-2 group hover:bg-[var(--glass-surface-strong)] hover:backdrop-blur-[var(--backdrop-blur-strong)] hover:border-[var(--glass-border-medium)] hover:shadow-[var(--shadow-glow-subtle)] hover:scale-[1.02] transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]"
              >
                Später
              </Button>
            </div>
          </div>

          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="h-10 w-10 p-2 rounded-2xl bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-medium)] border border-[var(--glass-border-subtle)] hover:bg-[var(--glass-surface-strong)] hover:backdrop-blur-[var(--backdrop-blur-strong)] hover:border-[var(--glass-border-medium)] hover:shadow-[var(--shadow-glow-subtle)] hover:rotate-90 transition-all duration-300 ease-[var(--motion-ease-elastic)]"
            aria-label="Installations-Prompt schließen"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
