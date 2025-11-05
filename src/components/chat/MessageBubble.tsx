import type { ChatMessageType } from "../../types";

export function MessageBubble({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  const alignmentClass = isUser ? "justify-end" : "justify-start";
  const bgColorClass = isUser
    ? "bg-[var(--color-brand-primary)]"
    : "bg-[var(--surface-neumorphic-floating)]";
  const textColorClass = isUser ? "text-white" : "text-[var(--color-text-primary)]";
  const offsetClass = isUser ? "ml-12" : "mr-12";

  return (
    <div className={`chat-message flex ${alignmentClass} group`} data-testid="message-bubble">
      <div
        className={`max-w-[85%] ${offsetClass} rounded-2xl px-4 py-3 shadow-[var(--shadow-depth-1)] ${bgColorClass} ${textColorClass} transition-all duration-200 hover:scale-[1.02] glass-panel`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium opacity-80">{isUser ? "Du" : "Disa AI"}</span>
          {message.timestamp && (
            <span className="text-xs opacity-60">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
