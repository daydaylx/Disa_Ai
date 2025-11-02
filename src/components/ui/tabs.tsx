import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "../../lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Dramatic Neomorphic Tabs Container
      "inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] p-1.5 transition-all duration-300 ease-out",
      "bg-[var(--surface-neumorphic-base)]",
      "shadow-[var(--shadow-inset-subtle)]",
      "border border-[var(--border-neumorphic-subtle)]",
      "text-[var(--color-text-secondary)]",
      // Enhanced Interactive States
      "hover:shadow-[var(--shadow-inset-medium)]",
      "focus-within:shadow-[var(--shadow-inset-medium)]",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Dramatic Neomorphic Tab Trigger
      "inline-flex min-h-[38px] items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold transition-all duration-300 ease-out",
      "text-[var(--color-text-secondary)]",

      // Default State (Inactive)
      "hover:text-[var(--color-text-primary)]",
      "hover:bg-[var(--surface-neumorphic-raised)]",
      "hover:shadow-[var(--shadow-neumorphic-sm)]",
      "hover:-translate-y-0.5",

      // Active State - Dramatically Raised
      "data-[state=active]:bg-[var(--surface-neumorphic-floating)]",
      "data-[state=active]:shadow-[var(--shadow-neumorphic-lg)]",
      "data-[state=active]:text-[var(--acc1)]",
      "data-[state=active]:font-bold",
      "data-[state=active]:-translate-y-1",
      "data-[state=active]:scale-105",
      "data-[state=active]:border data-[state=active]:border-[var(--border-neumorphic-light)]",

      // Enhanced Active Hover
      "data-[state=active]:hover:shadow-[var(--shadow-neumorphic-xl)]",
      "data-[state=active]:hover:-translate-y-1.5",
      "data-[state=active]:hover:scale-110",
      "data-[state=active]:hover:shadow-[0_0_20px_rgba(75,99,255,0.3)]",

      // Focus States
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--acc1)]/50 focus-visible:ring-offset-2",

      // Disabled State
      "disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none",

      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      // Dramatic Neomorphic Content Container
      "mt-4 rounded-[var(--radius-lg)] p-6 transition-all duration-500 ease-out",
      "bg-[var(--surface-neumorphic-floating)]",
      "shadow-[var(--shadow-neumorphic-md)]",
      "border border-[var(--border-neumorphic-light)]",

      // Enhanced Focus State
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--acc1)]/50 focus-visible:ring-offset-2",
      "focus-visible:shadow-[var(--shadow-neumorphic-lg)]",

      // Content Animation
      "animate-in slide-in-from-bottom-2 fade-in-0 duration-500",

      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
