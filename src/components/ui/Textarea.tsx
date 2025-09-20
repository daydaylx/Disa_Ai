import * as React from "react";

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
        className={cn("textarea h-auto resize-y", className)}
        {...props}
      />
    );

    return label ? (
      <label className="block">
        <span className="mb-1 block text-sm font-medium">{label}</span>
        {inputEl}
        {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
      </label>
    ) : (
      <>
        {inputEl}
        {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
      </>
    );
  },
);

Textarea.displayName = "Textarea";
