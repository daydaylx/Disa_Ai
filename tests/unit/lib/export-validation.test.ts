// Quick validation test to check what exports are available
import { describe, it, expect } from 'vitest';

describe('Export Validation', () => {
  it('should check what is actually exported from storage-layer', async () => {
    const storageLayer = await import('@/lib/storage-layer');
    
    console.log('Available exports:', Object.keys(storageLayer));
    
    expect(typeof storageLayer.ModernStorageLayer).toBe('function');
    expect(typeof storageLayer.modernStorage).toBe('object');
  });

  it('should check what is actually exported from storage-migration', async () => {
    const migration = await import('@/lib/storage-migration');
    
    console.log('Migration exports:', Object.keys(migration));
    
    expect(typeof migration.StorageMigration).toBe('function');
    expect(typeof migration.storageMigration).toBe('object');
  });
});