import { useNavigate } from "react-router-dom";

import type { ChatApiStatus } from "@/hooks/useChat";
import { AlertCircle, AlertTriangle, X, XCircle } from "@/lib/icons";
import { hasApiKey } from "@/lib/openrouter/key";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";
import { Typography } from "@/ui/Typography";

interface ChatStatusBannerProps {
  status: ChatApiStatus;
  error?: Error | null;
  rateLimitInfo?: {
    isLimited: boolean;
    retryAfter: number;
  };
  onDismiss?: () => void;
}

type BannerTone = "warning" | "error" | "info";

export function ChatStatusBanner({
  status,
  error,
  rateLimitInfo,
  onDismiss,
}: ChatStatusBannerProps) {
  const navigate = useNavigate();
  const userHasKey = hasApiKey();

  // Don't show banner when everything is ok or idle
  if (status === "ok" || status === "idle") {
    return null;
  }

  const getBannerConfig = () => {
    switch (status) {
      case "rate_limited":
        return {
          icon: AlertTriangle,
          title: "Rate-Limit erreicht",
          message: rateLimitInfo?.retryAfter
            ? `Der Test-Zugang ist vorübergehend ausgeschöpft. ${
                rateLimitInfo.retryAfter > 1
                  ? `Bitte warte ${rateLimitInfo.retryAfter} Sekunden.`
                  : "Einen Moment bitte …"
              }`
            : "Der Test-Zugang ist vorübergehend ausgeschöpft.",
          color: "warning" as BannerTone,
          actions: userHasKey
            ? []
            : [
                {
                  label: "Eigenen API-Key hinterlegen",
                  onClick: () => navigate("/settings/api-data"),
                },
              ],
        };

      case "missing_key":
        return {
          icon: XCircle,
          title: "Kein API-Key",
          message:
            "Um Disa AI zu nutzen, benötigst du einen OpenRouter API-Key. Du kannst entweder den Test-Zugang verwenden oder deinen eigenen Key hinterlegen.",
          color: "error" as BannerTone,
          actions: [
            {
              label: "API-Key einrichten",
              onClick: () => navigate("/settings/api-data"),
            },
          ],
        };

      case "error":
        return {
          icon: AlertCircle,
          title: "Verbindungsfehler",
          message:
            error?.message ||
            "Die Anfrage konnte nicht verarbeitet werden. Bitte versuche es erneut.",
          color: "error" as BannerTone,
          actions: [
            {
              label: "Status ansehen",
              onClick: () => navigate("/settings/api-data"),
            },
          ],
        };

      default:
        return null;
    }
  };

  const config = getBannerConfig();
  if (!config) return null;

  const Icon = config.icon;

  const toneStyles: Record<
    BannerTone,
    { bg: string; border: string; iconWrap: string; icon: string }
  > = {
    warning: {
      bg: "bg-gradient-to-r from-status-warning/12 via-surface-1/90 to-surface-1/90",
      border: "border-status-warning/30",
      iconWrap: "bg-status-warning/20 text-status-warning",
      icon: "text-status-warning",
    },
    error: {
      bg: "bg-gradient-to-r from-status-error/10 via-surface-1/90 to-surface-1/90",
      border: "border-status-error/35",
      iconWrap: "bg-status-error/18 text-status-error",
      icon: "text-status-error",
    },
    info: {
      bg: "bg-gradient-to-r from-accent-chat/15 via-surface-1/90 to-surface-1/90",
      border: "border-accent-chat-border",
      iconWrap: "bg-accent-chat-surface text-accent-chat",
      icon: "text-accent-chat",
    },
  };

  const tone = toneStyles[config.color];

  return (
    <MaterialCard
      variant="raised"
      className={cn(
        "mx-[var(--spacing-4)] my-3 rounded-2xl border px-4 py-3 shadow-lg relative",
        tone.bg,
        tone.border,
      )}
      data-testid="chat-status-banner"
    >
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-lg",
            "text-ink-tertiary hover:text-ink-primary",
            "hover:bg-surface-2/50 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-brand-primary/60",
          )}
          aria-label="Banner schließen"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-semibold",
            tone.iconWrap,
          )}
        >
          <Icon className={cn("h-4 w-4", tone.icon)} />
        </span>
        <div className="flex-1 min-w-0">
          <Typography variant="body-sm" className="font-semibold text-text-primary mb-1">
            {config.title}
          </Typography>
          <Typography variant="body-xs" className="text-text-secondary leading-relaxed">
            {config.message}
          </Typography>
          {config.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {config.actions.map((action, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={action.onClick}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </MaterialCard>
  );
}
