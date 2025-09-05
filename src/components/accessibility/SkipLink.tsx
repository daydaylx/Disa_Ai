import React from "react";

export const SkipLink: React.FC<{ targetId?: string; label?: string }> = ({
  targetId = "main",
  label = "Zum Hauptinhalt springen",
}) => {
  return (
    <a href={`#${targetId}`} className="skip-link">
      {label}
    </a>
  );
};
