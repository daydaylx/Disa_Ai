#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const commands = [
  { name: 'lint', cmd: 'npm', args: ['run', 'lint'] },
  { name: 'typecheck', cmd: 'npm', args: ['run', 'typecheck'] },
  { name: 'test', cmd: 'npm', args: ['run', 'test'] },
  { name: 'build', cmd: 'npm', args: ['run', 'build'] }
];

async function runCommand(name, cmd, args) {
  console.log(`\n🔄 Running ${name}...`);
  
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${name} passed`);
        resolve({ success: true, code });
      } else {
        console.log(`❌ ${name} failed with exit code ${code}`);
        resolve({ success: false, code });
      }
    });

    child.on('error', (error) => {
      console.error(`❌ ${name} failed:`, error.message);
      resolve({ success: false, code: 1, error });
    });
  });
}

async function main() {
  console.log('🚀 Running CI checks locally...');
  
  for (const { name, cmd, args } of commands) {
    const result = await runCommand(name, cmd, args);
    
    if (!result.success) {
      console.log(`\n💥 CI pipeline failed at ${name} step`);
      process.exit(result.code);
    }
  }
  
  console.log('\n🎉 All CI checks passed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});