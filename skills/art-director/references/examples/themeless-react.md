# Example — theme-less React (Kiln Queue)

**When:** a React web app with no theme pack and a list/detail/form job.
**Not:** a look to reuse on unrelated products.

## Run (this repository, maintainer)

Not a skill runtime. From the repo root after `npm install`:

```sh
npm run example:kiln
```

Open `http://127.0.0.1:5173/`. The maintainer harness compiles the React
source with a JS-only transform (no Vite native binaries). `npm run
example:kiln:vite` is the Vite path used in CI after `npm install`.

Fixtures: `?fixture=loading|error|empty`.
Holds are **session memory**. They are not a kiln controller and not disk.

```sh
npm run test:examples:compile
npm run test:e2e:chrome
npx playwright test tests/e2e/kiln-flow.spec.js
```

## Scope matrix

| Screen | Task | Pieces | States | After | Check |
|---|---|---|---|---|---|
| `#/` | Find a load | Shell, search, schedule, list | loading, empty, error+retry | open detail | `?fixture=`, filter `zzz` |
| `#/loads/:id` | Read status | Summary, actions | unknown id | hold / list | K-999 |
| `#/loads/:id/hold` | Record a hold | Form, native `dialog` | validation, busy, unknown id | detail shows new note | empty reason; then save |

## Files

- [themeless-react/kiln-store.js](themeless-react/kiln-store.js)
- [themeless-react/tokens.css](themeless-react/tokens.css)
- [themeless-react/ui.jsx](themeless-react/ui.jsx)
- [themeless-react/data.js](themeless-react/data.js)
- [themeless-react/App.jsx](themeless-react/App.jsx)
- [themeless-react/main.jsx](themeless-react/main.jsx)
- [themeless-react/index.html](themeless-react/index.html)
