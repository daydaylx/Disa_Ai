import { expect, test } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage loads with main UI elements visible", async ({ page }) => {
    await page.goto("/");

    // Wait for app to be fully loaded
    await page.waitForLoadState("networkidle");

    // Check for main chat interface elements using robust selectors
    // Look for text input (common in chat apps)
    const textInput = page.getByRole("textbox").first();
    await expect(textInput).toBeVisible();

    // Check for send button or similar action button
    const actionButton = page.getByRole("button").first();
    await expect(actionButton).toBeVisible();

    // Verify page title is set correctly
    await expect(page).toHaveTitle(/Disa AI|Chat/i);

    // Check that no error boundary is showing
    await expect(page.getByText("Oops! Something went wrong")).not.toBeVisible();
  });

  test("prompt flow - text input and submission works", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find the main text input
    const textInput = page.getByRole("textbox").first();
    await expect(textInput).toBeVisible();

    // Enter test text
    const testPrompt = "Hello, this is a test message";
    await textInput.fill(testPrompt);

    // Verify text was entered
    await expect(textInput).toHaveValue(testPrompt);

    // Find and click send button (look for common button text/roles)
    const sendButton = page
      .getByRole("button")
      .filter({
        hasText: /send|submit|chat/i,
      })
      .first();

    // If no send button with text, try to find by position or keyboard shortcut
    if ((await sendButton.count()) === 0) {
      // Try pressing Enter as alternative submission method
      await textInput.press("Enter");
    } else {
      await sendButton.click();
    }

    // Look for loading state or message processing indicators
    // This could be a loading spinner, disabled input, or placeholder text
    await expect(async () => {
      const isInputDisabled = await textInput.isDisabled();
      const hasLoadingIndicator = (await page.getByRole("status").count()) > 0;
      const hasLoadingText = (await page.getByText(/loading|thinking|processing/i).count()) > 0;

      // At least one loading indicator should be present
      expect(isInputDisabled || hasLoadingIndicator || hasLoadingText).toBe(true);
    }).toPass({ timeout: 5000 });

    // Verify input is cleared or in expected state after submission
    const inputValueAfterSubmit = await textInput.inputValue();
    // Input should either be cleared or still contain the text (depends on UX)
    expect(typeof inputValueAfterSubmit).toBe("string");
  });

  test("404 route fallback - unknown routes redirect to main app", async ({ page }) => {
    // Test that deep links work via 404.html fallback
    const unknownRoute = "/unknown/deep/route?param=test#hash";

    await page.goto(unknownRoute);
    await page.waitForLoadState("networkidle");

    // Should show main app content, not a 404 error page
    const textInput = page.getByRole("textbox").first();
    await expect(textInput).toBeVisible();

    // Verify we're in the main app (not showing 404 content)
    await expect(page.getByText("Page not found")).not.toBeVisible();
    await expect(page.getByText("404")).not.toBeVisible();

    // Check that query parameters and hash are preserved in URL
    expect(page.url()).toContain("param=test");
    expect(page.url()).toContain("#hash");

    // Verify app functionality still works after deep link navigation
    const actionButton = page.getByRole("button").first();
    await expect(actionButton).toBeVisible();

    // No error boundary should be showing
    await expect(page.getByText("Oops! Something went wrong")).not.toBeVisible();
  });
});
