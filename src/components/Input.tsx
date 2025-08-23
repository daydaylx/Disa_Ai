import React from "react";
import { cn } from "../lib/cn";
const base = "w-full rounded-2xl bg-[#12121A]/80 text-foreground placeholder:text-zinc-500 border border-border px-4 h-12 focus-ring";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, props.className)} {...props} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("w-full rounded-2xl bg-[#12121A]/80 text-foreground placeholder:text-zinc-500 border border-border px-4 py-3 min-h-[120px] focus-ring", props.className)} {...props} />;
}
