import React from "react";

import { Glass } from "./Glass";

interface TypingIndicatorProps {
  show?: boolean;
  message?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  show = true,
  message = "Schreibt...",
}) => {
  if (!show) return null;

  return (
    <div className="mx-auto max-w-[720px] px-4 py-2">
      <Glass variant="subtle" className="mr-auto max-w-[78%] items-start px-2 py-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-[var(--fg)]">{message}</span>
          <div className="flex space-x-1">
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-[var(--acc1)]"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-[var(--acc1)]"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-[var(--acc1)]"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </Glass>
    </div>
  );
};
