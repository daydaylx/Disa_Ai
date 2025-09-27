import React, { useState } from "react";

import {
  clearABTestData,
  getABTestMetrics,
  getABTestStatus,
  setUIVersionOverride,
  type UIVersion,
} from "../lib/ab-testing";

interface ABTestingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Admin panel for A/B testing management and metrics
 */
export default function ABTestingPanel({ isOpen, onClose }: ABTestingPanelProps) {
  const [status] = useState(() => getABTestStatus());
  const [metrics] = useState(() => getABTestMetrics());

  if (!isOpen) return null;

  const handleVersionChange = (version: UIVersion | null) => {
    setUIVersionOverride(version);
  };

  const handleClearData = () => {
    if (window.confirm("Clear all A/B testing data? This action cannot be undone.")) {
      clearABTestData();
      window.location.reload();
    }
  };

  // Calculate basic metrics
  const eventsByVersion = metrics.reduce(
    (acc, metric) => {
      acc[metric.version] = (acc[metric.version] || 0) + 1;
      return acc;
    },
    {} as Record<UIVersion, number>,
  );

  const interactionsByVersion = metrics
    .filter((m) => m.event.startsWith("user_interaction_"))
    .reduce(
      (acc, metric) => {
        acc[metric.version] = (acc[metric.version] || 0) + 1;
        return acc;
      },
      {} as Record<UIVersion, number>,
    );

  const errorsByVersion = metrics
    .filter((m) => m.event.startsWith("error_"))
    .reduce(
      (acc, metric) => {
        acc[metric.version] = (acc[metric.version] || 0) + 1;
        return acc;
      },
      {} as Record<UIVersion, number>,
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative mx-4 max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">A/B Testing Dashboard</h2>
            <p className="mt-1 text-sm text-slate-400">UI V1 vs V2 Performance & Usage Analytics</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Current Status */}
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-slate-200">Current Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Active Version:</span>
                  <span
                    className={`ml-2 font-medium ${status.currentVersion === "v2" ? "text-blue-400" : "text-green-400"}`}
                  >
                    UI {status.currentVersion.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">V2 Rollout:</span>
                  <span className="ml-2 font-medium text-slate-200">
                    {status.config.v2Percentage}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">User ID:</span>
                  <span className="ml-2 font-mono text-xs text-slate-300">{status.userId}</span>
                </div>
                <div>
                  <span className="text-slate-400">Manual Override:</span>
                  <span className="ml-2 font-medium text-slate-200">
                    {status.manualOverride || "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Version Controls */}
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-slate-200">Version Override</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleVersionChange("v1")}
                  className="rounded-lg border border-green-600 bg-green-600/10 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-600/20"
                >
                  Force UI V1
                </button>
                <button
                  onClick={() => handleVersionChange("v2")}
                  className="rounded-lg border border-blue-600 bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-400 hover:bg-blue-600/20"
                >
                  Force UI V2
                </button>
                <button
                  onClick={() => handleVersionChange(null)}
                  className="rounded-lg border border-slate-600 bg-slate-600/10 px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-600/20"
                >
                  Reset to A/B Test
                </button>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-slate-200">Performance Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-700/50 p-3">
                  <div className="text-sm text-slate-400">Total Events</div>
                  <div className="text-xl font-semibold text-slate-200">{status.totalEvents}</div>
                  <div className="text-xs text-slate-500">
                    V1: {eventsByVersion.v1 || 0} | V2: {eventsByVersion.v2 || 0}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-700/50 p-3">
                  <div className="text-sm text-slate-400">User Interactions</div>
                  <div className="text-xl font-semibold text-slate-200">
                    {(interactionsByVersion.v1 || 0) + (interactionsByVersion.v2 || 0)}
                  </div>
                  <div className="text-xs text-slate-500">
                    V1: {interactionsByVersion.v1 || 0} | V2: {interactionsByVersion.v2 || 0}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-700/50 p-3">
                  <div className="text-sm text-slate-400">Errors</div>
                  <div className="text-xl font-semibold text-red-400">
                    {(errorsByVersion.v1 || 0) + (errorsByVersion.v2 || 0)}
                  </div>
                  <div className="text-xs text-slate-500">
                    V1: {errorsByVersion.v1 || 0} | V2: {errorsByVersion.v2 || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-slate-200">Recent Events</h3>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {metrics
                  .slice(-10)
                  .reverse()
                  .map((metric, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        className={`font-medium ${metric.version === "v2" ? "text-blue-400" : "text-green-400"}`}
                      >
                        {metric.version.toUpperCase()}
                      </span>
                      <span className="text-slate-300">{metric.event}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-slate-200">Actions</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleClearData}
                  className="rounded-lg border border-red-600 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-600/20"
                >
                  Clear All Data
                </button>
                <button
                  onClick={() => {
                    const data = JSON.stringify(metrics, null, 2);
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `ab-test-metrics-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="rounded-lg border border-slate-600 bg-slate-600/10 px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-600/20"
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
