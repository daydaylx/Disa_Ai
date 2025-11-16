import * as React from "react";

import { cn } from "../../lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        "relative w-full overflow-x-auto rounded-[var(--radius-lg)]",
        // Glassmorphism container design
        "bg-[color-mix(in_srgb,var(--surface-card)_90%,white_5%)]",
        "border border-[color-mix(in_srgb,var(--line)_70%,transparent)]",
        "shadow-[0_8px_24px_rgba(0,0,0,0.2)]",
        "backdrop-blur-md",
      )}
    >
      <table
        ref={ref}
        className={cn(
          "w-full border-collapse text-left text-sm text-[var(--color-text-primary)]",
          // Enhanced table styling
          "relative z-10",
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      // Glassmorphism header design
      "bg-[color-mix(in_srgb,var(--surface-card)_85%,transparent)]",
      "text-[var(--color-text-primary)]",
      "relative",
      // Header border
      "border-b border-[color-mix(in_srgb,var(--line)_70%,transparent)]",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "bg-[color-mix(in_srgb,var(--surface-card)_80%,transparent)]",
      // Enhanced body styling
      "relative z-10",
      className,
    )}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      // Glassmorphism footer design
      "bg-[color-mix(in_srgb,var(--surface-card)_85%,transparent)]",
      "font-semibold text-[var(--color-text-secondary)]",
      "border-t border-[color-mix(in_srgb,var(--line)_70%,transparent)]",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        // Glassmorphism row design
        "border-b border-[color-mix(in_srgb,var(--line)_50%,transparent)]",
        "transition-all duration-300 ease-out",
        "last:border-0",
        // Enhanced Hover State
        "hover:bg-[color-mix(in_srgb,var(--surface-card)_95%,white_5%)]",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      // Glassmorphism header cell
      "py-4 px-6 text-xs font-bold uppercase tracking-wider",
      "text-[var(--color-text-primary)]",
      "text-left align-middle",
      // Enhanced visual treatment
      "relative",
      "first:rounded-tl-[var(--radius-lg)]",
      "last:rounded-tr-[var(--radius-lg)]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      // Glassmorphism cell
      "py-4 px-6 align-middle text-sm",
      "text-[var(--color-text-secondary)]",
      "transition-colors duration-200",
      // Enhanced hover state from parent row
      "group-hover:text-[var(--color-text-primary)]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      // Glassmorphism caption
      "mt-4 text-sm text-[var(--color-text-tertiary)]",
      "font-medium",
      "px-2",
      className,
    )}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
