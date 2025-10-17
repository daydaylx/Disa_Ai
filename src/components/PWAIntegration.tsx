import { useEffect, useState } from "react";

import { usePWAHandlers } from "../hooks/usePWAHandlers";

interface PWAIntegrationProps {
  onSharedContent?: (content: string) => void;
  onProtocolAction?: (action: { route?: string; message?: string; action?: string }) => void;
  className?: string;
}

/**
 * PWA Integration Component
 *
 * Handles incoming PWA data (shares, protocol handlers, files)
 * and provides UI feedback during processing
 */
export function PWAIntegration({
  onSharedContent,
  onProtocolAction,
  className = "",
}: PWAIntegrationProps) {
  const { hasPWAData, processAllData, clearPWAData, getPWAStatus, isProcessingFiles } =
    usePWAHandlers();

  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);

  // Process PWA data when available
  useEffect(() => {
    if (hasPWAData() && !hasProcessed && !isProcessing) {
      setIsProcessing(true);

      processAllData()
        .then(({ content, action }) => {
          if (content && onSharedContent) {
            onSharedContent(content);
          }

          if (action && onProtocolAction) {
            onProtocolAction(action);
          }

          setHasProcessed(true);

          // Clear PWA data after processing
          setTimeout(() => {
            clearPWAData();
            setHasProcessed(false);
          }, 1000);
        })
        .catch((error) => {
          console.error("Failed to process PWA data:", error);
          if (onSharedContent) {
            onSharedContent("**Fehler beim Verarbeiten der geteilten Inhalte**");
          }
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }, [
    hasPWAData,
    hasProcessed,
    isProcessing,
    processAllData,
    onSharedContent,
    onProtocolAction,
    clearPWAData,
  ]);

  const status = getPWAStatus();

  // Don't render anything if no PWA data and not processing
  if (!status.hasData && !isProcessing && !isProcessingFiles) {
    return null;
  }

  return (
    <div className={`pwa-integration ${className}`}>
      {(isProcessing || isProcessingFiles) && (
        <div className="border-accent/20 bg-accent/10 flex items-center gap-2 rounded-lg border p-3">
          <div className="border-accent h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-accent text-sm">
            {isProcessingFiles
              ? "Verarbeite geteilte Dateien..."
              : "Verarbeite geteilte Inhalte..."}
          </span>
        </div>
      )}

      {status.hasData && !isProcessing && (
        <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 p-3">
          <div className="h-4 w-4 text-success">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm text-success">{status.dataTypes.join(", ")} empfangen</span>
        </div>
      )}
    </div>
  );
}
