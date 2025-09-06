import React from "react";

type Props = { checked: boolean; onCheckedChange: (v: boolean) => void };

export function Switch({ checked, onCheckedChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={
        "inline-flex h-6 w-11 rounded-full transition-colors " +
        (checked ? "bg-black dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700")
      }
    >
      <span
        className={
          "block h-5 w-5 translate-y-0.5 transform rounded-full bg-white transition-transform dark:bg-black " +
          (checked ? "translate-x-6" : "translate-x-0.5")
        }
      />
    </button>
  );
}
