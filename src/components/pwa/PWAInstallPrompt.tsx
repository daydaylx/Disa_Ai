import { Download, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

import { usePWAInstall } from "../../hooks/usePWAInstall";
import { Button } from "../ui/button";
import { useToasts } from "../ui/toast/ToastsProvider";

interface PWAInstallPromptProps {
  className?: string;
}

export function PWAInstallPrompt({ className }: PWAInstallPromptProps) {
  const { canInstall, requestInstall, dismiss, installed } = usePWAInstall();
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
      await requestInstall();
      toasts.push({
        kind: "success",
        title: "Installation gestartet",
        message: "Folge den Anweisungen deines Browsers, um die App zu installieren.",
      });
      setIsVisible(false);
    } catch {
      toasts.push({
        kind: "error",
        title: "Installation fehlgeschlagen",
        message: "Die App konnte nicht installiert werden. Versuche es später erneut.",
      });
    }
  };

  const handleDismiss = () => {
    dismiss();
    setIsVisible(false);
  };

  if (installed || !canInstall || !isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-4 md:max-w-sm lg:max-w-md ${className || ""}`}
    >
      <div className="border-border max-h-[40vh] overflow-y-auto rounded-lg border bg-surface-popover p-4 shadow-popover sm:max-h-none sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Smartphone className="text-text-0 h-5 w-5" />
              <h3 className="text-text-0 font-semibold">Disa AI installieren</h3>
            </div>
            <p className="text-text-1 mb-3 text-xs leading-tight sm:mb-4 sm:text-sm">
              Installiere Disa AI als App für schnelleren Zugriff und bessere Performance.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleInstall} size="sm" className="order-1 flex-1">
                <Download className="mr-2 h-4 w-4" />
                Jetzt installieren
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="outline"
                className="order-2 sm:order-2"
              >
                Später
              </Button>
            </div>
          </div>

          <Button onClick={handleDismiss} variant="ghost" size="icon" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
