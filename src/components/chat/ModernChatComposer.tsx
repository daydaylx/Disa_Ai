import React, { useEffect, useRef, useState } from "react";

import { Code, FileText, Image, Mic, Paperclip, Send, Smile, Square } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Inline, Stack } from "../ui/spacing";
import { BodyTextSmall } from "../ui/typography";

interface ChatComposerProps {
  onSendMessage: (message: string) => void;
  onStopGeneration?: () => void;
  isGenerating?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showAttachments?: boolean;
  showVoiceInput?: boolean;
  maxLength?: number;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export function ChatComposer({
  onSendMessage,
  onStopGeneration,
  isGenerating = false,
  placeholder = "Nachricht eingeben...",
  disabled = false,
  className,
  showAttachments = true,
  showVoiceInput = true,
  maxLength = 4000,
}: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isGenerating) {
      onSendMessage(message.trim());
      setMessage("");
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    setShowAttachmentMenu(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
    } else {
      setIsRecording(true);
      // Start recording logic here
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const canSend = message.trim().length > 0 && !disabled && !isGenerating;

  return (
    <div
      className={cn(
        "border-t border-[var(--border-subtle)] bg-[var(--surface-card)] p-4",
        className,
      )}
    >
      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mb-3">
          <Stack direction="horizontal" gap="sm" wrap>
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 bg-[var(--color-neutral-100)] rounded-[var(--radius-md)] px-3 py-2 text-sm"
              >
                {attachment.type.startsWith("image/") ? (
                  <Image className="h-4 w-4 text-[var(--color-primary-600)]" />
                ) : (
                  <FileText className="h-4 w-4 text-[var(--color-neutral-600)]" />
                )}
                <span className="text-[var(--text-primary)] font-medium truncate max-w-[120px]">
                  {attachment.name}
                </span>
                <span className="text-[var(--text-muted)] text-xs">
                  {formatFileSize(attachment.size)}
                </span>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-[var(--text-muted)] hover:text-[var(--color-error-600)] transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </Stack>
        </div>
      )}

      {/* Main composer */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "flex items-end gap-3 rounded-[var(--radius-lg)] border border-[var(--border-muted)] bg-[var(--surface-base)] p-3 transition-all duration-[var(--duration-normal)]",
            "focus-within:border-[var(--color-primary-500)] focus-within:shadow-[var(--shadow-light)]",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {/* Attachment button */}
          {showAttachments && (
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)]"
                disabled={disabled}
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              {/* Attachment menu */}
              {showAttachmentMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-48 rounded-[var(--radius-md)] border border-[var(--border-muted)] bg-[var(--surface-card)] py-2 shadow-[var(--shadow-heavy)] z-10">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)] transition-colors"
                  >
                    <Image className="h-4 w-4" />
                    Bild hochladen
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)] transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Datei hochladen
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)] transition-colors"
                  >
                    <Code className="h-4 w-4" />
                    Code-Snippet
                  </button>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.doc,.docx"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>
          )}

          {/* Text input */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              rows={1}
              className={cn(
                "w-full resize-none border-0 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                "focus:outline-none focus:ring-0",
                "text-sm leading-relaxed",
                "scrollbar-thin scrollbar-thumb-[var(--color-neutral-300)] scrollbar-track-transparent",
              )}
              style={{ minHeight: "20px", maxHeight: "120px" }}
            />

            {/* Character count */}
            {maxLength && (
              <div className="flex justify-end mt-1">
                <BodyTextSmall
                  className={cn(
                    "text-xs",
                    message.length > maxLength * 0.9 && "text-[var(--color-warning-600)]",
                    message.length >= maxLength && "text-[var(--color-error-600)]",
                  )}
                >
                  {message.length}/{maxLength}
                </BodyTextSmall>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <Inline gap="xs">
            {/* Emoji button */}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)]"
              disabled={disabled}
            >
              <Smile className="h-4 w-4" />
            </Button>

            {/* Voice input button */}
            {showVoiceInput && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={toggleRecording}
                className={cn(
                  "transition-colors",
                  isRecording
                    ? "text-[var(--color-error-600)] hover:text-[var(--color-error-700)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)]",
                )}
                disabled={disabled}
              >
                {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}

            {/* Send/Stop button */}
            <Button
              type="submit"
              variant={isGenerating ? "destructive" : "modern-primary"}
              size="sm"
              disabled={!canSend}
              className={cn(
                "transition-all duration-[var(--duration-normal)]",
                canSend && "hover:scale-105 active:scale-95",
              )}
            >
              {isGenerating ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stoppen
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Senden
                </>
              )}
            </Button>
          </Inline>
        </div>
      </form>

      {/* Recording indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center gap-2 text-[var(--color-error-600)]">
          <div className="h-2 w-2 rounded-full bg-[var(--color-error-600)] animate-pulse"></div>
          <BodyTextSmall>Aufnahme läuft...</BodyTextSmall>
        </div>
      )}

      {/* Emoji picker placeholder */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-2 w-64 h-48 bg-[var(--surface-card)] border border-[var(--border-muted)] rounded-[var(--radius-md)] shadow-[var(--shadow-heavy)] z-10 p-4">
          <BodyTextSmall className="text-center text-[var(--text-muted)]">
            Emoji-Picker wird hier angezeigt
          </BodyTextSmall>
        </div>
      )}
    </div>
  );
}
