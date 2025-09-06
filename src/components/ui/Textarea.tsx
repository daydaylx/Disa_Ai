import React from "react";

import { cn } from "../../lib/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputEl = (
      <textarea
        id={id}
        ref={ref}
        className={cn("textarea", className)}
        {...props} // <- wichtig: data-*, aria-*, on*, usw. werden durchgereicht
      />
    );

    return label ? (
      <label className="block">
        <span className="mb-1 block text-sm font-medium">{label}</span>
        {inputEl}
        {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
      </label>
    ) : (
      <>
        {inputEl}
        {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
      </>
    );
  },
);

Textarea.displayName = "Textarea";
