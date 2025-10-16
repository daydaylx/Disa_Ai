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
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-red-500",
    loading: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <header className="sticky top-0 z-10 mb-4 w-full px-4 py-6">
      <Glass
        variant="subtle"
        className="mx-auto max-w-[720px] border-b border-[var(--glass-stroke)] p-4"
      >
        <div className="flex flex-col items-center">
          {/* Status und Modell Info */}
          <div className="mb-2 flex w-full items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${statusColors[status]}`}></div>
              <span className="text-xs text-[var(--fg-dim)]">{model}</span>
            </div>

            {tokensUsed > 0 && (
              <span className="text-xs text-[var(--fg-dim)]">{tokensUsed} Tokens</span>
            )}
          </div>

          {/* Haupt-Titel */}
          <h1 className="mb-1 text-xl font-bold text-[var(--fg)]">Disa AI</h1>

          {/* Beschreibungstext */}
          <p className="max-w-md text-center text-xs text-[var(--fg-dim)]">
            Dein künstlicher Freund und Helfer, ein guter Freund, nicht immer ehrlich, aber immer
            da.
          </p>
        </div>
      </Glass>
    </header>
  );
};
