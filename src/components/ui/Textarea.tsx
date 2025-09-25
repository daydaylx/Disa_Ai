import * as React from "react";

import { cn } from "../../lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const combinedRef = (el: HTMLTextAreaElement) => {
      // @ts-ignore
      if (ref) ref.current = el;
      // @ts-ignore
      internalRef.current = el;
    };

    // Auto-resize logic
    React.useLayoutEffect(() => {
      const ta = internalRef.current;
      if (!ta) return;
      // Reset height to recalculate
      ta.style.height = "0px";
      const scrollHeight = ta.scrollHeight;
      // Set height based on content, up to a max (e.g., 5 lines)
      const maxHeight = 5 * 24; // Assuming line-height of 24px
      ta.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }, [props.value]);

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm",
          "ring-offset-background placeholder:text-text-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-none overflow-y-auto", // Allow scrolling past max height
          className,
        )}
        ref={combinedRef}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
