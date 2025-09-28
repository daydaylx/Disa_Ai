import { expect, test } from "@playwright/test";

test.describe("Primitive Components Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page with all primitive components
    await page.goto("/");

    // Inject test HTML for primitive components
    await page.evaluate(() => {
      document.body.innerHTML = `
        <div class="p-8 space-y-8 bg-neutral-900 min-h-screen">
          <!-- Buttons -->
          <section class="space-y-4">
            <h2 class="text-xl font-bold text-white">Glass Buttons</h2>
            <div class="flex gap-4 flex-wrap">
              <button class="glass-button glass-button--primary">Primary Button</button>
              <button class="glass-button glass-button--secondary">Secondary Button</button>
              <button class="glass-button glass-button--ghost">Ghost Button</button>
              <button class="glass-button glass-button--danger">Danger Button</button>
              <button class="glass-button glass-button--primary glass-button--sm">Small</button>
              <button class="glass-button glass-button--primary glass-button--lg">Large</button>
              <button class="glass-button glass-button--primary" disabled>Disabled</button>
            </div>
          </section>

          <!-- Inputs -->
          <section class="space-y-4">
            <h2 class="text-xl font-bold text-white">Glass Inputs</h2>
            <div class="space-y-4 max-w-md">
              <input class="glass-input" placeholder="Glass Input" />
              <input class="glass-input" value="Filled Input" />
              <select class="glass-select">
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
              <textarea class="glass-input glass-textarea" placeholder="Glass Textarea"></textarea>
            </div>
          </section>

          <!-- Badges -->
          <section class="space-y-4">
            <h2 class="text-xl font-bold text-white">Glass Badges</h2>
            <div class="flex gap-4 flex-wrap">
              <span class="glass-badge">Default Badge</span>
              <span class="glass-badge glass-badge--accent">Accent Badge</span>
              <span class="glass-badge glass-badge--success">Success Badge</span>
              <span class="glass-badge glass-badge--warning">Warning Badge</span>
              <span class="glass-badge glass-badge--danger">Danger Badge</span>
            </div>
          </section>

          <!-- Tabs -->
          <section class="space-y-4">
            <h2 class="text-xl font-bold text-white">Glass Tabs</h2>
            <div class="glass-tabs max-w-md">
              <button class="glass-tab glass-tab--active">Active Tab</button>
              <button class="glass-tab">Inactive Tab</button>
              <button class="glass-tab">Another Tab</button>
            </div>
          </section>

          <!-- Cards -->
          <section class="space-y-4">
            <h2 class="text-xl font-bold text-white">Glass Cards</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div class="glass-card p-6">
                <h3 class="font-semibold text-white mb-2">Glass Card</h3>
                <p class="text-neutral-300">This is a glass card with backdrop blur and glassmorphism effects.</p>
              </div>
              <div class="glass-card glass-card--interactive p-6">
                <h3 class="font-semibold text-white mb-2">Interactive Card</h3>
                <p class="text-neutral-300">This card has hover effects and interactive states.</p>
              </div>
            </div>
          </section>

          <!-- Tooltip Demo -->
          <section class="space-y-4">
            <h2 class="text-xl font-bold text-white">Glass Tooltip</h2>
            <div class="relative">
              <button class="glass-button glass-button--secondary">Hover for Tooltip</button>
              <div class="glass-tooltip bottom-full left-1/2 -translate-x-1/2 mb-2">
                This is a glass tooltip
              </div>
            </div>
          </section>

          <!-- Toast Demo -->
          <section class="space-y-4">
            <h2 class="text-xl font-bold text-white">Glass Toasts</h2>
            <div class="space-y-3 max-w-sm">
              <div class="glass-toast">
                <div class="font-semibold text-white">Default Toast</div>
                <div class="text-sm text-neutral-300">This is a default toast message</div>
              </div>
              <div class="glass-toast glass-toast--success">
                <div class="font-semibold text-white">Success Toast</div>
                <div class="text-sm text-neutral-300">Operation completed successfully</div>
              </div>
              <div class="glass-toast glass-toast--warning">
                <div class="font-semibold text-white">Warning Toast</div>
                <div class="text-sm text-neutral-300">Please check your input</div>
              </div>
              <div class="glass-toast glass-toast--error">
                <div class="font-semibold text-white">Error Toast</div>
                <div class="text-sm text-neutral-300">Something went wrong</div>
              </div>
            </div>
          </section>
        </div>
      `;
    });
  });

  test("All Primitive Components", async ({ page }) => {
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("primitive-components-all.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("Button States", async ({ page }) => {
    const buttonsSection = page.locator("section").first();

    await expect(buttonsSection).toHaveScreenshot("buttons-all-states.png", {
      threshold: 0.2,
    });
  });

  test("Form Elements", async ({ page }) => {
    const inputsSection = page.locator("section").nth(1);

    await expect(inputsSection).toHaveScreenshot("form-elements.png", {
      threshold: 0.2,
    });
  });

  test("Interactive Elements", async ({ page }) => {
    const tabsSection = page.locator("section").nth(3);

    await expect(tabsSection).toHaveScreenshot("interactive-tabs.png", {
      threshold: 0.2,
    });
  });

  test("Mobile Responsive Components", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("primitive-components-mobile.png", {
      fullPage: true,
      threshold: 0.3,
    });
  });

  test("Component Hover States", async ({ page }) => {
    // Test hover on interactive card
    const interactiveCard = page.locator(".glass-card--interactive");
    await interactiveCard.hover();

    await expect(interactiveCard).toHaveScreenshot("card-hover-state.png", {
      threshold: 0.3,
    });

    // Test button hover
    const primaryButton = page.locator(".glass-button--primary").first();
    await primaryButton.hover();

    await expect(primaryButton).toHaveScreenshot("button-hover-state.png", {
      threshold: 0.3,
    });
  });

  test("Focus States", async ({ page }) => {
    // Test input focus
    const glassInput = page.locator(".glass-input").first();
    await glassInput.focus();

    await expect(glassInput).toHaveScreenshot("input-focus-state.png", {
      threshold: 0.3,
    });

    // Test button focus
    const primaryButton = page.locator(".glass-button--primary").first();
    await primaryButton.focus();

    await expect(primaryButton).toHaveScreenshot("button-focus-state.png", {
      threshold: 0.3,
    });
  });
});
