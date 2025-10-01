import {
  Brain,
  Download,
  Eye,
  EyeOff,
  Info,
  Key,
  Shield,
  Smartphone,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/Switch";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { useMemory } from "../hooks/useMemory";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { useSettings } from "../hooks/useSettings";
import { BUILD_ID } from "../lib/pwa/registerSW";

function MemoryStats({ getMemoryStats }: { getMemoryStats: () => Promise<any> }) {
  const [stats, setStats] = useState({ chatCount: 0, totalMessages: 0, storageUsed: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getMemoryStats();
        setStats(data);
      } catch (error) {
        console.warn("Failed to load memory stats:", error);
      }
    };
    void loadStats();
  }, [getMemoryStats]);

  return (
    <>
      <div>Gespeicherte Chats: {stats.chatCount}</div>
      <div>Gesamte Nachrichten: {stats.totalMessages}</div>
      <div>Speicherverbrauch: ~{Math.round(stats.storageUsed / 1024)}KB</div>
    </>
  );
}

type InitState = "loading" | "ready" | "error";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<"empty" | "present" | "invalid">("empty");
  const [initState, setInitState] = useState<InitState>("loading");
  const toasts = useToasts();
  const { canInstall, installed: isInstalled, requestInstall: promptInstall } = usePWAInstall();
  const { settings, toggleNSFWContent } = useSettings();
  const {
    toggleMemory,
    globalMemory,
    updateGlobalMemory,
    clearAllMemory,
    getMemoryStats,
    isEnabled: memoryEnabled,
  } = useMemory();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setInitState("error");
    }, 5000); // 5s Timeout für Settings-Load

    try {
      const storedKey = sessionStorage.getItem("openrouter-key") ?? "";
      setApiKey(storedKey);
      setKeyStatus(storedKey.length > 0 ? "present" : "empty");
      setInitState("ready");
      clearTimeout(timeoutId);
    } catch {
      setInitState("error");
      clearTimeout(timeoutId);
      toasts.push({
        kind: "error",
        title: "Einstellungen nicht verfügbar",
        message: "Browser-Storage nicht zugänglich.",
      });
    }

    return () => clearTimeout(timeoutId);
  }, [toasts]);

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

  if (initState === "loading") {
    return (
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" />
          <p className="text-sm text-white/60">Lädt Einstellungen...</p>
        </div>
      </div>
    );
  }

  if (initState === "error") {
    return (
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-red-400">⚠️</div>
          <div className="space-y-2">
            <p className="text-sm text-white/80">Fehler beim Laden der Einstellungen</p>
            <p className="text-xs text-white/60">Browser-Storage nicht verfügbar</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="tap-target hover:bg-accent-600 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }

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
                aria-label={showKey ? "API-Schlüssel ausblenden" : "API-Schlüssel anzeigen"}
                className="focus-visible:ring-accent-400 absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2"
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

      {/* Content Filter Section */}
      <Card className="border-white/20 bg-white/10 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5" />
            Inhaltsfilter
          </CardTitle>
          <CardDescription className="text-white/70">
            Verwalte die Sichtbarkeit verschiedener Inhaltsarten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="nsfw-toggle" className="text-white/90">
                18+ / NSFW-Content anzeigen
              </Label>
              <p id="nsfw-description" className="text-xs text-white/60">
                Ermöglicht die Anzeige von Adult-Content-Personas und entsprechenden Rollen.
              </p>
            </div>
            <Switch
              checked={settings.showNSFWContent}
              onChange={toggleNSFWContent}
              id="nsfw-toggle"
              aria-describedby="nsfw-description"
            />
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 p-3">
            <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-400" />
            <div className="text-xs text-orange-200">
              <p className="mb-1 font-medium">Hinweis:</p>
              <p>
                Diese Einstellung wird nur lokal in deinem Browser gespeichert. 18+ Inhalte werden
                standardmäßig ausgeblendet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Settings Section */}
      <Card className="border-white/20 bg-white/10 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5" />
            Gedächtnis-Funktion
          </CardTitle>
          <CardDescription className="text-white/70">
            Speichere Chat-Verläufe und persönliche Informationen für zukünftige Gespräche.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="memory-toggle" className="text-white/90">
                Gedächtnis aktivieren
              </Label>
              <p id="memory-description" className="text-xs text-white/60">
                Wenn aktiviert, werden Chat-Verläufe und globale Infos lokal gespeichert.
              </p>
            </div>
            <Switch
              checked={memoryEnabled}
              onChange={toggleMemory}
              id="memory-toggle"
              aria-describedby="memory-description"
            />
          </div>

          {memoryEnabled && (
            <>
              {/* Global Memory Input */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <Label className="text-white/90">Persönliche Informationen</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Dein Name (optional)"
                    value={globalMemory?.name || ""}
                    onChange={(e) => updateGlobalMemory({ name: e.target.value })}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                  <Input
                    placeholder="Hobbys, Interessen (optional)"
                    value={globalMemory?.hobbies?.join(", ") || ""}
                    onChange={(e) =>
                      updateGlobalMemory({
                        hobbies: e.target.value
                          ? e.target.value.split(",").map((h) => h.trim())
                          : [],
                      })
                    }
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                  <Input
                    placeholder="Hintergrund, Beruf (optional)"
                    value={globalMemory?.background || ""}
                    onChange={(e) => updateGlobalMemory({ background: e.target.value })}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              {/* Memory Stats */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <Label className="text-white/90">Statistiken</Label>
                <div className="space-y-1 text-xs text-white/60">
                  <MemoryStats getMemoryStats={getMemoryStats} />
                </div>
              </div>

              {/* Clear Memory */}
              <div className="border-t border-white/10 pt-4">
                <Button
                  onClick={async () => {
                    if (
                      confirm(
                        "Alle gespeicherten Erinnerungen löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
                      )
                    ) {
                      await clearAllMemory();
                      toasts.push({
                        kind: "success",
                        title: "Gedächtnis gelöscht",
                        message: "Alle gespeicherten Chat-Verläufe und Infos wurden entfernt.",
                      });
                    }
                  }}
                  variant="outline"
                  className="w-full border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Alle Erinnerungen löschen
                </Button>
              </div>
            </>
          )}

          <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
            <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
            <div className="text-xs text-blue-200">
              <p className="mb-1 font-medium">Datenschutz:</p>
              <p>
                Alle Daten werden nur lokal in deinem Browser gespeichert und niemals an Server
                übertragen. Das Gedächtnis kann jederzeit deaktiviert oder gelöscht werden.
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

      {/* Build Info */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Info className="h-5 w-5" />
            Build Information
          </CardTitle>
          <CardDescription className="text-white/70">
            Build-Version und Deployment-Informationen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Build ID:</span>
              <span className="text-accent-400 font-mono">{BUILD_ID}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Version:</span>
              <span className="text-white/90">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Environment:</span>
              <span className="text-white/90">
                {import.meta.env.DEV ? "Development" : "Production"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Built:</span>
              <span className="text-white/90">
                {(import.meta as any)?.env?.VITE_BUILD_TIME ??
                  new Date().toLocaleDateString("de-DE")}
              </span>
            </div>
          </div>

          <div className="rounded border border-white/10 bg-white/5 p-3 text-xs">
            <p className="text-white/60">
              <span className="font-medium">Cache-Hinweis:</span> Bei Updates kann ein harter Reload
              (Strg+Shift+R) erforderlich sein, um die neue Version zu laden.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
