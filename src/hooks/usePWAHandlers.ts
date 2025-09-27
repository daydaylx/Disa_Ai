import { useCallback, useEffect, useState } from "react";

import {
  checkPWASupport,
  type FileHandlerData,
  handleProtocolAction,
  handleProtocolHandler,
  handleShareTarget,
  initializePWAHandlers,
  processSharedFiles,
  processSharedText,
  type ProtocolHandlerData,
  setupInstallPrompt,
  type ShareData,
  triggerInstallPrompt,
  triggerNativeShare,
} from "../lib/pwa-handlers";

interface PWAState {
  shareData: ShareData | null;
  protocolData: ProtocolHandlerData | null;
  fileData: FileHandlerData | null;
  installPromptAvailable: boolean;
  isInstalled: boolean;
  support: ReturnType<typeof checkPWASupport>;
}

interface PWAActions {
  route?: string;
  message?: string;
  action?: string;
}

/**
 * Hook for PWA feature integration
 */
export function usePWAHandlers() {
  const [state, setState] = useState<PWAState>({
    shareData: null,
    protocolData: null,
    fileData: null,
    installPromptAvailable: false,
    isInstalled: false,
    support: checkPWASupport(),
  });

  const [processedContent, setProcessedContent] = useState<string>("");
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  // Initialize PWA handlers on mount
  useEffect(() => {
    initializePWAHandlers();
    setupInstallPrompt();

    // Check for incoming share data
    const shareData = handleShareTarget();
    const protocolData = handleProtocolHandler();

    if (shareData || protocolData) {
      setState((prev) => ({
        ...prev,
        shareData,
        protocolData,
      }));
    }

    // Listen for PWA events
    const handleInstallAvailable = () => {
      setState((prev) => ({ ...prev, installPromptAvailable: true }));
    };

    const handleInstalled = () => {
      setState((prev) => ({
        ...prev,
        installPromptAvailable: false,
        isInstalled: true,
      }));
    };

    const handleFilesReceived = (event: CustomEvent) => {
      const { files, source } = event.detail;
      setState((prev) => ({
        ...prev,
        fileData: { files, source },
      }));
    };

    window.addEventListener("pwa-install-available", handleInstallAvailable);
    window.addEventListener("pwa-installed", handleInstalled);
    window.addEventListener("pwa-files-received", handleFilesReceived as EventListener);

    return () => {
      window.removeEventListener("pwa-install-available", handleInstallAvailable);
      window.removeEventListener("pwa-installed", handleInstalled);
      window.removeEventListener("pwa-files-received", handleFilesReceived as EventListener);
    };
  }, []);

  /**
   * Process share data into chat content
   */
  const processShareData = useCallback(async (): Promise<string> => {
    if (!state.shareData) return "";

    let content = "";

    // Process shared text
    if (state.shareData.title || state.shareData.text || state.shareData.url) {
      content += processSharedText(state.shareData);
    }

    // Process shared files
    if (state.shareData.files && state.shareData.files.length > 0) {
      setIsProcessingFiles(true);
      try {
        const fileContent = await processSharedFiles(state.shareData.files);
        if (content && fileContent) {
          content += "\n\n---\n\n" + fileContent;
        } else if (fileContent) {
          content = fileContent;
        }
      } catch (error) {
        console.error("Failed to process shared files:", error);
        content += "\n\n**Fehler beim Verarbeiten der geteilten Dateien**";
      } finally {
        setIsProcessingFiles(false);
      }
    }

    return content;
  }, [state.shareData]);

  /**
   * Process file data into chat content
   */
  const processFileData = useCallback(async (): Promise<string> => {
    if (!state.fileData) return "";

    setIsProcessingFiles(true);
    try {
      return await processSharedFiles(state.fileData.files);
    } catch (error) {
      console.error("Failed to process files:", error);
      return "**Fehler beim Verarbeiten der Dateien**";
    } finally {
      setIsProcessingFiles(false);
    }
  }, [state.fileData]);

  /**
   * Get protocol action routing information
   */
  const getProtocolAction = useCallback((): PWAActions | null => {
    if (!state.protocolData) return null;

    return handleProtocolAction(state.protocolData.action, state.protocolData.params);
  }, [state.protocolData]);

  /**
   * Clear processed PWA data
   */
  const clearPWAData = useCallback(() => {
    setState((prev) => ({
      ...prev,
      shareData: null,
      protocolData: null,
      fileData: null,
    }));
    setProcessedContent("");
  }, []);

  /**
   * Trigger installation prompt
   */
  const installApp = useCallback(async (): Promise<boolean> => {
    const result = await triggerInstallPrompt();
    if (result) {
      setState((prev) => ({
        ...prev,
        installPromptAvailable: false,
        isInstalled: true,
      }));
    }
    return result;
  }, []);

  /**
   * Share content using native share API
   */
  const shareContent = useCallback(
    async (data: { title?: string; text?: string; url?: string }): Promise<boolean> => {
      return await triggerNativeShare(data);
    },
    [],
  );

  /**
   * Process all available PWA data
   */
  const processAllData = useCallback(async (): Promise<{
    content: string;
    action: PWAActions | null;
  }> => {
    const results = await Promise.all([processShareData(), processFileData()]);

    const content = results.filter(Boolean).join("\n\n---\n\n");
    const action = getProtocolAction();

    setProcessedContent(content);

    return { content, action };
  }, [processShareData, processFileData, getProtocolAction]);

  /**
   * Check if there's any PWA data to process
   */
  const hasPWAData = useCallback((): boolean => {
    return !!(state.shareData || state.protocolData || state.fileData);
  }, [state.shareData, state.protocolData, state.fileData]);

  /**
   * Get PWA status summary
   */
  const getPWAStatus = useCallback(() => {
    const hasData = hasPWAData();
    const dataTypes: string[] = [];

    if (state.shareData) dataTypes.push("Geteilte Inhalte");
    if (state.protocolData) dataTypes.push("Protokoll-Handler");
    if (state.fileData) dataTypes.push("Dateien");

    return {
      hasData,
      dataTypes,
      isProcessing: isProcessingFiles,
      canInstall: state.installPromptAvailable && state.support.serviceWorker,
      isInstalled: state.isInstalled,
      support: state.support,
    };
  }, [hasPWAData, state, isProcessingFiles]);

  return {
    // State
    shareData: state.shareData,
    protocolData: state.protocolData,
    fileData: state.fileData,
    processedContent,
    isProcessingFiles,
    installPromptAvailable: state.installPromptAvailable,
    isInstalled: state.isInstalled,
    support: state.support,

    // Actions
    processShareData,
    processFileData,
    processAllData,
    getProtocolAction,
    clearPWAData,
    installApp,
    shareContent,

    // Helpers
    hasPWAData,
    getPWAStatus,
  };
}
