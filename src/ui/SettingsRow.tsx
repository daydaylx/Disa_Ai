import * as React from "react";

import { cn } from "@/lib/utils";

import { Switch } from "./Switch";

interface SettingsRowProps {
  label: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * SettingsRow - Consistent row layout for settings screens
 *
 * Use for: toggle rows, select rows, info rows
 * Layout: Label + description on left, control on right
 */
export function SettingsRow({ label, description, children, className }: SettingsRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-4 border-b border-white/5 last:border-b-0",
        className,
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink-primary">{label}</p>
        {description && (
          <p className="text-xs text-ink-tertiary mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

interface SettingsToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * SettingsToggleRow - Settings row with built-in Switch
 */
export function SettingsToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: SettingsToggleRowProps) {
  return (
    <SettingsRow label={label} description={description} className={className}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </SettingsRow>
  );
}

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SettingsSection - Group related settings with a header
 */
export function SettingsSection({ title, description, children, className }: SettingsSectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-ink-primary">{title}</h3>
        {description && <p className="text-xs text-ink-tertiary mt-1">{description}</p>}
      </div>
      <div className="bg-surface-1 rounded-2xl border border-white/5 px-4">{children}</div>
    </section>
  );
}
