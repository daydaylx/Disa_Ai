import { expect, test } from "@playwright/test";

test.describe("Design System Visual Regression", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a component showcase page or create components for testing
    await page.goto("/");

    // Wait for fonts and styles to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  });

  test("Button component variants", async ({ page }) => {
    // Create a test page with all button variants
    await page.evaluate(() => {
      document.body.innerHTML = `
        <div style="padding: 20px; background: white; display: flex; flex-direction: column; gap: 16px;">
          <h2 style="margin: 0; color: #111;">Button Variants</h2>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent-500 text-white hover:bg-accent-700 h-10 px-4 py-2">Default</button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-semantic-danger text-white hover:bg-red-600 h-10 px-4 py-2">Destructive</button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 h-10 px-4 py-2">Outline</button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 h-10 px-4 py-2">Secondary</button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-neutral-100 hover:text-neutral-900 h-10 px-4 py-2">Ghost</button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-accent-500 underline-offset-4 hover:underline h-10 px-4 py-2">Link</button>
          </div>
          <h3 style="margin: 16px 0 0 0; color: #111;">Button Sizes</h3>
          <div style="display: flex; gap: 12px; align-items: center;">
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent-500 text-white hover:bg-accent-700 h-9 rounded-md px-3">Small</button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent-500 text-white hover:bg-accent-700 h-10 px-4 py-2">Default</button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent-500 text-white hover:bg-accent-700 h-11 rounded-md px-8">Large</button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent-500 text-white hover:bg-accent-700 h-10 w-10">⚙</button>
          </div>
        </div>
      `;
    });

    await expect(page.locator("body")).toHaveScreenshot("button-variants.png");
  });

  test("Card component variants", async ({ page }) => {
    await page.evaluate(() => {
      document.body.innerHTML = `
        <div style="padding: 20px; background: #f5f5f5; display: flex; flex-direction: column; gap: 16px;">
          <h2 style="margin: 0; color: #111;">Card Components</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
            <div class="rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6">
                <h3 class="text-2xl font-semibold leading-none tracking-tight">Simple Card</h3>
                <p class="text-sm text-neutral-500">This is a basic card with header and content.</p>
              </div>
              <div class="p-6 pt-0">
                <p>Card content goes here. This is where you would put the main content of the card.</p>
              </div>
            </div>
            
            <div class="rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6">
                <h3 class="text-2xl font-semibold leading-none tracking-tight">Card with Footer</h3>
                <p class="text-sm text-neutral-500">This card includes a footer section.</p>
              </div>
              <div class="p-6 pt-0">
                <p>Main card content with additional information and details.</p>
              </div>
              <div class="flex items-center p-6 pt-0">
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent-500 text-white hover:bg-accent-700 h-10 px-4 py-2">Action</button>
              </div>
            </div>

            <div class="rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm">
              <div class="flex flex-col space-y-1.5 p-6">
                <h3 class="text-2xl font-semibold leading-none tracking-tight">Interactive Card</h3>
                <p class="text-sm text-neutral-500">Hover and focus states testing.</p>
              </div>
              <div class="p-6 pt-0">
                <div style="display: flex; gap: 8px;">
                  <span class="inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 border-transparent bg-accent-500 text-white hover:bg-accent-700">Badge</span>
                  <span class="inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200">Secondary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    await expect(page.locator("body")).toHaveScreenshot("card-variants.png");
  });

  test("AppShell layout and navigation", async ({ page }) => {
    // Test the actual AppShell component
    await page.goto("/");

    // Wait for the AppShell to fully render
    await page.waitForSelector('[aria-label="Bottom navigation"]');
    await page.waitForSelector('[aria-label="Top navigation"]');

    // Take screenshot of the full AppShell
    await expect(page).toHaveScreenshot("appshell-layout.png", {
      fullPage: true,
    });

    // Test mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("appshell-mobile.png", {
      fullPage: true,
    });

    // Test navigation state changes
    await page.click('[aria-label="Bottom navigation"] a[href="/models"]');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("appshell-models-active.png", {
      fullPage: true,
    });
  });

  test("Form input components", async ({ page }) => {
    await page.evaluate(() => {
      document.body.innerHTML = `
        <div style="padding: 20px; background: white; display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
          <h2 style="margin: 0; color: #111;">Form Components</h2>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Input Field</label>
            <input class="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Enter some text..." />
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Textarea</label>
            <textarea class="flex min-h-[80px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Enter a longer message..."></textarea>
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Focused State</label>
            <input class="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value="Focused input" style="outline: none; border-color: var(--color-accent-500); box-shadow: 0 0 0 2px var(--color-accent-500);" />
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Disabled State</label>
            <input class="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" disabled value="Disabled input" />
          </div>
        </div>
      `;
    });

    await expect(page.locator("body")).toHaveScreenshot("form-components.png");
  });
});
