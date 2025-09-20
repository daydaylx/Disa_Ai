import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Composer } from "../components/chat/Composer";
import MessageList, { type MessageListHandle } from "../components/chat/MessageList";
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
const ChatView = ({ convId = null }: { convId?: string | null }) => {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: uid(), role: "assistant", content: "Bereit." }]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toasts = useToasts();
  const viewport = useVisualViewport();
  const messageListRef = useRef<MessageListHandle | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [scrollState, setScrollState] = useState({ isAtBottom: true, showScrollFab: false });

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
  const composerStack = useMemo(() => Math.max(112, composerOffset + 96), [composerOffset]);
  const composerStyle = useMemo(
    () =>
      ({
        "--composer-offset": `${composerStack}px`,
      }) as CSSProperties,
    [composerStack],
  );

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setSending(false);
    setError(null);

    if (!convId) {
      setMsgs([{ id: uid(), role: "assistant", content: "Bereit." }]);
      requestAnimationFrame(() => messageListRef.current?.scrollToBottom(false));
      return;
    }

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

    requestAnimationFrame(() => messageListRef.current?.scrollToBottom(false));
  }, [convId]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
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

  const handleScrollStateChange = useCallback(
    (state: { isAtBottom: boolean; showScrollFab: boolean }) => {
      setScrollState(state);
    },
    [],
  );

  const scrollToBottom = useCallback(() => {
    messageListRef.current?.scrollToBottom(true);
  }, []);

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
    }) satisfies ChatMessage[];
    const cm = new ContextManager({ maxTokens: ctxLimits.max, reservedTokens: ctxLimits.reserve });
    return cm.optimize(built);
  }

  function send(trimmed: string) {
    if (!trimmed || sending) return;
    maybeVibrate(15);

    setMsgs((m) => trimHistory([...m, { id: uid(), role: "user", content: trimmed }]));
    if (convId) {
      convAppendMessage(convId, { role: "user", content: trimmed });
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
          convAppendMessage(convId, { role: "assistant", content: accum });
          const turns = convGetMessages(convId).map((t) => ({ role: t.role, content: t.content }));
          const recent = turns.slice(-10);
          updateMemory(convId, recent);
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
    <div className="relative flex min-h-[100dvh] flex-col" style={composerStyle}>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 pb-[calc(var(--bottomnav-h,56px)+var(--composer-offset,128px))] pt-3">
        <div className="mx-auto mt-1 w-full max-w-3xl px-1 text-xs text-text-muted">
          {sending ? "Antwort wird erstellt …" : `Modell: ${modelLabel || "—"}`}
        </div>

        <div className="relative flex min-h-0 flex-1 rounded-lg border border-border-subtle bg-surface-100 px-0 py-2">
          <MessageList
            ref={messageListRef}
            className="flex-1"
            messages={msgs.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: Date.now(),
            }))}
            isLoading={sending}
            onCopyMessage={async (content) => {
              try {
                if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
                  await navigator.clipboard.writeText(content);
                } else {
                  const textarea = document.createElement("textarea");
                  textarea.value = content;
                  textarea.setAttribute("readonly", "true");
                  textarea.style.position = "absolute";
                  textarea.style.opacity = "0";
                  document.body.appendChild(textarea);
                  textarea.select();
                  document.execCommand("copy");
                  document.body.removeChild(textarea);
                }
                toasts.push({ kind: "success", title: "Kopiert" });
              } catch (copyError) {
                console.warn(copyError);
                toasts.push({
                  kind: "error",
                  title: "Kopieren fehlgeschlagen",
                  message: "Bitte manuell kopieren oder Berechtigungen prüfen.",
                });
              }
            }}
            virtualizeThreshold={virtEnabled ? 50 : 100}
            onScrollStateChange={handleScrollStateChange}
          />
        </div>

        {/* Show listening orb when sending */}
        {sending && (
          <div className="flex justify-center py-8">
            <HeroOrb state="listening" size="md" />
          </div>
        )}
      </div>

      <div
        className="pointer-events-none fixed left-0 right-0 z-50"
        style={{
          bottom: viewport.isKeyboardOpen
            ? `calc(${viewport.offsetTop}px + var(--keyboard-offset, 0px) + 16px)`
            : `calc(env(safe-area-inset-bottom) + var(--bottomnav-h, 56px) + ${composerOffset}px)`,
        }}
      >
        <div className="pointer-events-auto mx-auto w-full max-w-3xl px-4">
          <Composer
            loading={sending}
            onSend={handleSend}
            onStop={handleStop}
            error={error}
            onClearError={handleClearError}
          />
        </div>
      </div>

      <ScrollToEndFAB visible={scrollState.showScrollFab} onClick={scrollToBottom} />
    </div>
  );
};

export default ChatView;
