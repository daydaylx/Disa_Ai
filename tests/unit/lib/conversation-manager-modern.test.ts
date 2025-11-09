// Unit tests for conversation manager
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getConversationStats,
  getAllConversations,
  getConversation,
  saveConversation,
  deleteConversation,
  cleanupOldConversations,
  exportConversations,
  importConversations,
  getConversationById,
  updateConversation,
  toggleFavorite,
  isStorageReady,
  migrateFromLocalStorage,
  getStoragePerformance,
  searchConversations,
  bulkDeleteConversations,
  bulkUpdateConversations,
  type Conversation,
  type ConversationMetadata
} from '@/lib/conversation-manager-modern';

// Mock the modernStorage
vi.mock('@/lib/storage-layer', () => ({
  modernStorage: {
    getConversationStats: vi.fn(),
    getAllConversations: vi.fn(),
    getConversation: vi.fn(),
    saveConversation: vi.fn(),
    deleteConversation: vi.fn(),
    cleanupOldConversations: vi.fn(),
    exportConversations: vi.fn(),
    importConversations: vi.fn(),
    getStorageUsage: vi.fn()
  }
}));

import { modernStorage } from '@/lib/storage-layer';

describe('Conversation Manager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getConversationStats', () => {
    it('should return stats from storage layer', async () => {
      const mockStats = {
        totalConversations: 5,
        totalMessages: 25,
        averageMessagesPerConversation: 5,
        modelsUsed: ['gpt-3.5', 'gpt-4'],
        storageSize: 1024000
      };

      modernStorage.getConversationStats.mockResolvedValue(mockStats);
      
      const result = await getConversationStats();
      
      expect(result).toEqual(mockStats);
      expect(modernStorage.getConversationStats).toHaveBeenCalled();
    });
  });

  describe('getAllConversations', () => {
    it('should return conversations from storage layer', async () => {
      const mockConversations: ConversationMetadata[] = [
        {
          id: '1',
          title: 'Test Conversation',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 5
        }
      ];

      modernStorage.getAllConversations.mockResolvedValue(mockConversations);
      
      const result = await getAllConversations();
      
      expect(result).toEqual(mockConversations);
      expect(modernStorage.getAllConversations).toHaveBeenCalled();
    });
  });

  describe('getConversation', () => {
    it('should return conversation from storage layer', async () => {
      const mockConversation: Conversation = {
        id: '1',
        title: 'Test Conversation',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        model: 'gpt-3.5',
        messageCount: 5,
        messages: [{ role: 'user', content: 'Hello' }]
      };

      modernStorage.getConversation.mockResolvedValue(mockConversation);
      
      const result = await getConversation('1');
      
      expect(result).toEqual(mockConversation);
      expect(modernStorage.getConversation).toHaveBeenCalledWith('1');
    });
  });

  describe('saveConversation', () => {
    it('should save conversation via storage layer', async () => {
      const conversation: Conversation = {
        id: '1',
        title: 'Test Conversation',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        model: 'gpt-3.5',
        messageCount: 5,
        messages: [{ role: 'user', content: 'Hello' }]
      };

      await saveConversation(conversation);
      
      expect(modernStorage.saveConversation).toHaveBeenCalledWith(conversation);
    });
  });

  describe('deleteConversation', () => {
    it('should delete conversation via storage layer', async () => {
      await deleteConversation('1');
      
      expect(modernStorage.deleteConversation).toHaveBeenCalledWith('1');
    });
  });

  describe('cleanupOldConversations', () => {
    it('should cleanup old conversations via storage layer', async () => {
      modernStorage.cleanupOldConversations.mockResolvedValue(3);
      
      const result = await cleanupOldConversations(30);
      
      expect(result).toBe(3);
      expect(modernStorage.cleanupOldConversations).toHaveBeenCalledWith(30);
    });
  });

  describe('exportConversations', () => {
    it('should export conversations via storage layer', async () => {
      const mockExportData = {
        version: '2.0',
        metadata: {
          exportedAt: '2024-01-01T00:00:00Z',
          totalConversations: 1,
          appVersion: '2.0.0'
        },
        conversations: []
      };

      modernStorage.exportConversations.mockResolvedValue(mockExportData);
      
      const result = await exportConversations();
      
      expect(result).toEqual(mockExportData);
      expect(modernStorage.exportConversations).toHaveBeenCalled();
    });
  });

  describe('importConversations', () => {
    it('should import conversations via storage layer', async () => {
      const importData = {
        version: '2.0',
        metadata: {
          exportedAt: '2024-01-01T00:00:00Z',
          totalConversations: 1,
          appVersion: '2.0.0'
        },
        conversations: []
      };

      const mockResult = {
        success: true,
        importedCount: 1,
        errors: []
      };

      modernStorage.importConversations.mockResolvedValue(mockResult);
      
      const result = await importConversations(importData, { overwrite: false });
      
      expect(result).toEqual(mockResult);
      expect(modernStorage.importConversations).toHaveBeenCalledWith(importData, { overwrite: false });
    });
  });

  describe('getConversationById', () => {
    it('should call getConversation with the provided id', async () => {
      const mockConversation: Conversation = {
        id: '1',
        title: 'Test Conversation',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        model: 'gpt-3.5',
        messageCount: 5,
        messages: [{ role: 'user', content: 'Hello' }]
      };

      modernStorage.getConversation.mockResolvedValue(mockConversation);
      
      const result = await getConversationById('1');
      
      expect(result).toEqual(mockConversation);
      expect(modernStorage.getConversation).toHaveBeenCalledWith('1');
    });
  });

  describe('updateConversation', () => {
    it('should update conversation successfully', async () => {
      const existingConversation: Conversation = {
        id: '1',
        title: 'Original Title',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        model: 'gpt-3.5',
        messageCount: 5,
        messages: [{ role: 'user', content: 'Hello' }]
      };

      const updates = { title: 'Updated Title' };

      modernStorage.getConversation.mockResolvedValue(existingConversation);
      modernStorage.saveConversation.mockResolvedValue(undefined);
      
      await updateConversation('1', updates);
      
      expect(modernStorage.getConversation).toHaveBeenCalledWith('1');
      expect(modernStorage.saveConversation).toHaveBeenCalledWith({
        ...existingConversation,
        ...updates,
        updatedAt: expect.any(String)
      });
    });

    it('should throw error when conversation not found', async () => {
      modernStorage.getConversation.mockResolvedValue(null);
      
      await expect(updateConversation('nonexistent', { title: 'New Title' }))
        .rejects.toThrow('Conversation nonexistent not found');
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite status successfully', async () => {
      const existingConversation: Conversation = {
        id: '1',
        title: 'Test Conversation',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        model: 'gpt-3.5',
        messageCount: 5,
        messages: [{ role: 'user', content: 'Hello' }],
        isFavorite: false
      };

      modernStorage.getConversation.mockResolvedValue(existingConversation);
      modernStorage.saveConversation.mockResolvedValue(undefined);
      
      await toggleFavorite('1');
      
      expect(modernStorage.getConversation).toHaveBeenCalledWith('1');
      expect(modernStorage.saveConversation).toHaveBeenCalledWith({
        ...existingConversation,
        isFavorite: true,
        updatedAt: expect.any(String)
      });
    });

    it('should throw error when conversation not found', async () => {
      modernStorage.getConversation.mockResolvedValue(null);
      
      await expect(toggleFavorite('nonexistent'))
        .rejects.toThrow('Conversation nonexistent not found');
    });
  });

  describe('isStorageReady', () => {
    it('should return true when storage is ready', async () => {
      modernStorage.getConversationStats.mockResolvedValue({
        totalConversations: 0,
        totalMessages: 0,
        averageMessagesPerConversation: 0,
        modelsUsed: [],
        storageSize: 0
      });
      
      const result = await isStorageReady();
      
      expect(result).toBe(true);
      expect(modernStorage.getConversationStats).toHaveBeenCalled();
    });

    it('should return false when storage is not ready', async () => {
      modernStorage.getConversationStats.mockRejectedValue(new Error('Storage not ready'));
      
      const result = await isStorageReady();
      
      expect(result).toBe(false);
    });
  });

  describe('migrateFromLocalStorage', () => {
    it('should migrate conversations successfully', async () => {
      const mockConversations: Conversation[] = [
        {
          id: '1',
          title: 'Test Conversation',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 5,
          messages: [{ role: 'user', content: 'Hello' }]
        }
      ];

      // Mock localStorage
      vi.stubGlobal('localStorage', {
        getItem: vi.fn((key) => {
          if (key === 'disa:conversations') {
            return JSON.stringify({ '1': mockConversations[0] });
          }
          return null;
        }),
        removeItem: vi.fn()
      });

      modernStorage.saveConversation.mockResolvedValue(undefined);
      
      const result = await migrateFromLocalStorage();
      
      expect(result).toEqual({
        migrated: 1,
        errors: []
      });
      expect(modernStorage.saveConversation).toHaveBeenCalledWith(mockConversations[0]);
    });

    it('should return zero migrated when no localStorage data', async () => {
      vi.stubGlobal('localStorage', {
        getItem: vi.fn().mockReturnValue(null),
        removeItem: vi.fn()
      });
      
      const result = await migrateFromLocalStorage();
      
      expect(result).toEqual({
        migrated: 0,
        errors: []
      });
    });
  });

  describe('getStoragePerformance', () => {
    it('should measure storage performance', async () => {
      const mockConversations: ConversationMetadata[] = [
        {
          id: '1',
          title: 'Test Conversation',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 5
        }
      ];

      modernStorage.getAllConversations.mockResolvedValue(mockConversations);
      modernStorage.saveConversation.mockResolvedValue(undefined);
      modernStorage.deleteConversation.mockResolvedValue(undefined);
      
      const result = await getStoragePerformance();
      
      expect(result).toEqual({
        readTime: expect.any(Number),
        writeTime: expect.any(Number),
        totalOperations: 2
      });
      
      expect(modernStorage.getAllConversations).toHaveBeenCalled();
      expect(modernStorage.saveConversation).toHaveBeenCalled();
      expect(modernStorage.deleteConversation).toHaveBeenCalled();
    });
  });

  describe('searchConversations', () => {
    it('should search conversations by title and model', async () => {
      const mockConversations: ConversationMetadata[] = [
        {
          id: '1',
          title: 'GPT-4 Discussion',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-4',
          messageCount: 5
        },
        {
          id: '2',
          title: 'GPT-3.5 Tutorial',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 3
        }
      ];

      modernStorage.getAllConversations.mockResolvedValue(mockConversations);
      
      const result = await searchConversations('GPT-4');
      
      expect(result).toEqual([mockConversations[0]]);
    });

    it('should return empty array when no matches found', async () => {
      const mockConversations: ConversationMetadata[] = [
        {
          id: '1',
          title: 'Test Conversation',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 5
        }
      ];

      modernStorage.getAllConversations.mockResolvedValue(mockConversations);
      
      const result = await searchConversations('nonexistent');
      
      expect(result).toEqual([]);
    });
  });

  describe('bulkDeleteConversations', () => {
    it('should delete multiple conversations successfully', async () => {
      modernStorage.deleteConversation.mockResolvedValue(undefined);
      
      const result = await bulkDeleteConversations(['1', '2', '3']);
      
      expect(result).toEqual({
        deleted: 3,
        errors: []
      });
      expect(modernStorage.deleteConversation).toHaveBeenCalledTimes(3);
      expect(modernStorage.deleteConversation).toHaveBeenCalledWith('1');
      expect(modernStorage.deleteConversation).toHaveBeenCalledWith('2');
      expect(modernStorage.deleteConversation).toHaveBeenCalledWith('3');
    });

    it('should handle partial failures', async () => {
      modernStorage.deleteConversation
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Delete failed'))
        .mockResolvedValueOnce(undefined);
      
      const result = await bulkDeleteConversations(['1', '2', '3']);
      
      expect(result).toEqual({
        deleted: 2,
        errors: ['Failed to delete conversation 2: Error: Delete failed']
      });
    });
  });

  describe('bulkUpdateConversations', () => {
    it('should update multiple conversations successfully', async () => {
      const existingConversation: Conversation = {
        id: '1',
        title: 'Original Title',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        model: 'gpt-3.5',
        messageCount: 5,
        messages: [{ role: 'user', content: 'Hello' }]
      };

      const updates = [
        { id: '1', updates: { title: 'Updated Title' } },
        { id: '2', updates: { title: 'Another Title' } }
      ];

      modernStorage.getConversation
        .mockResolvedValueOnce(existingConversation)
        .mockResolvedValueOnce(existingConversation);
      modernStorage.saveConversation.mockResolvedValue(undefined);
      
      const result = await bulkUpdateConversations(updates);
      
      expect(result).toEqual({
        updated: 2,
        errors: []
      });
      expect(modernStorage.saveConversation).toHaveBeenCalledTimes(2);
    });

    it('should handle partial failures', async () => {
      const existingConversation: Conversation = {
        id: '1',
        title: 'Original Title',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        model: 'gpt-3.5',
        messageCount: 5,
        messages: [{ role: 'user', content: 'Hello' }]
      };

      const updates = [
        { id: '1', updates: { title: 'Updated Title' } },
        { id: 'nonexistent', updates: { title: 'Another Title' } }
      ];

      modernStorage.getConversation
        .mockResolvedValueOnce(existingConversation)
        .mockResolvedValueOnce(null);
      
      const result = await bulkUpdateConversations(updates);
      
      expect(result).toEqual({
        updated: 1,
        errors: ['Failed to update conversation nonexistent: Error: Conversation nonexistent not found']
      });
    });
  });
});