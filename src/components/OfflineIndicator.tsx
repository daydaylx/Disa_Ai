import React, { useState } from "react";

import { useOfflineMode } from "../hooks/useOfflineMode";
import { clearOfflineData, exportOfflineData } from "../lib/offline-storage";
import { useToasts } from "./ui/Toast";

interface OfflineIndicatorProps {
  className?: string;
}

export default function OfflineIndicator({ className = "" }: OfflineIndicatorProps) {
  const {
    isOfflineMode,
    pendingSync,
    drafts,
    stats,
    isProcessingQueue,
    retrySync,
    getOfflineStatus,
  } = useOfflineMode();

  const [showDetails, setShowDetails] = useState(false);
  const { push } = useToasts();

  const status = getOfflineStatus();

  const handleExportOfflineData = () => {
    const exportData = exportOfflineData();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `disa-offline-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    push({ message: "Offline data exported", kind: "success" });
  };

  const handleClearOfflineData = () => {
    if (window.confirm("Clear all offline data? This cannot be undone.")) {
      clearOfflineData();
      push({ message: "Offline data cleared", kind: "success" });
      setShowDetails(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Indicator */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
          status.color === "green"
            ? "border-green-600 bg-green-600/10 text-green-400 hover:bg-green-600/20"
            : status.color === "blue"
              ? "border-blue-600 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20"
              : "border-orange-600 bg-orange-600/10 text-orange-400 hover:bg-orange-600/20"
        }`}
        title={status.message}
      >
        {/* Status Icon */}
        <div
          className={`h-2 w-2 rounded-full ${
            status.color === "green"
              ? "bg-green-500"
              : status.color === "blue"
                ? "animate-pulse bg-blue-500"
                : "bg-orange-500"
          }`}
        />

        {/* Status Text */}
        <span className="font-medium">
          {status.status === "offline" && "Offline"}
          {status.status === "syncing" && `Sync ${pendingSync.length}`}
          {status.status === "processing" && "Processing"}
          {status.status === "online" && "Online"}
        </span>

        {/* Additional indicators */}
        {drafts.length > 0 && (
          <span className="ml-1 rounded-full bg-slate-600 px-1.5 py-0.5 text-xs text-slate-300">
            {drafts.length} draft{drafts.length > 1 ? "s" : ""}
          </span>
        )}

        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${showDetails ? "rotate-180" : ""}`}
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>

      {/* Details Panel */}
      {showDetails && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-xl">
          <h3 className="mb-3 text-lg font-semibold text-slate-200">Offline Status</h3>

          {/* Current Status */}
          <div className="mb-4 rounded-lg border border-slate-700 bg-slate-800/50 p-3">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  status.color === "green"
                    ? "bg-green-500"
                    : status.color === "blue"
                      ? "bg-blue-500"
                      : "bg-orange-500"
                }`}
              />
              <span className="font-medium text-slate-200">{status.message}</span>
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Messages stored:</span>
                <span className="text-slate-200">{stats.totalMessages}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Pending sync:</span>
                <span className={`${stats.pendingSync > 0 ? "text-blue-400" : "text-slate-200"}`}>
                  {stats.pendingSync}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Failed sync:</span>
                <span className={`${stats.failedSync > 0 ? "text-red-400" : "text-slate-200"}`}>
                  {stats.failedSync}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Drafts:</span>
                <span className="text-slate-200">{stats.drafts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Queue size:</span>
                <span className="text-slate-200">{stats.queueSize}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Storage used:</span>
                <span className="text-slate-200">{formatBytes(stats.storageUsed)}</span>
              </div>
              {stats.lastSync && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Last sync:</span>
                  <span className="text-slate-200">{formatRelativeTime(stats.lastSync)}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {!isOfflineMode && pendingSync.length > 0 && (
              <button
                onClick={retrySync}
                disabled={isProcessingQueue}
                className="w-full rounded-lg border border-blue-600 bg-blue-600/10 py-2 text-sm text-blue-400 hover:bg-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessingQueue ? "Processing..." : "Retry Sync"}
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleExportOfflineData}
                className="flex-1 rounded-lg border border-slate-600 bg-slate-800 py-2 text-xs text-slate-300 hover:bg-slate-700"
              >
                Export
              </button>
              <button
                onClick={handleClearOfflineData}
                className="flex-1 rounded-lg border border-red-600 bg-red-600/10 py-2 text-xs text-red-400 hover:bg-red-600/20"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Offline Mode Tips */}
          {isOfflineMode && (
            <div className="mt-4 rounded-lg border border-orange-600 bg-orange-600/10 p-3">
              <h4 className="text-sm font-medium text-orange-400">Offline Mode</h4>
              <ul className="mt-2 space-y-1 text-xs text-orange-300">
                <li>• Messages are saved locally</li>
                <li>• Drafts auto-save every 3 seconds</li>
                <li>• Everything syncs when back online</li>
                <li>• Some features may be limited</li>
              </ul>
            </div>
          )}

          {/* Draft List */}
          {drafts.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium text-slate-300">Recent Drafts</h4>
              <div className="max-h-32 space-y-1 overflow-y-auto">
                {drafts.slice(0, 5).map((draft) => (
                  <div
                    key={draft.id}
                    className="rounded border border-slate-700 bg-slate-800/50 p-2"
                  >
                    <p className="truncate text-xs text-slate-400">
                      {draft.content.substring(0, 50)}...
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {formatRelativeTime(draft.timestamp)}
                      </span>
                      {draft.autoSaved && <span className="text-xs text-blue-400">Auto-saved</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
