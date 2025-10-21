import React from "react";

import { Glass } from "./Glass";

interface HeaderProps {
  status?: "online" | "offline" | "loading" | "error";
  model?: string;
  tokensUsed?: number;
}

export const Header: React.FC<HeaderProps> = ({
  status = "online",
  model = "openrouter/auto",
  tokensUsed = 0,
}) => {
  const statusColors: Record<NonNullable<HeaderProps["status"]>, string> = {
    online: "bg-success",
    offline: "bg-danger",
    loading: "bg-warning",
    error: "bg-danger",
  };

  return (
    <header
      className="sticky top-0 z-10 mb-4 w-full px-page-x pb-6 pt-2"
      style={{ paddingTop: "calc(var(--mobile-safe-top) + var(--spacing-lg))" }}
    >
      <Glass
        variant="standard"
        className="mx-auto flex max-w-[var(--max-content-width)] flex-col gap-3 border border-border/50 px-5 py-4 shadow-level2 backdrop-blur-lg"
      >
        <div className="flex flex-col items-center">
          {/* Status und Modell Info */}
          <div className="flex w-full items-center justify-between text-xs text-text-subtle">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${statusColors[status]}`}
                aria-hidden="true"
              />
              <span className="font-medium text-text-muted">{model}</span>
            </div>

            {tokensUsed > 0 && (
              <span className="text-text-muted">
                <span className="font-medium text-text-strong">{tokensUsed}</span> Tokens
              </span>
            )}
          </div>

          {/* Haupt-Titel */}
          <h1 className="text-token-h2 font-semibold text-text-strong">Disa AI</h1>

          {/* Beschreibungstext */}
          <p className="max-w-md text-center text-sm leading-6 text-text-muted">
            Dein künstlicher Freund und Helfer, ein guter Freund, nicht immer ehrlich, aber immer
            da.
          </p>
        </div>
      </Glass>
    </header>
  );
};
