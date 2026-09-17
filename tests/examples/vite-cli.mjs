/**
 * Resolve the Vite CLI file npm already laid down. Do not use
 * require.resolve("vite/bin/vite.js"): package exports can throw before spawn.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export function resolveViteBin() {
  const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
  if (!fs.existsSync(viteBin)) {
    console.error("vite is not installed at", viteBin);
    console.error("From the repo root run npm ci (maintainer lockfile).");
    process.exit(1);
  }
  return viteBin;
}
