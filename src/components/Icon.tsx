import React from "react"
import type { SVGProps } from "react"

type IconName = "send" | "stop" | "copy" | "settings" | "sparkles" | "model" | "menu"
type Props = SVGProps<SVGSVGElement> & { name: IconName }

export default function Icon({ name, ...rest }: Props) {
  if (name === "send") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
      <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22l-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
    </svg>
  )
  if (name === "stop") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
      <rect x="6" y="6" width="12" height="12" rx="2" strokeWidth="2"/>
    </svg>
  )
  if (name === "copy") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
      <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/>
      <rect x="2" y="2" width="13" height="13" rx="2" strokeWidth="2"/>
    </svg>
  )
  if (name === "settings") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" strokeWidth="2"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.12 4a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.12.57.53 1.04 1.1 1.2H21a2 2 0 1 1 0 4h-.09c-.57.16-.98.63-1.1 1.2z" strokeWidth="1.5"/>
    </svg>
  )
  if (name === "sparkles") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
      <path d="M5 3l1.5 3L10 7.5 6.5 9 5 12 3.5 9 0 7.5 3.5 6 5 3z" transform="translate(2 2)" strokeWidth="1.5" fill="currentColor"/>
      <path d="M18 2l.8 1.6L21 4.5 18.8 5.4 18 7 17.2 5.4 15 4.5l2.2-.9L18 2z" strokeWidth="1.5" fill="currentColor"/>
    </svg>
  )
  if (name === "model") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
      <rect x="3" y="5" width="18" height="14" rx="3" strokeWidth="2"/>
      <path d="M7 9h10M7 13h6" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...rest}>
      <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
