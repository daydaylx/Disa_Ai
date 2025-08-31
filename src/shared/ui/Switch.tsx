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
        "inline-flex w-11 h-6 rounded-full transition-colors " +
        (checked ? "bg-black dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700")
      }
    >
      <span
        className={
          "block w-5 h-5 rounded-full bg-white dark:bg-black transform transition-transform translate-y-0.5 " +
          (checked ? "translate-x-6" : "translate-x-0.5")
        }
      />
    </button>
  );
}
