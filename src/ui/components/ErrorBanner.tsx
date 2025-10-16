import { Badge } from "../primitives/Badge";
import type { UIState } from "../state/uiMachine";
import { hasError } from "../state/uiMachine";

interface ErrorBannerProps {
  uiState: UIState;
  onDismiss?: () => void;
}

export function ErrorBanner({ uiState, onDismiss }: ErrorBannerProps) {
  if (!hasError(uiState) || !uiState.currentError) {
    return null;
  }

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case "RATE_LIMITED":
        return "Rate limit erreicht. Bitte warten Sie einen Moment.";
      case "OFFLINE":
        return "Keine Internetverbindung verfügbar.";
      case "SERVER_ERROR":
        return "Server-Fehler. Bitte versuchen Sie es später erneut.";
      case "AUTHENTICATION_ERROR":
        return "API-Schlüssel ist ungültig oder fehlt.";
      case "NETWORK_ERROR":
        return "Netzwerk-Fehler. Überprüfen Sie Ihre Verbindung.";
      default:
        return "Ein unerwarteter Fehler ist aufgetreten.";
    }
  };

  const getErrorIcon = (chatState: string): string => {
    switch (chatState) {
      case "offline":
        return "📡";
      case "rate_limited":
        return "⏱️";
      default:
        return "⚠️";
    }
  };

  return (
    <div className="mx-auto max-w-[900px] px-4 py-2">
      <div className="flex items-center gap-3 rounded-lg border border-[hsl(var(--error)/0.3)] bg-[hsl(var(--error)/0.1)] p-3">
        <span className="text-lg">{getErrorIcon(uiState.chatState)}</span>
        <div className="flex-1">
          <p className="text-sm text-[hsl(var(--error))]">
            {getErrorMessage(uiState.currentError)}
          </p>
        </div>
        <Badge variant="muted" className="text-xs">
          {uiState.chatState.toUpperCase()}
        </Badge>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-[hsl(var(--fg-dim))] transition-colors hover:text-[hsl(var(--fg))]"
            aria-label="Fehler-Banner schließen"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
