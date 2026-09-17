# Example — theme-less React (Kiln Queue)

**When:** a React web app with no theme pack and a list/detail/form job.
**Not:** a look, hash router, `?fixture=` API, or file drop-in
(`dialog-geometry.js`, `ui.jsx`) to reuse on unrelated products. Those exist
so *this* demo can be tested. Re-implement backdrop, tab cycle, and fields
under the product’s own names.

## Run (this repository, maintainer)

Not a skill runtime. From the repo root after `npm ci`:

```sh
npm run example:kiln
```

Open `http://127.0.0.1:5173/`. Vite compiles the skill’s React source.

CI and Playwright serve the **production preview** of that same build
(`npm run test:examples:build`, then `npm run example:kiln:preview`), not a
second HTML page and not `page.clock`.

Fixtures: `?fixture=loading|error|empty|hold-reject`.
Optional `?holdDelay=2000` stretches the demo write so Cancel can beat it.
Holds are **session memory**. They are not a kiln controller and not disk.
A delayed Save can still be cancelled; a late timer must not commit after
Cancel, All loads, or a different record.

```sh
npm run test:examples:build
npm run test:e2e
```

## Scope matrix

| Screen | Task | Pieces | States | After | Check |
|---|---|---|---|---|---|
| `#/` | Find a load | Shell, search, schedule, list | loading, empty, error+retry | open detail | `?fixture=`, filter `zzz` |
| `#/loads/:id` | Read status | Summary, actions | unknown id | hold / list | K-999 |
| `#/loads/:id/hold` | Record a hold | Form, native `dialog` | validation, busy, abortable write, reject+retry, unknown id | detail shows new note | empty reason; Save then Cancel; `hold-reject` |

## Files

- [themeless-react/kiln-store.js](themeless-react/kiln-store.js)
- [themeless-react/dialog-geometry.js](themeless-react/dialog-geometry.js)
- [themeless-react/tokens.css](themeless-react/tokens.css)
- [themeless-react/ui.jsx](themeless-react/ui.jsx)
- [themeless-react/data.js](themeless-react/data.js)
- [themeless-react/App.jsx](themeless-react/App.jsx)
- [themeless-react/main.jsx](themeless-react/main.jsx)
- [themeless-react/index.html](themeless-react/index.html)
