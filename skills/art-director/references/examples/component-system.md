# Example — existing component system (Nadir Desk)

**When:** local primitives with semantic tokens (shadcn/ui-like).
**Not:** shadcn source, Kiln Queue, or Closeout.

Notes are stored **per row in this tab**. Cancel drops the draft. Clicks
on the dialog panel, including padding, do not cancel.

## Run (this repository, maintainer)

After `npm ci`:

```sh
npm run example:desk
```

`http://127.0.0.1:5174/` — Vite, same path as CI and Playwright.

```sh
npx playwright test tests/e2e/nadir-desk.spec.js
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
