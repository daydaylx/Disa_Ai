import React, { useState } from "react";

import { cn } from "../../lib/utils/cn";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  details?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Fehler",
  message = "Es ist ein Fehler aufgetreten.",
  details,
  onRetry,
  className,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn("rounded-md border border-destructive/40 bg-destructive/10 p-3", className)}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-destructive">
          <Icon name="error" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-destructive-foreground">{title}</div>
          <div className="text-sm text-destructive-foreground/90">{message}</div>
          {details ? (
            <details className="mt-1">
              <summary className="cursor-pointer text-xs underline underline-offset-4">
                Details
              </summary>
              <pre className="mt-1 max-h-48 overflow-auto rounded border border-border bg-background p-2 text-xs text-foreground">
                {details}
              </pre>
            </details>
          ) : null}
          {onRetry ? (
            <div className="mt-2">
              <Button variant="secondary" size="sm" onClick={onRetry} aria-label="Erneut versuchen">
                <Icon name="info" className="mr-2" /> Erneut versuchen
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
