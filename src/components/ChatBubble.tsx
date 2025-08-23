import React from "react";

import { cn } from "../lib/cn";
export function ChatBubble({ role, children }:{ role:"user"|"assistant"; children:React.ReactNode; }) {
  const mine = role === "user";
  return (
    <div className={cn("w-full flex", mine ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
        mine ? "bg-gradient-to-r from-primary to-indigo-500 text-white shadow-glow"
             : "bg-[#14141C] border border-white/10 text-foreground"
      )}>
        {children}
      </div>
    </div>
  );
}
