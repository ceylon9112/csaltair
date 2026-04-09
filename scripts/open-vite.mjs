/**
 * Opens the Vite patron-web dev server in the default system browser.
 * Use this if an embedded IDE browser shows "Connection Failed" (it often cannot use loopback).
 */
import { spawn } from 'node:child_process';
import { platform } from 'node:os';

const url = 'http://127.0.0.1:5173';

if (platform() === 'win32') {
  spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
} else if (platform() === 'darwin') {
  spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
} else {
  spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
}

console.log(`Opening: ${url}`);
console.log('Start the dev server first: npm run web:vite');
console.log('If the port differs, use the URL printed in the Vite terminal (e.g. 5174).');
