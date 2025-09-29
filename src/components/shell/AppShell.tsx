import React from "react";
import { twMerge } from "tailwind-merge";

type AppShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  const shellClasses = twMerge(
    "flex flex-col h-screen-dynamic overflow-hidden",
    "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
    "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
    className,
  );

  return <div className={shellClasses}>{children}</div>;
}
