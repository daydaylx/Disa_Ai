import * as React from "react";

import { cn } from "@/lib/utils";

import { Switch } from "./Switch";

interface SettingsRowProps {
  label: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  labelId?: string;
}

/**
 * SettingsRow - Consistent row layout for settings screens
 *
 * Use for: toggle rows, select rows, info rows
 * Layout: Label + description on left, control on right
 */
export function SettingsRow({
  label,
  description,
  children,
  className,
  labelId,
}: SettingsRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        "border-b border-white/[0.06]",
        className,
      )}
    >
      <div className="flex-1 min-w-0">
        <p id={labelId} className="text-sm font-semibold text-ink-primary">
          {label}
        </p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-ink-tertiary">{description}</p>
        )}
      </div>
      <div className="w-full sm:w-auto sm:min-w-[12rem] sm:max-w-sm sm:flex-shrink-0">
        {children}
      </div>
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
  const labelId = React.useId();

  return (
    <SettingsRow label={label} labelId={labelId} description={description} className={className}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-labelledby={labelId}
      />
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
    <section className={cn("space-y-3", className)}>
      <div className="px-1">
        <h2 className="text-base font-semibold tracking-tight text-ink-primary">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{description}</p>
        )}
      </div>
      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.10] bg-surface-1/82 px-4 shadow-[0_14px_34px_-28px_rgba(0,0,0,0.72)] ring-1 ring-inset ring-white/[0.04] sm:px-5 sm:backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent"
          aria-hidden
        />
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}
