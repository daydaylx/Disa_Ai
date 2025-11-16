import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { X } from "../../lib/icons";
import { cn } from "../../lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

// Aurora Dialog Overlay Variants
const dialogOverlayVariants = cva(
  [
    "fixed inset-0 z-[var(--z-modal-backdrop)]",
    "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0",
  ].join(" "),
  {
    variants: {
      variant: {
        "aurora-glass": [
          // Premium Aurora Glass Overlay
          "bg-[var(--surface-overlay)] backdrop-blur-[var(--backdrop-blur-strong)]",
          "supports-[backdrop-filter]:bg-[var(--surface-overlay)]/60",
        ].join(" "),

        "aurora-soft": [
          // Subtle Aurora Overlay
          "bg-[var(--surface-overlay)]/40 backdrop-blur-[var(--backdrop-blur-medium)]",
        ].join(" "),

        "aurora-minimal": [
          // Minimal Aurora Overlay
          "bg-[var(--surface-overlay)]/20 backdrop-blur-[var(--backdrop-blur-subtle)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "aurora-glass",
    },
  },
);

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    VariantProps<typeof dialogOverlayVariants> {}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(dialogOverlayVariants({ variant }), className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Aurora Dialog Content Variants
const dialogContentVariants = cva(
  [
    "fixed left-[50%] top-[50%] z-[var(--z-modal)] grid w-full translate-x-[-50%] translate-y-[-50%]",
    "gap-[var(--space-stack-md)]",
    "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
    // Aurora Premium Entry Animations
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  ].join(" "),
  {
    variants: {
      variant: {
        "aurora-glass": [
          // Premium Aurora Glass Dialog
          "rounded-[var(--radius-2xl)] border border-[var(--glass-border-medium)]",
          "bg-[var(--glass-surface-strong)] backdrop-blur-[var(--backdrop-blur-strong)]",
          "shadow-[var(--shadow-premium-strong)]",
          // Aurora Glass Overlay Effect
          "before:absolute before:inset-0 before:rounded-[var(--radius-2xl)]",
          "before:bg-gradient-to-br before:from-[var(--aurora-primary-500)]/8 before:to-[var(--aurora-lila-500)]/4",
          "before:pointer-events-none",
        ].join(" "),

        "aurora-premium": [
          // Ultra Premium Aurora Dialog
          "rounded-[var(--radius-2xl)] border border-[var(--glass-border-aurora)]",
          "bg-gradient-to-br from-[var(--glass-surface-strong)] to-[var(--glass-surface-medium)]",
          "backdrop-blur-[var(--backdrop-blur-strong)] shadow-[var(--shadow-premium-dramatic)]",
          // Premium Glow Effect
          "before:absolute before:inset-0 before:rounded-[var(--radius-2xl)]",
          "before:bg-gradient-to-br before:from-[var(--aurora-primary-500)]/12 before:to-[var(--aurora-lila-500)]/8",
          "before:pointer-events-none",
        ].join(" "),

        "aurora-soft": [
          // Subtle Aurora Dialog
          "rounded-[var(--radius-xl)] border border-[var(--glass-border-subtle)]",
          "bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "shadow-[var(--shadow-premium-medium)]",
        ].join(" "),

        "aurora-minimal": [
          // Minimal Aurora Dialog
          "rounded-[var(--radius-lg)] border border-[var(--glass-border-subtle)]",
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-subtle)]",
          "shadow-[var(--shadow-glow-soft)]",
        ].join(" "),
      },

      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        full: "max-w-[90vw] w-full",
        mobile: "max-w-[calc(100vw-2rem)] w-full", // Mobile-optimized
      },

      padding: {
        none: "p-0",
        xs: "p-[var(--space-sm)]",
        sm: "p-[var(--space-md)]",
        default: "p-[var(--space-lg)]",
        lg: "p-[var(--space-xl)]",
        xl: "p-[var(--space-2xl)]",
      },
    },
    defaultVariants: {
      variant: "aurora-glass",
      size: "lg",
      padding: "default",
    },
  },
);

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  overlayVariant?: VariantProps<typeof dialogOverlayVariants>["variant"];
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, variant, size, padding, overlayVariant, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay variant={overlayVariant} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ variant, size, padding }), "relative", className)}
      {...props}
    >
      {children}
      {/* Aurora Glass Close Button */}
      <DialogPrimitive.Close
        className={cn(
          // Layout & Position
          "absolute right-[var(--space-md)] top-[var(--space-md)]",
          "inline-flex items-center justify-center",
          // Aurora Glass Close Button Styling
          "size-[var(--touch-target-compact)] rounded-[var(--radius-md)]",
          "bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)]",
          "border border-[var(--glass-border-subtle)]",
          "text-[var(--text-secondary)] shadow-[var(--shadow-glow-soft)]",
          // Aurora Interactive States
          "transition-all duration-[var(--motion-medium)] ease-[var(--ease-aurora)]",
          "hover:bg-[var(--glass-surface-medium)] hover:border-[var(--glass-border-medium)]",
          "hover:text-[var(--text-primary)] hover:shadow-[var(--shadow-glow-primary)]",
          "hover:scale-105 active:scale-95",
          // Focus States
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          "focus-visible:shadow-[var(--shadow-glow-primary)]",
          // Disabled State
          "disabled:pointer-events-none disabled:opacity-50",
          // Touch Optimized
          "select-none touch-manipulation",
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Schließen</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Aurora Dialog Layout Components
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-[var(--space-stack-xs)]",
      "text-center sm:text-left",
      "relative z-10", // Above aurora overlays
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-[var(--space-stack-xs)]",
      "sm:flex-row sm:justify-end sm:gap-[var(--space-inline-sm)]",
      "relative z-10", // Above aurora overlays
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      // Aurora Typography
      "text-[var(--text-xl)] font-semibold leading-[var(--leading-tight)]",
      "tracking-[var(--tracking-tight)] text-[var(--text-primary)]",
      "relative z-10", // Above aurora overlays
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      // Aurora Typography
      "text-[var(--text-base)] leading-[var(--leading-normal)]",
      "text-[var(--text-secondary)]",
      "relative z-10", // Above aurora overlays
      className,
    )}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
