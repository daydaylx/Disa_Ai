import * as React from "react";
import { useState } from "react";

import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
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
  // Variablen aktuell ungenutzt, bewusst beibehalten (API)
  void open;
  void setOpen;

  return (
    <div
      className={cn("bg-bg-danger-subtle border-danger rounded-md border p-3", className)}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <div className="text-danger mt-0.5">
          <Icon name="error" />
        </div>
        <div className="flex-1">
          <div className="text-danger font-semibold">{title}</div>
          <div className="text-danger text-sm">{message}</div>
          {details ? (
            <details className="mt-1">
              <summary className="cursor-pointer text-xs underline underline-offset-4">
                Details
              </summary>
              <pre className="border-border-subtle bg-surface-100 text-text-primary mt-1 max-h-48 overflow-auto rounded border p-2 text-xs">
                {details}
              </pre>
            </details>
          ) : null}
          {onRetry ? (
            <div className="mt-2">
              <Button variant="default" size="sm" onClick={onRetry} aria-label="Erneut versuchen">
                <Icon name="info" className="mr-2" /> Erneut versuchen
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
