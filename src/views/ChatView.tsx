import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Composer } from "../components/chat/Composer";
import MessageList from "../components/chat/MessageList";
import ScrollToEndFAB from "../components/chat/ScrollToEndFAB";
import { HeroOrb } from "../components/ui/HeroOrb";
// import CodeBlock from "../components/CodeBlock"; // Temporarily unused
// import { CopyButton } from "../components/ui/CopyButton"; // Temporarily unused
import { useToasts } from "../components/ui/Toast";
import { getVirtualListEnabled } from "../config/featureFlags";
import {
  getComposerOffset,
  getCtxMaxTokens,
  getCtxReservedTokens,
  getMemoryEnabled,
  getNSFW,
  getSelectedModelId,
  getStyle,
  getTemplateId,
  getUseRoleStyle,
} from "../config/settings";
import {
  appendMessage as convAppendMessage,
  getConversationMessages as convGetMessages,
} from "../hooks/useConversations";
import { useVisualViewport } from "../hooks/useVisualViewport";
import { humanErrorToToast } from "../lib/errors/humanError";
import { buildMessages as buildPipelineMessages } from "../services/chatPipeline";
import { sendChat } from "../services/chatService";
import { ContextManager } from "../services/contextManager";
import { formatMemoryForSystem, loadMemory, updateMemory } from "../services/memory";
import { getApiKey } from "../services/openrouter";
import type { ChatMessage } from "../types/chat";

type Msg = { id: string; role: "assistant" | "user"; content: string };
const uid = () => Math.random().toString(36).slice(2);

/* Message component - temporarily unused due to MessageList integration
const Message: React.FC<{ msg: Msg; onCopied: () => void }> = ({ msg, onCopied: _onCopied }) => {
  const parts = React.useMemo(() => {
    const src = msg.content;
    const out: Array<{ t: "text" | "code"; content: string; lang?: string }> = [];
    const fence = /```(\w+)?\n([\s\S]*?)```/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = fence.exec(src))) {
      if (m.index > last) out.push({ t: "text", content: src.slice(last, m.index) });
      const lang = m[1]?.trim() || "txt";
      const code = ((m[2] ?? "") + "").trimEnd();
      out.push({ t: "code", lang, content: code });
      last = m.index + m[0].length;
    }
    if (last < src.length) out.push({ t: "text", content: src.slice(last) });
    return out;
  }, [msg.content]);
  return (
    <div className="relative my-2 text-text">
      <CopyButton
        text={msg.content}
        className="absolute right-2 top-2"
        aria-label="Nachricht kopieren"
      />
      {parts.map((p, i) =>
        p.t === "code" ? (
          <CodeBlock key={i} code={p.content} lang={p.lang ?? "txt"} onCopied={() => {}} />
        ) : (
          <p key={i} className="whitespace-pre-wrap leading-relaxed">
            {p.content.trim()}
          </p>
        ),
      )}
    </div>
  );
};
*/

const ChatView: React.FC<{ convId?: string | null }> = ({ convId = null }) => {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: uid(), role: "assistant", content: "Bereit." }]);
  const [sending, setSending] = useState(false);
  const [showScrollFab, setShowScrollFab] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toasts = useToasts();
  const viewport = useVisualViewport();
  const abortRef = useRef<AbortController | null>(null);

  const MAX_HISTORY = 200;
  const trimHistory = (arr: Msg[]) => (arr.length > MAX_HISTORY ? arr.slice(-MAX_HISTORY) : arr);

  function maybeVibrate(pattern: number | number[]) {
    try {
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isAndroid = /Android/i.test(ua);
      // Opt-out via localStorage
      const pref = ((): boolean => {
        try {
          const v = localStorage.getItem("disa:ui:haptics");
          if (v === null) return true; // default: an
          return v === "true";
        } catch {
          return true;
        }
      })();
      if (isAndroid && pref && "vibrate" in navigator && typeof navigator.vibrate === "function") {
        navigator.vibrate(pattern as number | number[]);
      }
    } catch {
      /* ignore */
    }
  }

  const modelId = useMemo(() => getSelectedModelId() ?? "", []);
  const modelLabel = modelId || "—";

  // Settings für Systemprompt/Policy
  const style = useMemo(() => getStyle(), []);
  const roleId = useMemo(() => getTemplateId(), []);
  const useRoleStyle = useMemo(() => getUseRoleStyle(), []);
  const allowNSFW = useMemo(() => getNSFW(), []);
  const memEnabled = useMemo(() => getMemoryEnabled(), []);
  const ctxLimits = useMemo(
    () => ({ max: getCtxMaxTokens(), reserve: getCtxReservedTokens() }),
    [],
  );

  const composerOffset = useMemo(() => getComposerOffset(), []);
  const virtEnabled = useMemo(() => getVirtualListEnabled(), []);

  useEffect(() => {
    if (!convId) return;
    try {
      const stored = convGetMessages(convId);
      const mapped = stored
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          id: `${m.role}-${m.createdAt}`,
          role: m.role as "user" | "assistant",
          content: m.content,
        }));
      setMsgs(mapped.length ? mapped : [{ id: uid(), role: "assistant", content: "Bereit." }]);
    } catch {
      /* ignore */
    }
  }, [convId]);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 64;
      setShowScrollFab(!nearBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    send(trimmed);
  };

  const handleStop = () => {
    stop();
  };

  const handleClearError = () => {
    setError(null);
  };

  function buildMessages(userText: string): ChatMessage[] {
    const memoryText = memEnabled && convId ? formatMemoryForSystem(loadMemory(convId)) : "";
    const history = msgs
      .filter((m) => m.content.trim().length > 0)
      .map(({ role, content }) => ({ role, content }));
    const built = buildPipelineMessages({
      userInput: userText,
      history,
      nsfw: allowNSFW,
      style,
      roleTemplateId: roleId,
      useRoleStyle,
      memory: memoryText || null,
    }) as unknown as ChatMessage[];
    const cm = new ContextManager({ maxTokens: ctxLimits.max, reservedTokens: ctxLimits.reserve });
    return cm.optimize(built);
  }

  function send(trimmed: string) {
    if (!trimmed || sending) return;
    maybeVibrate(15);

    setMsgs((m) => trimHistory([...m, { id: uid(), role: "user", content: trimmed }]));
    if (convId) {
      convAppendMessage(convId, { role: "user", content: trimmed } as any);
    }
    setSending(true);
    setError(null);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const apiKey = getApiKey();

    let accum = "";
    void sendChat({
      apiKey,
      model: modelId,
      messages: buildMessages(trimmed),
      signal: ac.signal,
      onChunk: (t) => {
        accum += t;
        setMsgs((m) => {
          const last = m[m.length - 1];
          if (last?.role === "assistant") {
            const copy = m.slice(0, -1);
            copy.push({ ...last, content: accum });
            return trimHistory(copy);
          }
          return trimHistory([...m, { id: uid(), role: "assistant", content: accum }]);
        });
      },
      onDone: () => {
        setSending(false);
        abortRef.current = null;
        if (convId && accum.trim().length > 0) {
          convAppendMessage(convId, { role: "assistant", content: accum } as any);
          const turns = convGetMessages(convId).map((t) => ({ role: t.role, content: t.content }));
          const recent = turns.slice(-10);
          updateMemory(convId, recent as any);
        }
      },
      onError: (err) => {
        setSending(false);
        abortRef.current = null;

        // Show user-friendly error toast
        const errorToast = humanErrorToToast(err);
        toasts.push(errorToast);
        setError("Die Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.");

        // Also add a brief error message to chat for context
        setMsgs((m) =>
          trimHistory([
            ...m,
            {
              id: uid(),
              role: "assistant",
              content:
                "Die Anfrage konnte nicht verarbeitet werden. Siehe Benachrichtigung für Details.",
            },
          ]),
        );
      },
    });
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setSending(false);
    maybeVibrate([5, 30]);
  }

  return (
    <div className="min-h-[100svh]">
      <main
        className="mx-auto w-full max-w-4xl px-4 pt-3"
        style={{ paddingBottom: `calc(var(--bottomnav-h, 56px) + 160px)` }}
      >
        <div className="mx-auto mb-2 mt-1 w-full max-w-3xl px-1 text-xs text-text-muted">
          {sending ? "Antwort wird erstellt …" : `Modell: ${modelLabel || "—"}`}
        </div>

        <MessageList
          messages={msgs.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: Date.now(),
          }))}
          isLoading={sending}
          onCopyMessage={(content) => {
            void navigator.clipboard?.writeText(content);
            toasts.push({ kind: "success", title: "Kopiert" });
          }}
          virtualizeThreshold={virtEnabled ? 50 : 100}
        />

        {/* Show listening orb when sending */}
        {sending && (
          <div className="flex justify-center py-8">
            <HeroOrb state="listening" size="md" />
          </div>
        )}
      </main>

      <div
        className="fixed left-0 right-0 z-50"
        style={{
          bottom: viewport.isKeyboardOpen
            ? `calc(${viewport.offsetTop}px + var(--keyboard-offset, 0px) + 16px)`
            : `calc(env(safe-area-inset-bottom) + var(--bottomnav-h, 56px) + ${composerOffset}px)`,
        }}
      >
        <div className="mx-auto w-full max-w-3xl px-4">
          <Composer
            loading={sending}
            onSend={handleSend}
            onStop={handleStop}
            error={error}
            onClearError={handleClearError}
          />
        </div>
      </div>

      <ScrollToEndFAB
        visible={showScrollFab}
        onClick={() =>
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
        }
      />
    </div>
  );
};

export default ChatView;
