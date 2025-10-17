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
      className={cn("rounded-md border border-danger/40 bg-danger/10 p-3", className)}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-danger">
          <Icon name="error" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-danger">{title}</div>
          <div className="text-sm text-danger">{message}</div>
          {details ? (
            <details className="mt-1">
              <summary className="cursor-pointer text-xs underline underline-offset-4">
                Details
              </summary>
              <pre className="border-border-subtle bg-surface-2 text-text-strong mt-1 max-h-48 overflow-auto rounded border p-2 text-xs">
                {details}
              </pre>
            </details>
          ) : null}
          {onRetry ? (
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={onRetry} aria-label="Erneut versuchen">
                <Icon name="info" className="mr-2" /> Erneut versuchen
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
