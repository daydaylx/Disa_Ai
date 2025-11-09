// E2E test for storage migration workflow
import { test, expect } from '@playwright/test';

test.describe('Storage Migration E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for app to load
    await page.waitForSelector('[data-testid="app-loaded"]', { timeout: 10000 });
  });

  test('should detect localStorage data and show migration prompt', async ({ page }) => {
    // Mock localStorage to have data
    await page.addInitScript(() => {
      localStorage.setItem('disa:conversations', JSON.stringify({
        'conv1': {
          id: 'conv1',
          title: 'Test Conversation',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 2,
          messages: [
            { id: '1', role: 'user', content: 'Hello', timestamp: '2024-01-01T00:00:00Z', model: 'gpt-3.5' },
            { id: '2', role: 'assistant', content: 'Hi there!', timestamp: '2024-01-01T00:00:01Z', model: 'gpt-3.5' }
          ]
        }
      }));
      localStorage.setItem('disa:conversations:metadata', JSON.stringify({
        'conv1': {
          id: 'conv1',
          title: 'Test Conversation',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 2
        }
      }));
    });

    // Reload page to trigger detection
    await page.reload();
    await page.waitForTimeout(2000);

    // Should show migration UI
    await expect(page.locator('[data-testid="storage-migration"]')).toBeVisible();
    await expect(page.locator('[data-testid="migration-prompt"]')).toBeVisible();
  });

  test('should successfully migrate localStorage data to IndexedDB', async ({ page }) => {
    // Set up localStorage with test data
    await page.addInitScript(() => {
      localStorage.setItem('disa:conversations', JSON.stringify({
        'conv1': {
          id: 'conv1',
          title: 'Test Conversation',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 2,
          messages: [
            { id: '1', role: 'user', content: 'Hello', timestamp: '2024-01-01T00:00:00Z', model: 'gpt-3.5' },
            { id: '2', role: 'assistant', content: 'Hi there!', timestamp: '2024-01-01T00:00:01Z', model: 'gpt-3.5' }
          ]
        }
      }));
      localStorage.setItem('disa:conversations:metadata', JSON.stringify({
        'conv1': {
          id: 'conv1',
          title: 'Test Conversation',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 2
        }
      }));
    });

    await page.reload();
    await page.waitForTimeout(2000);

    // Start migration
    await page.click('[data-testid="start-migration"]');
    
    // Wait for migration to complete
    await expect(page.locator('[data-testid="migration-success"]')).toBeVisible({ timeout: 30000 });
    
    // Verify migration results
    const migratedCount = await page.locator('[data-testid="migrated-count"]').textContent();
    expect(migratedCount).toContain('1');
    
    // Should show success message
    await expect(page.locator('[data-testid="migration-complete"]')).toBeVisible();
  });

  test('should handle migration errors gracefully', async ({ page }) => {
    // Mock IndexedDB to fail
    await page.addInitScript(() => {
      // Mock Dexie to throw error
      (window as any).indexedDB = undefined;
      
      // Set localStorage data
      localStorage.setItem('disa:conversations', JSON.stringify({
        'conv1': {
          id: 'conv1',
          title: 'Test Conversation',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 1,
          messages: [{ id: '1', role: 'user', content: 'Hello', timestamp: '2024-01-01T00:00:00Z', model: 'gpt-3.5' }]
        }
      }));
    });

    await page.reload();
    await page.waitForTimeout(2000);

    // Should show error state
    await expect(page.locator('[data-testid="migration-error"]')).toBeVisible();
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText('IndexedDB');
  });

  test('should allow manual migration from settings', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForSelector('[data-testid="settings-page"]');

    // Go to data section
    await page.click('[data-testid="data-section"]');

    // Should show migration option
    await expect(page.locator('[data-testid="manual-migration"]')).toBeVisible();
    
    // Click migration button
    await page.click('[data-testid="manual-migration"]');
    
    // Should open migration dialog
    await expect(page.locator('[data-testid="migration-dialog"]')).toBeVisible();
  });

  test('should preserve data during failed migration', async ({ page }) => {
    // Set up localStorage with test data
    await page.addInitScript(() => {
      localStorage.setItem('disa:conversations', JSON.stringify({
        'conv1': {
          id: 'conv1',
          title: 'Important Data',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          model: 'gpt-3.5',
          messageCount: 1,
          messages: [{ id: '1', role: 'user', content: 'Important message', timestamp: '2024-01-01T00:00:00Z', model: 'gpt-3.5' }]
        }
      }));
    });

    await page.reload();
    await page.waitForTimeout(2000);

    // Try to start migration (it might fail, but localStorage should remain)
    await page.click('[data-testid="start-migration"]').catch(() => {});
    await page.waitForTimeout(5000);

    // Check that localStorage still has data
    const data = await page.evaluate(() => localStorage.getItem('disa:conversations'));
    expect(data).toBeTruthy();
  });
});