import { Info } from "lucide-react";
import { useState } from "react";

import { usePWAInstall } from "../../hooks/usePWAInstall";
import { Button } from "../ui/button";

function isStandalone(): boolean {
  try {
    if ((navigator as any).standalone) return true;
  } catch {
    // ignore
  }
  try {
    return window.matchMedia("(display-mode: standalone)").matches;
  } catch {
    return false;
  }
}

function isIOS(): boolean {
  const ua = navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua);
}

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
  const { canInstall, installed, dismissed } = usePWAInstall();

  const debugInfo = {
    userAgent: navigator.userAgent,
    isStandalone: isStandalone(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isChrome: isChrome(),
    canInstall,
    installed,
    dismissed,
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
        size="sm"
        className="btn-ghost fixed right-4 top-4 z-50 h-8 w-8 p-0"
      >
        <Info className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed right-4 top-4 z-50 max-w-sm">
      <div className="glass-card-secondary p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">PWA Debug Info</h3>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="btn-ghost h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>

          <div className="space-y-1 text-xs text-white/80">
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
              <span className="font-medium">Dismissed:</span>{" "}
              {debugInfo.dismissed ? "✅ Yes" : "❌ No"}
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

          <div className="mt-3 border-t border-white/20 pt-2">
            <p className="text-xs text-white/60">PWA installiert sich nur wenn:</p>
            <ul className="mt-1 space-y-0.5 text-xs text-white/60">
              <li>• HTTPS (nicht localhost)</li>
              <li>• Chrome/Android</li>
              <li>• Manifest vorhanden</li>
              <li>• Service Worker aktiv</li>
              <li>• Noch nicht installiert</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
