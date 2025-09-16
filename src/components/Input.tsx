import * as React from "react";

import { cn } from "../lib/cn";

// Now using the centralized .input class from theme.css
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("input", props.className)} {...props} />;
}

// Textarea nutzt dieselbe Input-Utility mit dynamischer Höhe
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("input h-auto resize-y", props.className)} {...props} />;
}
