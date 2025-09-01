import React from "react"
import { resolveStartTemplate } from "../state/templates"
import { requestChatFocus, requestNewChatSession } from "../utils/focusChatInput"

export default function StartHero() {
  const onStart = () => {
    const tpl = resolveStartTemplate()
    window.location.hash = "/chat"
    if (tpl) requestNewChatSession({ templateId: tpl.id })
    requestChatFocus()
  }
  return (
    <section className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-pink-400/20 via-fuchsia-400/20 to-cyan-400/20 backdrop-blur border border-white/10 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-400 via-fuchsia-400 to-cyan-400" />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">Triff Disa</h2>
          <p className="text-sm opacity-80">Direkt. Ehrlich. Schnell.</p>
        </div>
        <button onClick={onStart}
          className="shrink-0 rounded-2xl px-4 py-2 font-medium bg-gradient-to-r from-pink-500 to-cyan-500 text-white active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-400">
          Los geht’s
        </button>
      </div>
    </section>
  )
}
