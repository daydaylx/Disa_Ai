// Storage Migration Component
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
import { Button } from "@/ui/Button";
import { PremiumCard } from "@/ui/PremiumCard";
import { Typography } from "@/ui/Typography";

import { useConversationStats, useStorageHealth, useStorageMigration } from "../hooks/use-storage";

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
      <PremiumCard className="p-3 mx-auto mt-8 flex max-w-md items-center gap-3 text-text-secondary">
        <RefreshCw className="h-4 w-4 animate-spin text-accent" />
        <span>Migration wird geprüft …</span>
      </PremiumCard>
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
      <PremiumCard className="p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-accent" />
          <div>
            <Typography variant="h3" as="h1">
              Storage Migration
            </Typography>
            <Typography variant="body" className="text-text-secondary">
              Aktualisiere den lokalen Speicher auf IndexedDB
            </Typography>
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
      </PremiumCard>

      {error && (
        <PremiumCard className="p-6 flex items-start gap-3" data-tone="danger">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="space-y-1">
            <Typography variant="body" className="font-semibold text-text-primary">
              Fehler beim Prüfen
            </Typography>
            <Typography variant="body" className="text-text-secondary">
              {error}
            </Typography>
          </div>
        </PremiumCard>
      )}

      {migrationStatus && (
        <PremiumCard className="p-6 space-y-4">
          <Typography variant="h5" as="h2" className="flex items-center gap-2">
            <Info className="h-5 w-5 text-accent" />
            Migrationsstatus
          </Typography>

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
                  <Typography variant="body" className="font-medium">
                    {item.label}
                  </Typography>
                  <Typography variant="caption" className="text-text-secondary">
                    {item.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </PremiumCard>
      )}

      {stats && (
        <PremiumCard className="p-6 space-y-4">
          <Typography variant="h5" as="h2" className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-accent" />
            Speicherstatistiken
          </Typography>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <PremiumCard className="p-4 text-center">
              <Typography variant="h3">{stats.totalConversations}</Typography>
              <Typography variant="caption" className="text-text-secondary">
                Konversationen
              </Typography>
            </PremiumCard>
            <PremiumCard className="p-4 text-center">
              <Typography variant="h3">{stats.totalMessages}</Typography>
              <Typography variant="caption" className="text-text-secondary">
                Nachrichten
              </Typography>
            </PremiumCard>
            <PremiumCard className="p-4 text-center">
              <Typography variant="h3">
                {stats.averageMessagesPerConversation.toFixed(1)}
              </Typography>
              <Typography variant="caption" className="text-text-secondary">
                Ø Nachrichten
              </Typography>
            </PremiumCard>
            <PremiumCard className="p-4 text-center">
              <Typography variant="h3">{formatBytes(stats.storageSize)}</Typography>
              <Typography variant="caption" className="text-text-secondary">
                Belegung
              </Typography>
            </PremiumCard>
          </div>
        </PremiumCard>
      )}

      {migrationEstimate && migrationStatus?.needsMigration && (
        <PremiumCard className="p-6 space-y-4" data-tone="info">
          <Typography variant="h5" as="h2" className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Migrationsschätzung
          </Typography>

          <div className="grid gap-3 md:grid-cols-3">
            <PremiumCard className="p-4">
              <Typography
                variant="caption"
                className="uppercase tracking-[0.2em] text-text-tertiary"
              >
                Konversationen
              </Typography>
              <Typography variant="h4" className="text-text-primary">
                {migrationEstimate.conversationCount}
              </Typography>
            </PremiumCard>
            <PremiumCard className="p-4">
              <Typography
                variant="caption"
                className="uppercase tracking-[0.2em] text-text-tertiary"
              >
                Dauer
              </Typography>
              <Typography variant="h4" className="text-text-primary">
                {formatDuration(migrationEstimate.estimatedDuration)}
              </Typography>
            </PremiumCard>
            <PremiumCard className="p-4">
              <Typography
                variant="caption"
                className="uppercase tracking-[0.2em] text-text-tertiary"
              >
                Datenmenge
              </Typography>
              <Typography variant="h4" className="text-text-primary">
                {formatBytes(migrationEstimate.estimatedSize)}
              </Typography>
            </PremiumCard>
          </div>
        </PremiumCard>
      )}

      {migrationStatus?.needsMigration && (
        <PremiumCard className="p-6 space-y-4" data-tone="warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <Typography variant="h6" as="h3" className="text-text-primary">
                Migration starten
              </Typography>
              <Typography variant="body" className="text-text-secondary">
                Übertrage Konversationen sicher nach IndexedDB. Währenddessen wird nichts gelöscht.
              </Typography>
            </div>
          </div>
          <Button
            variant="primary"
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
        </PremiumCard>
      )}

      <PremiumCard className="p-6 space-y-4">
        <Typography variant="h5" as="h2" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          Backup & Restore
        </Typography>
        <div className="grid gap-3">
          <PremiumCard className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Typography variant="body" className="font-medium">
                Backup erstellen
              </Typography>
              <Typography variant="body" className="text-text-secondary">
                Exportiere deine Daten als JSON-Datei.
              </Typography>
            </div>
            <Button variant="primary" size="sm" onClick={handleCreateBackup}>
              <Download className="h-4 w-4" />
              Backup
            </Button>
          </PremiumCard>
          <PremiumCard className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <Typography variant="body" className="font-medium">
                Backup importieren
              </Typography>
              <Typography variant="body" className="text-text-secondary">
                Stelle eine gesicherte Datei wieder her.
              </Typography>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowRestore(!showRestore)}>
              <Upload className="h-4 w-4" />
              Restore
            </Button>
          </PremiumCard>
        </div>

        {showRestore && (
          <PremiumCard className="p-4 space-y-3">
            <textarea
              value={restoreData}
              onChange={(e) => setRestoreData(e.target.value)}
              placeholder="Backup JSON hier einfügen…"
              className="glass-field h-32 resize-none"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
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
          </PremiumCard>
        )}
      </PremiumCard>

      {migrationResult && (
        <PremiumCard
          className="p-6 space-y-3"
          data-tone={migrationResult.success ? "success" : "danger"}
        >
          <Typography variant="h5" as="h2" className="flex items-center gap-2">
            {migrationResult.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            Migration {migrationResult.success ? "abgeschlossen" : "fehlgeschlagen"}
          </Typography>

          <div className="space-y-1">
            <Typography variant="body">
              <span className="font-semibold">Dauer:</span>{" "}
              {formatDuration(migrationResult.duration)}
            </Typography>
            <Typography variant="body">
              <span className="font-semibold">Migriert:</span> {migrationResult.migratedCount}{" "}
              Konversationen
            </Typography>
          </div>

          {migrationResult.errors.length > 0 && (
            <div>
              <Typography variant="body" className="font-semibold">
                Fehler
              </Typography>
              <ul className="list-disc list-inside">
                {migrationResult.errors.map((err: string, idx: number) => (
                  <Typography variant="caption" as="li" key={idx} className="text-text-secondary">
                    {err}
                  </Typography>
                ))}
              </ul>
            </div>
          )}

          {migrationResult.warnings.length > 0 && (
            <div>
              <Typography variant="body" className="font-semibold">
                Hinweise
              </Typography>
              <ul className="list-disc list-inside">
                {migrationResult.warnings.map((warning: string, idx: number) => (
                  <Typography variant="caption" as="li" key={idx} className="text-text-secondary">
                    {warning}
                  </Typography>
                ))}
              </ul>
            </div>
          )}
        </PremiumCard>
      )}

      <PremiumCard
        className="p-6 flex flex-wrap items-center gap-3"
        data-tone={isReady ? "success" : "danger"}
      >
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: toneToColor(isReady ? "success" : "danger") }}
        />
        <Typography variant="body" className="font-medium">
          {isReady ? "Speicher bereit" : "Speicher benötigt Aufmerksamkeit"}
        </Typography>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={checkHealth}>
          <RefreshCw className="h-4 w-4" />
          Status aktualisieren
        </Button>
      </PremiumCard>
    </div>
  );
}
