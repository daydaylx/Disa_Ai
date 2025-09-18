#!/usr/bin/env node
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load and evaluate the http.ts module
async function loadHttpModule() {
  try {
    const httpPath = join(__dirname, '..', 'src', 'lib', 'http.ts');
    let content = await readFile(httpPath, 'utf8');
    
    // Convert TypeScript to JavaScript for Node execution
    content = content
      .replace(/export interface.*?\{[\s\S]*?\}/g, '') // Remove interfaces
      .replace(/: HttpError/g, '') // Remove type annotations
      .replace(/: Promise<[^>]*>/g, '') // Remove return type annotations
      .replace(/<T = any>/g, '') // Remove generic type parameters
      .replace(/: T/g, '') // Remove return type
      .replace(/export /g, '') // Remove exports for eval
      .replace(/import.*?;/g, ''); // Remove imports
    
    eval(content);
    return { fetchJson };
  } catch (error) {
    console.error('❌ Failed to load http module:', error.message);
    process.exit(1);
  }
}

async function testTimeout() {
  console.log('🔄 Testing timeout behavior...');
  
  try {
    const start = Date.now();
    await fetchJson('http://httpstat.us/200?sleep=3000', {
      timeoutMs: 1000, // 1 second timeout, but endpoint sleeps 3 seconds
      retries: 0
    });
    console.log('❌ Expected timeout error');
  } catch (error) {
    const elapsed = Date.now() - start;
    if (error.name === 'TimeoutError' && elapsed >= 1000 && elapsed < 2000) {
      console.log(`✅ Timeout works (${elapsed}ms)`);
    } else {
      console.log(`❌ Unexpected timeout behavior: ${error.name} after ${elapsed}ms`);
    }
  }
}

async function testRetries() {
  console.log('🔄 Testing retry behavior with 503 Service Unavailable...');
  
  try {
    const start = Date.now();
    await fetchJson('http://httpstat.us/503', {
      retries: 2,
      timeoutMs: 5000
    });
    console.log('❌ Expected retry exhaustion');
  } catch (error) {
    const elapsed = Date.now() - start;
    if (error.name === 'HttpError' && error.status === 503 && elapsed >= 900) {
      console.log(`✅ Retries work (${elapsed}ms, should be ~900ms for 2 retries)`);
    } else {
      console.log(`❌ Unexpected retry behavior: ${error.name}, status: ${error.status}, elapsed: ${elapsed}ms`);
    }
  }
}

async function testAbortController() {
  console.log('🔄 Testing AbortController cancellation...');
  
  try {
    const controller = new AbortController();
    
    // Cancel after 500ms
    setTimeout(() => {
      console.log('  🛑 Aborting request...');
      controller.abort();
    }, 500);
    
    const start = Date.now();
    await fetchJson('http://httpstat.us/200?sleep=2000', {
      signal: controller.signal,
      timeoutMs: 10000,
      retries: 0
    });
    console.log('❌ Expected abort error');
  } catch (error) {
    const elapsed = Date.now() - start;
    if (error.name === 'AbortError' && elapsed >= 500 && elapsed < 1000) {
      console.log(`✅ Abort works (${elapsed}ms)`);
    } else {
      console.log(`❌ Unexpected abort behavior: ${error.name} after ${elapsed}ms`);
    }
  }
}

async function testNetworkError() {
  console.log('🔄 Testing network error with retries...');
  
  try {
    const start = Date.now();
    await fetchJson('http://nonexistent.invalid.domain.test', {
      retries: 1,
      timeoutMs: 2000
    });
    console.log('❌ Expected network error');
  } catch (error) {
    const elapsed = Date.now() - start;
    if (error.name === 'NetworkError' && elapsed >= 600) {
      console.log(`✅ Network error with retries (${elapsed}ms)`);
    } else {
      console.log(`❌ Unexpected network error: ${error.name} after ${elapsed}ms`);
    }
  }
}

async function testSuccessfulJson() {
  console.log('🔄 Testing successful JSON response...');
  
  try {
    const data = await fetchJson('http://httpstat.us/200', {
      retries: 0,
      timeoutMs: 5000
    });
    
    if (data && typeof data === 'object') {
      console.log('✅ JSON response parsed successfully');
    } else {
      console.log('❌ Unexpected response format:', typeof data);
    }
  } catch (error) {
    console.log(`❌ Unexpected error for successful request: ${error.name}: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 HTTP Smoke Test\n');
  
  await loadHttpModule();
  
  const tests = [
    testSuccessfulJson,
    testTimeout,
    testRetries,
    testAbortController,
    testNetworkError
  ];
  
  for (const test of tests) {
    try {
      await test();
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
    }
    console.log(''); // Empty line between tests
  }
  
  console.log('🎉 HTTP smoke test completed');
}

main().catch((error) => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});