#!/usr/bin/env node
/**
 * Performance and Quality Assessment with Lighthouse
 * 
 * This script provides guidance for running Lighthouse against your app.
 * Lighthouse can be run via Chrome DevTools, CLI, or programmatically.
 * 
 * For programmatic use, lighthouse requires Chrome/Chromium to be available.
 */

const BASE_URL = 'http://localhost:4173';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

function log(level, message) {
  const prefix = `${colors.dim}[${new Date().toISOString().split('T')[1].split('.')[0]}]${colors.reset}`;
  
  switch (level) {
    case 'info':
      console.log(`${prefix} ${colors.blue}ℹ️  ${message}${colors.reset}`);
      break;
    case 'success':
      console.log(`${prefix} ${colors.green}✅ ${message}${colors.reset}`);
      break;
    case 'warning':
      console.log(`${prefix} ${colors.yellow}⚠️  ${message}${colors.reset}`);
      break;
    case 'error':
      console.log(`${prefix} ${colors.red}❌ ${message}${colors.reset}`);
      break;
  }
}

async function checkServerAvailability() {
  try {
    const response = await fetch(BASE_URL, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function runLighthouseCLI() {
  console.log(`${colors.bold}🏃 Running Lighthouse CLI...${colors.reset}\n`);
  
  try {
    const { spawn } = await import('child_process');
    
    return new Promise((resolve, reject) => {
      const args = [
        BASE_URL,
        '--output=html',
        '--output=json',
        '--output-path=./reports/lighthouse',
        '--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"',
        '--preset=desktop',
        '--throttling-method=simulate'
      ];
      
      log('info', `Running: lighthouse ${args.join(' ')}`);
      
      const child = spawn('lighthouse', args, {
        stdio: 'inherit',
        shell: true
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          log('success', 'Lighthouse scan completed');
          log('info', 'Reports saved to: reports/lighthouse.report.html');
          resolve();
        } else {
          reject(new Error(`Lighthouse failed with exit code ${code}`));
        }
      });
      
      child.on('error', (error) => {
        if (error.code === 'ENOENT') {
          reject(new Error('Lighthouse CLI not found. Install with: npm install -g lighthouse'));
        } else {
          reject(error);
        }
      });
    });
  } catch (error) {
    throw new Error(`Failed to run Lighthouse CLI: ${error.message}`);
  }
}

async function main() {
  console.log(`${colors.bold}🔬 Lighthouse Performance Assessment${colors.reset}`);
  console.log(`${colors.dim}Target: ${BASE_URL}${colors.reset}\n`);
  
  // Check if preview server is running
  log('info', 'Checking server availability...');
  const serverAvailable = await checkServerAvailability();
  
  if (!serverAvailable) {
    log('error', `Server not available at ${BASE_URL}`);
    log('info', 'Please run: npm run preview');
    process.exit(1);
  }
  
  log('success', 'Server is running');
  
  // Create reports directory
  const { mkdir } = await import('fs/promises');
  try {
    await mkdir('./reports', { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  try {
    await runLighthouseCLI();
    
    console.log(`\n${colors.bold}📊 Performance Assessment Complete${colors.reset}`);
    console.log(`${colors.cyan}📄 View report:${colors.reset} open reports/lighthouse.report.html`);
    
  } catch (error) {
    log('warning', error.message);
    
    console.log(`\n${colors.bold}📋 Alternative Methods:${colors.reset}`);
    console.log(`
${colors.cyan}1. Chrome DevTools (Recommended):${colors.reset}
   • Open ${BASE_URL} in Chrome
   • Press F12 → Lighthouse tab
   • Click "Generate report"
   • Best for interactive analysis

${colors.cyan}2. Install Lighthouse CLI:${colors.reset}
   npm install -g lighthouse
   lighthouse ${BASE_URL} --view

${colors.cyan}3. Chrome Extension:${colors.reset}
   • Install "Lighthouse" extension from Chrome Web Store
   • Navigate to ${BASE_URL}
   • Click Lighthouse icon in toolbar

${colors.cyan}4. PageSpeed Insights (for deployed sites):${colors.reset}
   • Visit: https://pagespeed.web.dev/
   • Enter your production URL
   • Get detailed performance analysis
`);
    
    console.log(`${colors.bold}🎯 Key Metrics to Track:${colors.reset}`);
    console.log(`
${colors.green}Performance:${colors.reset}
   • First Contentful Paint (FCP): < 1.8s
   • Largest Contentful Paint (LCP): < 2.5s  
   • Cumulative Layout Shift (CLS): < 0.1
   • First Input Delay (FID): < 100ms

${colors.green}Accessibility:${colors.reset}
   • Score: 95+ (complement with a11y-check.mjs)
   • Keyboard navigation working
   • Screen reader compatibility

${colors.green}Best Practices:${colors.reset}
   • HTTPS usage
   • No console errors
   • Efficient image formats
   • Proper meta tags

${colors.green}SEO:${colors.reset}
   • Valid HTML structure
   • Meta descriptions
   • Proper heading hierarchy
   • Mobile-friendly viewport
`);
    
    // Don't exit with error for missing CLI - provide alternatives
    process.exit(0);
  }
}

main().catch((error) => {
  log('error', `Script failed: ${error.message}`);
  process.exit(1);
});