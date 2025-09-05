import React from "react";
import type { SVGProps } from "react";

type IconName =
  | "send"
  | "stop"
  | "copy"
  | "settings"
  | "sparkles"
  | "model"
  | "menu"
  | "moon"
  | "sun"
  | "key"
  | "shield"
  | "role"
  | "style"
  | "nsfw"
  | "info"
  | "check"
  | "arrow-down";

type Props = SVGProps<SVGSVGElement> & { name: IconName };

export default function Icon({ name, ...rest }: Props) {
  if (name === "send") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
        <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M22 2L15 22L11 13L2 9L22 2Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (name === "stop") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
        <rect x="6" y="6" width="12" height="12" rx="2" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "copy") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
        <rect x="9" y="9" width="11" height="11" rx="2" strokeWidth="2" />
        <rect x="2" y="2" width="13" height="13" rx="2" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "settings") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
        <path d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z" strokeWidth="1.5" />
        <path
          d="M19.4 15a1 1 0 0 1-.25 1.09l-1 .87a1 1 0 0 0-.23 1.32l.48.83a1 1 0 0 1-1 1.5h-1.23a1 1 0 0 0-.95.68l-.33 1.05a1 1 0 0 1-1.92 0L12 21a1 1 0 0 0-1-.68H9.77a1 1 0 0 1-1-.68L8.44 18.5a1 1 0 0 0-.95-.68H6.23a1 1 0 0 1-1-1.5l.48-.83a1 1 0 0 0-.23-1.32l-1-.87A1 1 0 0 1 4.6 9l1-.87a1 1 0 0 0 .23-1.32L5.35 5a1 1 0 0 1 1-1.5h1.23a1 1 0 0 0 .95-.68L8.86 1.8a1 1 0 0 1 1.92 0L12 3a1 1 0 0 0 1 .68h1.23a1 1 0 0 1 1 1.5l-.48.83a1 1 0 0 0 .23 1.32l1 .87A1 1 0 0 1 19.4 15Z"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  if (name === "sparkles") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
        <path
          d="M12 2l2 6l6 2l-6 2l-2 6l-2-6l-6-2l6-2l2-6Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "arrow-down") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
        <path d="M12 5v14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 13l6 6l6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Fallback: einfaches Info-Icon
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path
        d="M12 8h.01M11 12h2v4h-2z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
