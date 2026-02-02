import * as React from "react";

import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useRoles } from "@/contexts/RolesContext";
import { useImageAttachment } from "@/hooks/useImageAttachment";
import { useSettings } from "@/hooks/useSettings";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { ImagePlus, X } from "@/lib/icons";
import { Send } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { type DiscussionPresetKey } from "@/prompts/discussion/presets";
import type { ChatMessageType } from "@/types/chatMessage";
import { Button } from "@/ui/Button";

export interface UnifiedInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSendVision?: (
    prompt: string,
    attachment: NonNullable<ReturnType<typeof useImageAttachment>["attachment"]>,
  ) => Promise<ChatMessageType | void>;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function UnifiedInputBar({
  value,
  onChange,
  onSend,
  onSendVision,
  isLoading = false,
  placeholder = "Schreibe eine Nachricht...",
  className,
}: UnifiedInputBarProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const viewport = useVisualViewport();
  const { activeRole: _activeRole } = useRoles();
  const { models } = useModelCatalog();
  const { settings, _setCreativity, _setDiscussionPreset, _setPreferredModel } = useSettings();

  // Image attachment state
  const {
    attachment,
    isProcessing: isImageProcessing,
    error: imageError,
    fileInputRef,
    selectImage,
    clearAttachment,
    handleFileInputChange,
  } = useImageAttachment();

  // Auto-resize logic
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 160);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  // Ensure input visibility when keyboard opens
  React.useEffect(() => {
    if (viewport.isKeyboardOpen && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }, 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [viewport.isKeyboardOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend();
      }
    }
  };

  const handleSend = () => {
    // If we have an image attachment and vision handler, use vision path
    if (attachment && onSendVision && value.trim()) {
      void onSendVision(value, attachment);
      clearAttachment();
    } else if (value.trim()) {
      // Regular text chat
      onSend();
    }
  };

  const creativityOptions = [
    { value: "10", label: "Präzise (10%)", short: "Präzise" },
    { value: "30", label: "Klar & fokussiert (30%)", short: "Klar" },
    { value: "45", label: "Ausgewogen (45%)", short: "Ausgewogen" },
    { value: "70", label: "Kreativ (70%)", short: "Kreativ" },
    { value: "90", label: "Verspielt (90%)", short: "Verspielt" },
  ];

  const _shortDiscussionLabels: Record<DiscussionPresetKey, string> = {
    locker_neugierig: "Locker",
    edgy_provokant: "Edgy",
    nuechtern_pragmatisch: "Nüchtern",
    akademisch_formell: "Akademisch",
    freundlich_offen: "Freundlich",
    analytisch_detailliert: "Analytisch",
    sarkastisch_witzig: "Sarkastisch",
    fachlich_tiefgehend: "Fachlich",
  };

  const _creativityOption = creativityOptions.find(
    (option) => option.value === String(settings.creativity),
  );
  const _selectedModel = models?.find((m) => m.id === settings.preferredModelId);
  const hasVisionSupport = !!onSendVision;
  const hasContent = value.trim().length > 0;

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Attachment Ribbon - Enhanced Glass Effect */}
      {attachment && (
        <div className="flex items-center gap-2 p-2.5 bg-surface-1/60 rounded-xl border border-accent-chat/20 backdrop-blur-sm shadow-lg animate-pill-slide-in hover:border-accent-chat/30 transition-colors">
          <img
            src={attachment.dataUrl}
            alt="Angehängtes Bild"
            className="h-12 w-12 rounded-lg object-cover flex-shrink-0 border border-white/15 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink-primary truncate">
              {attachment.filename || "Bild"}
            </p>
            {attachment.size && (
              <p className="text-xs text-ink-tertiary">{(attachment.size / 1024).toFixed(1)} KB</p>
            )}
          </div>
          <Button
            onClick={clearAttachment}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full flex-shrink-0 hover:bg-white/10 transition-colors"
            aria-label="Bild entfernen"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Image Error Banner - Enhanced */}
      {imageError && (
        <div className="px-3 py-2 bg-error/12 border border-error/25 rounded-xl animate-pill-slide-in">
          <p className="text-sm text-error font-medium">{imageError}</p>
        </div>
      )}

      {/* Main Input Container - Enhanced Visual Design */}
      <div
        className={cn(
          "relative flex items-end gap-3 transition-all duration-300 ease-out",
          // Base styling with subtle gradient
          "bg-gradient-to-b from-surface-1/90 to-surface-2/80",
          "border border-white/10 rounded-2xl p-3",
          // Focus states
          "focus-within:border-accent-chat/40 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
          "focus-within:bg-gradient-to-b focus-within:from-surface-1 focus-within:to-surface-2/90",
          // Active state with content
          hasContent && "shadow-md border-white/12",
          // Backdrop blur for glass effect
          "backdrop-blur-md",
        )}
        aria-label="Eingabebereich"
      >
        {/* Image Attachment Button (only if vision is supported) */}
        {hasVisionSupport && (
          <Button
            onClick={selectImage}
            disabled={isImageProcessing || isLoading}
            variant="ghost"
            size="icon"
            className={cn(
              "flex-shrink-0 h-11 w-11 rounded-xl transition-all duration-300 mb-0.5",
              // Base state
              "bg-surface-3/40 text-ink-secondary",
              "hover:bg-surface-3/60 hover:text-ink-primary hover:scale-105",
              // Active attachment state
              attachment &&
                "bg-accent-chat/15 text-accent-chat border border-accent-chat/30 shadow-[0_0_12px_rgba(139,92,246,0.2)]",
              // Disabled state
              (isImageProcessing || isLoading) && "opacity-50 cursor-not-allowed hover:scale-100",
            )}
            aria-label="Bild anhängen"
            title="Bild anhängen (JPEG, PNG, WebP, max. 4MB)"
          >
            {isImageProcessing ? (
              <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <ImagePlus
                className={cn("h-5 w-5 transition-transform", attachment && "scale-110")}
              />
            )}
          </Button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Bilddatei auswählen"
        />

        {/* Textarea - Enhanced Focus Experience */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "w-full max-h-[160px] min-h-[44px] resize-none bg-transparent",
              "px-3 py-2.5 text-[16px] leading-relaxed",
              "text-ink-primary placeholder:text-ink-tertiary/60",
              "focus:outline-none textarea-resize-transition",
              attachment && "font-medium",
              // Improved focus indication
              "focus:placeholder:text-ink-tertiary/40",
            )}
            rows={1}
            data-testid="composer-input"
            aria-label="Nachricht eingeben"
          />
          {/* Character counter (optional, appears when text is long) */}
          {value.length > 200 && (
            <div className="absolute right-3 -top-5 text-[10px] text-ink-tertiary/60">
              {value.length} Zeichen
            </div>
          )}
        </div>

        {/* Send Button - Enhanced Ready State */}
        <Button
          onClick={handleSend}
          disabled={(!value.trim() && !attachment) || isLoading || isImageProcessing}
          variant="primary"
          size="icon"
          className={cn(
            "flex-shrink-0 h-11 w-11 rounded-xl transition-all duration-300 mb-0.5 mr-0.5",
            // Disabled state - subtle
            !value.trim() &&
              !attachment &&
              "bg-surface-3/30 text-ink-muted border border-white/5 shadow-none",
            // Loading state
            (isLoading || isImageProcessing) && "opacity-70",
            // Active state - prominent
            (value.trim() || attachment) &&
              !isLoading &&
              !isImageProcessing &&
              "bg-gradient-to-br from-accent-chat to-accent-chat/90 text-white",
            // Hover effects only when active
            (value.trim() || attachment) &&
              !isLoading &&
              !isImageProcessing &&
              "shadow-[0_4px_16px_rgba(139,92,246,0.35)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.45)] hover:scale-105 hover:-translate-y-[2px]",
            // Active press effect
            (value.trim() || attachment) &&
              "active:scale-95 active:translate-y-0 active:shadow-[0_2px_8px_rgba(139,92,246,0.3)]",
          )}
          aria-label="Senden"
        >
          {isLoading || isImageProcessing ? (
            <div className="h-5 w-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send
              className={cn(
                "h-5 w-5 transition-transform",
                (value.trim() || attachment) && "ml-0.5",
              )}
            />
          )}
        </Button>
      </div>
    </div>
  );
}
