import { useState } from "react";

import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";

import { usePWAInstall } from "../../hooks/usePWAInstall";
import { Info } from "../../lib/icons";

function isAndroid(): boolean {
  const ua = navigator.userAgent || "";
  return /android/i.test(ua);
}

function isChrome(): boolean {
  const ua = navigator.userAgent || "";
  return /chrome/i.test(ua) && !/edg/i.test(ua);
}

export function PWADebugInfo() {
  const [isVisible, setIsVisible] = useState(false);
  const { canInstall, installed, isStandalone, isIOS, showPrompt, hasUserInteracted } =
    usePWAInstall();

  const debugInfo = {
    userAgent: navigator.userAgent,
    isStandalone,
    isIOS,
    isAndroid: isAndroid(),
    isChrome: isChrome(),
    canInstall,
    installed,
    showPrompt,
    hasUserInteracted,
    protocol: window.location.protocol,
    host: window.location.host,
    hasServiceWorker: "serviceWorker" in navigator,
    hasManifest: document.querySelector('link[rel="manifest"]') !== null,
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="ghost"
        size="icon"
        className="fixed right-4 top-20 z-40 tap-target h-11 w-11"
        aria-label="PWA Debug-Informationen anzeigen"
        title="PWA Debug-Informationen anzeigen"
      >
        <Info className="h-4 w-4" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <div className="fixed right-4 top-20 z-40 max-w-sm">
      <MaterialCard className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-text-primary text-sm font-semibold">PWA Debug Info</h3>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="icon"
              className="tap-target h-11 w-11"
              aria-label="PWA Debug-Informationen schließen"
              title="Schließen"
            >
              ×
            </Button>
          </div>

          <div className="text-text-secondary space-y-1 text-xs">
            <div>
              <span className="font-medium">Platform:</span>{" "}
              {debugInfo.isIOS ? "iOS" : debugInfo.isAndroid ? "Android" : "Desktop"}
            </div>
            <div>
              <span className="font-medium">Browser:</span>{" "}
              {debugInfo.isChrome ? "Chrome" : "Other"}
            </div>
            <div>
              <span className="font-medium">Protocol:</span> {debugInfo.protocol}
            </div>
            <div>
              <span className="font-medium">Standalone:</span>{" "}
              {debugInfo.isStandalone ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <span className="font-medium">Can Install:</span>{" "}
              {debugInfo.canInstall ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <span className="font-medium">Already Installed:</span>{" "}
              {debugInfo.installed ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <span className="font-medium">Show Prompt:</span>{" "}
              {debugInfo.showPrompt ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <span className="font-medium">User Interacted:</span>{" "}
              {debugInfo.hasUserInteracted ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <span className="font-medium">Service Worker:</span>{" "}
              {debugInfo.hasServiceWorker ? "✅ Available" : "❌ Not Available"}
            </div>
            <div>
              <span className="font-medium">Manifest:</span>{" "}
              {debugInfo.hasManifest ? "✅ Found" : "❌ Not Found"}
            </div>
          </div>

          <div className="border-border mt-3 border-t pt-2">
            <p className="text-text-secondary text-xs">PWA installiert sich nur wenn:</p>
            <ul className="text-text-secondary mt-1 space-y-0.5 text-xs">
              <li>• HTTPS (nicht localhost)</li>
              <li>• Chrome/Android</li>
              <li>• Manifest vorhanden</li>
              <li>• Service Worker aktiv</li>
              <li>• Noch nicht installiert</li>
            </ul>
          </div>
        </div>
      </MaterialCard>
    </div>
  );
}
