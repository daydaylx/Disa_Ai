import React from "react";
export function InlineNote({
  kind = "info",
  children,
}: {
  kind?: "info" | "warn" | "error" | "success";
  children: React.ReactNode;
}) {
  const map = {
    info: "text-blue-300",
    warn: "text-amber-300",
    error: "text-red-300",
    success: "text-emerald-300",
  } as const;
  return <div className={`text-sm ${map[kind]} leading-relaxed`}>{children}</div>;
}
