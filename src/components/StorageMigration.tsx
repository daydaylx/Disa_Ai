// Storage Migration Component
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
} from "lucide-react";
import { useEffect, useState } from "react";

import { useConversationStats, useStorageHealth, useStorageMigration } from "../hooks/use-storage";
import { Button } from "./ui/button";

interface StorageMigrationProps {
  onMigrationComplete?: () => void;
  onClose?: () => void;
}

type GlassTone = "warning" | "danger" | "success" | "info";

const toneToColor = (tone?: GlassTone) => {
  switch (tone) {
    case "warning":
      return `hsl(var(--warning))`;
    case "danger":
      return `hsl(var(--danger))`;
    case "success":
      return `hsl(var(--success))`;
    case "info":
      return `hsl(var(--info))`;
    default:
      return `var(--accent)`;
  }
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

  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [_backupData, setBackupData] = useState<string | null>(null);
  const [showRestore, setShowRestore] = useState(false);
  const [restoreData, setRestoreData] = useState("");
  const [migrationEstimate, setMigrationEstimate] = useState<any>(null);

  useEffect(() => {
    void checkMigrationStatus();
    void checkHealth();
  }, [checkMigrationStatus, checkHealth]);

  useEffect(() => {
    if (migrationStatus?.needsMigration) {
      void estimateMigrationTime().then(setMigrationEstimate);
    }
  }, [migrationStatus, estimateMigrationTime]);

  const handleStartMigration = async () => {
    try {
      const result = await migrate({
        clearLocalStorageAfterSuccess: true,
        validateData: true,
        batchSize: 50,
        skipOnError: false,
      });

      setMigrationResult(result);

      if (result.success) {
        await refreshStats();
        await checkHealth();
        onMigrationComplete?.();
      }
    } catch (error) {
      console.error("Migration failed:", error);
    }
  };

  const handleCreateBackup = async () => {
    const backup = await createBackup();
    if (backup) {
      setBackupData(backup);
      // Create download link
      const blob = new Blob([backup], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `disa-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleRestoreBackup = async () => {
    if (!restoreData.trim()) return;

    try {
      const result = await restoreFromBackup(restoreData);
      setMigrationResult(result);

      if (result.success) {
        await refreshStats();
        await checkHealth();
        setShowRestore(false);
        setRestoreData("");
      }
    } catch (error) {
      console.error("Restore failed:", error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  if (loading) {
    return (
      <div className="glass-panel glass-panel--dense mx-auto mt-8 flex max-w-md items-center gap-3 text-text-secondary">
        <RefreshCw className="h-4 w-4 animate-spin text-accent" />
        <span>Migration wird geprüft …</span>
      </div>
    );
  }

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

  return (
    <div className="page-stack mx-auto max-w-4xl px-page-padding-x py-page-padding-y text-text-primary">
      <section className="glass-panel flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-accent" />
          <div>
            <h1 className="text-2xl font-semibold">Storage Migration</h1>
            <p className="text-sm text-text-secondary">
              Aktualisiere den lokalen Speicher auf IndexedDB
            </p>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Storage-Migration schließen"
          >
            ✕
          </Button>
        )}
      </section>

      {error && (
        <section className="glass-panel flex items-start gap-3" data-tone="danger">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-text-primary">Fehler beim Prüfen</p>
            <p className="text-text-secondary">{error}</p>
          </div>
        </section>
      )}

      {migrationStatus && (
        <section className="glass-panel space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Info className="h-5 w-5 text-accent" />
            Migrationsstatus
          </h2>

          <div className="grid gap-3 md:grid-cols-3">
            {statusCards.map((item) => (
              <div
                key={item.label}
                className="glass-inline flex items-center gap-3"
                data-tone={item.active ? item.tone : undefined}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: item.active ? toneToColor(item.tone) : "var(--line)",
                  }}
                />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-text-secondary">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {stats && (
        <section className="glass-panel space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <HardDrive className="h-5 w-5 text-accent" />
            Speicherstatistiken
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <div className="glass-inline glass-panel--dense text-center">
              <p className="text-2xl font-semibold">{stats.totalConversations}</p>
              <p className="text-xs text-text-secondary">Konversationen</p>
            </div>
            <div className="glass-inline glass-panel--dense text-center">
              <p className="text-2xl font-semibold">{stats.totalMessages}</p>
              <p className="text-xs text-text-secondary">Nachrichten</p>
            </div>
            <div className="glass-inline glass-panel--dense text-center">
              <p className="text-2xl font-semibold">
                {stats.averageMessagesPerConversation.toFixed(1)}
              </p>
              <p className="text-xs text-text-secondary">Ø Nachrichten</p>
            </div>
            <div className="glass-inline glass-panel--dense text-center">
              <p className="text-2xl font-semibold">{formatBytes(stats.storageSize)}</p>
              <p className="text-xs text-text-secondary">Belegung</p>
            </div>
          </div>
        </section>
      )}

      {migrationEstimate && migrationStatus?.needsMigration && (
        <section className="glass-panel space-y-4" data-tone="info">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="h-5 w-5" />
            Migrationsschätzung
          </h2>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="glass-inline glass-panel--dense">
              <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary">
                Konversationen
              </p>
              <p className="text-xl font-semibold text-text-primary">
                {migrationEstimate.conversationCount}
              </p>
            </div>
            <div className="glass-inline glass-panel--dense">
              <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary">Dauer</p>
              <p className="text-xl font-semibold text-text-primary">
                {formatDuration(migrationEstimate.estimatedDuration)}
              </p>
            </div>
            <div className="glass-inline glass-panel--dense">
              <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary">Datenmenge</p>
              <p className="text-xl font-semibold text-text-primary">
                {formatBytes(migrationEstimate.estimatedSize)}
              </p>
            </div>
          </div>
        </section>
      )}

      {migrationStatus?.needsMigration && (
        <section className="glass-panel space-y-4" data-tone="warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <h3 className="text-base font-semibold text-text-primary">Migration starten</h3>
              <p className="text-sm text-text-secondary">
                Übertrage Konversationen sicher nach IndexedDB. Währenddessen wird nichts gelöscht.
              </p>
            </div>
          </div>
          <Button
            variant="accent"
            size="lg"
            onClick={handleStartMigration}
            disabled={migrationInProgress}
          >
            {migrationInProgress ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Migrating …</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span>Migration starten</span>
              </>
            )}
          </Button>
        </section>
      )}

      <section className="glass-panel space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Shield className="h-5 w-5 text-accent" />
          Backup & Restore
        </h2>
        <div className="grid gap-3">
          <div className="glass-inline glass-panel--dense flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">Backup erstellen</p>
              <p className="text-sm text-text-secondary">Exportiere deine Daten als JSON-Datei.</p>
            </div>
            <Button variant="accent" size="sm" onClick={handleCreateBackup}>
              <Download className="h-4 w-4" />
              Backup
            </Button>
          </div>
          <div className="glass-inline glass-panel--dense flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">Backup importieren</p>
              <p className="text-sm text-text-secondary">
                Stelle eine gesicherte Datei wieder her.
              </p>
            </div>
            <Button variant="glass-primary" size="sm" onClick={() => setShowRestore(!showRestore)}>
              <Upload className="h-4 w-4" />
              Restore
            </Button>
          </div>
        </div>

        {showRestore && (
          <div className="glass-inline glass-panel--dense space-y-3">
            <textarea
              value={restoreData}
              onChange={(e) => setRestoreData(e.target.value)}
              placeholder="Backup JSON hier einfügen…"
              className="glass-field h-32 resize-none"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="accent"
                size="sm"
                onClick={handleRestoreBackup}
                disabled={!restoreData.trim() || migrationInProgress}
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
              >
                Abbrechen
              </Button>
            </div>
          </div>
        )}
      </section>

      {migrationResult && (
        <section
          className="glass-panel space-y-3"
          data-tone={migrationResult.success ? "success" : "danger"}
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            {migrationResult.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            Migration {migrationResult.success ? "abgeschlossen" : "fehlgeschlagen"}
          </h2>

          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">Dauer:</span>{" "}
              {formatDuration(migrationResult.duration)}
            </p>
            <p>
              <span className="font-semibold">Migriert:</span> {migrationResult.migratedCount}{" "}
              Konversationen
            </p>
          </div>

          {migrationResult.errors.length > 0 && (
            <div>
              <p className="text-sm font-semibold">Fehler</p>
              <ul className="list-disc list-inside text-xs text-text-secondary">
                {migrationResult.errors.map((err: string, idx: number) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {migrationResult.warnings.length > 0 && (
            <div>
              <p className="text-sm font-semibold">Hinweise</p>
              <ul className="list-disc list-inside text-xs text-text-secondary">
                {migrationResult.warnings.map((warning: string, idx: number) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section
        className="glass-panel flex flex-wrap items-center gap-3"
        data-tone={isReady ? "success" : "danger"}
      >
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: toneToColor(isReady ? "success" : "danger") }}
        />
        <span className="font-medium">
          {isReady ? "Speicher bereit" : "Speicher benötigt Aufmerksamkeit"}
        </span>
        <Button variant="outline" size="sm" className="ml-auto" onClick={checkHealth}>
          <RefreshCw className="h-4 w-4" />
          Status aktualisieren
        </Button>
      </section>
    </div>
  );
}
