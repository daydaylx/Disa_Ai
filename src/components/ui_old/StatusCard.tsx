import React from "react";

import { AlertCircle, CheckCircle, Info, Loader2, XCircle } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, type CardProps, CardTitle } from "./card";

type StatusType = "loading" | "success" | "error" | "warning" | "info";

interface StatusCardProps extends Omit<CardProps, "intent" | "state"> {
  /**
   * The type of status to display
   */
  status: StatusType;
  /**
   * The main title/message
   */
  title: string;
  /**
   * Additional description or details
   */
  description?: string;
  /**
   * Custom action buttons or elements
   */
  actions?: React.ReactNode;
  /**
   * Whether to show the default icon for the status type
   */
  showIcon?: boolean;
  /**
   * Custom icon to override the default
   */
  customIcon?: React.ReactNode;
  /**
   * Whether the card can be dismissed
   */
  dismissible?: boolean;
  /**
   * Callback when dismiss button is clicked
   */
  onDismiss?: () => void;
}

const statusConfig = {
  loading: {
    intent: "default" as const,
    icon: Loader2,
    iconClassName: "animate-spin text-text-muted",
    titleClassName: "text-text-strong",
    descriptionClassName: "text-text-muted",
  },
  success: {
    intent: "success" as const,
    icon: CheckCircle,
    iconClassName: "text-status-success",
    titleClassName: "text-status-success-text",
    descriptionClassName: "text-text-muted",
  },
  error: {
    intent: "error" as const,
    icon: XCircle,
    iconClassName: "text-status-error",
    titleClassName: "text-status-error-text",
    descriptionClassName: "text-text-muted",
  },
  warning: {
    intent: "warning" as const,
    icon: AlertCircle,
    iconClassName: "text-status-warning",
    titleClassName: "text-status-warning-text",
    descriptionClassName: "text-text-muted",
  },
  info: {
    intent: "info" as const,
    icon: Info,
    iconClassName: "text-status-info",
    titleClassName: "text-status-info-text",
    descriptionClassName: "text-text-muted",
  },
};

export const StatusCard = React.forwardRef<HTMLDivElement, StatusCardProps>(
  (
    {
      status,
      title,
      description,
      actions,
      showIcon = true,
      customIcon,
      dismissible = false,
      onDismiss,
      className,
      ...props
    },
    ref,
  ) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <Card
        ref={ref}
        intent={config.intent}
        state={status === "loading" ? "loading" : "default"}
        elevation="subtle"
        padding="md"
        className={cn("relative", className)}
        {...props}
      >
        {dismissible && (
          <button
            onClick={onDismiss}
            className="absolute right-2 top-2 rounded-full p-1 transition-colors duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)] hover:bg-surface-subtle"
            aria-label="Dismiss"
          >
            <XCircle className="h-4 w-4 text-text-muted" />
          </button>
        )}

        <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
          {(showIcon || customIcon) && (
            <div className="mt-0.5 flex-shrink-0">
              {customIcon || (
                <IconComponent className={cn("h-5 w-5", config.iconClassName)} aria-hidden="true" />
              )}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <CardTitle className={cn("text-base leading-snug", config.titleClassName)}>
              {title}
            </CardTitle>
          </div>
        </CardHeader>

        {(description || actions) && (
          <CardContent className="pt-0">
            {description && (
              <p className={cn("mb-3 text-sm leading-relaxed", config.descriptionClassName)}>
                {description}
              </p>
            )}
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </CardContent>
        )}
      </Card>
    );
  },
);

StatusCard.displayName = "StatusCard";

// Convenience components for specific status types
export const LoadingCard = React.forwardRef<HTMLDivElement, Omit<StatusCardProps, "status">>(
  (props, ref) => <StatusCard ref={ref} status="loading" {...props} />,
);
LoadingCard.displayName = "LoadingCard";

export const SuccessCard = React.forwardRef<HTMLDivElement, Omit<StatusCardProps, "status">>(
  (props, ref) => <StatusCard ref={ref} status="success" {...props} />,
);
SuccessCard.displayName = "SuccessCard";

export const ErrorCard = React.forwardRef<HTMLDivElement, Omit<StatusCardProps, "status">>(
  (props, ref) => <StatusCard ref={ref} status="error" {...props} />,
);
ErrorCard.displayName = "ErrorCard";

export const WarningCard = React.forwardRef<HTMLDivElement, Omit<StatusCardProps, "status">>(
  (props, ref) => <StatusCard ref={ref} status="warning" {...props} />,
);
WarningCard.displayName = "WarningCard";

export const InfoCard = React.forwardRef<HTMLDivElement, Omit<StatusCardProps, "status">>(
  (props, ref) => <StatusCard ref={ref} status="info" {...props} />,
);
InfoCard.displayName = "InfoCard";
