#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSWVersion() {
  try {
    // Get package.json version
    const packagePath = path.join(__dirname, '../package.json');
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
    const swPath = path.join(__dirname, '../public/sw.js');
    let swContent = fs.readFileSync(swPath, 'utf8');

    // Replace version placeholder
    swContent = swContent.replace(
      /const SW_VERSION = "[^"]+";/,
      `const SW_VERSION = "${swVersion}";`
    );

    // Write updated SW file
    fs.writeFileSync(swPath, swContent);

    console.log(`✓ Service Worker version updated to: ${swVersion}`);

  } catch (error) {
    console.error('Failed to generate SW version:', error);
    process.exit(1);
  }
}

generateSWVersion();