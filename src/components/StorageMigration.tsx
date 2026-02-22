import { useEffect, useState } from "react";

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Download,
  HardDrive,
  Info,
  RefreshCw,
  Shield,
  Upload,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button, Card, Textarea } from "@/ui";

import { useConversationStats, useStorageHealth, useStorageMigration } from "../hooks/use-storage";
import type { MigrationResult } from "../lib/storage-migration";

interface StorageMigrationProps {
  onMigrationComplete?: () => void;
  onClose?: () => void;
}

type GlassTone = "warning" | "danger" | "success" | "info";

interface MigrationEstimate {
  estimatedDuration: number;
  conversationCount: number;
  estimatedSize: number;
}

const toneCardClasses: Record<GlassTone, string> = {
  warning: "border-status-warning/35 bg-status-warning/10",
  danger: "border-status-error/35 bg-status-error/10",
  success: "border-status-success/35 bg-status-success/10",
  info: "border-status-info/35 bg-status-info/10",
};

const toneTextClasses: Record<GlassTone, string> = {
  warning: "text-status-warning",
  danger: "text-status-error",
  success: "text-status-success",
  info: "text-status-info",
};

const toneDotClasses: Record<GlassTone, string> = {
  warning: "bg-status-warning",
  danger: "bg-status-error",
  success: "bg-status-success",
  info: "bg-status-info",
};

export function StorageMigration({ onMigrationComplete, onClose }: StorageMigrationProps) {
  const {
    migrationStatus,
    migrationInProgress,
    loading,
    error,
    checkMigrationStatus,
    migrate,
    estimateMigrationTime,
    createBackup,
    restoreFromBackup,
  } = useStorageMigration();

  const { stats, refresh: refreshStats } = useConversationStats();
  const { isReady, checkHealth } = useStorageHealth();

  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [showRestore, setShowRestore] = useState(false);
  const [restoreData, setRestoreData] = useState("");
  const [migrationEstimate, setMigrationEstimate] = useState<MigrationEstimate | null>(null);

  useEffect(() => {
    void checkMigrationStatus();
    void checkHealth();
  }, [checkMigrationStatus, checkHealth]);

  useEffect(() => {
    if (migrationStatus?.needsMigration) {
      void estimateMigrationTime().then((estimate) => setMigrationEstimate(estimate));
    } else {
      setMigrationEstimate(null);
    }
  }, [migrationStatus, estimateMigrationTime]);

  const handleStartMigration = async () => {
    try {
      const result = (await migrate({
        clearLocalStorageAfterSuccess: true,
        validateData: true,
        batchSize: 50,
        skipOnError: false,
      })) as MigrationResult;

      setMigrationResult(result);

      if (result.success) {
        await refreshStats();
        await checkHealth();
        onMigrationComplete?.();
      }
    } catch (migrationError) {
      console.error("Migration failed:", migrationError);
    }
  };

  const handleCreateBackup = async () => {
    const backup = await createBackup();
    if (!backup) return;

    const blob = new Blob([backup], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `disa-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRestoreBackup = async () => {
    if (!restoreData.trim()) return;

    try {
      const result = (await restoreFromBackup(restoreData)) as MigrationResult;
      setMigrationResult(result);

      if (result.success) {
        await refreshStats();
        await checkHealth();
        setShowRestore(false);
        setRestoreData("");
      }
    } catch (restoreError) {
      console.error("Restore failed:", restoreError);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const statusCards: Array<{
    label: string;
    description: string;
    active: boolean;
    tone: GlassTone;
  }> = migrationStatus
    ? [
        {
          label: "LocalStorage-Daten",
          description: migrationStatus.hasLocalStorageData ? "Vorhanden" : "Leer",
          active: migrationStatus.hasLocalStorageData,
          tone: "warning",
        },
        {
          label: "IndexedDB-Daten",
          description: migrationStatus.hasIndexedDBData ? "Vorhanden" : "Leer",
          active: migrationStatus.hasIndexedDBData,
          tone: "success",
        },
        {
          label: "Migration erforderlich",
          description: migrationStatus.needsMigration ? "Ja" : "Nein",
          active: migrationStatus.needsMigration,
          tone: "info",
        },
      ]
    : [];

  if (loading) {
    return (
      <Card
        variant="surface"
        padding="sm"
        className="mx-auto mt-2 flex max-w-md items-center gap-3 border-white/[0.08] bg-surface-2/35"
      >
        <RefreshCw className="h-4 w-4 animate-spin text-accent-settings" />
        <p className="text-sm text-ink-secondary">Migration wird geprüft …</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3 text-ink-primary">
      <Card variant="surface" accent="settings" className="border-white/[0.1]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-settings-surface text-accent-settings">
              <Database className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-ink-primary">
                Storage Migration
              </h2>
              <p className="mt-1 text-xs text-ink-secondary">
                Aktualisiere den lokalen Speicher auf IndexedDB.
              </p>
            </div>
          </div>
          {onClose ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Storage-Migration schließen"
            >
              ✕
            </Button>
          ) : null}
        </div>
      </Card>

      {error ? (
        <Card variant="surface" className={cn("border-status-error/30 bg-status-error/10")}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-status-error" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-ink-primary">Fehler beim Prüfen</p>
              <p className="text-xs text-ink-secondary">{error}</p>
            </div>
          </div>
        </Card>
      ) : null}

      {migrationStatus ? (
        <Card variant="surface" className="border-white/[0.08]">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
              <Info className="h-4 w-4 text-accent-settings" />
              Migrationsstatus
            </h3>

            <div className="grid gap-3 sm:grid-cols-3">
              {statusCards.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-3",
                    item.active
                      ? toneCardClasses[item.tone]
                      : "border-white/[0.08] bg-surface-2/35 text-ink-secondary",
                  )}
                >
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      item.active ? toneDotClasses[item.tone] : "bg-white/25",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-primary">{item.label}</p>
                    <p
                      className={cn(
                        "mt-0.5 truncate text-xs",
                        item.active ? toneTextClasses[item.tone] : "text-ink-tertiary",
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : null}

      {stats ? (
        <Card variant="surface" className="border-white/[0.08]">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
              <HardDrive className="h-4 w-4 text-accent-settings" />
              Speicherstatistiken
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-white/[0.08] bg-surface-2/35 px-3 py-3 text-center">
                <p className="text-lg font-bold text-accent-settings">{stats.totalConversations}</p>
                <p className="text-xs text-ink-tertiary">Konversationen</p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-surface-2/35 px-3 py-3 text-center">
                <p className="text-lg font-bold text-accent-settings">{stats.totalMessages}</p>
                <p className="text-xs text-ink-tertiary">Nachrichten</p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-surface-2/35 px-3 py-3 text-center">
                <p className="text-lg font-bold text-accent-settings">
                  {stats.averageMessagesPerConversation.toFixed(1)}
                </p>
                <p className="text-xs text-ink-tertiary">Ø Nachrichten</p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-surface-2/35 px-3 py-3 text-center">
                <p className="text-lg font-bold text-accent-settings">
                  {formatBytes(stats.storageSize)}
                </p>
                <p className="text-xs text-ink-tertiary">Belegung</p>
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {migrationEstimate && migrationStatus?.needsMigration ? (
        <Card variant="surface" className={cn("border-status-info/30 bg-status-info/10")}>
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
              <Clock className="h-4 w-4 text-status-info" />
              Migrationsschätzung
            </h3>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-status-info/35 bg-surface-2/35 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
                  Konversationen
                </p>
                <p className="mt-1 text-lg font-semibold text-ink-primary">
                  {migrationEstimate.conversationCount}
                </p>
              </div>
              <div className="rounded-xl border border-status-info/35 bg-surface-2/35 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">Dauer</p>
                <p className="mt-1 text-lg font-semibold text-ink-primary">
                  {formatDuration(migrationEstimate.estimatedDuration)}
                </p>
              </div>
              <div className="rounded-xl border border-status-info/35 bg-surface-2/35 px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
                  Datenmenge
                </p>
                <p className="mt-1 text-lg font-semibold text-ink-primary">
                  {formatBytes(migrationEstimate.estimatedSize)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {migrationStatus?.needsMigration ? (
        <Card variant="surface" className={cn("border-status-warning/30 bg-status-warning/10")}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-status-warning" />
              <div>
                <h3 className="text-sm font-semibold text-ink-primary">Migration starten</h3>
                <p className="mt-1 text-xs text-ink-secondary">
                  Übertrage Konversationen sicher nach IndexedDB. Währenddessen wird nichts
                  gelöscht.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleStartMigration}
              disabled={migrationInProgress}
              className="w-full sm:w-auto"
            >
              {migrationInProgress ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Migration läuft …</span>
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  <span>Migration starten</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : null}

      <Card variant="surface" className="border-white/[0.08]">
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
            <Shield className="h-4 w-4 text-accent-settings" />
            Backup & Restore
          </h3>

          <div className="space-y-3">
            <Card variant="surface" padding="sm" className="border-white/[0.08] bg-surface-2/35">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-primary">Backup erstellen</p>
                  <p className="text-xs text-ink-secondary">
                    Exportiere deine Daten als JSON-Datei.
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={handleCreateBackup}>
                  <Download className="h-4 w-4" />
                  Backup
                </Button>
              </div>
            </Card>

            <Card variant="surface" padding="sm" className="border-white/[0.08] bg-surface-2/35">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-primary">Backup importieren</p>
                  <p className="text-xs text-ink-secondary">
                    Stelle eine gesicherte Datei wieder her.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setShowRestore((v) => !v)}>
                  <Upload className="h-4 w-4" />
                  {showRestore ? "Schließen" : "Restore"}
                </Button>
              </div>
            </Card>
          </div>

          {showRestore ? (
            <Card variant="surface" padding="sm" className="border-white/[0.08] bg-surface-2/35">
              <div className="space-y-3">
                <Textarea
                  value={restoreData}
                  onChange={(event) => setRestoreData(event.target.value)}
                  placeholder="Backup JSON hier einfügen…"
                  className="min-h-[9rem] resize-y text-sm"
                />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRestoreBackup}
                    disabled={!restoreData.trim() || migrationInProgress}
                    className="w-full sm:w-auto"
                  >
                    Restore ausführen
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowRestore(false);
                      setRestoreData("");
                    }}
                    className="w-full sm:w-auto"
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </Card>

      {migrationResult ? (
        <Card
          variant="surface"
          className={cn(
            migrationResult.success
              ? "border-status-success/30 bg-status-success/10"
              : "border-status-error/30 bg-status-error/10",
          )}
        >
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
              {migrationResult.success ? (
                <CheckCircle className="h-4 w-4 text-status-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-status-error" />
              )}
              Migration {migrationResult.success ? "abgeschlossen" : "fehlgeschlagen"}
            </h3>

            <div className="space-y-1 text-sm text-ink-secondary">
              <p>
                <span className="font-semibold text-ink-primary">Dauer:</span>{" "}
                {formatDuration(migrationResult.duration)}
              </p>
              <p>
                <span className="font-semibold text-ink-primary">Migriert:</span>{" "}
                {migrationResult.migratedCount} Konversationen
              </p>
            </div>

            {migrationResult.errors.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-ink-primary">Fehler</p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-ink-secondary">
                  {migrationResult.errors.map((migrationError, index) => (
                    <li key={`${migrationError}-${index}`}>{migrationError}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {migrationResult.warnings.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-ink-primary">Hinweise</p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-ink-secondary">
                  {migrationResult.warnings.map((warning, index) => (
                    <li key={`${warning}-${index}`}>{warning}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Card>
      ) : null}

      <Card
        variant="surface"
        padding="sm"
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center",
          isReady
            ? "border-status-success/30 bg-status-success/10"
            : "border-status-error/30 bg-status-error/10",
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              isReady ? toneDotClasses.success : toneDotClasses.danger,
            )}
          />
          <p className="text-sm font-medium text-ink-primary">
            {isReady ? "Speicher bereit" : "Speicher benötigt Aufmerksamkeit"}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={checkHealth}
          className="w-full sm:ml-auto sm:w-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Status aktualisieren
        </Button>
      </Card>
    </div>
  );
}
