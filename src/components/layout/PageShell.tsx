import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { Typography } from "../ui/typography";

interface PageShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  showBreadcrumb?: boolean;
  breadcrumb?: string;
}

export function PageShell({
  children,
  title,
  subtitle,
  actions,
  className,
  showBreadcrumb = true,
  breadcrumb = "Disa AI",
}: PageShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[var(--bg-0)]", // Sehr dunkler Hintergrund
        className,
      )}
    >
      {/* Topbar mit Breadcrumb und Titel */}
      <div className="sticky top-0 z-[var(--z-sticky)] bg-[var(--bg-0)]/95 backdrop-blur-[var(--backdrop-blur-medium)] border-b border-[var(--glass-border-soft)]">
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-4">
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <div className="mb-3">
              <Typography
                variant="body-xs"
                className="text-[var(--text-secondary)] uppercase tracking-[0.16em]"
              >
                {breadcrumb}
              </Typography>
            </div>
          )}

          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <Typography
                variant="h1"
                className="text-[var(--text-primary)] font-semibold text-2xl leading-tight"
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body-sm" className="text-[var(--text-secondary)] mt-1">
                  {subtitle}
                </Typography>
              )}
            </div>

            {/* Actions */}
            {actions && <div className="flex items-center gap-2 ml-4 flex-shrink-0">{actions}</div>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 pt-4 pb-16 space-y-4">{children}</main>
    </div>
  );
}

// Specialized PageShells for different page types
export function ChatPageShell({ children, ...props }: Omit<PageShellProps, "title" | "subtitle">) {
  return (
    <PageShell title="Chat" subtitle="Chat" breadcrumb="Disa AI" {...props}>
      {children}
    </PageShell>
  );
}

export function ModelsPageShell({
  children,
  ...props
}: Omit<PageShellProps, "title" | "subtitle">) {
  return (
    <PageShell title="Modelle" subtitle="Modelle" breadcrumb="Disa AI" {...props}>
      {children}
    </PageShell>
  );
}

export function RolesPageShell({ children, ...props }: Omit<PageShellProps, "title" | "subtitle">) {
  return (
    <PageShell title="Rollen" subtitle="Rollen" breadcrumb="Disa AI" {...props}>
      {children}
    </PageShell>
  );
}

export function SettingsPageShell({
  children,
  ...props
}: Omit<PageShellProps, "title" | "subtitle">) {
  return (
    <PageShell title="Einstellungen" subtitle="Einstellungen" breadcrumb="Disa AI" {...props}>
      {children}
    </PageShell>
  );
}

export function LegalPageShell({
  children,
  title,
  subtitle,
  ...props
}: Omit<PageShellProps, "breadcrumb" | "showBreadcrumb"> & { title: string; subtitle?: string }) {
  return (
    <PageShell
      title={title}
      subtitle={subtitle}
      breadcrumb="Disa AI"
      showBreadcrumb={true}
      {...props}
    >
      {children}
    </PageShell>
  );
}
