/**
 * Opens the Metro dev server in the default browser using the correct URL.
 * Local Expo uses HTTP, not HTTPS — do not use https://127.0.0.1 (will fail).
 */
import { spawn } from 'node:child_process';
import { platform } from 'node:os';

const url = 'http://127.0.0.1:8081';

if (platform() === 'win32') {
  spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
} else if (platform() === 'darwin') {
  spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
} else {
  spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
}

console.log(`Opening: ${url}`);
console.log('If nothing loads, run `npm run web` or `npx expo start` first and match the port shown (e.g. 8082).');
