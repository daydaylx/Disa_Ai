import React, { useEffect, useRef, useState } from "react";

import { chatStream } from "../api/openrouter";
import CodeBlock from "../components/CodeBlock";
import { useToasts } from "../components/ui/Toast";
import { chooseDefaultModel, loadModelCatalog } from "../config/models";
import CorporateModelPickerV2 from "./CorporateModelPickerV2";
import { segmentMessage } from "./segment";
import type { Message, Model } from "./types";

interface ExecutiveChatV2Props {
  openModelPicker?: boolean;
}

interface CorporateMessageBubbleProps {
  message: Message;
  onCopy: () => void;
  onRegenerate?: () => void;
  onDelete?: () => void;
  isLast?: boolean;
}

/** ====== Corporate Message Bubble ====== */
function CorporateMessageBubble({
  message,
  onCopy,
  onRegenerate,
  onDelete,
  isLast,
}: CorporateMessageBubbleProps) {
  const segments = segmentMessage(message.content);
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          isUser ? "border border-blue-500 bg-blue-600" : "border border-slate-700 bg-slate-800"
        }`}
      >
        {isUser ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-300"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 space-y-2 ${isUser ? "text-right" : "text-left"}`}>
        <div
          className={`inline-block max-w-2xl rounded-xl border px-4 py-3 ${
            isUser
              ? "border-blue-500/30 bg-blue-600/10 text-blue-100"
              : "border-slate-700 text-slate-100"
          }`}
          style={
            isUser
              ? {}
              : {
                  backgroundColor: "var(--corp-bg-elevated)",
                  borderColor: "var(--corp-border-primary)",
                }
          }
        >
          {segments.map((segment, i) => {
            if (segment.type === "code") {
              return (
                <div key={i} className="my-3">
                  <CodeBlock lang={segment.lang || undefined} code={segment.content} />
                </div>
              );
            }
            return (
              <div key={i} className="whitespace-pre-wrap text-sm leading-relaxed">
                {segment.content}
              </div>
            );
          })}
        </div>

        {/* Message Actions */}
        {isAssistant && (
          <div className="flex gap-2 text-xs">
            <button
              onClick={onCopy}
              className="flex items-center gap-1 rounded px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </button>
            {onRegenerate && isLast && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 rounded px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                Regenerate
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-1 rounded px-2 py-1 text-red-400 hover:bg-red-900/20 hover:text-red-300"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** ====== Executive Dashboard Header ====== */
function ExecutiveHeader({
  modelName,
  onOpenModels,
}: {
  modelName: string;
  onOpenModels: () => void;
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl" role="banner">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Executive Branding */}
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-300"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-100">AI Executive Assistant</h1>
              <p className="text-sm text-slate-400">Enterprise Intelligence Platform</p>
            </div>
          </div>

          {/* Executive Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenModels}
              data-testid="executive-model-picker"
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="max-w-40 truncate">{modelName}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </button>

            <button
              data-testid="executive-settings"
              className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/** ====== Modern Corporate Welcome ====== */
function CorporateWelcome({ onSendMessage }: { onSendMessage?: () => void }) {
  const suggestions = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 3v18h18" />
          <path d="M9 9l1.5 1.5L16 5" />
          <path d="m7 14 2-2 2.5 2.5L18 8" />
        </svg>
      ),
      title: "Strategic Analysis",
      description: "AI-powered market insights and competitive intelligence",
      category: "Intelligence",
      accent: "blue",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: "Executive Reports",
      description: "Automated reporting and performance dashboards",
      category: "Analytics",
      accent: "purple",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 12l-4-4-4 4" />
          <path d="M12 16V8" />
        </svg>
      ),
      title: "Risk Management",
      description: "Advanced risk assessment and mitigation strategies",
      category: "Security",
      accent: "green",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8Z" />
          <path d="M9 16v-6" />
          <path d="M12 16v-6" />
          <path d="M15 16v-6" />
        </svg>
      ),
      title: "Resource Planning",
      description: "Optimize resource allocation and workforce planning",
      category: "Operations",
      accent: "blue",
    },
  ];

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: "var(--corp-bg-primary)" }}>
      {/* Corporate Grid */}
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Corporate Welcome Section */}
          <div className="mb-12 text-center" data-testid="corporate-welcome">
            <h2 className="mb-4 text-3xl font-bold" style={{ color: "var(--corp-text-primary)" }}>
              Corporate AI Intelligence
            </h2>
            <p className="text-lg" style={{ color: "var(--corp-text-secondary)" }}>
              Enterprise-grade artificial intelligence for strategic decision making
            </p>
            <div
              className="mx-auto mt-6 h-px w-24"
              style={{
                background:
                  "linear-gradient(to right, transparent, var(--corp-accent-primary), transparent)",
              }}
            ></div>
          </div>

          {/* Enhanced Quick Actions Grid */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((item, i) => {
              const glowClass =
                item.accent === "blue"
                  ? "hover:shadow-[var(--corp-glow-blue)]"
                  : item.accent === "purple"
                    ? "hover:shadow-[var(--corp-glow-purple)]"
                    : "hover:shadow-[var(--corp-glow-green)]";
              return (
                <button
                  key={i}
                  onClick={() => onSendMessage?.()}
                  data-testid={`executive-card-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`group relative overflow-hidden rounded-xl border p-6 text-left transition-all duration-300 ${glowClass}`}
                  style={{
                    backgroundColor: "var(--corp-bg-elevated)",
                    borderColor: "var(--corp-border-primary)",
                  }}
                >
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg transition-all group-hover:scale-110"
                        style={{
                          backgroundColor: "var(--corp-bg-card)",
                          color: "var(--corp-text-accent)",
                        }}
                      >
                        {item.icon}
                      </div>
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--corp-text-muted)" }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <h3
                      className="mb-3 text-lg font-semibold"
                      style={{ color: "var(--corp-text-primary)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--corp-text-secondary)" }}
                    >
                      {item.description}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--corp-accent-primary), var(--color-info))",
                    }}
                  ></div>
                </button>
              );
            })}
          </div>

          {/* Corporate Input Section */}
          <div
            className="rounded-2xl border backdrop-blur-sm"
            style={{
              backgroundColor: "var(--corp-bg-elevated)",
              borderColor: "var(--corp-border-primary)",
            }}
          >
            <div className="p-8">
              <div className="mb-6">
                <h3
                  className="mb-2 text-xl font-semibold"
                  style={{ color: "var(--corp-text-primary)" }}
                >
                  AI Assistant Command Center
                </h3>
                <p className="text-sm" style={{ color: "var(--corp-text-secondary)" }}>
                  Enter your business inquiry for intelligent analysis and recommendations
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <textarea
                    placeholder="Describe your business challenge, strategic question, or data analysis request..."
                    className="w-full resize-none rounded-xl border px-6 py-4 text-base transition-all placeholder:text-[var(--corp-text-muted)] focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: "var(--corp-bg-card)",
                      borderColor: "var(--corp-border-secondary)",
                      color: "var(--corp-text-primary)",
                    }}
                    rows={4}
                  />
                </div>
                <button
                  onClick={() => onSendMessage?.()}
                  className="flex items-center justify-center rounded-xl px-8 py-4 font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{
                    backgroundColor: "var(--corp-accent-primary)",
                    color: "var(--corp-text-primary)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
                    <circle cx="11" cy="11" r="2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ====== Corporate Chat Interface ====== */
function CorporateChatInterface({ currentModel }: { currentModel: Model | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { push } = useToasts();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, model: Model) => {
    if (!content.trim() || streaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      model: model.id,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setStreaming(true);

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const messagesForApi = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let fullContent = "";
      await chatStream(
        messagesForApi,
        (chunk: string) => {
          fullContent += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id ? { ...msg, content: fullContent } : msg,
            ),
          );
        },
        {
          model: model.id,
          signal: controller.signal,
          onDone: () => {
            setStreaming(false);
            abortControllerRef.current = null;
          },
        },
      );
    } catch (error: any) {
      if (error.name !== "AbortError") {
        push({
          message: `Chat error: ${error.message || "Unknown error"}`,
          kind: "error",
        });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: "Sorry, I encountered an error. Please try again." }
              : msg,
          ),
        );
      }
    } finally {
      setStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStreaming(false);
    }
  };

  const handleCopyMessage = (content: string) => {
    void navigator.clipboard.writeText(content);
    push({ message: "Message copied to clipboard", kind: "success" });
  };

  const handleRegenerateMessage = (messageId: string) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex > 0) {
      const previousMessage = messages[messageIndex - 1];
      if (previousMessage && previousMessage.role === "user" && currentModel) {
        // Remove the assistant message and regenerate
        setMessages((prev) => prev.slice(0, messageIndex));
        void handleSendMessage(previousMessage.content, currentModel);
      }
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: "var(--corp-bg-primary)" }}>
      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 ? (
            <CorporateWelcome onSendMessage={() => {}} />
          ) : (
            <>
              {messages.map((message, index) => (
                <CorporateMessageBubble
                  key={message.id}
                  message={message}
                  onCopy={() => handleCopyMessage(message.content)}
                  onRegenerate={() => handleRegenerateMessage(message.id)}
                  onDelete={() => handleDeleteMessage(message.id)}
                  isLast={index === messages.length - 1}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Corporate Composer */}
      {messages.length > 0 && (
        <div className="border-t p-4" style={{ borderColor: "var(--corp-border-primary)" }}>
          <div className="mx-auto max-w-4xl">
            <CorporateComposer
              onSend={handleSendMessage}
              onStop={handleStopStreaming}
              streaming={streaming}
              currentModel={currentModel}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/** ====== Corporate Composer ====== */
function CorporateComposer({
  onSend,
  onStop,
  streaming,
  currentModel,
}: {
  onSend: (content: string, model: Model) => void;
  onStop: () => void;
  streaming: boolean;
  currentModel: Model | null;
}) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!content.trim() || !currentModel || streaming) return;
    onSend(content, currentModel);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your business question or request..."
          className="w-full resize-none rounded-xl border px-4 py-3 text-base transition-all placeholder:text-[var(--corp-text-muted)] focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style={{
            backgroundColor: "var(--corp-bg-elevated)",
            borderColor: "var(--corp-border-secondary)",
            color: "var(--corp-text-primary)",
            minHeight: "48px",
            maxHeight: "200px",
          }}
          rows={1}
        />
      </div>
      <button
        onClick={streaming ? onStop : handleSubmit}
        disabled={!content.trim() && !streaming}
        className="flex h-12 w-12 items-center justify-center rounded-xl font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundColor: streaming ? "var(--corp-accent-danger)" : "var(--corp-accent-primary)",
          color: "var(--corp-text-primary)",
        }}
      >
        {streaming ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4z" />
          </svg>
        )}
      </button>
    </div>
  );
}

/** ====== Executive Chat Interface ====== */
export default function ExecutiveChatV2({
  openModelPicker: _openModelPicker = false,
}: ExecutiveChatV2Props) {
  const [models, setModels] = useState<Model[]>([]);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const { push } = useToasts();

  useEffect(() => {
    async function initializeModels() {
      try {
        const catalog = await loadModelCatalog();
        setModels(catalog);

        if (!currentModel && catalog.length > 0) {
          const defaultModelId = chooseDefaultModel(catalog);
          const defaultModel = catalog.find((m) => m.id === defaultModelId);
          setCurrentModel(defaultModel ?? catalog[0] ?? null);
        }
      } catch (error) {
        console.error("Failed to load model catalog:", error);
        push({ message: "Failed to load models", kind: "error" });
      }
    }

    void initializeModels();
  }, [currentModel, push]);

  return (
    <div className="flex h-full flex-col bg-slate-950">
      {/* Executive Header */}
      <ExecutiveHeader
        modelName={currentModel?.label || "Loading Model..."}
        onOpenModels={() => setShowModelPicker(true)}
      />

      {/* Corporate Interface */}
      {showChat ? (
        <CorporateChatInterface currentModel={currentModel} />
      ) : (
        <CorporateWelcome onSendMessage={() => setShowChat(true)} />
      )}

      {/* Executive Status */}
      <div className="pointer-events-none fixed bottom-20 right-4 z-40">
        <div className="rounded-lg border border-slate-800 bg-slate-950/95 px-3 py-2 text-xs font-medium text-slate-400 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            Executive Suite
          </div>
        </div>
      </div>

      {/* Corporate Model Picker */}
      <CorporateModelPickerV2
        open={showModelPicker}
        onClose={() => setShowModelPicker(false)}
        onSelect={(model) => {
          setCurrentModel(model);
          setShowModelPicker(false);
        }}
        currentId={currentModel?.id || ""}
        models={models}
      />
    </div>
  );
}
