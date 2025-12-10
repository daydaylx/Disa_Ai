import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

import { Mic, Paperclip, Send, Smile } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

interface MobileChatComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MobileChatComposer({
  onSend,
  disabled = false,
  placeholder = "Nachricht schreiben...",
}: MobileChatComposerProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Focus management for mobile
  useEffect(() => {
    const handleFocus = () => {
      // Ensure composer is visible when focused
      setTimeout(() => {
        const composer = document.querySelector('[data-composer="mobile"]');
        if (composer) {
          composer.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("focus", handleFocus);
      return () => textarea.removeEventListener("focus", handleFocus);
    }
    return undefined;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Mobile-friendly: Enter sends message, Shift+Enter for new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleVoiceInput = () => {
    // TODO: Implement Web Speech API
    console.warn("Voice input not yet implemented");
  };

  const handleAttachment = () => {
    // TODO: Implement file attachment
    console.warn("Attachment not yet implemented");
  };

  const handleEmoji = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-composer="mobile"
      className="mobile-composer fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-3 shadow-mobile-composer"
      style={{
        // Ensure composer stays above keyboard on iOS
        paddingBottom: "max( env(safe-area-inset-bottom), 20px )",
        zIndex: 50,
      }}
    >
      <div className="flex items-end gap-2 max-w-screen-lg mx-auto relative">
        {/* Emoji Picker Popover */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full left-0 mb-2 z-50 shadow-xl rounded-xl overflow-hidden"
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={Theme.AUTO}
              searchDisabled={false}
              skinTonesDisabled={true}
              previewConfig={{ showPreview: false }}
              height={350}
              width={300}
            />
          </div>
        )}

        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAttachment}
          disabled={disabled}
          className="flex-shrink-0 text-text-secondary hover:text-text-primary"
          title="Datei anhängen"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Emoji Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEmoji}
          disabled={disabled}
          className={cn(
            "flex-shrink-0 text-text-secondary hover:text-primary",
            showEmojiPicker && "text-primary bg-surface-2",
          )}
          title="Emoji auswählen"
        >
          <Smile className="h-5 w-5" />
        </Button>

        {/* Text Input */}
        <div className="flex-1 min-w-0 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "w-full px-4 py-2 rounded-full border border-border bg-surface-2 text-text-primary text-base leading-relaxed",
              "focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent",
              "resize-none max-h-24 placeholder-text-secondary",
              "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            rows={1}
            style={{
              // Mobile-optimized styling
              minHeight: "44px", // Minimum touch target size
              lineHeight: "1.25",
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
            maxLength={2000}
          />

          {/* Character counter */}
          {message.length > 1500 && (
            <div className="absolute -top-6 right-0 text-xs text-text-secondary">
              {message.length}/2000
            </div>
          )}
        </div>

        {/* Voice Input Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVoiceInput}
          disabled={disabled}
          className="flex-shrink-0 text-text-secondary hover:text-text-primary"
          title="Spracheingabe"
        >
          <Mic className="h-5 w-5" />
        </Button>

        {/* Send Button */}
        <Button
          type="submit"
          ref={submitButtonRef}
          disabled={disabled || !message.trim()}
          size="sm"
          className={cn(
            "flex-shrink-0 rounded-full p-2",
            message.trim()
              ? "bg-accent-primary hover:bg-accent-primary/90 text-white"
              : "bg-surface-2 text-text-secondary cursor-not-allowed",
          )}
          title="Senden (Enter)"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile-specific enhancements */}
      <div className="pointer-events-none fixed inset-0">
        <style>{`
          .shadow-mobile-composer {
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1),
                         0 -1px 3px rgba(0, 0, 0, 0.05);
          }

          @media (pointer: coarse) {
            .mobile-composer {
              touch-action: manipulation;
            }
          }

          @supports (padding: max(10px)) {
            .mobile-composer {
              padding-bottom: max(env(safe-area-inset-bottom), 20px);
            }
          }
        `}</style>
      </div>
    </form>
  );
}
