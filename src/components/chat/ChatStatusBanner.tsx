import { AlertTriangle, RefreshCw } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface ChatStatusBannerProps {
  error?: unknown;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

function resolveErrorMessage(error: unknown, fallback?: string): string {
  if (!error) {
    return fallback ?? "Es ist ein unbekannter Fehler aufgetreten.";
  }

  if (error instanceof Error) {
    return error.message || fallback || "Es ist ein Fehler aufgetreten.";
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback ?? "Es ist ein Fehler aufgetreten.";
}

export function ChatStatusBanner({ error, message, onRetry, className }: ChatStatusBannerProps) {
  const resolvedMessage = resolveErrorMessage(error, message);

  return (
    <Card
      tone="neo-subtle"
      className={cn(
        "border-border flex items-center gap-3 rounded-lg border px-3 py-3 text-sm text-text-secondary",
        className,
      )}
    >
      <AlertTriangle className="h-4 w-4 text-status-warning" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-text-primary font-medium">Kurze Störung</p>
        <p className="text-xs">{resolvedMessage}</p>
      </div>
      {onRetry ? (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onRetry}
          className="inline-flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Erneut
        </Button>
      ) : null}
    </Card>
  );
}
