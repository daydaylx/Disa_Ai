import React from "react";

import { cn } from "../../lib/cn";
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, ...props },
  ref,
) {
  return (
    <textarea ref={ref} className={cn("input", "min-h-[88px] resize-y", className)} {...props} />
  );
});
