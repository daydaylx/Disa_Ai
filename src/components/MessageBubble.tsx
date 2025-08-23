import React from "react";

import { cn } from "@/shared/lib/cn";

export function MessageBubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div className={cn("w-full flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-[15px] leading-relaxed",
          mine ? "bg-black text-white" : "bg-black/[0.05] dark:bg-white/10"
        )}
      >
        {children}
      </div>
    </div>
  );
}
