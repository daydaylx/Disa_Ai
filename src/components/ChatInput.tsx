import React from "react";

import { Textarea } from "./Input";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onEnter?: () => void;
  className?: string;
};

export function ChatInput({ value, onChange, placeholder, disabled, onEnter, className }: Props) {
  return (
    <Textarea
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (onEnter && e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onEnter();
        }
      }}
    />
  );
}
