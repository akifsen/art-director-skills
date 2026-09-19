/**
 * Serve a production Vite build. Playwright and CI use this, not `vite` dev.
 * Long-running: stdio inherit, no shell, argv only.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { resolveViteBin, root } from "./vite-cli.mjs";

const apps = {
  kiln: {
    config: "evals/apps/kiln-queue/vite.config.js",
    out: "evals/artifacts/kiln-queue",
    port: "5173"
  },
  desk: {
    config: "evals/apps/nadir-desk/vite.config.js",
    out: "evals/artifacts/nadir-desk",
    port: "5174"
  }
};

for (const [index, name] of ['library-baseline', 'library-candidate', 'library-candidate2', 'existing-desk'].entries()) {
  apps[name] = { config: `evals/apps/${name}/vite.config.js`, out: `evals/artifacts/${name}`, port: String(5191 + index) };
}
const app = apps[process.argv[2]];
if (!app) {
  console.error(`usage: node tests/examples/preview.mjs ${Object.keys(apps).join('|')}`);
  process.exit(2);
}

const index = path.join(root, app.out, "index.html");
if (!fs.existsSync(index)) {
  console.error("missing production build at", index);
  console.error("From the repo root run: npm run test:examples:build");
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [
    resolveViteBin(),
    "preview",
    "--config",
    app.config,
    "--host",
    "127.0.0.1",
    "--port",
    app.port,
    "--strictPort"
  ],
  {
    cwd: root,
    env: process.env,
    stdio: "inherit",
    shell: false,
    windowsHide: true
  }
);

child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});
