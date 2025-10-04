import React from "react";

import { BUILD_ID } from "../lib/pwa/registerSW";

interface BuildInfoProps {
  className?: string;
  showFullInfo?: boolean;
}

// Git info from environment variables
const GIT_SHA = (import.meta as any)?.env?.VITE_GIT_SHA ?? "unknown";
const GIT_BRANCH = (import.meta as any)?.env?.VITE_GIT_BRANCH ?? "unknown";
const BUILD_TIME = (import.meta as any)?.env?.VITE_BUILD_TIME ?? new Date().toISOString();

function formatBuildId(buildId: string): string {
  // Format: v2.0.0-abc12345
  if (buildId.startsWith("v")) {
    return buildId;
  }

  // Fallback formatting
  return `build-${buildId.slice(-8)}`;
}

function formatCommitSha(sha: string): string {
  if (sha === "unknown" || sha.length < 7) {
    return sha;
  }

  return sha.slice(0, 7);
}

function formatBuildTime(timeStr: string): string {
  try {
    const date = new Date(timeStr);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timeStr;
  }
}

export function BuildInfo({ className = "", showFullInfo = false }: BuildInfoProps) {
  const formattedBuildId = formatBuildId(BUILD_ID);
  const formattedSha = formatCommitSha(GIT_SHA);
  const formattedTime = formatBuildTime(BUILD_TIME);

  // Nur in Entwicklungsumgebung oder wenn explizit aktiviert anzeigen
  const isDevelopment = import.meta.env.DEV;
  const showDebugInfo = isDevelopment || localStorage.getItem("show-debug-info") === "true";

  if (!showDebugInfo) {
    return null;
  }

  if (showFullInfo) {
    return (
      <div className={`space-y-1 text-xs text-corporate-text-subtle ${className}`}>
        <div className="flex items-center gap-2">
          <span className="font-mono">{formattedBuildId}</span>
          <span>•</span>
          <span className="font-mono">{formattedSha}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{GIT_BRANCH}</span>
          <span>•</span>
          <span>{formattedTime}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`font-mono text-xs text-corporate-text-subtle ${className}`}>
      {formattedBuildId} • {formattedSha}
    </div>
  );
}

// Hook für programmatische Build-Info
export function useBuildInfo() {
  return {
    buildId: BUILD_ID,
    gitSha: GIT_SHA,
    gitBranch: GIT_BRANCH,
    buildTime: BUILD_TIME,
    formatted: {
      buildId: formatBuildId(BUILD_ID),
      sha: formatCommitSha(GIT_SHA),
      time: formatBuildTime(BUILD_TIME),
    },
  };
}
