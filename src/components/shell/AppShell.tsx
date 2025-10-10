import React from "react";
import { twMerge } from "tailwind-merge";

import { SkipLink } from "../accessibility/SkipLink";

type AppShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  const shellClasses = twMerge("flex flex-col overflow-hidden safe-y safe-x", className);

  return (
    <div className={shellClasses} style={{ minHeight: "var(--vh, 100dvh)" }}>
      <SkipLink />
      {children}
    </div>
  );
}
