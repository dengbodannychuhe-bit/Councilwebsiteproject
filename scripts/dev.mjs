import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const viteEntry = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

const backend = spawn(process.execPath, ['server/index.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    BACKEND_PORT: process.env.BACKEND_PORT || '3001',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
});

const frontend = spawn(process.execPath, [viteEntry, '--host', '127.0.0.1', '--port', '5173'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: process.env,
});

function stopAll() {
  for (const child of [backend, frontend]) {
    if (!child.killed) child.kill();
  }
}

process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll();
  process.exit(0);
});

for (const child of [backend, frontend]) {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      stopAll();
      process.exit(code);
    }
  });
}
