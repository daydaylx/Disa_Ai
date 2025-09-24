import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function swVersionPlugin() {
  return {
    name: 'sw-version-plugin',
    buildStart: async function() {
      try {
        // Get package.json version
        const packagePath = path.resolve('package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const version = packageJson.version;

        // Get git commit hash (first 8 chars)
        let gitHash = '';
        try {
          const { stdout } = await execAsync('git rev-parse --short=8 HEAD');
          gitHash = stdout.trim();
        } catch {
          // Fallback if git is not available
          gitHash = Date.now().toString(36);
        }

        // Create version string
        const swVersion = `v${version}-${gitHash}`;

        // Read SW template
        const swPath = path.resolve('public/sw.js');
        let swContent = fs.readFileSync(swPath, 'utf8');

        // Replace version placeholder
        const updatedContent = swContent.replace(
          /const SW_VERSION = "[^"]+";/,
          `const SW_VERSION = "${swVersion}";`
        );

        // Only write if content changed
        if (updatedContent !== swContent) {
          fs.writeFileSync(swPath, updatedContent);
          console.log(`✓ SW version updated to: ${swVersion}`);
        }

      } catch (error) {
        console.warn('SW version update failed:', error.message);
        // Don't fail the build for SW version issues
      }
    }
  };
}