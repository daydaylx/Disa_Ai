import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="typing-dots text-sm text-muted-foreground"
    >
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  );
};
