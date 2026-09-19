import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export default defineConfig({
  root: path.join(root, 'evals/outputs/see-and-fix-2026-09-20/pier-kettle'),
  plugins: [react()],
  build: {
    outDir: path.join(root, 'evals/artifacts/pier-kettle'),
    emptyOutDir: true
  }
});
