import { Download, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

import { usePWAInstall } from "../../hooks/usePWAInstall";
import { Button } from "../ui/button";
import { useToasts } from "../ui/toast/ToastsProvider";

export function PWAInstallPrompt({ className }: PWAInstallPromptProps) {
  const { canInstall, requestInstall, dismiss, installed } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const toasts = useToasts();

  // Verzögerte Anzeige für bessere UX (nur bei Android)
  useEffect(() => {
    if (canInstall) {
      const timer = setTimeout(() => setIsVisible(true), 3000); // 3s Verzögerung für weniger aufdringlich
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

  // Nur für Android anzeigen, wenn Installation möglich ist
  if (installed || !canInstall || !isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-sm ${className || ""}`}
    >
      <div className="glass-card animate-bounce-in p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Disa AI installieren</h3>
            </div>
            <p className="mb-4 text-sm text-white/70">
              Installiere Disa AI als App für schnelleren Zugriff und bessere Performance.
            </p>

            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-transform hover:scale-105 hover:from-blue-600 hover:to-purple-600"
              >
                <Download className="mr-2 h-4 w-4" />
                Jetzt installieren
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="outline"
                className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
              >
                Später
              </Button>
            </div>
          </div>

          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
