import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

// Aurora Select Trigger Variants with CVA
const selectTriggerVariants = cva(
  // Aurora Base Styles - Mobile-First Glass Design
  [
    "flex w-full items-center justify-between rounded-[var(--radius-md)]",
    "text-[var(--text-primary)] font-medium tracking-[-0.01em]",
    "[&>span]:line-clamp-1 border",
    // Aurora Premium Transitions
    "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
    // Focus States
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
    // Disabled States
    "disabled:cursor-not-allowed disabled:opacity-50",
    // Touch-optimized
    "select-none touch-manipulation",
  ].join(" "),
  {
    variants: {
      // === AURORA GLASS VARIANTS ===
      variant: {
        "aurora-soft": [
          // Subtle Aurora Glass Input
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border-[var(--glass-border-subtle)] shadow-[var(--shadow-glow-soft)]",
          // Interactive States
          "hover:bg-[var(--glass-surface-medium)] hover:border-[var(--glass-border-medium)]",
          "focus-visible:bg-[var(--glass-surface-medium)] focus-visible:border-[var(--glass-border-aurora)]",
          "data-[state=open]:bg-[var(--glass-surface-medium)] data-[state=open]:border-[var(--glass-border-aurora)]",
        ].join(" "),

        "glass-primary": [
          // Premium Aurora Glass Input
          "bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)]",
          "border-[var(--glass-border-medium)] shadow-[var(--shadow-premium-subtle)]",
          // Premium Interactive States
          "hover:bg-[var(--glass-surface-strong)] hover:border-[var(--glass-border-aurora)] hover:shadow-[var(--shadow-premium-medium)]",
          "focus-visible:bg-[var(--glass-surface-strong)] focus-visible:border-[var(--aurora-primary-500)] focus-visible:shadow-[var(--shadow-glow-primary)]",
          "data-[state=open]:bg-[var(--glass-surface-strong)] data-[state=open]:border-[var(--aurora-primary-500)] data-[state=open]:shadow-[var(--shadow-glow-primary)]",
        ].join(" "),

        "glass-ghost": [
          // Minimal Aurora Glass
          "bg-transparent backdrop-blur-[var(--backdrop-blur-subtle)]",
          "border-[var(--glass-border-subtle)]",
          // Subtle Interactive States
          "hover:bg-[var(--glass-surface-subtle)] hover:border-[var(--glass-border-medium)]",
          "focus-visible:bg-[var(--glass-surface-subtle)] focus-visible:border-[var(--glass-border-aurora)]",
          "data-[state=open]:bg-[var(--glass-surface-subtle)] data-[state=open]:border-[var(--glass-border-aurora)]",
        ].join(" "),
      },

      // === TOUCH-OPTIMIZED SIZES ===
      size: {
        sm: "min-h-[var(--touch-target-compact)] px-3 py-2 text-[var(--text-sm)]",
        default: "min-h-[var(--touch-target-comfortable)] px-4 py-3 text-[var(--text-base)]",
        lg: "min-h-[var(--touch-target-spacious)] px-5 py-4 text-[var(--text-lg)]",
      },
    },
    defaultVariants: {
      variant: "aurora-soft",
      size: "default",
    },
  },
);

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, variant, size, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, size }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown
        className={cn(
          "h-5 w-5 opacity-60 transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
          "data-[state=open]:rotate-180 data-[state=open]:opacity-100 data-[state=open]:scale-110",
          // Aurora Icon Enhancement
          "text-[var(--text-muted)] data-[state=open]:text-[var(--aurora-primary-500)]",
        )}
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      // Aurora Glass Scroll Button
      "flex cursor-default items-center justify-center py-2",
      "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
      "border-b border-[var(--glass-border-subtle)]",
      "text-[var(--text-muted)]",
      // Aurora Interactive States
      "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
      "hover:bg-[var(--glass-surface-medium)] hover:text-[var(--text-primary)]",
      "hover:shadow-[var(--shadow-glow-soft)]",
      className,
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4 transition-transform duration-[var(--motion-medium)]" />
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
      // Aurora Glass Scroll Button
      "flex cursor-default items-center justify-center py-2",
      "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
      "border-t border-[var(--glass-border-subtle)]",
      "text-[var(--text-muted)]",
      // Aurora Interactive States
      "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
      "hover:bg-[var(--glass-surface-medium)] hover:text-[var(--text-primary)]",
      "hover:shadow-[var(--shadow-glow-soft)]",
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 transition-transform duration-[var(--motion-medium)]" />
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

        // Aurora Premium Glass Floating Panel
        "bg-[var(--glass-surface-strong)] backdrop-blur-[var(--backdrop-blur-strong)]",
        "border border-[var(--glass-border-medium)] shadow-[var(--shadow-premium-strong)]",

        // Aurora Glass Overlay
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-[var(--aurora-primary-500)]/8 before:to-[var(--aurora-lila-500)]/4 before:pointer-events-none",

        // Typography
        "text-[var(--text-primary)]",

        // Positioning
        position === "popper" && [
          "data-[side=bottom]:translate-y-2",
          "data-[side=left]:-translate-x-2",
          "data-[side=right]:translate-x-2",
          "data-[side=top]:-translate-y-2",
        ],

        // Aurora Premium Transitions
        "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",

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
          // Aurora Scrollbar Styling
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--glass-border-medium)]",
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

      // Aurora Glass Label Style
      "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
      "shadow-[var(--shadow-glow-soft)]",
      "rounded-[var(--radius-sm)]",
      "border border-[var(--glass-border-subtle)]",

      // Typography
      "text-xs font-semibold tracking-wide uppercase",
      "text-[var(--text-secondary)]",

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
      "min-h-[var(--touch-target-compact)]",

      // Aurora Glass Base
      "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-subtle)]",
      "border border-[var(--glass-border-subtle)]",

      // Typography
      "text-sm text-[var(--text-secondary)]",
      "font-medium tracking-[-0.01em]",

      // Aurora Interactive States
      "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
      "outline-none",

      // Aurora Hover State
      "hover:bg-[var(--glass-surface-medium)] hover:backdrop-blur-[var(--backdrop-blur-medium)]",
      "hover:shadow-[var(--shadow-glow-soft)]",
      "hover:text-[var(--text-primary)]",
      "hover:border-[var(--glass-border-medium)]",
      "hover:scale-[1.02]",

      // Aurora Focus State
      "focus:bg-[var(--glass-surface-medium)]",
      "focus:shadow-[var(--shadow-glow-primary)]",
      "focus:text-[var(--text-primary)]",
      "focus:border-[var(--glass-border-aurora)]",

      // Aurora Selected State (Premium Gradient)
      "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[var(--aurora-primary-500)] data-[state=checked]:to-[var(--aurora-lila-500)]",
      "data-[state=checked]:shadow-[var(--shadow-glow-primary)]",
      "data-[state=checked]:text-white data-[state=checked]:backdrop-blur-[var(--backdrop-blur-strong)]",
      "data-[state=checked]:font-semibold",
      "data-[state=checked]:border-[var(--aurora-primary-400)]",

      // Disabled State
      "data-[disabled]:pointer-events-none",
      "data-[disabled]:opacity-40",
      "data-[disabled]:shadow-none",

      className,
    )}
    {...props}
  >
    {/* Aurora Check Icon Container */}
    <span
      className={cn(
        "absolute left-2 flex h-4 w-4 items-center justify-center",
        "text-[var(--aurora-primary-500)]",
        "data-[state=checked]:text-white data-[state=checked]:drop-shadow-sm",
      )}
    >
      <SelectPrimitive.ItemIndicator>
        <Check
          className={cn(
            "h-4 w-4",
            "drop-shadow-[var(--shadow-glow-soft)]",
            "animate-in zoom-in-75 duration-[var(--motion-medium)]",
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
      // Aurora Glass Separator Line
      "-mx-1 my-2 h-px",
      "bg-gradient-to-r from-transparent via-[var(--glass-border-medium)] to-transparent",
      "shadow-[var(--shadow-glow-soft)]",

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
