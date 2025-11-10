import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const textareaVariants = cva(
  "flex w-full rounded-md border border-line bg-surface-base px-3 py-2 text-sm ring-offset-background placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "min-h-[80px]",
        sm: "min-h-[60px]",
        lg: "min-h-[120px]",
      },
      resizable: {
        true: "resize-y",
        false: "resize-none",
      },
    },
    defaultVariants: {
      size: "default",
      resizable: false,
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, resizable, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ size, resizable, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
