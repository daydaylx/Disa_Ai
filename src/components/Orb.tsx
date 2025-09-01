import React from "react"
export default function Orb({ thinking = false, size = 84, className = "" }: { thinking?: boolean; size?: number; className?: string }) {
  const style: React.CSSProperties = { width: size, height: size }
  return <div className={`orb ${thinking ? "orb--thinking" : ""} ${className}`} style={style} aria-hidden />
}
