import React from "react";

import { cn } from "../lib/cn";

// Now using the centralized .input class from theme.css
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("input", props.className)} {...props} />;
}

// Now using the centralized .textarea class from theme.css
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("textarea", props.className)}
      {...props}
    />
  );
}
