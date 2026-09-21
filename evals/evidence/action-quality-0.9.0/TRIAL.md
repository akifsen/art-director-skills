# Photographer re-run — Shoot board (0.9.0, 2026-09-20)

Inspector: this repository session (Cursor Grok 4.6), Playwright Chromium on
`http://127.0.0.1:5240/` at 1280×900 and 390×844.

**Kind:** file-path subagent in the authoring chat, not Cursor natural
discovery and not a second-chat `/art-director` run. Producer:
[Shoot board producer run](2cddb387-0654-48cb-859d-d005c76aa190).

Workspace:
`C:\Users\lenovo\AppData\Local\Temp\art-director-cursor-trial-2026-09-20T03-10-18-636Z-l8NjXq`

Skill copy at prepare (`SKILL-HASHES.md` in that folder):

- `SKILL.md` SHA256 `72213b43864b218da88f51e6df4e30c4f1b88016e4cb427ec2978971f5b885e3`
- Tree SHA256 `3790db95d7cf30c4baa321f532cb01d8f13cef8954edc16c1175cfc3d279eddf`

Later `SKILL.md` / `product-ui-system.md` were copied into that trial after
further authoring edits. Current worktree `SKILL.md` SHA256
`0dfa4c2394419956bb30c3a35be8591d4b395796a8813e4f31538d08e93177ef`.

One `.cursor/skills/art-director` copy. No `.agents` duplicate.

## C — discovery / use

| Claim | Result |
|---|---|
| File install + hash at prepare | Match |
| Natural selection in a new Cursor GUI chat | **Not run** |
| Explicit `/art-director` in a different chat | **Not run** |
| Method used | Isolated Vite starter + frozen `brief.md`; producer read the installed skill; quality-bar interrupt; one focused visual revision; one author CSS patch after inspection |

## D — UI (validator, live)

React app (not a static landing). Sample data labeled. Session memory only.
Same three records as 0.8.0.

| Check | Result |
|---|---|
| List + filter | Tümü / Çekim / Düzenleme / Teslim edildi. `?status=shooting` shows only SH-118 |
| Empty filter | Not reachable with three statuses each having one row |
| Detail | Title, status, shoot/due, note, **Teslimatı düzenle** in first viewport at 1280 and 390 |
| Validation | Empty date stays on form; `Teslimat tarihi gerekli.`; `aria-invalid` |
| Form surface | Full-bleed topbar + working sheet (not a postage-stamp card). Fields remain a left column with unused right space |
| Missing id | Implemented in source (`sheet--missing`) |
| Mobile | Chips 2×2; list/detail swap; Edit delivery + Listeye dön compact |
| Console | `/favicon.ico` 404 only |

### Visual (opened the PNGs and the live page)

Not Palatino-on-cream. Cool sheet, sans chrome, list + inspector filling
the viewport. No fake KPI tiles, extra destinations, or stock portraits.

First producer render: two white cards on empty teal — quality miss vs the
product-workspace still. Focused revision: full-bleed shell.

Inspection after that revision: at 1280, **Teslimatı düzenle** stretched
into a square because `.sheet--preview { display: grid }` grew the action
cell. Author patch (not skill output): `align-content: start; align-items: start`.
After the patch the control is a normal button (`157×40` at 1280).

Weaknesses kept:

- Three rows leave unused list/inspector height. No invented records.
- Form fields do not use the full desktop width.
- No licensed job photographs; a timeline diagram stands in.
- English titles vs Turkish chrome (frozen start data).

Physical phone: not run. Expo/native: out of scope (web brief).
