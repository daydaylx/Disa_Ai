import React from "react";

import { requestChatFocus, requestNewChatSession } from "../utils/focusChatInput";

export default function StartHero() {
  const onStart = () => {
    try {
      if (location.hash !== "#/chat") location.hash = "#/chat";
    } catch (e) {
      void e;
      /* ignore */
    }
    requestNewChatSession({});
    requestChatFocus();
  };
  return (
    <section className="rounded-3xl border border-white/30 bg-white/60 p-6 shadow-soft backdrop-blur-lg md:p-8">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#F5F3FF] to-[#EEF2FF]" />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">Triff Disa</h2>
          <p className="text-sm text-slate-600">Direkt. Ehrlich. Schnell.</p>
        </div>
        <button
          onClick={onStart}
          className="shrink-0 rounded-[14px] px-4 py-2 font-medium text-white btn-primary"
        >
          Los geht’s
        </button>
      </div>
    </section>
  );
}
