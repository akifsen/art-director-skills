# Example — existing component system (Nadir Desk)

**When:** local primitives with semantic tokens (shadcn/ui-like).
**Not:** shadcn source, Kiln Queue, or Closeout.

Notes are stored **per row in this tab**. Cancel drops the draft.

## Run (this repository, maintainer)

```sh
npm run example:desk
```

`http://127.0.0.1:5174/` — same JS-only React harness as Kiln Queue.
`npm run example:desk:vite` is the Vite path.

```sh
npx playwright test tests/e2e/nadir-desk.spec.js
npm run test:e2e:chrome
```

The dialog is a real `<dialog>` with `showModal()` — not a `div` plus
`aria-modal`.

## Files

- [component-system/notes-store.js](component-system/notes-store.js)
- [component-system/theme.css](component-system/theme.css)
- [component-system/Button.jsx](component-system/Button.jsx)
- [component-system/Field.jsx](component-system/Field.jsx)
- [component-system/Dialog.jsx](component-system/Dialog.jsx)
- [component-system/DeskScreen.jsx](component-system/DeskScreen.jsx)
- [component-system/main.jsx](component-system/main.jsx)
- [component-system/index.html](component-system/index.html)
