import React from "react";

import { cn } from "../lib/cn";
const base =
  "w-full h-12 rounded-[14px] bg-white/70 backdrop-blur-md text-foreground placeholder:text-slate-500 border border-white/30 px-4 focus:outline-none focus:ring-2 focus:ring-[color:rgba(91,140,255,0.4)] focus:ring-offset-2 focus:ring-offset-background";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, props.className)} {...props} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-[14px] border border-white/30 bg-white/70 px-4 py-3 text-foreground placeholder:text-slate-500 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[color:rgba(91,140,255,0.4)] focus:ring-offset-2 focus:ring-offset-background",
        props.className,
      )}
      {...props}
    />
  );
}
