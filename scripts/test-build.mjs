import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('\x1b[36m%s\x1b[0m', 'Starting Build Smoke Test...');

try {
  // 1. Run Build
  console.log('Running npm run build...');
  // Use --no-check to speed up if possible, but "vite build" usually does tsc checks if configured.
  // Here we just run the standard build command.
  // We pipe output to stdio to see progress.
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

  // 2. Check dist exists
  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory was not created.');
  }
  console.log('✅ dist directory created.');

  // 3. Find CSS file
  // Vite usually outputs to dist/assets/
  const findCssFiles = (dir) => {
      let results = [];
      if (!fs.existsSync(dir)) return results;

      const list = fs.readdirSync(dir);
      list.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat && stat.isDirectory()) {
              results = results.concat(findCssFiles(filePath));
          } else if (file.endsWith('.css')) {
              results.push(filePath);
          }
      });
      return results;
  };

  const cssFiles = findCssFiles(distDir);
  if (cssFiles.length === 0) {
      throw new Error('No CSS files found in dist output.');
  }

  console.log(`✅ Found ${cssFiles.length} CSS file(s).`);

  // 4. Check for Tailwind utilities and CSS content
  let foundTailwind = false;
  // We look for specific strings that strongly suggest Tailwind is working
  const indicators = [
      '.flex',
      '.grid',
      '.hidden',
      '.absolute',
      '.relative',
      '--tw-', // Tailwind variables
      'display:flex' // Minified content often
  ];

  for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const fileName = path.basename(file);

      console.log(`Inspecting ${fileName} (${(content.length / 1024).toFixed(2)} KB)...`);

      // Check if file is not empty
      if (content.length < 100) {
          console.warn(`⚠️  Warning: ${fileName} is very small.`);
      }

      // Check for indicators
      const foundIndicators = indicators.filter(ind => content.includes(ind));
      if (foundIndicators.length > 0) {
          foundTailwind = true;
          console.log(`   Found indicators: ${foundIndicators.slice(0, 3).join(', ')}...`);
      }
  }

  if (!foundTailwind) {
      throw new Error('Could not find standard Tailwind classes/variables in the output CSS. Build might be missing Tailwind compilation.');
  }

  console.log('\x1b[32m%s\x1b[0m', 'Build Smoke Test Passed! ✅');
  console.log('The build pipeline is generating CSS with Tailwind classes.');

} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Build Smoke Test Failed! ❌');
  console.error(error.message);
  process.exit(1);
}
