import React from "react";
import { twMerge } from "tailwind-merge";

type MainContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function MainContent({ children, className }: MainContentProps) {
  const mainContentClasses = twMerge("flex-1 overflow-y-auto p-4", className);

  return (
    <main id="main" className={mainContentClasses}>
      {children}
    </main>
  );
}
