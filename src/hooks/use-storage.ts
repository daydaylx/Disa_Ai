// React hooks for modern storage layer
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getAllConversations, 
  getConversation, 
  saveConversation, 
  deleteConversation,
  getConversationStats,
  searchConversations,
  bulkDeleteConversations,
  updateConversation,
  toggleFavorite,
  isStorageReady,
  migrateFromLocalStorage,
  type Conversation,
  type ConversationMetadata,
  type ConversationStats
} from '../lib/conversation-manager-modern';
import { storageMigration } from '../lib/storage-migration';

export interface UseConversationsOptions {
  autoRefresh?: boolean;
  searchQuery?: string;
}

export interface UseConversationsReturn {
  conversations: ConversationMetadata[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export function useConversations(options: UseConversationsOptions = {}) {
  const { autoRefresh = true, searchQuery = '' } = options;
  
  const [conversations, setConversations] = useState<ConversationMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState(searchQuery);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result: ConversationMetadata[];
      if (currentSearch) {
        result = await searchConversations(currentSearch);
      } else {
        result = await getAllConversations();
      }
      
      setConversations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [currentSearch]);

  const refresh = useCallback(async () => {
    await loadConversations();
  }, [loadConversations]);

  const search = useCallback(async (query: string) => {
    setCurrentSearch(query);
  }, []);

  const clearSearch = useCallback(() => {
    setCurrentSearch('');
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      loadConversations();
    }
  }, [autoRefresh, loadConversations]);

  return {
    conversations,
    loading,
    error,
    refresh,
    search,
    clearSearch
  };
}

export interface UseConversationReturn {
  conversation: Conversation | null;
  loading: boolean;
  error: string | null;
  save: (conversation: Conversation) => Promise<void>;
  remove: () => Promise<void>;
  update: (updates: Partial<Conversation>) => Promise<void>;
  toggleFavoriteStatus: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useConversation(id: string | null) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversation = useCallback(async () => {
    if (!id) {
      setConversation(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await getConversation(id);
      setConversation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
      setConversation(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const save = useCallback(async (conv: Conversation) => {
    try {
      setError(null);
      await saveConversation(conv);
      setConversation(conv);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save conversation');
      throw err;
    }
  }, []);

  const remove = useCallback(async () => {
    if (!id) return;
    
    try {
      setError(null);
      await deleteConversation(id);
      setConversation(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
      throw err;
    }
  }, [id]);

  const update = useCallback(async (updates: Partial<Conversation>) => {
    if (!conversation) return;
    
    try {
      setError(null);
      await updateConversation(conversation.id, updates);
      const updated = { ...conversation, ...updates };
      setConversation(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update conversation');
      throw err;
    }
  }, [conversation]);

  const toggleFavoriteStatus = useCallback(async () => {
    if (!conversation) return;
    
    try {
      setError(null);
      await toggleFavorite(conversation.id);
      const updated = { ...conversation, isFavorite: !conversation.isFavorite };
      setConversation(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle favorite status');
      throw err;
    }
  }, [conversation]);

  const refresh = useCallback(async () => {
    await loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  return {
    conversation,
    loading,
    error,
    save,
    remove,
    update,
    toggleFavoriteStatus,
    refresh
  };
}

export interface UseConversationStatsReturn {
  stats: ConversationStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useConversationStats() {
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getConversationStats();
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refresh
  };
}

export interface UseStorageMigrationReturn {
  migrationStatus: {
    hasLocalStorageData: boolean;
    hasIndexedDBData: boolean;
    needsMigration: boolean;
  } | null;
  migrationInProgress: boolean;
  loading: boolean;
  error: string | null;
  checkMigrationStatus: () => Promise<void>;
  migrate: (options?: any) => Promise<any>;
  estimateMigrationTime: () => Promise<any>;
  createBackup: () => Promise<string | null>;
  restoreFromBackup: (backupData: string) => Promise<any>;
}

export function useStorageMigration() {
  const [migrationStatus, setMigrationStatus] = useState<{
    hasLocalStorageData: boolean;
    hasIndexedDBData: boolean;
    needsMigration: boolean;
  } | null>(null);
  const [migrationInProgress, setMigrationInProgress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkMigrationStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const status = await storageMigration.checkMigrationStatus();
      setMigrationStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check migration status');
    } finally {
      setLoading(false);
    }
  }, []);

  const migrate = useCallback(async (options?: any) => {
    try {
      setMigrationInProgress(true);
      setError(null);
      
      const result = await storageMigration.migrateFromLocalStorage(options);
      await checkMigrationStatus(); // Refresh status after migration
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Migration failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setMigrationInProgress(false);
    }
  }, [checkMigrationStatus]);

  const estimateMigrationTime = useCallback(async () => {
    try {
      return await storageMigration.estimateMigrationTime();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to estimate migration time');
      return null;
    }
  }, []);

  const createBackup = useCallback(async () => {
    try {
      return await storageMigration.createBackup();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create backup');
      return null;
    }
  }, []);

  const restoreFromBackup = useCallback(async (backupData: string) => {
    try {
      setMigrationInProgress(true);
      setError(null);
      
      const result = await storageMigration.restoreFromBackup(backupData);
      await checkMigrationStatus(); // Refresh status after restore
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Restore failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setMigrationInProgress(false);
    }
  }, [checkMigrationStatus]);

  useEffect(() => {
    checkMigrationStatus();
  }, [checkMigrationStatus]);

  return {
    migrationStatus,
    migrationInProgress,
    loading,
    error,
    checkMigrationStatus,
    migrate,
    estimateMigrationTime,
    createBackup,
    restoreFromBackup
  };
}

export interface UseStorageHealthReturn {
  isReady: boolean;
  loading: boolean;
  error: string | null;
  checkHealth: () => Promise<void>;
}

export function useStorageHealth() {
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ready = await isStorageReady();
      setIsReady(ready);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Storage health check failed');
      setIsReady(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    isReady,
    loading,
    error,
    checkHealth
  };
}

// Utility hook for bulk operations
export function useBulkOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkDelete = useCallback(async (ids: string[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await bulkDeleteConversations(ids);
      if (result.errors.length > 0) {
        setError(result.errors.join(', '));
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Bulk delete failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bulkDelete,
    loading,
    error
  };
}