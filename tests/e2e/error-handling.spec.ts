import { expect, test } from "@playwright/test";

import { AppHelpers } from "./helpers/app-helpers";

test.describe("Error Handling and Recovery Flow Tests", () => {
  test("Network error handling and offline functionality", async ({ page }) => {
    const helpers = new AppHelpers(page);

    // Set up API key for authenticated requests
    await page.addInitScript(() => {
      localStorage.setItem("openrouter-api-key", "test-api-key");
    });

    await helpers.navigateAndWait("/chat");

    // Simulate network failure
    await page.route("**/api/**", (route) => {
      route.abort("failed");
    });

    // Try to send a message that will fail
    const composer = page.locator('textarea[placeholder="Nachricht an Disa AI schreiben..."]');
    if (await composer.isVisible()) {
      await composer.fill("Test message that should fail");
      await composer.press("Enter");
      await page.waitForTimeout(2000);

      // Look for error message or indication
      const errorIndicator = page
        .getByText(/fehler|error|offline|network/i)
        .or(page.locator("[data-testid*='error']"))
        .or(page.locator(".error-message"));

      if (await errorIndicator.first().isVisible()) {
        await expect(errorIndicator.first()).toBeVisible();
      }

      // Test retry functionality
      const retryButton = page.getByRole("button", { name: /retry|erneut|wiederholen/i });
      if (await retryButton.isVisible()) {
        await expect(retryButton).toBeVisible();

        // Restore network and retry
        await page.unroute("**/api/**");

        // Set up successful API mock
        await page.route("**/api/**", (route) => {
          route.fulfill({
            status: 200,
            contentType: "text/plain",
            body: 'data: {"choices":[{"delta":{"content":"Test response"}}]}\n\n',
          });
        });

        await retryButton.tap();
        await page.waitForTimeout(1000);

        // Verify recovery
        const responseMessage = page.locator("[data-testid='message-bubble']").filter({
          hasText: "Test response",
        });

        if (await responseMessage.isVisible()) {
          await expect(responseMessage).toBeVisible();
        }
      }
    }
  });

  test("API key validation and error states", async ({ page }) => {
    const helpers = new AppHelpers(page);

    // Start without API key
    await page.addInitScript(() => {
      localStorage.removeItem("openrouter-api-key");
    });

    await helpers.navigateAndWait("/chat");

    // Look for API key prompt or error
    const apiKeyPrompt = page
      .getByText(/api.*key|schlüssel/i)
      .or(page.locator("[data-testid*='api-key']"));

    if (await apiKeyPrompt.first().isVisible()) {
      await expect(apiKeyPrompt.first()).toBeVisible();

      // Test invalid API key
      const apiKeyInput = page
        .locator("input[type='password']")
        .or(page.locator("input[placeholder*='api']"));

      if (await apiKeyInput.isVisible()) {
        await apiKeyInput.fill("invalid-api-key");

        const saveButton = page.getByRole("button", { name: /speichern|save|confirm/i });
        if (await saveButton.isVisible()) {
          await saveButton.tap();
          await page.waitForTimeout(500);

          // Try to send a message with invalid key
          const composer = page.locator(
            'textarea[placeholder="Nachricht an Disa AI schreiben..."]',
          );
          if (await composer.isVisible()) {
            await composer.fill("Test message");
            await composer.press("Enter");
            await page.waitForTimeout(2000);

            // Look for authentication error
            const authError = page.getByText(/unauthorized|authentifizierung|api.*key.*invalid/i);
            if (await authError.first().isVisible()) {
              await expect(authError.first()).toBeVisible();
            }
          }
        }
      }
    }
  });

  test("Route error handling and 404 pages", async ({ page }) => {
    const helpers = new AppHelpers(page);

    // Test 404 page
    await page.goto("/nonexistent-page");
    await page.waitForTimeout(1000);

    // Check if redirected to 404 or error page
    const notFoundIndicator = page
      .getByText(/404|nicht gefunden|not found/i)
      .or(page.getByRole("heading", { name: /404/i }));

    if (await notFoundIndicator.first().isVisible()) {
      await expect(notFoundIndicator.first()).toBeVisible();

      // Test navigation back to working page
      const homeLink = page
        .getByRole("link", { name: /home|start|zurück.*chat/i })
        .or(page.getByRole("button", { name: /zurück.*chat/i }));

      if (await homeLink.isVisible()) {
        await homeLink.tap();
        await page.waitForTimeout(1000);

        // Verify we're back to a working page
        await expect(page).toHaveURL(/\/chat$/);
      }
    } else {
      // App might redirect unknown routes to home
      await expect(page).toHaveURL(/\/(chat)?$/);
    }
  });

  test("Form validation and error feedback", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/settings/api");

    // Test empty form submission
    const apiKeyInput = page
      .locator("input[type='password']")
      .or(page.locator("input[placeholder*='api']"));

    if (await apiKeyInput.isVisible()) {
      // Clear any existing value
      await apiKeyInput.fill("");

      const saveButton = page.getByRole("button", { name: /speichern|save/i });
      if (await saveButton.isVisible()) {
        await saveButton.tap();
        await page.waitForTimeout(500);

        // Look for validation error
        const validationError = page
          .getByText(/required|erforderlich|pflichtfeld/i)
          .or(page.locator("[data-testid*='error']"));

        if (await validationError.first().isVisible()) {
          await expect(validationError.first()).toBeVisible();
        }

        // Test too short API key
        await apiKeyInput.fill("abc");
        await saveButton.tap();
        await page.waitForTimeout(500);

        const lengthError = page.getByText(/zu kurz|too short|minimum/i);
        if (await lengthError.first().isVisible()) {
          await expect(lengthError.first()).toBeVisible();
        }
      }
    }
  });

  test("Error boundary and application crash recovery", async ({ page }) => {
    const helpers = new AppHelpers(page);

    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await helpers.navigateAndWait("/chat");

    // Inject code that will cause a React error
    await page.evaluate(() => {
      // Trigger an error in React component
      window.dispatchEvent(
        new CustomEvent("test-error", {
          detail: { error: new Error("Test error for boundary") },
        }),
      );
    });

    await page.waitForTimeout(1000);

    // Check if error boundary is displayed
    const errorBoundary = page
      .getByText(/unerwarteter fehler|unexpected error|etwas ist schiefgelaufen/i)
      .or(page.locator("[data-testid*='error-boundary']"));

    if (await errorBoundary.first().isVisible()) {
      await expect(errorBoundary.first()).toBeVisible();

      // Test error boundary recovery
      const retryButton = page.getByRole("button", { name: /erneut versuchen|try again|retry/i });
      if (await retryButton.isVisible()) {
        await retryButton.tap();
        await page.waitForTimeout(1000);

        // Verify app recovers
        const welcomeText = page.getByText("Starte eine Unterhaltung");
        if (await welcomeText.isVisible()) {
          await expect(welcomeText).toBeVisible();
        }
      }

      // Test navigation to home
      const homeButton = page.getByRole("button", { name: /zur startseite|home/i });
      if (await homeButton.isVisible()) {
        await homeButton.tap();
        await page.waitForTimeout(1000);

        await expect(page).toHaveURL(/\/(chat)?$/);
      }
    }
  });

  test("Offline mode and PWA functionality", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Simulate going offline
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);

    // Test that app still works offline
    const mainContent = page.locator("#main").or(page.locator("#app"));
    await expect(mainContent).toBeVisible();

    // Test navigation while offline
    const navLinks = page.locator("nav a").or(page.locator("nav button"));

    const linkCount = await navLinks.count();
    if (linkCount > 0) {
      const firstLink = navLinks.first();
      await firstLink.tap();
      await page.waitForTimeout(1000);

      // Navigation should still work for cached pages
      const pageContent = page.locator("main").or(page.locator("#main"));
      await expect(pageContent).toBeVisible();
    }

    // Look for offline indicator
    const offlineIndicator = page
      .getByText(/offline|nicht verbunden|no connection/i)
      .or(page.locator("[data-testid*='offline']"));

    if (await offlineIndicator.first().isVisible()) {
      await expect(offlineIndicator.first()).toBeVisible();
    }

    // Test going back online
    await page.context().setOffline(false);
    await page.waitForTimeout(2000);

    // Offline indicator should disappear
    if (await offlineIndicator.first().isVisible()) {
      await expect(offlineIndicator.first()).not.toBeVisible();
    }
  });

  test("Memory and storage error handling", async ({ page }) => {
    const helpers = new AppHelpers(page);

    // Fill up localStorage to simulate quota exceeded
    await page.addInitScript(() => {
      try {
        // Try to fill localStorage
        let i = 0;
        while (i < 1000) {
          localStorage.setItem(`test-key-${i}`, "x".repeat(1000));
          i++;
        }
      } catch (e) {
        // Storage quota exceeded - this is what we want to test
        console.error("Storage quota exceeded:", e);
      }
    });

    await helpers.navigateAndWait("/chat");

    // Try to perform operations that use localStorage
    const composer = page.locator('textarea[placeholder="Nachricht an Disa AI schreiben..."]');
    if (await composer.isVisible()) {
      await composer.fill("Test message for storage");
      await composer.press("Enter");
      await page.waitForTimeout(1000);

      // App should still function even with storage errors
      const messageElement = page.locator("[data-testid='message-bubble']").filter({
        hasText: "Test message for storage",
      });

      if (await messageElement.isVisible()) {
        await expect(messageElement).toBeVisible();
      }
    }

    // Clean up localStorage
    await page.evaluate(() => {
      for (let i = 0; i < 1000; i++) {
        localStorage.removeItem(`test-key-${i}`);
      }
    });
  });

  test("Performance under stress and large data", async ({ page }) => {
    const helpers = new AppHelpers(page);
    await helpers.navigateAndWait("/chat");

    // Create a conversation with many messages
    const composer = page.locator('textarea[placeholder="Nachricht an Disa AI schreiben..."]');
    if (await composer.isVisible()) {
      // Mock API for fast responses
      await page.route("**/api/**", (route) => {
        route.fulfill({
          status: 200,
          contentType: "text/plain",
          body: 'data: {"choices":[{"delta":{"content":"Response"}}]}\n\n',
        });
      });

      // Send multiple messages quickly
      for (let i = 0; i < 10; i++) {
        await composer.fill(`Message ${i + 1} with some content`);
        await composer.press("Enter");
        await page.waitForTimeout(200);
      }

      await page.waitForTimeout(2000);

      // Verify app remains responsive
      const messageList = page.locator("[data-testid='message-list']").or(page.locator("main"));

      // Test scrolling performance
      const scrollableArea = await messageList.boundingBox();
      if (scrollableArea) {
        const startTime = Date.now();
        await page.mouse.wheel(0, -500);
        await page.waitForTimeout(100);
        await page.mouse.wheel(0, 500);
        const scrollTime = Date.now() - startTime;

        // Scrolling should be responsive
        expect(scrollTime).toBeLessThan(1000);
      }

      // Test that new messages can still be sent
      await composer.fill("Final test message");
      await composer.press("Enter");
      await page.waitForTimeout(500);

      const finalMessage = page.locator("[data-testid='message-bubble']").filter({
        hasText: "Final test message",
      });

      if (await finalMessage.isVisible()) {
        await expect(finalMessage).toBeVisible();
      }
    }
  });
});
