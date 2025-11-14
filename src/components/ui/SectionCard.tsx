import * as React from "react";

import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export interface SectionCardProps {
  /** Section title */
  title?: string;

  /** Section subtitle/description */
  subtitle?: string;

  /** Children (form fields, content, etc.) */
  children: React.ReactNode;

  /** Custom className */
  className?: string;

  /** Actions for the header (e.g., buttons) */
  headerActions?: React.ReactNode;

  /** Custom padding (default: "lg") */
  padding?: "sm" | "md" | "lg";

  /** Footer content */
  footer?: React.ReactNode;
}

/**
 * SectionCard - Einheitliche Sektion für Settings und Content-Bereiche
 *
 * Features:
 * - Konsistente Innenabstände
 * - Glassmorphism-Styling
 * - Optionaler Header mit Title + Actions
 * - Optionaler Footer
 * - Automatisches Spacing zwischen Kindern
 *
 * @example
 * ```tsx
 * <SectionCard title="API-Einstellungen" subtitle="Konfiguriere deine API-Keys">
 *   <Label htmlFor="api-key">API-Key</Label>
 *   <Input id="api-key" type="password" />
 *
 *   <Label htmlFor="model">Modell</Label>
 *   <Select id="model">...</Select>
 * </SectionCard>
 * ```
 */
export function SectionCard({
  title,
  subtitle,
  children,
  className,
  headerActions,
  padding = "lg",
  footer,
}: SectionCardProps) {
  return (
    <Card
      tone="glass-primary"
      elevation="surface"
      padding="none"
      className={cn("overflow-hidden", className)}
      data-testid="section-card"
    >
      {/* Header */}
      {(title || subtitle || headerActions) && (
        <CardHeader
          className={cn(
            "flex flex-row items-start justify-between gap-4 border-b border-line",
            padding === "sm" && "p-space-sm",
            padding === "md" && "p-space-md",
            padding === "lg" && "p-space-lg",
          )}
        >
          <div className="flex-1 space-y-1">
            {title && <CardTitle className="text-style-heading-sm">{title}</CardTitle>}
            {subtitle && <p className="text-style-body text-text-secondary">{subtitle}</p>}
          </div>

          {headerActions && <div className="flex-shrink-0">{headerActions}</div>}
        </CardHeader>
      )}

      {/* Content */}
      <CardContent
        className={cn(
          "space-y-4 text-style-body",
          padding === "sm" && "p-space-sm",
          padding === "md" && "p-space-md",
          padding === "lg" && "p-space-lg",
        )}
      >
        {children}
      </CardContent>

      {/* Footer */}
      {footer && (
        <div
          className={cn(
            "border-t border-line bg-surface-muted/30 text-style-body",
            padding === "sm" && "p-space-sm",
            padding === "md" && "p-space-md",
            padding === "lg" && "p-space-lg",
          )}
        >
          {footer}
        </div>
      )}
    </Card>
  );
}
