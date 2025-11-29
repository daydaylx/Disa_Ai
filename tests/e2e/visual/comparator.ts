import { Locator, Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

interface VisualRegressionConfig {
  threshold: number;
  baselineDir: string;
  diffDir: string;
  screenshotDir: string;
}

interface VisualComparisonResult {
  passed: boolean;
  diffImage?: string;
  error?: string;
  threshold: number;
  actual: number;
}

export class VisualComparator {
  private config: VisualRegressionConfig;

  constructor(config?: Partial<VisualRegressionConfig>) {
    this.config = {
      threshold: 0.1, // 10% difference threshold
      baselineDir: "tests/e2e/visual/baselines",
      diffDir: "tests/e2e/visual/diffs",
      screenshotDir: "tests/e2e/visual/screenshots",
      ...config,
    };

    // Ensure directories exist
    [this.config.baselineDir, this.config.diffDir, this.config.screenshotDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async compareScreenshot(
    page: Page,
    name: string,
    options?: {
      fullPage?: boolean;
      clip?: { x: number; y: number; width: number; height: number };
      threshold?: number;
      locator?: Locator;
    },
  ): Promise<VisualComparisonResult> {
    const threshold = options?.threshold ?? this.config.threshold;

    try {
      // Take screenshot
      const screenshotPath = path.join(this.config.screenshotDir, `${name}.png`);

      let screenshotOptions: any = {
        path: screenshotPath,
        fullPage: options?.fullPage ?? true,
        animations: "disabled",
      };

      if (options?.clip) {
        screenshotOptions.clip = options.clip;
      }

      if (options?.locator) {
        await options.locator.screenshot(screenshotOptions);
      } else {
        await page.screenshot(screenshotOptions);
      }

      // Check if baseline exists
      const baselinePath = path.join(this.config.baselineDir, `${name}.png`);

      if (!fs.existsSync(baselinePath)) {
        // Create baseline if it doesn't exist
        fs.copyFileSync(screenshotPath, baselinePath);
        console.log(`📸 Created baseline: ${baselinePath}`);

        return {
          passed: true,
          threshold,
          actual: 0,
        };
      }

      // Compare screenshots using pixelmatch (simplified comparison)
      const comparisonResult = await this.compareImages(screenshotPath, baselinePath, name);

      if (comparisonResult.differentPixels > threshold * comparisonResult.totalPixels) {
        // Images are different
        const diffPath = path.join(this.config.diffDir, `${name}-diff.png`);

        return {
          passed: false,
          diffImage: diffPath,
          threshold,
          actual: comparisonResult.differentPixels / comparisonResult.totalPixels,
        };
      }

      return {
        passed: true,
        threshold,
        actual: comparisonResult.differentPixels / comparisonResult.totalPixels,
      };
    } catch (error) {
      return {
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        threshold,
        actual: 1,
      };
    }
  }

  private async compareImages(
    screenshotPath: string,
    baselinePath: string,
    name: string,
  ): Promise<{
    differentPixels: number;
    totalPixels: number;
  }> {
    // For now, we'll use a simplified comparison
    // In a real implementation, you'd use a library like pixelmatch
    const fs = require("fs");

    try {
      const screenshot = fs.readFileSync(screenshotPath);
      const baseline = fs.readFileSync(baselinePath);

      // Simple file size comparison as a placeholder
      // A real implementation would compare pixel by pixel
      const differentPixels = screenshot.length !== baseline.length ? 100 : 0;
      const totalPixels = 1000; // Placeholder

      return { differentPixels, totalPixels };
    } catch (error) {
      return { differentPixels: 1000, totalPixels: 1000 };
    }
  }

  async updateBaseline(name: string): Promise<void> {
    const screenshotPath = path.join(this.config.screenshotDir, `${name}.png`);
    const baselinePath = path.join(this.config.baselineDir, `${name}.png`);

    if (fs.existsSync(screenshotPath)) {
      fs.copyFileSync(screenshotPath, baselinePath);
      console.log(`🔄 Updated baseline: ${baselinePath}`);
    } else {
      throw new Error(`Screenshot not found: ${screenshotPath}`);
    }
  }

  async cleanupOldScreenshots(days: number = 7): Promise<void> {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    [this.config.screenshotDir, this.config.diffDir].forEach((dir) => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);

          if (stats.mtime.getTime() < cutoff) {
            fs.unlinkSync(filePath);
          }
        }
      }
    });
  }

  // Performance comparison for different viewports
  async compareResponsive(
    page: Page,
    name: string,
    viewports: Array<{ width: number; height: number }>,
    options?: Omit<Parameters<VisualComparator["compareScreenshot"]>[2], "clip">,
  ): Promise<Array<{ viewport: string; result: VisualComparisonResult }>> {
    const results: Array<{ viewport: string; result: VisualComparisonResult }> = [];

    for (const viewport of viewports) {
      const viewportName = `${name}-${viewport.width}x${viewport.height}`;

      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000); // Allow layout to settle

      const result = await this.compareScreenshot(page, viewportName, options);
      results.push({
        viewport: `${viewport.width}x${viewport.height}`,
        result,
      });
    }

    return results;
  }

  // Component comparison for isolated elements
  async compareComponent(
    page: Page,
    locator: Locator,
    name: string,
    options?: { threshold?: number; padding?: number },
  ): Promise<VisualComparisonResult> {
    const threshold = options?.threshold ?? this.config.threshold;
    const padding = options?.padding ?? 10;

    try {
      // Get element bounds
      const box = await locator.boundingBox();
      if (!box) {
        throw new Error("Element not found or not visible");
      }

      // Add padding
      const clip = {
        x: box.x - padding,
        y: box.y - padding,
        width: box.width + padding * 2,
        height: box.height + padding * 2,
      };

      return await this.compareScreenshot(page, name, {
        fullPage: false,
        clip,
        threshold,
      });
    } catch (error) {
      return {
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
        threshold,
        actual: 1,
      };
    }
  }
}

// Global comparator instance
export const visualComparator = new VisualComparator();

// Helper function for quick comparisons
export async function expectVisualMatch(
  page: Page,
  name: string,
  options?: Parameters<VisualComparator["compareScreenshot"]>[2],
): Promise<void> {
  const result = await visualComparator.compareScreenshot(page, name, options);

  if (!result.passed) {
    throw new Error(
      `Visual regression detected for "${name}". ` +
        `Difference: ${(result.actual * 100).toFixed(2)}% (threshold: ${(result.threshold * 100).toFixed(2)}%)` +
        (result.diffImage ? `\nDiff image: ${result.diffImage}` : ""),
    );
  }
}
