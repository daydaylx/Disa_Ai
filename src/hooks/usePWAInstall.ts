import React from "react"

type Choice = { outcome: "accepted" | "dismissed"; platform?: string }
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<Choice>
}

const LS_KEY_DISMISSED = "disa:pwa:dismissed"

function isStandalone(): boolean {
  try {
    // iOS Safari
    // @ts-ignore
    if (typeof navigator !== "undefined" && navigator.standalone) return true
  } catch {}
  try {
    return window.matchMedia("(display-mode: standalone)").matches
  } catch { return false }
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false
  const ua = navigator.userAgent || ""
  return /iphone|ipad|ipod/i.test(ua)
}

export function usePWAInstall() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = React.useState<boolean>(() => isStandalone())
  const [dismissed, setDismissed] = React.useState<boolean>(() => {
    try { return localStorage.getItem(LS_KEY_DISMISSED) === "true" } catch { return false }
  })

  React.useEffect(() => {
    function onBIP(e: Event) {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    function onInstalled() {
      setInstalled(true)
      try { localStorage.removeItem(LS_KEY_DISMISSED) } catch {}
      setDeferred(null)
    }
    window.addEventListener("beforeinstallprompt", onBIP as any)
    window.addEventListener("appinstalled", onInstalled as any)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP as any)
      window.removeEventListener("appinstalled", onInstalled as any)
    }
  }, [])

  async function requestInstall() {
    if (!deferred) return
    try {
      await deferred.prompt()
      const choice = await deferred.userChoice
      if (choice?.outcome === "accepted") {
        // Nutzer hat den Dialog angenommen – warten auf appinstalled
      } else {
        // Nutzer abgebrochen → Banner später nicht sofort wieder nerven
        try { localStorage.setItem(LS_KEY_DISMISSED, "true") } catch {}
        setDismissed(true)
      }
    } catch {
      // Wenn prompt() scheitert: Banner nicht spammen
      try { localStorage.setItem(LS_KEY_DISMISSED, "true") } catch {}
      setDismissed(true)
    } finally {
      setDeferred(null)
    }
  }

  function dismiss() {
    try { localStorage.setItem(LS_KEY_DISMISSED, "true") } catch {}
    setDismissed(true)
  }

  const canPrompt = !!deferred
  const ios = isIOS()
  const showIOSHowTo = ios && !installed && !canPrompt && !dismissed

  const visible = !installed && !dismissed && (canPrompt || showIOSHowTo)

  return {
    visible,
    canPrompt,
    requestInstall,
    dismiss,
    showIOSHowTo,
  }
}
