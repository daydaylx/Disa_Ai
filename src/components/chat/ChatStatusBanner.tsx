import { AlertCircle, Key, RefreshCw } from "lucide-react";

import { Button } from "@/ui";

interface ChatStatusBannerProps {
  status: "missing_key" | "rate_limited" | "error" | "ok" | "idle" | "streaming";
  onRetry?: () => void;
  onOpenSettings?: () => void;
  error?: Error | null;
}

export function ChatStatusBanner({
  status,
  onRetry,
  onOpenSettings,
  error,
}: ChatStatusBannerProps) {
  if (status === "missing_key") {
    return (
      <div className="mx-4 mb-4 rounded-lg bg-surface-2 p-4 border border-border shadow-raise bubble-in">
        <div className="flex items-start gap-3">
          <Key className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary mb-1">API-Zugang erforderlich</h3>
            <p className="text-sm text-text-secondary mb-3">
              Zum Starten brauchst du einen API-Zugang. Nutze unseren Testzugang oder hinterlege
              deinen eigenen Schlüssel.
            </p>
            {onOpenSettings && (
              <Button size="sm" onClick={onOpenSettings}>
                Einstellungen öffnen
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === "rate_limited") {
    return (
      <div className="mx-4 mb-4 rounded-lg bg-surface-2 p-4 border border-yellow-500/30 shadow-raise bubble-in">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary mb-1">Tageslimit erreicht</h3>
            <p className="text-sm text-text-secondary mb-3">
              Das Testkontingent für heute ist verbraucht. Ab morgen ist es wieder verfügbar.
              Alternativ kannst du deinen eigenen Key hinterlegen.
            </p>
            {onOpenSettings && (
              <Button size="sm" onClick={onOpenSettings}>
                Eigenen Key nutzen
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-4 mb-4 rounded-lg bg-red-500/5 p-4 border border-red-500/20 shadow-raise bubble-in">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">
              Ein Fehler ist aufgetreten
            </h3>
            <p className="text-sm text-red-600/80 dark:text-red-300/80 mb-3">
              {error?.message || "Es ist ein unbekannter Fehler aufgetreten."}
            </p>
            {onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="bg-transparent border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Erneut versuchen
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
