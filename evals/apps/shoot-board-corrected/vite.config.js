import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export default defineConfig({
  root: path.join(root, 'evals/outputs/shoot-board-0.9.0-corrected'),
  plugins: [react()],
  build: {
    outDir: path.join(root, 'evals/artifacts/shoot-board-corrected'),
    emptyOutDir: true
  }
});
