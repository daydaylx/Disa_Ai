import React from "react"
export default function ScrollToEndFAB({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  if (!visible) return null
  return <button className="fab" aria-label="Zum Ende scrollen" onClick={onClick}>▼</button>
}
