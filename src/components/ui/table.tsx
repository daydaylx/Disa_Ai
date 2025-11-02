import * as React from "react";

import { cn } from "../../lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        "relative w-full overflow-x-auto rounded-[var(--radius-lg)]",
        // Dramatic Container with Neomorphic Design
        "bg-[var(--surface-neumorphic-floating)]",
        "shadow-[var(--shadow-neumorphic-lg)]",
        "border border-[var(--border-neumorphic-light)]",
        "backdrop-blur-sm",
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
      // Dramatic Header with Gradient and Neomorphic Design
      "bg-gradient-to-r from-[var(--surface-neumorphic-raised)] to-[var(--surface-neumorphic-floating)]",
      "text-[var(--color-text-primary)]",
      "relative",
      // Header border
      "border-b-2 border-[var(--border-neumorphic-light)]",
      // Inner shadow for depth
      "shadow-[inset_0_-2px_6px_rgba(9,12,20,0.1)]",
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
      "bg-[var(--surface-neumorphic-base)]",
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
      // Dramatic Footer with Neomorphic Design
      "bg-gradient-to-r from-[var(--surface-neumorphic-floating)] to-[var(--surface-neumorphic-raised)]",
      "font-semibold text-[var(--color-text-secondary)]",
      "border-t-2 border-[var(--border-neumorphic-light)]",
      "shadow-[inset_0_2px_6px_rgba(9,12,20,0.1)]",
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
        // Dramatic Row with Enhanced Hover
        "border-b border-[var(--border-neumorphic-subtle)]",
        "transition-all duration-300 ease-out",
        "last:border-0",
        // Enhanced Hover State
        "hover:bg-gradient-to-r hover:from-[var(--surface-neumorphic-raised)]/50 hover:to-transparent",
        "hover:shadow-[inset_0_1px_3px_rgba(9,12,20,0.05)]",
        "hover:transform hover:scale-[1.01]",
        "hover:-translate-y-0.5",
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
      // Dramatic Header Cell
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
      // Dramatic Cell with Enhanced Typography
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
      // Dramatic Caption
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
