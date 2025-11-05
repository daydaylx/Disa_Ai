import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    /** Neomorphic variant for different depth levels */
    variant?: "default" | "subtle" | "medium" | "strong";
    /** Size variant for different heights and padding */
    size?: "sm" | "md" | "lg";
  }
>(({ className, children, variant = "default", size = "md", ...props }, ref) => {
  const variants = {
    default: "neo-inset-subtle",
    subtle: "neo-inset-subtle",
    medium: "neo-inset-medium",
    strong: "neo-inset-strong",
  };

  const sizes = {
    sm: "min-h-[2rem] px-2 py-1 text-xs",
    md: "min-h-[2.5rem] px-3 py-2 text-sm",
    lg: "min-h-[3rem] px-4 py-3 text-base",
  };

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        // Base Layout
        "flex w-full items-center justify-between rounded-[var(--radius-md)]",
        sizes[size],

        // Neomorphic Foundation (Inset Field Style)
        "bg-[var(--surface-neumorphic-base)]",
        "border-[var(--border-neumorphic-subtle)]",
        variants[variant],

        // Typography
        "text-[var(--color-text-primary)]",
        "font-medium tracking-[-0.01em]",
        "[&>span]:line-clamp-1",

        // Interactive States
        "transition-all duration-200 ease-out",
        "hover:bg-[var(--surface-neumorphic-base)]",
        "hover:shadow-[var(--shadow-inset-subtle)]",

        // Focus State (Dramatic Neomorphic)
        "focus-visible:outline-none",
        "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
        "focus-visible:border-[var(--color-border-focus)]",
        "focus-visible:bg-[var(--surface-neumorphic-floating)]",

        // Open State
        "data-[state=open]:shadow-[var(--shadow-focus-neumorphic)]",
        "data-[state=open]:border-[var(--color-border-focus)]",
        "data-[state=open]:bg-[var(--surface-neumorphic-floating)]",

        // Disabled State
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        "disabled:shadow-[var(--shadow-inset-subtle)]",

        // Dark Mode
        "dark:bg-[var(--surface-neumorphic-base)]",
        "dark:border-[var(--border-neumorphic-dark)]",

        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-70 transition-all duration-300 ease-out",
            "data-[state=open]:rotate-180",
            "data-[state=open]:opacity-100",
            "data-[state=open]:scale-110",
            // Neomorphic icon effect
            "shadow-[var(--shadow-neumorphic-icon)]",
          )}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-sm)]",
      "hover:shadow-[var(--shadow-neumorphic-md)]",
      "transition-all duration-200 ease-out",
      className,
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4 shadow-[var(--shadow-neumorphic-icon)]" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-sm)]",
      "hover:shadow-[var(--shadow-neumorphic-md)]",
      "transition-all duration-200 ease-out",
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 shadow-[var(--shadow-neumorphic-icon)]" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        // Animation States
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",

        // Layout
        "relative z-50 min-w-[8rem] overflow-hidden rounded-[var(--radius-lg)]",

        // Dramatic Neomorphic Floating Panel
        "bg-[var(--surface-neumorphic-floating)]",
        "border-[var(--border-neumorphic-subtle)]",
        "shadow-[var(--shadow-neumorphic-dramatic)]",

        // Typography
        "text-[var(--color-text-primary)]",

        // Positioning
        position === "popper" &&
          [
            "data-[side=bottom]:translate-y-2",
            "data-[side=left]:-translate-x-2",
            "data-[side=right]:translate-x-2",
            "data-[side=top]:-translate-y-2",
          ].join(" "),

        // Enhanced Transitions
        "transition-all duration-300 ease-out",

        // Dark Mode
        "dark:bg-[var(--surface-neumorphic-floating)]",
        "dark:border-[var(--border-neumorphic-light)]",
        "dark:shadow-[var(--shadow-neumorphic-dramatic)]",

        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-2",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          // Scrollbar styling
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--color-border-subtle)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      // Layout
      "px-3 py-1.5",

      // Neomorphic Label Style (Subtle Raised)
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-sm)]",
      "rounded-[var(--radius-sm)]",
      "border-[var(--border-neumorphic-subtle)]",

      // Typography
      "text-xs font-semibold tracking-wide uppercase",
      "text-[var(--color-text-tertiary)]",

      // Spacing
      "mx-1 mb-1",

      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // Layout
      "relative flex w-full cursor-default select-none items-center",
      "rounded-[var(--radius-md)] py-2 pl-8 pr-3 mx-1 my-0.5",

      // Neomorphic Base
      "bg-[var(--surface-neumorphic-base)]",
      "border-[var(--border-neumorphic-subtle)]",

      // Typography
      "text-sm text-[var(--color-text-secondary)]",
      "font-medium tracking-[-0.01em]",

      // Interactive States
      "transition-all duration-200 ease-out",
      "outline-none",

      // Hover State (Lift Effect)
      "hover:bg-[var(--surface-neumorphic-raised)]",
      "hover:shadow-[var(--shadow-neumorphic-sm)]",
      "hover:text-[var(--color-text-primary)]",
      "hover:scale-[1.02]",

      // Focus State
      "focus:bg-[var(--surface-neumorphic-floating)]",
      "focus:shadow-[var(--shadow-neumorphic-md)]",
      "focus:text-[var(--color-text-primary)]",
      "focus:border-[var(--acc1)]",

      // Selected State (Dramatic Highlight)
      "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[var(--acc1)] data-[state=checked]:to-[var(--acc2)]",
      "data-[state=checked]:shadow-[var(--shadow-neumorphic-lg)]",
      "data-[state=checked]:text-white",
      "data-[state=checked]:font-semibold",
      "data-[state=checked]:border-[var(--acc1)]",

      // Disabled State
      "data-[disabled]:pointer-events-none",
      "data-[disabled]:opacity-40",
      "data-[disabled]:shadow-none",

      className,
    )}
    {...props}
  >
    {/* Check Icon Container */}
    <span
      className={cn(
        "absolute left-2 flex h-4 w-4 items-center justify-center",
        "text-[var(--acc1)]",
        "data-[state=checked]:text-white",
      )}
    >
      <SelectPrimitive.ItemIndicator>
        <Check
          className={cn(
            "h-4 w-4",
            "shadow-[var(--shadow-neumorphic-icon)]",
            "animate-in zoom-in-75 duration-200",
          )}
        />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      // Neomorphic Inset Line
      "-mx-1 my-2 h-px",
      "bg-gradient-to-r from-transparent via-[var(--border-neumorphic-dark)] to-transparent",
      "shadow-[inset_0_-1px_0_var(--border-neumorphic-light)]",

      className,
    )}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
