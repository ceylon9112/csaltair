import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

/**
 * `host: true` → listen on 0.0.0.0 (all interfaces). Avoids edge cases where only one of
 * localhost / 127.0.0.1 works on Windows. Use http://127.0.0.1:5173/ or http://localhost:5173/
 * after `npm run web:vite` is running (ERR_CONNECTION_REFUSED = server not started or wrong port).
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@/services/notifications/NotificationService',
        replacement: path.resolve(__dirname, 'src/shims/NotificationService.ts'),
      },
      {
        find: '@react-native-async-storage/async-storage',
        replacement: path.resolve(__dirname, 'src/shims/asyncStorage.ts'),
      },
      { find: '@', replacement: repoRoot },
    ],
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: true,
    fs: {
      allow: [repoRoot, __dirname],
    },
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
    open: true,
  },
});
