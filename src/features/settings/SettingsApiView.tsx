import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Input, Label, PremiumCard, PrimaryButton, useToasts } from "@/ui";

import { Eye, EyeOff } from "../../lib/icons";
import { hasApiKey as hasStoredApiKey, readApiKey, writeApiKey } from "../../lib/openrouter/key";

export function SettingsApiView() {
  const toasts = useToasts();
  const [hasApiKey, setHasApiKey] = useState(() => hasStoredApiKey());
  const [apiKey, setApiKey] = useState(() => {
    try {
      return readApiKey() ?? "";
    } catch {
      return "";
    }
  });
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setHasApiKey(hasStoredApiKey());
  }, []);

  const handleSaveKey = () => {
    try {
      const trimmed = apiKey.trim();
      if (!trimmed) {
        writeApiKey("");
        setHasApiKey(false);
        toasts.push({
          kind: "success",
          title: "API-Key entfernt",
          message: "Es wird wieder der öffentliche Proxy genutzt.",
        });
        return;
      }
      if (!trimmed.startsWith("sk-or-")) {
        toasts.push({
          kind: "error",
          title: "Ungültiger Schlüssel",
          message: "OpenRouter Schlüssel beginnen mit 'sk-or-'",
        });
        return;
      }
      writeApiKey(trimmed);
      setHasApiKey(true);
      toasts.push({
        kind: "success",
        title: "API-Key gespeichert",
        message: "Der Schlüssel wird nur in dieser Session gehalten.",
      });
    } catch (error) {
      console.error(error);
      toasts.push({
        kind: "error",
        title: "Speichern fehlgeschlagen",
        message: "SessionStorage nicht verfügbar.",
      });
    }
  };

  const handleRemoveKey = () => {
    setApiKey("");
    writeApiKey("");
    setHasApiKey(false);
    toasts.push({
      kind: "info",
      title: "API-Key entfernt",
      message: "Es wird wieder der öffentliche Proxy genutzt.",
    });
  };

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Link to="/settings">
          <Button variant="ghost" size="sm">
            ← Zurück zu Einstellungen
          </Button>
        </Link>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-6">
        <PremiumCard variant="default" className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary">API-Key & Verbindung</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Optionaler OpenRouter-API-Key für persönliche Limits.
              </p>
            </div>

            {/* Status Indicator */}
            {hasApiKey && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-brand/10 border border-brand/20">
                <div className="w-2 h-2 rounded-full bg-brand shadow-brandGlow" />
                <span className="text-sm font-medium text-brand">API-Key aktiv</span>
              </div>
            )}

            {/* Input Section */}
            <div className="space-y-3">
              <Label htmlFor="api-key" className="text-sm font-semibold text-text-primary">
                OpenRouter Key
              </Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-..."
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-sm text-text-muted hover:text-brand hover:bg-brand/10 transition-all duration-fast"
                  aria-label={showKey ? "Key verbergen" : "Key anzeigen"}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <PrimaryButton onClick={handleSaveKey} className="w-full sm:w-auto shadow-brandGlow">
                Speichern
              </PrimaryButton>
              {hasApiKey && (
                <Button variant="secondary" onClick={handleRemoveKey} className="w-full sm:w-auto">
                  Entfernen
                </Button>
              )}
            </div>

            {/* Info Notice */}
            <div className="rounded-md bg-surface-inset shadow-inset p-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                🔒 Der API-Key wird nur lokal im Browser gespeichert und nie an externe Server
                übertragen.
              </p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
