/**
 * Maintainer-only: serve a skill React example with a JS-only JSX transform.
 * Layer: real React source in the browser. Not a CSS-only HTML mock.
 * React is loaded from esm.sh at run time (eval harness, not a skill runtime).
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { rewriteReactImports, transformJsx } from "./transform-jsx.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const APPS = {
  kiln: {
    root: path.join(repoRoot, "skills/art-director/references/examples/themeless-react"),
    port: 5173,
    title: "Kiln Queue",
    css: "./tokens.css"
  },
  desk: {
    root: path.join(repoRoot, "skills/art-director/references/examples/component-system"),
    port: 5174,
    title: "Nadir Desk",
    css: "./theme.css"
  }
};

function mime(file) {
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".mjs")) {
    return "text/javascript; charset=utf-8";
  }
  return "application/octet-stream";
}

function pageHtml(title, css) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    ${css ? `<link rel="stylesheet" href="${css}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.jsx"></script>
  </body>
</html>`;
}

export function compileFile(abs) {
  const raw = fs.readFileSync(abs, "utf8");
  if (abs.endsWith(".css") || abs.endsWith(".html")) return raw;
  let code = raw.replace(/^\s*import\s+["'][^"']+\.css["'];\s*$/gm, "");
  if (abs.endsWith(".jsx") || /<[A-Za-z>/]/.test(code)) {
    code = transformJsx(code);
  }
  code = rewriteReactImports(code);
  if (code.includes("React.createElement") && !/import\s+React\s+from/.test(code) && !/import\s+React\s*,/.test(code)) {
    code = `import React from "https://esm.sh/react@18.3.1";\n${code}`;
  }
  return code;
}

export function createAppServer(app) {
  const server = http.createServer((req, res) => {
    try {
      const url = new URL(req.url || "/", `http://127.0.0.1:${app.port}`);
      let rel = decodeURIComponent(url.pathname);
      if (rel === "/") {
        res.writeHead(200, { "content-type": mime("index.html"), "cache-control": "no-store" });
        res.end(pageHtml(app.title, app.css));
        return;
      }
      const abs = path.normalize(path.join(app.root, rel));
      if (!abs.startsWith(app.root)) {
        res.writeHead(403);
        res.end("forbidden");
        return;
      }
      if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      const body = compileFile(abs);
      res.writeHead(200, { "content-type": mime(abs), "cache-control": "no-store" });
      res.end(body);
    } catch (err) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end(String(err && err.stack ? err.stack : err));
    }
  });
  return server;
}

export function listen(app) {
  const server = createAppServer(app);
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(app.port, "127.0.0.1", () => resolve(server));
  });
}

const invoked = process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invoked) {
  const name = process.argv[2] === "desk" ? "desk" : "kiln";
  const server = await listen(APPS[name]);
  console.log(`serving ${name} on http://127.0.0.1:${APPS[name].port}/`);
  process.on("SIGINT", () => server.close());
}
