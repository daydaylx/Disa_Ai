import { useEffect, useState } from "react";

import { AppHeader, Button, GlassCard, Input, Label, PrimaryButton, useToasts } from "@/ui";

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
      <AppHeader pageTitle="API-Key" />

      <div className="space-y-4 sm:space-y-6 px-4 py-3 sm:px-6 sm:py-6">
        <GlassCard variant="raised" className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text-on-raised">API-Key & Verbindung</h2>
            <p className="text-sm text-text-secondary">
              Optionaler OpenRouter-API-Key für persönliche Limits.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-sm font-medium text-text-primary">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <PrimaryButton onClick={handleSaveKey} className="w-full sm:w-auto">
                Speichern
              </PrimaryButton>
              {hasApiKey && (
                <Button variant="secondary" onClick={handleRemoveKey} className="w-full sm:w-auto">
                  Entfernen
                </Button>
              )}
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Der API-Key wird nur lokal im Browser gespeichert und nie an externe Server
              übertragen.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
