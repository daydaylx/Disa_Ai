import * as React from "react";

import { ALLOWED_MIME_TYPES, MAX_IMAGE_SIZE_MB, validateImageFile } from "@/api/zaiVision";
import { Image, X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

export interface AttachedImage {
  file: File;
  dataUrl: string;
  name: string;
}

export interface ImageAttachmentProps {
  /** Currently attached image */
  image: AttachedImage | null;
  /** Called when user attaches an image */
  onAttach: (image: AttachedImage) => void;
  /** Called when user removes the image */
  onRemove: () => void;
  /** Called when there's an error (validation, file read) */
  onError: (message: string) => void;
  /** Whether the input is disabled (e.g., during loading) */
  disabled?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * Image attachment component for chat input.
 * Provides file picker, thumbnail preview, and remove functionality.
 */
export function ImageAttachment({
  image,
  onAttach,
  onRemove,
  onError,
  disabled = false,
  className,
}: ImageAttachmentProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileSelect = React.useCallback(
    async (file: File) => {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        onError(validation.error);
        return;
      }

      // Convert to data URL
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Failed to read file"));
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

        onAttach({
          file,
          dataUrl,
          name: file.name,
        });
      } catch {
        onError("Fehler beim Lesen der Datei. Bitte versuche es erneut.");
      }
    },
    [onAttach, onError],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith("image/")) {
        onError("Nur Bilddateien sind erlaubt (PNG, JPEG, WebP, GIF).");
        return;
      }
      void handleFileSelect(file);
    }
  };

  // If image is attached, show preview
  if (image) {
    return (
      <div
        className={cn(
          "relative inline-flex items-center gap-2 rounded-xl bg-surface-1/60 border border-white/10 p-1.5 pr-3",
          className,
        )}
      >
        {/* Thumbnail */}
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-surface-2">
          <img src={image.dataUrl} alt={image.name} className="h-full w-full object-cover" />
        </div>

        {/* File info */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-ink-primary truncate max-w-[120px]">
            {image.name}
          </span>
          <span className="text-[10px] text-ink-tertiary">
            {(image.file.size / 1024).toFixed(0)} KB
          </span>
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className={cn(
            "ml-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
            "bg-surface-2/80 text-ink-tertiary hover:bg-status-error/20 hover:text-status-error",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-status-error/50",
            disabled && "pointer-events-none opacity-50",
          )}
          aria-label="Bild entfernen"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // No image attached, show attach button
  return (
    <div
      className={cn("relative", className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(",")}
        onChange={handleInputChange}
        className="sr-only"
        disabled={disabled}
        aria-label="Bild auswählen"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "text-ink-tertiary hover:text-brand-secondary hover:bg-brand-secondary/10",
          isDragging && "ring-2 ring-brand-secondary/50 bg-brand-secondary/10",
        )}
        aria-label="Bild anhängen"
        title={`Bild anhängen (max. ${MAX_IMAGE_SIZE_MB} MB)`}
      >
        <Image className="h-5 w-5" />
      </Button>

      {/* Drag overlay indicator */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-brand-secondary/10 rounded-lg border-2 border-dashed border-brand-secondary/50" />
        </div>
      )}
    </div>
  );
}

/**
 * Hook for managing image attachment state
 */
export function useImageAttachment() {
  const [attachedImage, setAttachedImage] = React.useState<AttachedImage | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleAttach = React.useCallback((image: AttachedImage) => {
    setAttachedImage(image);
    setError(null);
  }, []);

  const handleRemove = React.useCallback(() => {
    setAttachedImage(null);
    setError(null);
  }, []);

  const handleError = React.useCallback((message: string) => {
    setError(message);
    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    attachedImage,
    error,
    handleAttach,
    handleRemove,
    handleError,
    clearError,
  };
}
