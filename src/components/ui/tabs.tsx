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
      "inline-flex h-12 items-center justify-center gap-2 rounded-3xl p-2 glass-panel transition-all duration-300 ease-[var(--motion-ease-elastic)]",
      "focus-within:glass-panel--glow focus-within:shadow-glow-primary",
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
      "inline-flex min-h-[42px] items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold glass-panel group transition-all duration-300 ease-[var(--motion-ease-elastic)]",
      "text-text-secondary hover:text-primary",
      "hover:glass-panel--glow hover:shadow-glow-subtle hover:scale-[1.02]",
      "data-[state=active]:glass-panel--glow-active data-[state=active]:text-primary data-[state=active]:shadow-glow-primary data-[state=active]:scale-[1.02] data-[state=active]:animate-pulse-glow",
      "focus-visible:glass-panel--glow focus-visible:shadow-glow-primary focus-visible:scale-[1.02] focus-visible:outline-none",
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
      "mt-6 rounded-3xl p-8 glass-panel--glow transition-all duration-500 ease-[var(--motion-ease-elastic)]",
      "shadow-glow-primary border-glass-strong",
      "focus-visible:outline-none",
      "animate-in fade-in-0 duration-500",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
