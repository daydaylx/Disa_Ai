import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { X } from "../../lib/icons";
import { cn } from "../../lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const dialogOverlayVariants = cva(
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-[var(--z-modal-backdrop)] duration-[180ms] ease-[cubic-bezier(.23,1,.32,1)]",
  {
    variants: {
      variant: {
        default: "bg-overlay-scrim",
        glass:
          "bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        neumorphic:
          "bg-[var(--surface-neumorphic-overlay)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--surface-neumorphic-overlay)]/80",
        soft: "bg-overlay-scrim/30 backdrop-blur-lg supports-[backdrop-filter]:bg-overlay-scrim/50",
        minimal: "bg-overlay-scrim/20 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
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

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-[var(--z-modal)] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-xl)] border border-[var(--border-neumorphic-subtle)] bg-[var(--surface-neumorphic-floating)] shadow-surface",
        glass:
          "rounded-[18px] border border-[color-mix(in_srgb,var(--line)_70%,transparent)] bg-[color-mix(in_srgb,var(--surface-card)_90%,white_10%)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl",
        neumorphic:
          "rounded-[var(--radius-2xl)] border border-[var(--border-neumorphic-light)] bg-[var(--surface-neumorphic-floating)] shadow-elevated motion-safe:hover:shadow-elevated motion-safe:transition-shadow motion-safe:duration-[180ms] motion-safe:ease-[cubic-bezier(.23,1,.32,1)]",
        floating:
          "rounded-[var(--radius-2xl)] border border-overlay-dialog-border/30 bg-overlay-dialog shadow-surface motion-safe:hover:-translate-y-[1px] motion-safe:hover:shadow-elevated motion-safe:transition-transform motion-safe:duration-[120ms] motion-safe:ease-[cubic-bezier(.23,1,.32,1)]",
        soft: "rounded-[var(--radius-2xl)] border border-overlay-dialog-border/20 bg-overlay-dialog/95 shadow-surface backdrop-blur-sm",
        elevated:
          "rounded-[var(--radius-xl)] border border-overlay-dialog-border bg-overlay-dialog shadow-neo-md",
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        full: "max-w-[90vw] w-full",
      },
      padding: {
        none: "p-0",
        sm: "p-[var(--space-md)]",
        md: "p-6",
        lg: "p-[var(--space-xl)]",
        xl: "p-[var(--space-2xl)]",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "lg",
      padding: "md",
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
      className={cn(dialogContentVariants({ variant, size, padding }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-[var(--space-md)] top-[var(--space-md)] inline-flex size-[var(--size-touch-compact)] items-center justify-center rounded-[var(--radius-md)] text-text-tertiary transition-[background,color,box-shadow] duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)] hover:bg-[var(--surface-neumorphic-raised)] hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus-neo disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Schließen</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-[var(--space-stack-xs)] text-center sm:text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-[var(--space-stack-xs)] sm:flex-row sm:justify-end sm:gap-[var(--space-inline-sm)]",
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
      "text-headline font-semibold leading-none tracking-tight text-text-primary",
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
    className={cn("text-body text-text-secondary", className)}
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
