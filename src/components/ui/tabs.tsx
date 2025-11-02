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
      "inline-flex h-11 items-center justify-center gap-1 rounded-[var(--radius-lg)] p-1 transition-colors",
      "bg-[var(--surface-neumorphic-raised)]",
      "border border-[var(--border-neumorphic-subtle)]",
      "shadow-[var(--shadow-inset-subtle)]",
      "text-[var(--color-text-secondary)]",
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
      "inline-flex min-h-[36px] items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] px-3.5 py-2 text-sm font-semibold transition-[color,background,box-shadow,transform] duration-200 ease-out",
      "text-[var(--color-text-secondary)]",
      "hover:text-[var(--color-text-primary)]",
      "hover:bg-[var(--surface-neumorphic-floating)]",
      "hover:shadow-neo-sm",
      "data-[state=active]:bg-[var(--surface-neumorphic-floating)]",
      "data-[state=active]:text-[var(--acc1)]",
      "data-[state=active]:shadow-neo-md",
      "data-[state=active]:border data-[state=active]:border-[var(--border-neumorphic-light)]",
      "data-[state=active]:hover:shadow-neo-lg",
      "focus-visible:outline-none focus-visible:shadow-focus-neo",
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
      "mt-4 rounded-[var(--radius-lg)] p-5 transition-opacity duration-300",
      "bg-[var(--surface-neumorphic-floating)]",
      "shadow-neo-sm",
      "border border-[var(--border-neumorphic-subtle)]",
      "focus-visible:outline-none focus-visible:shadow-focus-neo",
      "animate-in fade-in-0 duration-300",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
