import * as React from "react";

import { cn } from "../../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[6rem] w-full resize-none rounded-[var(--radius-md)] border border-control-field-border bg-control-field px-[var(--space-inline-md)] py-[var(--space-xs)] text-body text-text-primary transition-[background,border-color,box-shadow,color] duration-small ease-standard placeholder:text-control-field-placeholder hover:border-control-field-border-hover hover:bg-control-field-hover focus-visible:border-control-field-border-active focus-visible:shadow-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-focus)] disabled:cursor-not-allowed disabled:bg-control-field-disabled disabled:text-text-muted disabled:placeholder:text-text-muted",
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
