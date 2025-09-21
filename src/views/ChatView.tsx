import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Composer } from "../components/chat/Composer";
import MessageList, { type MessageListHandle } from "../components/chat/MessageList";
import { QuickStylesPanel, useQuickStylesPanel } from "../components/chat/QuickStylesPanel";
import ScrollToEndFAB from "../components/chat/ScrollToEndFAB";
import { StyleRoleIndicator } from "../components/chat/StyleRoleIndicator";
import { GlassCard } from "../components/glass/GlassCard";
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

type Msg = {
  id: string;
  role: "assistant" | "user";
  content: string;
  createdAt: number;
  state?: "error";
  retryText?: string;
};
const uid = () => Math.random().toString(36).slice(2);
const ChatView = ({ convId = null }: { convId?: string | null }) => {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: uid(),
      role: "assistant",
      content: "Bereit.",
      createdAt: Date.now(),
    },
  ]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toasts = useToasts();
  const viewport = useVisualViewport();
  const quickStylesPanel = useQuickStylesPanel();
  const keyboardInset = useMemo(() => {
    if (!viewport.isKeyboardOpen) return 0;
    if (typeof window === "undefined") return 0;
    const innerHeight = window.innerHeight || viewport.height;
    const diff = innerHeight - (viewport.height + viewport.offsetTop);
    return diff > 0 ? diff : 0;
  }, [viewport.height, viewport.offsetTop, viewport.isKeyboardOpen]);
  const keyboardLift = useMemo(() => Math.max(0, keyboardInset - 12), [keyboardInset]);
  const horizontalInset = useMemo(() => Math.max(0, viewport.offsetLeft), [viewport.offsetLeft]);
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
  const baseComposerBottom = useMemo(
    () => `calc(env(safe-area-inset-bottom) + var(--bottomnav-h, 56px) + ${composerOffset}px)`,
    [composerOffset],
  );
  const contentBottomPadding = useMemo(
    () =>
      `calc(env(safe-area-inset-bottom) + var(--bottomnav-h, 56px) + var(--composer-offset, 128px) + ${keyboardLift}px)`,
    [keyboardLift],
  );
  const hasUserMessages = useMemo(() => msgs.some((m) => m.role === "user"), [msgs]);
  const showEmptyState = useMemo(() => !hasUserMessages && !sending, [hasUserMessages, sending]);

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setSending(false);
    setError(null);

    if (!convId) {
      setMsgs([
        {
          id: uid(),
          role: "assistant",
          content: "Bereit.",
          createdAt: Date.now(),
        },
      ]);
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
          createdAt: m.createdAt ?? Date.now(),
        }));
      setMsgs(
        mapped.length
          ? mapped
          : [
              {
                id: uid(),
                role: "assistant",
                content: "Bereit.",
                createdAt: Date.now(),
              },
            ],
      );
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

    const userEntry: Msg = {
      id: uid(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };
    setMsgs((m) => trimHistory([...m, userEntry]));
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
          return trimHistory([
            ...m,
            { id: uid(), role: "assistant", content: accum, createdAt: Date.now() },
          ]);
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
        const friendlyMessage =
          errorToast.message || "Die Antwort konnte nicht erstellt werden. Bitte erneut versuchen.";
        setError(friendlyMessage);

        // Also add a brief error message to chat for context
        setMsgs((m) =>
          trimHistory([
            ...m,
            {
              id: uid(),
              role: "assistant",
              content: friendlyMessage,
              createdAt: Date.now(),
              state: "error",
              retryText: trimmed,
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

  const handleRetryMessage = (message: { retryText?: string; id: string }) => {
    if (!message.retryText) return;
    setMsgs((prev) => prev.filter((entry) => entry.id !== message.id));
    send(message.retryText);
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col" style={composerStyle}>
      <div
        className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 pt-6"
        style={{ paddingBottom: contentBottomPadding }}
      >
        <div className="mx-auto w-full max-w-3xl space-y-4 px-1 text-center">
          {/* Status Badge with Glass Design */}
          <div className="glass-badge glass-badge--accent inline-flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${sending ? "bg-cyan-400 animate-pulse" : "bg-gray-400"}`}
            />
            {sending ? "Antwort wird erstellt …" : `Modell: ${modelLabel || "—"}`}
          </div>

          {/* Style & Role Indicator with Enhanced Glass */}
          <div className="glass-panel glass-panel--floating inline-block p-3">
            <StyleRoleIndicator onQuickStylesClick={quickStylesPanel.open} />
          </div>
        </div>

        <GlassCard variant="floating" tint="cyan" className="relative flex min-h-0 flex-1" enhanced>
          {showEmptyState && (
            <div className="glass-bg--soft m-4 rounded-lg p-8 text-center" role="status">
              <div className="space-y-4">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-white mb-3 text-xl font-semibold">Starte deinen ersten Chat</h3>
                <div className="text-neutral-300 space-y-3">
                  <div className="glass-badge glass-badge--accent">
                    💡 Stelle eine Frage oder beschreibe dein Ziel in einem Satz
                  </div>
                  <div className="glass-badge">
                    ⚡ Nutze Befehle wie <code className="text-cyan-400">/model</code> oder{" "}
                    <code className="text-cyan-400">/style</code> für schnelle Anpassungen
                  </div>
                  <div className="glass-badge">
                    🎯 Der Button unten rechts bringt dich sofort zum aktuellen Ende
                  </div>
                </div>
              </div>
            </div>
          )}
          <MessageList
            ref={messageListRef}
            className="flex-1"
            messages={msgs.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: m.createdAt,
              state: m.state,
              retryText: m.retryText,
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
            onRetryMessage={handleRetryMessage}
          />
        </GlassCard>

        {/* Show listening orb when sending */}
        {sending && (
          <GlassCard variant="floating" tint="cyan" className="flex justify-center py-8" enhanced>
            <div className="glass-bg--medium rounded-full p-6">
              <HeroOrb state="listening" size="md" />
            </div>
          </GlassCard>
        )}
      </div>

      <div
        className="pointer-events-none fixed left-0 right-0 z-50"
        style={{
          bottom: baseComposerBottom,
          transform: keyboardLift > 0 ? `translateY(-${keyboardLift}px)` : undefined,
          transition: "transform 160ms ease-out",
          left: horizontalInset ? `${horizontalInset}px` : undefined,
          right: horizontalInset ? `${horizontalInset}px` : undefined,
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

      <ScrollToEndFAB
        visible={scrollState.showScrollFab}
        onClick={scrollToBottom}
        keyboardLift={keyboardLift}
      />

      {/* Quick Styles Panel */}
      <QuickStylesPanel isOpen={quickStylesPanel.isOpen} onClose={quickStylesPanel.close} />
    </div>
  );
};

export default ChatView;
