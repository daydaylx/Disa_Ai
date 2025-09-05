import React, { useEffect, useRef, useState } from "react";

import { CHAT_FOCUS_EVENT, CHAT_NEWSESSION_EVENT, requestChatFocus } from "../utils/focusChatInput";

export interface ChatInputProps {
  onSubmit: (text: string) => void;
  onStop?: () => void;
  busy?: boolean;
}

function ChatInputBase({ onSubmit, onStop, busy }: ChatInputProps) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 6 * 24 + 16) + "px";
  }, [value]);
  useEffect(() => {
    const focus = () => {
      setTimeout(() => taRef.current?.focus(), 10);
      wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };
    const newSession = () => {}; // optional nutzbar
    window.addEventListener(CHAT_FOCUS_EVENT, focus);
    // cast to any to avoid eslint no-undef on DOM EventListener symbol
    window.addEventListener(CHAT_NEWSESSION_EVENT, newSession as any);
    return () => {
      window.removeEventListener(CHAT_FOCUS_EVENT, focus);
      window.removeEventListener(CHAT_NEWSESSION_EVENT, newSession as any);
    };
  }, []);

  const send = () => {
    const t = value.trim();
    if (!t || busy) return;
    onSubmit(t);
    setValue("");
    requestChatFocus();
  };
  const onKey: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      ref={wrapRef}
      className="sticky bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/40 to-transparent pt-2"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
    >
      <div className="mx-auto max-w-3xl px-3">
        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            placeholder="/role, /style, /nsfw, /model verfügbar – kurz & konkret fragen"
            className="max-h-[176px] min-h-[40px] flex-1 resize-none bg-transparent placeholder-white/50 outline-none"
          />
          {busy ? (
            <button
              onClick={onStop}
              className="shrink-0 rounded-xl border border-white/10 bg-white/10 px-3 py-2"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={send}
              disabled={!value.trim()}
              className="shrink-0 rounded-xl border border-white/10 bg-white/10 px-3 py-2 disabled:opacity-50"
            >
              Senden
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatInputBase;

// Named wrapper for compatibility with features/chat/ requirements
export function ChatInput(props: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop?: () => void;
  busy?: boolean;
}) {
  const baseProps: any = {
    onSubmit: () => {
      props.onSend();
    },
    busy: props.busy,
  };
  if (props.onStop) baseProps.onStop = props.onStop; // exactOptionalPropertyTypes: nur setzen wenn vorhanden
  return <ChatInputBase {...baseProps} />;
}
