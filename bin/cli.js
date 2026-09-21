#!/usr/bin/env node
/**
 * art-director / art-director-skills CLI entry.
 *
 *   npx art-director-skills install --ai cursor
 *   npx art-director-skills status  --ai all
 *   npx art-director-skills remove  --ai codex --global
 *   npx art-director-skills list
 *   npx art-director-skills --version
 *
 * Thin wrapper over tooling/install-skill.mjs so the same code path serves
 * `node tooling/install-skill.mjs`, `npm run install-skill`, and the
 * published bins. No dependencies, no network, no telemetry.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { main } from "../tooling/install-skill.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));

export function packageVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(here, "..", "package.json"), "utf8"));
  return pkg.version;
}

export function run(argv = process.argv.slice(2)) {
  const first = argv[0];
  if (first === "--version" || first === "-v" || first === "version") {
    console.log(packageVersion());
    return 0;
  }
  return main(argv);
}

try {
  process.exit(run());
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
