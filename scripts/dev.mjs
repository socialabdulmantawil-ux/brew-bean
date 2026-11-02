import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const apiPath = fileURLToPath(new URL('../server/index.mjs', import.meta.url));
const vitePath = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const children = [
  spawn(process.execPath, [apiPath], { cwd: root, stdio: 'inherit' }),
  spawn(process.execPath, [vitePath], { cwd: root, stdio: 'inherit' }),
];
let stopping = false;

function stopChildren(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
  process.exitCode = exitCode;
}

for (const child of children) {
  child.on('error', (error) => {
    console.error('Unable to start the POS development process:', error);
    stopChildren(1);
  });
  child.on('exit', (code) => {
    if (!stopping) stopChildren(code || 0);
  });
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => stopChildren(0));
}
