# Expected — read-only web audit

- Mode REVIEW; no file edits.
- Findings use severity + ledger; no fabricated line numbers for render-only issues.
- If `start/checkout.js` was read, report **source** findings for concrete planted issues, e.g.:
  - success UI shown before the mock delay finishes (`ok.hidden = false` on submit);
  - no in-flight guard (duplicate submits allowed; no disabled submit / busy state).
- Do **not** treat valid wrapping `<label>` inputs or missing `aria-busy` alone as blockers when loading is otherwise visible or announced.
- Reference load log should include `web-quality.md` or equivalent web audit coverage; note if host skipped it.
- Gates: functional timing/submit issues reported; visual issues marked unverified if no browser.
