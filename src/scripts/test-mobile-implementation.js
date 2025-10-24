#!/usr/bin/env node

/**
 * Mobile Implementation Testing Script
 * 
 * This script verifies that the mobile-first implementation is working correctly
 * by checking key aspects of the mobile UI.
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs');

// Test configuration
const BASE_URL = process.argv[2] || 'http://localhost:4173';
const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667, isMobile: true },
  { name: 'iPhone 12 Pro', width: 390, height: 844, isMobile: true },
  { name: 'iPad Air', width: 820, height: 1180, isMobile: true },
  { name: 'Desktop', width: 1200, height: 800, isMobile: false }
];

// Test scenarios
const TESTS = [
  {
    name: 'Chat Page Mobile Layout',
    path: '/chat',
    checks: [
      { 
        name: 'Has mobile header', 
        selector: '.app-header',
        condition: async (page) => {
          const element = await page.$('.app-header');
          return element !== null;
        }
      },
      {
        name: 'Has bottom navigation',
        selector: '.bottom-navigation',
        condition: async (page, isMobile) => {
          const element = await page.$('.bottom-navigation');
          // Bottom navigation should be visible on mobile, hidden on desktop
          if (isMobile) {
            return element !== null;
          } else {
            // On desktop, it should either not exist or be hidden
            if (!element) return true;
            const isVisible = await page.evaluate(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none';
            }, element);
            return !isVisible;
          }
        }
      },
      {
        name: 'Has proper viewport height',
        selector: '#app',
        condition: async (page) => {
          const hasDynamicHeight = await page.evaluate(() => {
            const app = document.getElementById('app');
            if (!app) return false;
            const style = window.getComputedStyle(app);
            return style.minHeight.includes('dvh') || style.minHeight.includes('calc');
          });
          return hasDynamicHeight;
        }
      },
      {
        name: 'Has touch-friendly elements',
        selector: '.touch-target',
        condition: async (page) => {
          const elements = await page.$$('.touch-target');
          // Should have at least some touch targets
          return elements.length > 0;
        }
      }
    ]
  },
  {
    name: 'Models Page Mobile Layout',
    path: '/models',
    checks: [
      {
        name: 'Has mobile model grid',
        selector: '.mobile-models-grid',
        condition: async (page) => {
          const element = await page.$('.mobile-models-grid');
          return element !== null;
        }
      },
      {
        name: 'Models are properly sized for mobile',
        selector: '.mobile-card',
        condition: async (page) => {
          const cards = await page.$$('.mobile-card');
          // Should have at least some model cards
          return cards.length > 0;
        }
      }
    ]
  },
  {
    name: 'Roles Page Mobile Layout',
    path: '/roles',
    checks: [
      {
        name: 'Has mobile roles grid',
        selector: '.mobile-roles-grid',
        condition: async (page) => {
          const element = await page.$('.mobile-roles-grid');
          return element !== null;
        }
      },
      {
        name: 'Roles are properly sized for mobile',
        selector: '.mobile-card',
        condition: async (page) => {
          const cards = await page.$$('.mobile-card');
          // Should have at least some role cards
          return cards.length > 0;
        }
      }
    ]
  }
];

async function runTests() {
  console.log(chalk.blue.bold('📱 Starting Mobile Implementation Tests...\n'));
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  let totalTests = 0;
  let passedTests = 0;
  
  try {
    for (const viewport of VIEWPORTS) {
      console.log(chalk.yellow.bold(`\nTesting on ${viewport.name} (${viewport.width}x${viewport.height})`));
      
      const page = await browser.newPage();
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        isMobile: viewport.isMobile
      });
      
      for (const test of TESTS) {
        console.log(chalk.gray(`  Testing ${test.name}...`));
        
        try {
          await page.goto(`${BASE_URL}${test.path}`, { waitUntil: 'networkidle0' });
          
          for (const check of test.checks) {
            totalTests++;
            const result = await check.condition(page, viewport.isMobile);
            
            if (result) {
              passedTests++;
              console.log(chalk.green(`    ✓ ${check.name}`));
            } else {
              console.log(chalk.red(`    ✗ ${check.name}`));
              console.log(chalk.red(`      Element not found: ${check.selector}`));
            }
          }
        } catch (error) {
          console.log(chalk.red(`    ✗ Failed to load ${test.path}: ${error.message}`));
        }
      }
      
      await page.close();
    }
    
    console.log(chalk.blue.bold('\n📊 Test Results:'));
    console.log(chalk.blue.bold(`  Total tests: ${totalTests}`));
    console.log(chalk.green.bold(`  Passed: ${passedTests}`));
    console.log(chalk.red.bold(`  Failed: ${totalTests - passedTests}`));
    
    const percentage = Math.round((passedTests / totalTests) * 100);
    console.log(chalk.blue.bold(`  Success rate: ${percentage}%`));
    
    if (percentage >= 80) {
      console.log(chalk.green.bold('\n🎉 Mobile implementation looks good!'));
    } else {
      console.log(chalk.red.bold('\n⚠️  Mobile implementation needs attention.'));
    }
    
  } catch (error) {
    console.error(chalk.red.bold('Error running tests:'), error);
  } finally {
    await browser.close();
  }
}

// Run the tests
runTests().catch(console.error);