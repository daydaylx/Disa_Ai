import { expect, type Page } from "@playwright/test";

/**
 * Enhanced E2E Test Helpers for Disa AI
 * Provides stable, reusable functions to interact with the app
 */

export class AppHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for app to be fully loaded and interactive
   */
  async waitForAppReady(timeout = 20000): Promise<void> {
    // Wait for network to be idle
    await this.page.waitForLoadState("networkidle");

    // Wait for React to mount
    await this.page.waitForTimeout(1000);

    // Ensure loading states are gone
    await expect(this.page.getByText("Wird geladen...")).not.toBeVisible({ timeout: 8000 });

    // Ensure chat log is present
    await expect(this.page.locator('[data-testid="chat-log"]')).toBeVisible({ timeout });

    // Wait for content stabilization
    await this.page.waitForTimeout(500);
  }

  /**
   * Verify chat interface is loaded and interactive
   */
  async verifyChatInterface(): Promise<void> {
    // Chat log should be visible
    await expect(this.page.locator('[data-testid="chat-log"]')).toBeVisible();

    // Either quickstarts or welcome message should be visible
    const hasWelcomeContent = await Promise.race([
      this.page
        .locator("text=Was möchtest du heute erschaffen?")
        .isVisible()
        .catch(() => false),
      this.page
        .locator('[data-testid="start-standard-chat"]')
        .isVisible()
        .catch(() => false),
      this.page
        .locator('[data-testid^="quickstart-"]')
        .first()
        .isVisible()
        .catch(() => false),
    ]);

    expect(hasWelcomeContent).toBeTruthy();
  }

  /**
   * Navigate to a route and wait for it to be ready
   */
  async navigateAndWait(route: string, timeout = 20000): Promise<void> {
    await this.page.goto(route);
    await this.waitForAppReady(timeout);
  }

  /**
   * Reload page and wait for it to be ready
   */
  async reloadAndWait(timeout = 25000): Promise<void> {
    // Stable reload with proper wait states
    await this.page.reload({ waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1500);

    await this.waitForAppReady(timeout);
  }

  /**
   * Check for console errors and filter known warnings
   */
  setupConsoleMonitoring(): { getErrors: () => string[]; getWarnings: () => string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    this.page.on("console", (msg) => {
      const text = msg.text();

      if (msg.type() === "error") {
        // Filter out known non-critical errors
        if (!this.isKnownNonCriticalError(text)) {
          errors.push(text);
        }
      }

      if (msg.type() === "warning") {
        warnings.push(text);
      }
    });

    return {
      getErrors: () => [...errors],
      getWarnings: () => [...warnings],
    };
  }

  /**
   * Filter known non-critical errors that shouldn't fail tests
   */
  private isKnownNonCriticalError(error: string): boolean {
    const knownPatterns = [
      /ResizeObserver loop limit exceeded/,
      /Non-passive event listener/,
      /Failed to load resource.*favicon/,
      // Add more patterns as needed
    ];

    return knownPatterns.some((pattern) => pattern.test(error));
  }

  /**
   * Wait for specific content to appear
   */
  async waitForContent(selector: string, timeout = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible({ timeout });
  }

  /**
   * Check if models page is accessible
   */
  async verifyModelsPage(): Promise<void> {
    const url = this.page.url();

    if (url.includes("/models")) {
      // Models page exists, check for models title
      await expect(this.page.locator('[data-testid="models-title"]')).toBeVisible({
        timeout: 10000,
      });
    } else {
      // Redirected to chat, verify chat interface
      await this.verifyChatInterface();
    }
  }

  /**
   * Verify performance - check load time
   */
  async measureLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.waitForAppReady();
    await this.verifyChatInterface();
    return Date.now() - startTime;
  }

  /**
   * Check for failed network requests
   */
  setupNetworkMonitoring(): { getFailedRequests: () => Array<{ url: string; status: number }> } {
    const failedRequests: Array<{ url: string; status: number }> = [];

    this.page.on("response", (response) => {
      const url = response.url();
      const status = response.status();

      // Track failed asset requests
      if ((url.includes(".js") || url.includes(".css")) && status >= 400) {
        failedRequests.push({ url, status });
      }
    });

    return {
      getFailedRequests: () => [...failedRequests],
    };
  }

  /**
   * Check MIME types for assets
   */
  setupMimeTypeMonitoring(): {
    getWrongMimeTypes: () => Array<{ url: string; contentType: string }>;
  } {
    const wrongMimeTypes: Array<{ url: string; contentType: string }> = [];

    this.page.on("response", (response) => {
      const url = response.url();
      const contentType = response.headers()["content-type"] || "";

      // Check JavaScript files
      if (
        url.endsWith(".js") &&
        !contentType.includes("javascript") &&
        !contentType.includes("module") &&
        !contentType.includes("text/javascript") &&
        !contentType.includes("application/javascript")
      ) {
        wrongMimeTypes.push({ url, contentType });
      }

      // Check CSS files (excluding dev mode exceptions)
      if (
        url.endsWith(".css") &&
        !contentType.includes("css") &&
        !contentType.includes("text/css") &&
        !url.includes("localhost:5174/src/")
      ) {
        wrongMimeTypes.push({ url, contentType });
      }
    });

    return {
      getWrongMimeTypes: () => [...wrongMimeTypes],
    };
  }

  /**
   * Check for CSP violations
   */
  getCSPErrors(allErrors: string[]): string[] {
    return allErrors.filter(
      (error) =>
        error.toLowerCase().includes("content security policy") ||
        error.toLowerCase().includes("csp") ||
        error.toLowerCase().includes("refused to"),
    );
  }
}
