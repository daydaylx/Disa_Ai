import { Download, Eye, EyeOff, Key, Shield, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { usePWAInstall } from "../hooks/usePWAInstall";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<"empty" | "present" | "invalid">("empty");
  const toasts = useToasts();
  const { canInstall, installed: isInstalled, requestInstall: promptInstall } = usePWAInstall();

  useEffect(() => {
    try {
      const storedKey = sessionStorage.getItem("openrouter-key") ?? "";
      setApiKey(storedKey);
      setKeyStatus(storedKey.length > 0 ? "present" : "empty");
    } catch {
      /* ignore */
    }
  }, []);

  const handleSaveKey = () => {
    try {
      const trimmedKey = apiKey.trim();

      if (trimmedKey) {
        // Basic validation
        if (!trimmedKey.startsWith("sk-or-")) {
          setKeyStatus("invalid");
          toasts.push({
            kind: "error",
            title: "Ungültiger Schlüssel",
            message: "OpenRouter-Schlüssel beginnen mit 'sk-or-'",
          });
          return;
        }

        sessionStorage.setItem("openrouter-key", trimmedKey);
        setKeyStatus("present");
        toasts.push({
          kind: "success",
          title: "Schlüssel gespeichert",
          message: "Der API-Schlüssel wird sicher in der Session gespeichert.",
        });
      } else {
        sessionStorage.removeItem("openrouter-key");
        setKeyStatus("empty");
        toasts.push({
          kind: "success",
          title: "Schlüssel entfernt",
          message: "Der API-Schlüssel wurde gelöscht.",
        });
      }
    } catch {
      toasts.push({
        kind: "error",
        title: "Speichern fehlgeschlagen",
        message: "Der Schlüssel konnte nicht gesichert werden.",
      });
    }
  };

  const handleInstallPWA = async () => {
    try {
      await promptInstall();
      toasts.push({
        kind: "success",
        title: "Installation gestartet",
        message: "Befolge die Anweisungen deines Browsers.",
      });
    } catch {
      toasts.push({
        kind: "error",
        title: "Installation fehlgeschlagen",
        message: "Die App konnte nicht installiert werden.",
      });
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col gap-4 p-4">
      <header>
        <h1 className="text-2xl font-semibold text-white">Einstellungen</h1>
        <p className="text-sm text-white/70">
          API-Schlüssel verwalten und die App auf deinem Gerät installieren.
        </p>
      </header>

      {/* API Key Section */}
      <Card className="border-white/20 bg-white/10 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-white">
            <Key className="h-5 w-5" />
            OpenRouter API-Schlüssel
          </CardTitle>
          <CardDescription className="text-white/70">
            Wird nur in der aktuellen Session gespeichert. Nie an unsere Server übertragen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-white/80">
              API-Schlüssel
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="sk-or-..."
                className="border-white/20 bg-white/10 pr-10 font-mono text-white placeholder:text-white/50"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                keyStatus === "present"
                  ? "bg-green-500"
                  : keyStatus === "invalid"
                    ? "bg-red-500"
                    : "bg-gray-500"
              }`}
            />
            <span className="text-sm text-white/70">
              {keyStatus === "present"
                ? "Schlüssel vorhanden"
                : keyStatus === "invalid"
                  ? "Ungültiger Schlüssel"
                  : "Kein Schlüssel"}
            </span>
          </div>

          <Button
            type="button"
            onClick={handleSaveKey}
            className="w-full border-0 bg-white/20 text-white hover:bg-white/30"
          >
            Schlüssel speichern
          </Button>

          <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
            <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
            <div className="text-xs text-blue-200">
              <p className="mb-1 font-medium">Datenschutz:</p>
              <p>
                Dein Schlüssel wird nur in der Browser-Session gespeichert und automatisch beim
                Schließen gelöscht.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PWA Install Section */}
      <Card className="border-white/20 bg-white/10 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-white">
            <Smartphone className="h-5 w-5" />
            App-Installation
          </CardTitle>
          <CardDescription className="text-white/70">
            Installiere Disa AI als native App für bessere Performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isInstalled ? "bg-green-500" : canInstall ? "bg-yellow-500" : "bg-gray-500"
              }`}
            />
            <span className="text-sm text-white/70">
              {isInstalled
                ? "App ist installiert"
                : canInstall
                  ? "Installation möglich"
                  : "Bereits installiert oder nicht verfügbar"}
            </span>
          </div>

          {canInstall && (
            <Button
              type="button"
              onClick={handleInstallPWA}
              className="hover:bg-accent-600 w-full bg-accent-500 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              App installieren
            </Button>
          )}

          {isInstalled && (
            <div className="py-4 text-center">
              <div className="text-sm font-medium text-green-400">
                ✓ App erfolgreich installiert
              </div>
              <p className="mt-1 text-xs text-white/60">
                Du kannst Disa AI jetzt wie eine native App verwenden.
              </p>
            </div>
          )}

          <div className="space-y-2 text-xs text-white/60">
            <p>
              <span className="font-medium">Vorteile:</span>
            </p>
            <ul className="ml-4 space-y-1">
              <li>• Schnellerer Start ohne Browser-UI</li>
              <li>• Offline-Funktionalität</li>
              <li>• Push-Benachrichtigungen möglich</li>
              <li>• Bessere Performance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
