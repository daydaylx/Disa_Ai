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

interface StorageMigrationProps {
  onMigrationComplete?: () => void;
  onClose?: () => void;
}

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
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Checking migration status...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Storage Migration</h1>
            <p className="text-gray-600">Upgrade to modern IndexedDB storage</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Migration Status */}
      {migrationStatus && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Migration Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  migrationStatus.hasLocalStorageData ? "bg-yellow-500" : "bg-gray-300"
                }`}
              />
              <div>
                <p className="font-medium">LocalStorage Data</p>
                <p className="text-sm text-gray-600">
                  {migrationStatus.hasLocalStorageData ? "Available" : "None"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  migrationStatus.hasIndexedDBData ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <div>
                <p className="font-medium">IndexedDB Data</p>
                <p className="text-sm text-gray-600">
                  {migrationStatus.hasIndexedDBData ? "Available" : "None"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  migrationStatus.needsMigration ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
              <div>
                <p className="font-medium">Migration Needed</p>
                <p className="text-sm text-gray-600">
                  {migrationStatus.needsMigration ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Storage Statistics */}
      {stats && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <HardDrive className="w-5 h-5 mr-2" />
            Storage Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalConversations}</p>
              <p className="text-sm text-gray-600">Conversations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.totalMessages}</p>
              <p className="text-sm text-gray-600">Messages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {stats.averageMessagesPerConversation.toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">Avg Messages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{formatBytes(stats.storageSize)}</p>
              <p className="text-sm text-gray-600">Storage Used</p>
            </div>
          </div>
        </div>
      )}

      {/* Migration Estimate */}
      {migrationEstimate && migrationStatus?.needsMigration && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Migration Estimate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Conversations to migrate</p>
              <p className="text-xl font-bold text-blue-600">
                {migrationEstimate.conversationCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated duration</p>
              <p className="text-xl font-bold text-blue-600">
                {formatDuration(migrationEstimate.estimatedDuration)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data size</p>
              <p className="text-xl font-bold text-blue-600">
                {formatBytes(migrationEstimate.estimatedSize)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Migration Actions */}
      {migrationStatus?.needsMigration && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Migration Actions</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Start Migration</p>
                  <p className="text-sm text-yellow-700">
                    Migrate your conversations from localStorage to IndexedDB
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartMigration}
                disabled={migrationInProgress}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {migrationInProgress ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Migrating...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Start Migration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup & Restore */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Backup & Restore
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Create Backup</p>
              <p className="text-sm text-gray-600">Download a backup of your current data</p>
            </div>
            <button
              onClick={handleCreateBackup}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Backup</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Restore from Backup</p>
              <p className="text-sm text-gray-600">Import data from a previously created backup</p>
            </div>
            <button
              onClick={() => setShowRestore(!showRestore)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Restore</span>
            </button>
          </div>

          {showRestore && (
            <div className="p-4 border border-gray-200 rounded-lg space-y-4">
              <textarea
                value={restoreData}
                onChange={(e) => setRestoreData(e.target.value)}
                placeholder="Paste your backup data here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleRestoreBackup}
                  disabled={!restoreData.trim() || migrationInProgress}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Restore Data
                </button>
                <button
                  onClick={() => {
                    setShowRestore(false);
                    setRestoreData("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Migration Result */}
      {migrationResult && (
        <div
          className={`border rounded-lg p-6 ${
            migrationResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            {migrationResult.success ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            )}
            Migration {migrationResult.success ? "Completed" : "Failed"}
          </h2>

          <div className="space-y-2">
            <p>
              <span className="font-medium">Duration:</span>{" "}
              {formatDuration(migrationResult.duration)}
            </p>
            <p>
              <span className="font-medium">Migrated:</span> {migrationResult.migratedCount}{" "}
              conversations
            </p>

            {migrationResult.errors.length > 0 && (
              <div>
                <p className="font-medium text-red-800">Errors:</p>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {migrationResult.errors.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {migrationResult.warnings.length > 0 && (
              <div>
                <p className="font-medium text-yellow-800">Warnings:</p>
                <ul className="list-disc list-inside text-sm text-yellow-700">
                  {migrationResult.warnings.map((warning: string, index: number) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Storage Health */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Storage Health</h2>

        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isReady ? "bg-green-500" : "bg-red-500"}`} />
          <span className="font-medium">{isReady ? "Storage Ready" : "Storage Not Ready"}</span>
          <button
            onClick={checkHealth}
            className="ml-auto px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
