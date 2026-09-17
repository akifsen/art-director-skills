# Example — theme-less React (Kiln Queue)

**When:** a React web app with no theme pack and a list/detail/form job.
**Not:** a look to reuse on unrelated products. Oxide, paper, and stencil
IDs belong to *this* queue. A legal desk or a harbor board should not
come out looking like a kiln.

These files are complete enough to drop into a Vite + React app that
already mounts `App`. They are not a skill runtime.

## What to copy as method

1. Tokens in one CSS file (`tokens.css`).
2. A small family (`ui.jsx`) that is the only way screens draw controls.
3. A shell + three routes: queue, load detail, log-a-hold form.
4. States: loading, empty filter, field errors, busy submit, dialog.

Do not paste this into a project that already has shadcn/ui or a vendor
theme — enhance that system instead.

## Scope matrix (this example)

| Screen | Task | Pieces | States | After | Check |
|---|---|---|---|---|---|
| `/` | Find a load | Shell, search, list | loading, empty | open detail | filter "cone 6", then "zzz" |
| `/loads/:id` | Read status | Summary, action bar | missing id | Log hold / back | long title wraps |
| `/loads/:id/hold` | Record a hold | Form, dialog | validation, busy | back to detail | submit with empty reason |

## Files

- [themeless-react/tokens.css](themeless-react/tokens.css)
- [themeless-react/ui.jsx](themeless-react/ui.jsx)
- [themeless-react/data.js](themeless-react/data.js)
- [themeless-react/App.jsx](themeless-react/App.jsx)
