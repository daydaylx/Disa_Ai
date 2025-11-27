import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";
import { Typography } from "@/ui/Typography";
import { AlertCircle, AlertTriangle, Info, XCircle } from "@/lib/icons";
import type { ChatApiStatus } from "@/hooks/useChat";
import { hasApiKey } from "@/lib/openrouter/key";
import { useNavigate } from "react-router-dom";

interface ChatStatusBannerProps {
  status: ChatApiStatus;
  error?: Error | null;
  rateLimitInfo?: {
    isLimited: boolean;
    retryAfter: number;
  };
  onDismiss?: () => void;
}

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
          color: "warning" as const,
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
          color: "error" as const,
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
          color: "error" as const,
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
  const bgColor =
    config.color === "warning"
      ? "bg-amber-50 dark:bg-amber-950/30"
      : config.color === "error"
        ? "bg-red-50 dark:bg-red-950/30"
        : "bg-blue-50 dark:bg-blue-950/30";
  const iconColor =
    config.color === "warning"
      ? "text-amber-600 dark:text-amber-400"
      : config.color === "error"
        ? "text-red-600 dark:text-red-400"
        : "text-blue-600 dark:text-blue-400";
  const borderColor =
    config.color === "warning"
      ? "border-amber-200 dark:border-amber-800"
      : config.color === "error"
        ? "border-red-200 dark:border-red-800"
        : "border-blue-200 dark:border-blue-800";

  return (
    <MaterialCard
      variant="raised"
      className={`mx-[var(--spacing-4)] my-3 p-4 ${bgColor} border ${borderColor}`}
      data-testid="chat-status-banner"
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
        <div className="flex-1 min-w-0">
          <Typography variant="body-sm" className="font-semibold text-text-primary mb-1">
            {config.title}
          </Typography>
          <Typography variant="body-xs" className="text-text-secondary">
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
