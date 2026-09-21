# Example — existing component system (Nadir Desk)

**When:** local primitives with semantic tokens already in the repo.
**Not:** Kiln Queue, Rail Still, or Closeout. This is a clinic intake board:
compact chrome, list/detail, a real note dialog. Do not copy Cambria, cream
paper, or catalog stills onto it.

Notes are stored **per row in this tab**. Cancel drops the draft. Clicks
on the dialog panel, including padding, do not cancel.

## Run (this repository, maintainer)

After `npm ci`:

```sh
npm run example:desk
```

`http://127.0.0.1:5174/` — Vite dev. CI and Playwright serve the
production preview of `npm run test:examples:build`
(`npm run example:desk:preview`).

```sh
npm run test:examples:build
npm run test:e2e
```

The dialog is a real `<dialog>` with `showModal()` — not a `div` plus
`aria-modal`.

## Files

- [component-system/notes-store.js](component-system/notes-store.js)
- [component-system/dialog-geometry.js](component-system/dialog-geometry.js)
- [component-system/theme.css](component-system/theme.css)
- [component-system/Button.jsx](component-system/Button.jsx)
- [component-system/Field.jsx](component-system/Field.jsx)
- [component-system/Dialog.jsx](component-system/Dialog.jsx)
- [component-system/DeskScreen.jsx](component-system/DeskScreen.jsx)
- [component-system/main.jsx](component-system/main.jsx)
- [component-system/index.html](component-system/index.html)
