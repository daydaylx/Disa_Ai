import * as React from "react";

import { cn } from "../../lib/cn";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" className="peer sr-only" ref={ref} {...props} />
      <div
        className={cn(
          "h-6 w-11 rounded-full bg-bg-elevated",
          "peer-checked:bg-primary",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg-base",
          "after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-600 after:bg-white",
          "after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        )}
      ></div>
    </label>
  );
});

Switch.displayName = "Switch";

export { Switch };
