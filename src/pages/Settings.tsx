import { Key, Palette, Save, Volume2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/Switch";
import { Textarea } from "../components/ui/textarea";
import { useToasts } from "../components/ui/toast/ToastsProvider";

interface AppSettings {
  theme: "light" | "dark" | "system";
  language: "de";
  fontSize: "small" | "medium" | "large";
  enableSounds: boolean;
  enableNotifications: boolean;
  autoSaveDrafts: boolean;
  note?: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  language: "de",
  fontSize: "medium",
  enableSounds: true,
  enableNotifications: true,
  autoSaveDrafts: true,
  note: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [apiKey, setApiKey] = useState("");
  const [pendingNote, setPendingNote] = useState("");
  const [dirty, setDirty] = useState(false);
  const toasts = useToasts();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("app-settings");
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppSettings>;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        setPendingNote(parsed.note ?? "");
      }
    } catch {
      // ignore corrupted state
    }
    try {
      const storedKey = sessionStorage.getItem("openrouter-key") ?? "";
      setApiKey(storedKey);
    } catch {
      /* ignore */
    }
  }, []);

  const markDirty = () => setDirty(true);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    markDirty();
  };

  const handleSave = () => {
    try {
      localStorage.setItem("app-settings", JSON.stringify({ ...settings, note: pendingNote }));
      setSettings((prev) => ({ ...prev, note: pendingNote }));
      setDirty(false);
      toasts.push({
        kind: "success",
        title: "Einstellungen gespeichert",
        message: "Deine mobilen Präferenzen wurden übernommen.",
      });
    } catch {
      toasts.push({
        kind: "error",
        title: "Speichern fehlgeschlagen",
        message: "Die Einstellungen konnten nicht gesichert werden.",
      });
    }
  };

  const handleSaveKey = () => {
    try {
      if (apiKey.trim()) {
        sessionStorage.setItem("openrouter-key", apiKey.trim());
      } else {
        sessionStorage.removeItem("openrouter-key");
      }
      toasts.push({
        kind: "success",
        title: "API-Schlüssel aktualisiert",
        message: "Der OpenRouter-Schlüssel wird lokal gespeichert.",
      });
    } catch {
      toasts.push({
        kind: "error",
        title: "Speichern fehlgeschlagen",
        message: "Der Schlüssel konnte nicht gesichert werden.",
      });
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col gap-4 p-4">
      <header>
        <h1 className="text-2xl font-semibold text-on-surface">Einstellungen</h1>
        <p className="text-text-muted text-sm">
          Feine Abstimmung für die mobile Nutzung von Disa AI.
        </p>
      </header>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" /> Erscheinungsbild
          </CardTitle>
          <CardDescription className="text-sm">
            Steuere Thema, Schriftgröße und Systemklänge.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-2">
            <Label htmlFor="theme">Thema</Label>
            <div className="flex gap-2">
              {["light", "dark", "system"].map((mode) => (
                <Button
                  key={mode}
                  type="button"
                  variant={settings.theme === mode ? "default" : "secondary"}
                  size="sm"
                  className="flex-1"
                  onClick={() => updateSetting("theme", mode as AppSettings["theme"])}
                >
                  {mode === "light" && "Hell"}
                  {mode === "dark" && "Dunkel"}
                  {mode === "system" && "System"}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontSize">Schriftgröße</Label>
            <div className="flex gap-2">
              {["small", "medium", "large"].map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={settings.fontSize === size ? "default" : "secondary"}
                  size="sm"
                  className="flex-1"
                  onClick={() => updateSetting("fontSize", size as AppSettings["fontSize"])}
                >
                  {size === "small" && "Klein"}
                  {size === "medium" && "Standard"}
                  {size === "large" && "Groß"}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Tastentöne</div>
              <p className="text-text-muted text-xs">Kurzes Audio-Feedback beim Senden.</p>
            </div>
            <Switch
              checked={settings.enableSounds}
              onChange={(value) => updateSetting("enableSounds", value)}
              aria-label="Tastentöne umschalten"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Push-Hinweise</div>
              <p className="text-text-muted text-xs">Benachrichtigung bei neuen Antworten.</p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onChange={(value) => updateSetting("enableNotifications", value)}
              aria-label="Push-Hinweise umschalten"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Entwürfe automatisch sichern</div>
              <p className="text-text-muted text-xs">Bewahrt Eingaben, wenn du die App verlässt.</p>
            </div>
            <Switch
              checked={settings.autoSaveDrafts}
              onChange={(value) => updateSetting("autoSaveDrafts", value)}
              aria-label="Automatisches Speichern umschalten"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" /> Persönliche Notiz
          </CardTitle>
          <CardDescription className="text-sm">
            Hinterlasse dir selbst Hinweise für Gespräche oder Prompts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="note">Notiz</Label>
          <Textarea
            id="note"
            rows={3}
            value={pendingNote}
            placeholder="Eigene Anweisung für jede Unterhaltung …"
            onChange={(event) => {
              setPendingNote(event.target.value);
              markDirty();
            }}
          />
          {settings.note && settings.note !== "" && (
            <Badge variant="secondary">Aktuell aktiv für neue Chats</Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> OpenRouter API-Schlüssel
          </CardTitle>
          <CardDescription className="text-sm">
            Bleibt ausschließlich im lokalen Speicher deines Geräts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API-Schlüssel</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="sk-or-..."
              className="font-mono"
            />
          </div>
          <Button type="button" onClick={handleSaveKey} className="w-full">
            Schlüssel sichern
          </Button>
          <p className="text-text-muted text-xs">
            Tipp: Schlüssel lässt sich im OpenRouter-Dashboard erstellen. Wir übertragen ihn niemals
            an eigene Server.
          </p>
        </CardContent>
      </Card>

      <Button
        type="button"
        onClick={handleSave}
        disabled={!dirty}
        className="mt-auto flex items-center justify-center gap-2"
      >
        <Save className="h-4 w-4" />
        Änderungen speichern
      </Button>
    </div>
  );
}
