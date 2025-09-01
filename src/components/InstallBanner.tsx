import React from "react"
import InlineBanner from "./InlineBanner"
import Icon from "./Icon"
import { usePWAInstall } from "../hooks/usePWAInstall"
export default function InstallBanner() {
  const { visible, canPrompt, requestInstall, dismiss, showIOSHowTo } = usePWAInstall()
  if (!visible) return null
  if (canPrompt) {
    return (
      <div className="px-3 pt-2">
        <InlineBanner tone="info" title="App installieren" actions={
          <div className="flex gap-2">
            <button onClick={requestInstall} className="underline inline-flex items-center gap-1">
              <Icon name="check" width="14" height="14" /> Jetzt installieren
            </button>
            <button onClick={dismiss} className="underline opacity-80">Später</button>
          </div>
        }>
          Installiere die App für Schnellstart und ein besseres Erlebnis.
        </InlineBanner>
      </div>
    )
  }
  if (showIOSHowTo) {
    return (
      <div className="px-3 pt-2">
        <InlineBanner tone="info" title="Zum Home-Bildschirm hinzufügen" actions={<button onClick={dismiss} className="underline opacity-80">Ok</button>}>
          iPhone/iPad: Teilen ▵ → <strong>Zum Home-Bildschirm</strong>.
        </InlineBanner>
      </div>
    )
  }
  return null
}
