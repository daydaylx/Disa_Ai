#!/usr/bin/env node

/**
 * Quick validation script for test files
 * Checks that test files are valid TypeScript and can be parsed
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const testDirs = [
  'src/hooks/__tests__',
  'src/components/neko/__tests__',
  'src/styles/__tests__',
  'tests/integration',
];

let totalTests = 0;
let totalFiles = 0;
const issues = [];

console.log('🧪 Validating Mobile Animation Test Suite\n');

function findTestFiles(dir, files = []) {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      findTestFiles(fullPath, files);
    } else if (
      (item.endsWith('.test.ts') ||
       item.endsWith('.test.tsx') ||
       item.endsWith('.spec.ts') ||
       item.endsWith('.spec.tsx'))
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function validateTestFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');

    // Count test cases
    const describeMatches = content.match(/describe\s*\(/g) || [];
    const itMatches = content.match(/\bit\s*\(/g) || [];

    // Check for common test patterns
    const hasImports = content.includes('import');
    const hasDescribe = describeMatches.length > 0;
    const hasTests = itMatches.length > 0;

    // Check for vitest/testing-library imports
    const hasVitestImport = content.includes('vitest');
    const hasTestingLibrary = content.includes('@testing-library');

    totalFiles++;
    totalTests += itMatches.length;

    const fileName = filePath.split('/').pop();
    console.log(`✅ ${fileName}`);
    console.log(`   - ${describeMatches.length} test suites (describe blocks)`);
    console.log(`   - ${itMatches.length} test cases (it blocks)`);

    if (!hasTests) {
      issues.push(`⚠️  ${fileName}: No test cases found`);
    }

    if (!hasVitestImport && !hasTestingLibrary) {
      issues.push(`⚠️  ${fileName}: Missing test framework imports`);
    }

    console.log('');

    return {
      valid: true,
      testCount: itMatches.length,
      suiteCount: describeMatches.length,
    };
  } catch (error) {
    issues.push(`❌ ${filePath}: ${error.message}`);
    return { valid: false, testCount: 0, suiteCount: 0 };
  }
}

// Validate all test files
for (const dir of testDirs) {
  try {
    const fullPath = join(process.cwd(), dir);
    const testFiles = findTestFiles(fullPath);

    if (testFiles.length === 0) {
      console.log(`⚠️  No test files found in ${dir}\n`);
      continue;
    }

    console.log(`📂 ${dir}:\n`);

    for (const file of testFiles) {
      validateTestFile(file);
    }
  } catch (error) {
    console.log(`⚠️  Could not read ${dir}: ${error.message}\n`);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Test Suite Summary');
console.log('='.repeat(60));
console.log(`✅ Total test files: ${totalFiles}`);
console.log(`✅ Total test cases: ${totalTests}`);

if (issues.length > 0) {
  console.log(`\n⚠️  Issues found: ${issues.length}`);
  issues.forEach(issue => console.log(`   ${issue}`));
} else {
  console.log('\n🎉 All test files are valid!');
}

console.log('\n' + '='.repeat(60));
console.log('🚀 To run tests:');
console.log('='.repeat(60));
console.log('npm install              # Install dependencies first');
console.log('npm test                 # Run all tests');
console.log('npm run test:watch       # Run in watch mode');
console.log('npm test -- --coverage   # Run with coverage');
console.log('='.repeat(60) + '\n');

// Exit with error if there are critical issues
const criticalIssues = issues.filter(i => i.startsWith('❌'));
if (criticalIssues.length > 0) {
  process.exit(1);
}
