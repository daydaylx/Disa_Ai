import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "../../lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const dialogOverlayVariants = cva(
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 transition-[backdrop-filter,background-color] duration-medium ease-standard",
  {
    variants: {
      variant: {
        default: "bg-overlay-scrim",
        glass:
          "bg-overlay-scrim/40 backdrop-blur-sm supports-[backdrop-filter]:bg-overlay-scrim/60",
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
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] data-[state=open]:zoom-in-95 fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-[var(--space-stack-md)] p-[var(--space-lg)] text-text-primary transition duration-medium ease-emphasized",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--radius-xl)] border border-overlay-dialog-border bg-overlay-dialog shadow-neo-xl",
        glass:
          "rounded-[var(--radius-xl)] border border-overlay-dialog-border/40 bg-overlay-dialog/80 backdrop-blur-xl shadow-neo-xl supports-[backdrop-filter]:bg-overlay-dialog/60",
        neumorphic:
          "rounded-[var(--radius-2xl)] border border-[var(--border-neumorphic-light)] bg-[var(--surface-neumorphic-floating)] shadow-neo-xl motion-safe:hover:shadow-floating motion-safe:transition-shadow motion-safe:duration-300",
        floating:
          "rounded-[var(--radius-2xl)] border border-overlay-dialog-border/30 bg-overlay-dialog shadow-floating motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-elevated motion-safe:transition-all motion-safe:duration-200",
        soft: "rounded-[var(--radius-2xl)] border border-overlay-dialog-border/20 bg-overlay-dialog/95 shadow-depth-3 backdrop-blur-sm",
        elevated:
          "rounded-[var(--radius-xl)] border border-overlay-dialog-border bg-overlay-dialog shadow-depth-4",
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
        md: "p-[var(--space-lg)]",
        lg: "p-[var(--space-xl)]",
        xl: "p-[var(--space-2xl)]",
      },
    },
    defaultVariants: {
      variant: "default",
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
      <DialogPrimitive.Close className="absolute right-[var(--space-md)] top-[var(--space-md)] inline-flex size-[var(--size-touch-compact)] items-center justify-center rounded-[var(--radius-md)] text-text-tertiary transition-[background,color,box-shadow] duration-small ease-standard hover:bg-action-ghost-hover hover:text-text-primary focus-visible:shadow-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-focus)] disabled:pointer-events-none neo-button-subtle">
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
