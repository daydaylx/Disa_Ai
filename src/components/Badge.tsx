import * as React from "react";
export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "purple";
}) {
  const map = {
    neutral: "border border-border-subtle bg-surface-100 text-text-secondary",
    green: "border border-border-subtle bg-bg-success-subtle text-success",
    purple: "border border-border-subtle bg-bg-purple-subtle text-text-secondary",
  } as const;
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2 text-xs ${map[tone]}`}>
      {children}
    </span>
  );
}
