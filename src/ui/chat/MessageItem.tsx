import React, { useState } from "react";

import { CodeBlock } from "./CodeBlock";
import { MessageActions } from "./MessageActions";
import { MessageHandlers } from "./messageHandlers";
import { Message } from "./types";

type Part = { type: "code" | "text"; content: string; lang?: string };
function splitCodeFences(text: string): Part[] {
  const out: Part[] = [];
  let i = 0;
  const fence = "```";
  while (i < text.length) {
    const start = text.indexOf(fence, i);
    if (start === -1) {
      out.push({ type: "text", content: text.slice(i) });
      break;
    }
    if (start > i) out.push({ type: "text", content: text.slice(i, start) });
    const langEnd = text.indexOf("\n", start + fence.length);
    if (langEnd === -1) {
      out.push({ type: "text", content: text.slice(start) });
      break;
    }
    const lang = text.slice(start + fence.length, langEnd).trim() || "text";
    const end = text.indexOf(fence, langEnd + 1);
    if (end === -1) {
      out.push({ type: "text", content: text.slice(start) });
      break;
    }
    out.push({ type: "code", lang, content: text.slice(langEnd + 1, end) });
    i = end + fence.length;
  }
  return out;
}

export function MessageItem({
  msg,
  align = "left",
  handlers,
}: {
  msg: Message;
  align?: "left" | "right";
  handlers?: MessageHandlers;
}) {
  const isAssistant = msg.role === "assistant";
  const isUser = msg.role === "user";
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(msg.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  return (
    <div className={align === "right" ? "flex justify-end" : "flex justify-start"}>
      <article
        className={
          "chat-bubble bubble max-w-[min(720px,92vw)] " +
          (isAssistant ? "bubble-assistant" : isUser ? "bubble-user" : "bubble-system")
        }
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="badge badge-muted">{msg.role}</span>
          <time className="text-[11px] text-[hsl(var(--text-muted))]">
            {new Date(msg.createdAt).toLocaleTimeString()}
          </time>
        </div>
        {splitCodeFences(msg.content).map((part, i) =>
          part.type === "code" ? (
            <CodeBlock key={i} code={part.content} language={part.lang} />
          ) : (
            <p key={i} className="whitespace-pre-wrap text-[0.98rem] leading-6">
              {part.content}
            </p>
          ),
        )}
        {/* Edit Mode for User Messages */}
        {isEditing && isUser ? (
          <div className="mt-3 space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full resize-none rounded border border-[hsl(var(--text-muted)/0.3)] bg-[hsl(var(--bg-elevated)/0.5)] p-2 text-sm"
              rows={Math.min(editContent.split("\n").length + 1, 10)}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handlers?.onEdit(msg.id, editContent);
                  setIsEditing(false);
                }}
                className="rounded bg-[hsl(var(--accent-primary))] px-3 py-1 text-xs font-medium text-black hover:bg-[hsl(var(--accent-primary-weak))]"
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setEditContent(msg.content);
                  setIsEditing(false);
                }}
                className="rounded border border-[hsl(var(--text-muted)/0.3)] px-3 py-1 text-xs font-medium hover:bg-[hsl(var(--bg-elevated)/0.5)]"
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : null}

        {/* Delete Confirmation */}
        {showDeleteConfirm ? (
          <div className="mt-3 rounded border border-red-500/30 bg-red-500/10 p-3">
            <p className="mb-2 text-sm text-red-400">
              Sind Sie sicher, dass Sie diese Nachricht löschen möchten?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handlers?.onDelete(msg.id);
                  setShowDeleteConfirm(false);
                }}
                className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
              >
                Löschen
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded border border-[hsl(var(--text-muted)/0.3)] px-3 py-1 text-xs font-medium hover:bg-[hsl(var(--bg-elevated)/0.5)]"
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : null}

        {/* Message Actions */}
        {!isEditing && !showDeleteConfirm && (
          <div className="mt-2">
            <MessageActions
              messageId={msg.id}
              content={msg.content}
              role={msg.role}
              onRegenerate={
                handlers?.onRegenerate ? () => handlers.onRegenerate(msg.id) : undefined
              }
              onEdit={isUser && handlers?.onEdit ? () => setIsEditing(true) : undefined}
              onDelete={handlers?.onDelete ? () => setShowDeleteConfirm(true) : undefined}
            />
          </div>
        )}
      </article>
    </div>
  );
}
