import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const Tabs = TabsPrimitive.Root;

// Aurora Tabs List Variants with CVA
const tabsListVariants = cva(
  [
    // Aurora Base Styles - Mobile-First
    "inline-flex items-center justify-center gap-[var(--space-inline-xs)]",
    "rounded-[var(--radius-2xl)] p-[var(--space-xs)]",
    "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
    // Touch-optimized
    "min-h-[var(--touch-target-comfortable)] select-none touch-manipulation",
  ].join(" "),
  {
    variants: {
      variant: {
        "aurora-glass": [
          // Premium Aurora Glass Container
          "bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)]",
          "border border-[var(--glass-border-medium)] shadow-[var(--shadow-premium-medium)]",
          "focus-within:border-[var(--glass-border-aurora)] focus-within:shadow-[var(--shadow-glow-primary)]",
        ].join(" "),

        "aurora-soft": [
          // Subtle Aurora Container
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border border-[var(--glass-border-subtle)] shadow-[var(--shadow-glow-soft)]",
          "focus-within:border-[var(--glass-border-medium)] focus-within:shadow-[var(--shadow-glow-primary)]",
        ].join(" "),

        "aurora-minimal": [
          // Minimal Aurora Container
          "bg-[var(--glass-surface-subtle)] border border-[var(--glass-border-subtle)]",
          "focus-within:border-[var(--glass-border-medium)]",
        ].join(" "),
      },

      size: {
        sm: "h-10 p-1",
        default: "h-12 p-[var(--space-xs)]",
        lg: "h-14 p-[var(--space-sm)]",
      },
    },
    defaultVariants: {
      variant: "aurora-glass",
      size: "default",
    },
  },
);

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, size, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

// Aurora Tabs Trigger Variants with CVA
const tabsTriggerVariants = cva(
  [
    // Aurora Base Styles - Touch-Optimized
    "inline-flex items-center justify-center whitespace-nowrap",
    "rounded-[var(--radius-xl)] px-[var(--space-md)] py-[var(--space-sm)]",
    "text-[var(--text-sm)] font-medium tracking-[var(--tracking-normal)]",
    "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
    // Touch-optimized
    "min-h-[var(--touch-target-compact)] select-none touch-manipulation",
  ].join(" "),
  {
    variants: {
      variant: {
        "aurora-glass": [
          // Premium Aurora Glass Tab
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border border-[var(--glass-border-subtle)] text-[var(--text-secondary)]",
          // Hover States
          "hover:bg-[var(--glass-surface-medium)] hover:border-[var(--glass-border-medium)]",
          "hover:text-[var(--text-primary)] hover:shadow-[var(--shadow-glow-soft)] hover:scale-[1.02]",
          // Active States
          "data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--aurora-primary-500)] data-[state=active]:to-[var(--aurora-lila-500)]",
          "data-[state=active]:border-[var(--aurora-primary-400)] data-[state=active]:text-white",
          "data-[state=active]:shadow-[var(--shadow-glow-primary)] data-[state=active]:scale-[1.02]",
          "data-[state=active]:font-semibold",
          // Focus States
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          "focus-visible:shadow-[var(--shadow-glow-primary)] focus-visible:scale-[1.02]",
        ].join(" "),

        "aurora-soft": [
          // Subtle Aurora Tab
          "bg-transparent border-transparent text-[var(--text-secondary)]",
          // Hover States
          "hover:bg-[var(--glass-surface-subtle)] hover:text-[var(--text-primary)]",
          "hover:shadow-[var(--shadow-glow-soft)] hover:scale-[1.02]",
          // Active States
          "data-[state=active]:bg-[var(--glass-surface-medium)] data-[state=active]:backdrop-blur-[var(--backdrop-blur-medium)]",
          "data-[state=active]:border border-[var(--glass-border-aurora)] data-[state=active]:text-[var(--aurora-primary-500)]",
          "data-[state=active]:shadow-[var(--shadow-glow-primary)] data-[state=active]:scale-[1.02]",
          "data-[state=active]:font-semibold",
          // Focus States
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
        ].join(" "),

        "aurora-minimal": [
          // Minimal Aurora Tab
          "bg-transparent border-transparent text-[var(--text-secondary)]",
          // Hover States
          "hover:text-[var(--text-primary)]",
          // Active States
          "data-[state=active]:text-[var(--aurora-primary-500)] data-[state=active]:font-semibold",
          "data-[state=active]:border-b-2 data-[state=active]:border-[var(--aurora-primary-500)]",
          // Focus States
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
        ].join(" "),
      },

      size: {
        sm: "px-[var(--space-sm)] py-[var(--space-xs)] text-[var(--text-xs)] min-h-[var(--touch-target-compact)]",
        default:
          "px-[var(--space-md)] py-[var(--space-sm)] text-[var(--text-sm)] min-h-[var(--touch-target-compact)]",
        lg: "px-[var(--space-lg)] py-[var(--space-md)] text-[var(--text-base)] min-h-[var(--touch-target-comfortable)]",
      },
    },
    defaultVariants: {
      variant: "aurora-glass",
      size: "default",
    },
  },
);

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      tabsTriggerVariants({ variant, size }),
      // Universal States
      "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Aurora Tabs Content Variants with CVA
const tabsContentVariants = cva(
  [
    // Aurora Base Styles
    "rounded-[var(--radius-2xl)] p-[var(--space-lg)]",
    "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
    "focus-visible:outline-none",
    // Aurora Entry Animation
    "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-[var(--motion-medium)]",
  ].join(" "),
  {
    variants: {
      variant: {
        "aurora-glass": [
          // Premium Aurora Glass Content
          "mt-[var(--space-lg)] bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)]",
          "border border-[var(--glass-border-medium)] shadow-[var(--shadow-premium-medium)]",
        ].join(" "),

        "aurora-soft": [
          // Subtle Aurora Content
          "mt-[var(--space-md)] bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border border-[var(--glass-border-subtle)] shadow-[var(--shadow-glow-soft)]",
        ].join(" "),

        "aurora-minimal": [
          // Minimal Aurora Content
          "mt-[var(--space-md)] bg-transparent",
          "border-t border-[var(--glass-border-subtle)]",
        ].join(" "),

        none: [
          // No styling - just content
          "mt-[var(--space-md)]",
        ].join(" "),
      },

      spacing: {
        none: "p-0",
        sm: "p-[var(--space-md)]",
        default: "p-[var(--space-lg)]",
        lg: "p-[var(--space-xl)]",
        xl: "p-[var(--space-2xl)]",
      },
    },
    defaultVariants: {
      variant: "aurora-glass",
      spacing: "default",
    },
  },
);

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant, spacing, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant, spacing }), className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
