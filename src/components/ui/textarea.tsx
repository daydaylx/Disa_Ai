import * as React from "react";

import { cn } from "../../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "border-border/80 glass glass--subtle text-text-0 placeholder:text-text-1 focus-visible:ring-brand focus-visible:ring-offset-surface-0 focus-visible:border-border-focus focus-visible:bg-hover-bg hover:border-border-hover hover:bg-hover-bg flex min-h-[96px] w-full resize-none rounded-base border px-3 py-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
