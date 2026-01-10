/**
 * useImageAttachment Hook
 *
 * Manages image attachment state, file selection, and processing for vision chat.
 */

import { useCallback, useRef, useState } from "react";

import { createVisionAttachment, ImageValidationError } from "@/lib/imageProcessor";
import type { VisionAttachment } from "@/types/chat";

export interface UseImageAttachmentOptions {
  maxFileSize?: number;
  onError?: (error: Error) => void;
}

export function useImageAttachment(options: UseImageAttachmentOptions = {}) {
  const { onError } = options;
  const [attachment, setAttachment] = useState<VisionAttachment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Clear current attachment and error
   */
  const clearAttachment = useCallback(() => {
    setAttachment(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  /**
   * Trigger file selection dialog
   */
  const selectImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        setIsProcessing(true);
        setError(null);

        // Process the image
        const processedAttachment = await createVisionAttachment(file);

        setAttachment(processedAttachment);
      } catch (err) {
        const errorMessage =
          err instanceof ImageValidationError
            ? err.message
            : "Bild konnte nicht verarbeitet werden";

        setError(errorMessage);

        if (onError) {
          onError(err instanceof Error ? err : new Error(errorMessage));
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [onError],
  );

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      void handleFileSelect(file);
    },
    [handleFileSelect],
  );

  /**
   * Handle drag and drop
   */
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const file = event.dataTransfer.files?.[0];
      if (!file) return;

      void handleFileSelect(file);
    },
    [handleFileSelect],
  );

  /**
   * Handle drag over (prevent default to enable drop)
   */
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return {
    attachment,
    isProcessing,
    error,
    fileInputRef,
    selectImage,
    clearAttachment,
    handleFileInputChange,
    handleDrop,
    handleDragOver,
  };
}
