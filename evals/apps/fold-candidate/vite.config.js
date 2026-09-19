import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export default defineConfig({root:path.join(root,'evals/outputs/native-craft-2026-09-19/fold-candidate'),plugins:[react()],build:{outDir:path.join(root,'evals/artifacts/fold-candidate'),emptyOutDir:true}});
