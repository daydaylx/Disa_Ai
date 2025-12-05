// BookPageAnimator.tsx
// Legacy component - replaced by standard layout transitions or simple Framer Motion wrappers.
// Kept as a passthrough to prevent breaks in any missed legacy files, but effectively disabled.

import type { ReactNode } from "react";

interface BookPageAnimatorProps {
  children: ReactNode;
  pageKey?: string;
  direction?: any;
}

export function BookPageAnimator({ children }: BookPageAnimatorProps) {
  return <div className="flex flex-col h-full w-full animate-fade-in">{children}</div>;
}
