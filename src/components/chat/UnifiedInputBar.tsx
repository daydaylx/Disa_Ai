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
  showContextPills?: boolean;
  className?: string;
}

export function UnifiedInputBar({
  value,
  onChange,
  onSend,
  onSendVision,
  isLoading = false,
  placeholder = "Schreibe eine Nachricht...",
  _showContextPills = true,
  className,
}: UnifiedInputBarProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const viewport = useVisualViewport();
  const { activeRole } = useRoles();
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

  const shortDiscussionLabels: Record<DiscussionPresetKey, string> = {
    locker_neugierig: "Locker",
    edgy_provokant: "Edgy",
    nuechtern_pragmatisch: "Nüchtern",
    akademisch_formell: "Akademisch",
    freundlich_offen: "Freundlich",
    analytisch_detailliert: "Analytisch",
    sarkastisch_witzig: "Sarkastisch",
    fachlich_tiefgehend: "Fachlich",
  };

  const creativityOption = creativityOptions.find(
    (option) => option.value === String(settings.creativity),
  );
  const selectedModel = models?.find((m) => m.id === settings.preferredModelId);
  const hasVisionSupport = !!onSendVision;

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Attachment Ribbon - Thumbnails above input */}
      {attachment && (
        <div className="flex items-center gap-2 p-2 bg-surface-1/40 rounded-xl border border-white/8 backdrop-blur-sm animate-pill-slide-in">
          <img
            src={attachment.dataUrl}
            alt="Angehängtes Bild"
            className="h-12 w-12 rounded-lg object-cover flex-shrink-0 border border-white/10"
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
            className="h-8 w-8 rounded-full flex-shrink-0"
            aria-label="Bild entfernen"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Image Error Banner */}
      {imageError && (
        <div className="px-3 py-2 bg-error/10 border border-error/20 rounded-xl animate-pill-slide-in">
          <p className="text-sm text-error">{imageError}</p>
        </div>
      )}

      {/* Main Input Container - Single visual container, no double borders */}
      <div
        className={cn(
          "relative flex items-end gap-3 transition-all backdrop-blur-sm input-focus-animation pr-safe-right bg-surface-1/60 border border-white/8 rounded-2xl p-3",
          "focus-within:border-white/20 focus-within:shadow-glow-sm focus-within:bg-surface-1/80",
          "transition-all duration-200",
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
              "flex-shrink-0 h-10 w-10 rounded-xl transition-all duration-200 mb-0.5",
              !attachment &&
                "bg-surface-2/50 text-ink-secondary hover:bg-surface-2 hover:text-ink-primary",
              attachment &&
                "bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/30",
            )}
            aria-label="Bild anhängen"
            title="Bild anhängen (JPEG, PNG, WebP, max. 4MB)"
          >
            {isImageProcessing ? (
              <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <ImagePlus className={cn("h-5 w-5", attachment && "fill-current")} />
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

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-1 max-h-[160px] min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-[16px] text-ink-primary placeholder:text-ink-tertiary focus:outline-none leading-relaxed textarea-resize-transition",
            attachment && "font-medium",
          )}
          rows={1}
          data-testid="composer-input"
          aria-label="Nachricht eingeben"
        />

        {/* Send Button - Material Chip */}
        <Button
          onClick={handleSend}
          disabled={(!value.trim() && !attachment) || isLoading || isImageProcessing}
          variant="primary"
          size="icon"
          className={cn(
            "flex-shrink-0 h-10 w-10 rounded-xl transition-all duration-200 mb-0.5 mr-1",
            !value.trim() &&
              !isLoading &&
              !attachment &&
              "opacity-40 bg-surface-2 text-ink-tertiary hover:bg-surface-2 shadow-sm",
            (value.trim() || attachment) &&
              !isLoading &&
              !isImageProcessing &&
              "bg-accent-chat text-white shadow-glow-sm hover:shadow-glow-md hover:scale-105 active:scale-100 animate-send-pulse",
          )}
          aria-label="Senden"
        >
          {isLoading || isImageProcessing ? (
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className={cn("h-5 w-5", (value.trim() || attachment) && "ml-0.5")} />
          )}
        </Button>
      </div>
    </div>
  );
}
