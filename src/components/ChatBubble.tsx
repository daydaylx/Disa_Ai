import React from "react";

import { cn } from "../lib/cn";
export function ChatBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const mine = role === "user";
  return (
    <div className={cn("flex w-full", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
          mine
            ? "shadow-glow bg-gradient-to-r from-primary to-indigo-500 text-white"
            : "border border-white/10 bg-[#14141C] text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
