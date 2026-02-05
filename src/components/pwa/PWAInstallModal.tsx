import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, Share2, Smartphone } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/Dialog";

export function PWAInstallModal() {
  const { isStandalone, isIOS, showPrompt, triggerInstall, dismiss } = usePWAInstall();

  if (isStandalone) {
    return null;
  }

  if (!showPrompt) {
    return null;
  }

  const handleInstall = async () => {
    const outcome = await triggerInstall();
    if (outcome === "dismissed") {
      dismiss("dismissed");
    }
  };

  const handleDismiss = () => {
    dismiss("dismissed");
  };

  return (
    <Dialog open={showPrompt} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="max-w-md" onEscapeKeyDown={handleDismiss}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "p-2 rounded-xl",
                isIOS ? "bg-brand-primary/20 text-brand-primary" : "bg-surface-3 text-ink-primary",
              )}
            >
              <Smartphone className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg">
              {isIOS ? "Disa AI als App hinzufügen" : "Disa AI als App installieren"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-ink-secondary">
            {isIOS
              ? "Installiere Disa AI auf deinem Home-Bildschirm für schnelleren Zugriff und eine bessere Erfahrung."
              : "Installiere Disa AI als App für schnelleren Zugriff, Offline-Nutzung und eine bessere Erfahrung."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isIOS ? (
            <div className="space-y-3">
              <ol className="space-y-3 text-sm text-ink-secondary">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center text-xs font-semibold text-ink-primary">
                    1
                  </span>
                  <div>
                    <p className="text-ink-primary font-medium">Öffne die Teilen-Funktion</p>
                    <p className="text-xs mt-1">Tippe unten auf das Teilen-Icon</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center text-xs font-semibold text-ink-primary">
                    2
                  </span>
                  <div>
                    <p className="text-ink-primary font-medium">Wähle "Zum Home-Bildschirm"</p>
                    <p className="text-xs mt-1">
                      Scrolle nach unten und tippe auf "Zum Home-Bildschirm hinzufügen"
                    </p>
                  </div>
                </li>
              </ol>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-surface-3">
                <Share2 className="h-4 w-4 text-ink-secondary" />
                <span className="text-xs text-ink-secondary">
                  Teilen-Icon unten in der Browserleiste
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-3">
              <div className="flex-shrink-0">
                <Download className="h-5 w-5 text-brand-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink-primary">
                  <span className="font-semibold">Offline-Nutzung:</span> Auch ohne Internet
                  verfügbar
                </p>
                <p className="text-sm text-ink-primary mt-2">
                  <span className="font-semibold">Schnellerer Zugriff:</span> Direkt von deinem
                  Startbildschirm
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant="secondary" onClick={handleDismiss} className="w-full sm:w-auto">
              Später
            </Button>
          </DialogClose>
          <Button onClick={isIOS ? handleDismiss : handleInstall} className="w-full sm:w-auto">
            {isIOS ? (
              "Verstanden"
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Installieren
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
