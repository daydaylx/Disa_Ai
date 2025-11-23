import fs from 'fs';
import path from 'path';
import { describe, expect,it } from 'vitest';

describe('Build Configuration Smoke Tests', () => {
  const rootDir = process.cwd();

  it('postcss.config.js exists and exports plugins', async () => {
    const configPath = path.join(rootDir, 'postcss.config.js');
    expect(fs.existsSync(configPath), 'postcss.config.js should exist').toBe(true);

    // Dynamic import to check exports
    // We use a timestamp to bypass cache if needed, though not strictly necessary for a single run
    const configModule = await import(`${configPath}?t=${Date.now()}`);
    const config = configModule.default;

    expect(config, 'PostCSS config should export a default object').toBeDefined();
    expect(config.plugins, 'PostCSS config should have plugins').toBeDefined();
    // Check for Tailwind plugin in PostCSS config
    expect(config.plugins).toHaveProperty('tailwindcss', {});
    // Check for Autoprefixer plugin in PostCSS config
    expect(config.plugins).toHaveProperty('autoprefixer', {});
  });

  it('tailwind.config.ts exists and has correct content globs', async () => {
    const configPath = path.join(rootDir, 'tailwind.config.ts');
    expect(fs.existsSync(configPath), 'tailwind.config.ts should exist').toBe(true);

    // Dynamic import to check exported object (less brittle than regex)
    const configModule = await import(`${configPath}?t=${Date.now()}`);
    const config = configModule.default;

    expect(config, 'Tailwind config should export a default object').toBeDefined();
    expect(Array.isArray(config.content), 'Tailwind content should be an array').toBe(true);

    // Check for index.html
    expect(config.content).toContain('./index.html');

    // Check for src/**/*.{ts,tsx} or similar - Tailwind content should include src ts/tsx files
    const srcGlob = config.content.find((c: string) => c.includes('src/') && c.includes('ts') && c.includes('tsx'));
    expect(srcGlob).toBeDefined();
  });

  it('src/index.css contains Tailwind directives', () => {
      const cssPath = path.join(rootDir, 'src/index.css');
      expect(fs.existsSync(cssPath), 'src/index.css should exist').toBe(true);

      const content = fs.readFileSync(cssPath, 'utf-8');
      expect(content).toContain('@tailwind base');
      expect(content).toContain('@tailwind components');
      expect(content).toContain('@tailwind utilities');
  });

  it('main.tsx imports index.css', () => {
      const mainPath = path.join(rootDir, 'src/main.tsx');
      expect(fs.existsSync(mainPath), 'src/main.tsx should exist').toBe(true);

      const content = fs.readFileSync(mainPath, 'utf-8');
      // main.tsx should import index.css
      expect(content).toMatch(/import "\.\/index\.css"/);
  });

  it('index.html contains entry point and mount node', () => {
      const htmlPath = path.join(rootDir, 'index.html');
      expect(fs.existsSync(htmlPath), 'index.html should exist').toBe(true);

      const content = fs.readFileSync(htmlPath, 'utf-8');
      expect(content).toContain('<div id="root">');
      expect(content).toContain('src/main.tsx');
  });
});
