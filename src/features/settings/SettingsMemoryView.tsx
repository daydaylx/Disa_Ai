import { useEffect, useState } from "react";

import { Badge, Button, Card, InfoBanner, Input, useToasts } from "@/ui";
import { SettingsRow, SettingsSection, SettingsToggleRow } from "@/ui/SettingsRow";

import { useConversationStats } from "../../hooks/use-storage";
import { useMemory } from "../../hooks/useMemory";
import { History, Shield, Trash2 } from "../../lib/icons";
import { SettingsLayout } from "./SettingsLayout";

export function SettingsMemoryView() {
  const toasts = useToasts();
  const { isEnabled, globalMemory, toggleMemory, updateGlobalMemory, clearAllMemory } = useMemory();
  const { stats, refresh } = useConversationStats();

  // Local form state
  const [name, setName] = useState(globalMemory?.name || "");
  const [hobbies, setHobbies] = useState(globalMemory?.hobbies?.join(", ") || "");
  const [background, setBackground] = useState(globalMemory?.background || "");

  useEffect(() => {
    setName(globalMemory?.name || "");
    setHobbies(globalMemory?.hobbies?.join(", ") || "");
    setBackground(globalMemory?.background || "");
  }, [globalMemory]);

  const handleToggleMemory = () => {
    toggleMemory();
    toasts.push({
      kind: "info",
      title: isEnabled ? "Gedächtnis deaktiviert" : "Gedächtnis aktiviert",
      message: isEnabled
        ? "Vergangene Gespräche werden nicht mehr gespeichert"
        : "Zukünftige Gespräche werden für Kontext gespeichert",
    });
  };

  const handleUpdateProfile = () => {
    const updates = {
      name: name.trim() || undefined,
      hobbies:
        hobbies
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean) || undefined,
      background: background.trim() || undefined,
    };

    updateGlobalMemory(updates);
    toasts.push({
      kind: "success",
      title: "Profil aktualisiert",
      message: "Deine Informationen wurden gespeichert",
    });
  };

  const handleClearMemory = () => {
    if (
      confirm(
        "Wirklich alle gespeicherten Erinnerungen löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      )
    ) {
      clearAllMemory();
      toasts.push({
        kind: "warning",
        title: "Gedächtnis gelöscht",
        message: "Alle gespeicherten Informationen wurden entfernt",
      });
    }
  };

  useEffect(() => {
    if (isEnabled) {
      void refresh();
    }
  }, [isEnabled, refresh]);

  return (
    <SettingsLayout
      activeTab="memory"
      title="Gedächtnis"
      description="Verlauf, Profilinformationen und lokale Erinnerungen sicher verwalten."
    >
      <div className="space-y-4 pb-4xl">
        <Card
          variant="surface"
          accent="settings"
          className="overflow-hidden rounded-[26px] border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl"
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-primary">Speicherstatus</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                  Alle Erinnerungen bleiben lokal im Browser. Du entscheidest, ob Disa sich Dinge
                  merken darf.
                </p>
              </div>
              <Badge
                variant={isEnabled ? "settings" : "secondary"}
                className="rounded-full px-3 py-1.5"
              >
                {isEnabled ? "Gedächtnis aktiv" : "Gedächtnis aus"}
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] border border-white/[0.08] bg-black/[0.10] px-4 py-4 shadow-inner">
                <div className="flex items-center gap-2 text-ink-tertiary">
                  <History className="h-4 w-4 text-accent-settings" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Gespräche
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-ink-primary">
                  {isEnabled ? (stats?.totalConversations ?? 0) : "—"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-tertiary">
                  Bereits gespeicherte Unterhaltungen im lokalen Verlauf.
                </p>
              </div>

              <div className="rounded-[20px] border border-white/[0.08] bg-black/[0.10] px-4 py-4 shadow-inner">
                <div className="flex items-center gap-2 text-ink-tertiary">
                  <Shield className="h-4 w-4 text-accent-settings" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Nachrichten
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-ink-primary">
                  {isEnabled ? (stats?.totalMessages ?? 0) : "—"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-tertiary">
                  Einzelne Nachrichten, die für Kontext lokal vorliegen.
                </p>
              </div>

              <div className="rounded-[20px] border border-white/[0.08] bg-black/[0.10] px-4 py-4 shadow-inner">
                <div className="flex items-center gap-2 text-ink-tertiary">
                  <Shield className="h-4 w-4 text-accent-settings" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Datenschutz
                  </span>
                </div>
                <p className="mt-3 text-lg font-semibold tracking-tight text-ink-primary">
                  Nur lokal
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-tertiary">
                  Keine Übertragung an externe Server durch diese Funktion.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <SettingsSection
          title="Gedächtnis"
          description="Schalte die Erinnerungsfunktion bewusst ein oder aus."
        >
          <SettingsToggleRow
            label="Gedächtnis aktivieren"
            description="Erlaubt Disa, sich an Details aus vergangenen Gesprächen zu erinnern und sie für neuen Kontext lokal zu speichern."
            checked={isEnabled}
            onCheckedChange={handleToggleMemory}
          />
        </SettingsSection>

        {isEnabled && (
          <SettingsSection
            title="Persönliches Profil"
            description="Diese Angaben helfen Disa, Antworten persönlicher und passender zu formulieren."
          >
            <SettingsRow label="Dein Name" description="Wie soll die KI dich ansprechen?">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional"
                className="w-full sm:max-w-xs"
              />
            </SettingsRow>

            <SettingsRow label="Interessen" description="Hobbies, kommagetrennt">
              <Input
                type="text"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                placeholder="z.B. Musik, Sport"
                className="w-full sm:max-w-sm"
              />
            </SettingsRow>

            <SettingsRow label="Hintergrund" description="Beruf oder Studienfach">
              <Input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Optional"
                className="w-full sm:max-w-sm"
              />
            </SettingsRow>

            <div className="py-4">
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdateProfile}
                className="w-full sm:w-auto"
              >
                Profil speichern
              </Button>
            </div>
          </SettingsSection>
        )}

        {isEnabled && (
          <SettingsSection
            title="Verlauf"
            description="So viel Chat-Kontext liegt aktuell lokal auf diesem Gerät."
          >
            <div className="grid gap-3 py-4 sm:grid-cols-2">
              <div className="rounded-[20px] border border-white/[0.08] bg-black/[0.10] px-4 py-4 shadow-inner">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-accent-settings" />
                  <span className="text-sm font-semibold text-ink-primary">
                    {stats?.totalConversations ?? 0} Gespräche
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-tertiary">
                  Gespeicherte Unterhaltungen, die beim Wiederöffnen verfügbar sind.
                </p>
              </div>
              <div className="rounded-[20px] border border-white/[0.08] bg-black/[0.10] px-4 py-4 shadow-inner">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent-settings" />
                  <span className="text-sm font-semibold text-ink-primary">
                    {stats?.totalMessages ?? 0} Nachrichten
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-tertiary">
                  Einzelne Nachrichten, die Disa für Verlauf und Kontext lokal kennt.
                </p>
              </div>
            </div>
          </SettingsSection>
        )}

        {isEnabled && (
          <SettingsSection
            title="Daten löschen"
            description="Dieser Schritt entfernt gespeicherte Erinnerungen dauerhaft."
          >
            <div className="space-y-4 py-4">
              <div className="rounded-[20px] border border-status-error/20 bg-status-error/8 px-4 py-4">
                <p className="text-sm font-medium text-ink-primary">Achtung</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
                  Löscht alle gespeicherten Kontextinformationen permanent. Dieser Schritt kann
                  nicht rückgängig gemacht werden.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearMemory}
                className="w-full gap-2 sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
                Alle Erinnerungen löschen
              </Button>
            </div>
          </SettingsSection>
        )}

        <InfoBanner
          icon={<Shield className="h-4 w-4" />}
          title="Datenschutz"
          className="rounded-[24px] border-white/[0.08] bg-surface-1/60"
        >
          Alle Gedächtnisinformationen werden nur lokal im Browser gespeichert und niemals an
          externe Server übertragen. Du kannst diese Daten jederzeit einsehen oder löschen.
        </InfoBanner>

        {!isEnabled && (
          <Card className="rounded-[24px] border-white/[0.10] bg-surface-1/72 shadow-[0_14px_34px_-28px_rgba(0,0,0,0.72)] ring-1 ring-inset ring-white/[0.04]">
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-sm font-semibold text-ink-primary">Gedächtnis ist aktuell aus</p>
              <p className="text-sm leading-relaxed text-ink-secondary">
                Aktiviere das Gedächtnis, um personalisierte Gespräche zu führen und Profilangaben
                lokal zu speichern.
              </p>
            </div>
          </Card>
        )}
      </div>
    </SettingsLayout>
  );
}
