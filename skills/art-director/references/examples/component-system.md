# Example — existing component system (Nadir Desk)

**When:** local primitives with semantic tokens (shadcn/ui-like), and you
must improve identity without breaking behavior.
**Not:** shadcn source, and not a look for Kiln Queue or a native kitchen
app. Nadir is a clinic desk: cool paper, ink navy, sharp rows.

The files show three layers moving together:

1. Tokens (`theme.css`) — more than `--primary`
2. Variants (`Button.jsx`, `Field.jsx`) — size/state in one language
3. A composite screen (`DeskScreen.jsx`) plus a dialog that keeps focus
   and Escape

Preserve: keyboard, `aria-*` on the web primitives, form errors, selected
row. Do not swap the dialog for a pretty unmarked `<div>`.

## Files

- [component-system/theme.css](component-system/theme.css)
- [component-system/Button.jsx](component-system/Button.jsx)
- [component-system/Field.jsx](component-system/Field.jsx)
- [component-system/Dialog.jsx](component-system/Dialog.jsx)
- [component-system/DeskScreen.jsx](component-system/DeskScreen.jsx)
