import React from "react";

import { SoftDepthSurface } from "./Glass";

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
      <div role="status" aria-live="polite" aria-atomic="true">
        <SoftDepthSurface variant="subtle" className="mr-auto max-w-[78%] items-start px-2 py-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-strong">{message}</span>
            <div className="flex space-x-1">
              <div
                className="h-2 w-2 rounded-full bg-accent1 motion-safe:animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="h-2 w-2 rounded-full bg-accent1 motion-safe:animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="h-2 w-2 rounded-full bg-accent1 motion-safe:animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </SoftDepthSurface>
      </div>
    </div>
  );
};
