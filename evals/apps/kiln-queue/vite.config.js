import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const example = path.join(repoRoot, "skills/art-director/references/examples/themeless-react");

export default defineConfig({
  root: example,
  plugins: [react()],
  build: {
    outDir: path.join(repoRoot, "evals/artifacts/kiln-queue"),
    emptyOutDir: true
  },
  server: { port: 5173, strictPort: true, host: "127.0.0.1" },
  preview: { port: 5173, strictPort: true, host: "127.0.0.1" }
});
