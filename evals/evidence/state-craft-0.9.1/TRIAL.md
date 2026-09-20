# Photographer clean trial — Shoot board (0.9.1 candidate, 2026-09-21)

Inspector: this repository session, Playwright Chromium on
`http://127.0.0.1:5230/` (Vite dev server started by the producer) at
1280×900 and 390×844.

**Kind:** file-path subagent in the authoring chat, pointed at the
workspace folder and told to read whatever project files and instructions
it finds. Not Cursor natural discovery in a new GUI chat, not a second-chat
`/art-director` run. Producer:
[Shoot board clean trial 0.9.1](a28c1d97-4ff7-4e64-af9f-899751e3aa05).

Differences from the 0.9.0 re-run ([action-quality TRIAL](../action-quality-0.9.0/TRIAL.md)):

- No quality-bar interrupt, no focused revision request, no author CSS
  patch. The output below is the producer's own, as left when it reported.
- The skill copy was not touched after `prepare.mjs`. The trial
  `SKILL.md` SHA256 equals the worktree `SKILL.md` at commit `be32dfa`.

Workspace:
`C:\Users\lenovo\AppData\Local\Temp\art-director-cursor-trial-2026-09-20T22-39-15-610Z-2OYwoR`

Skill copy at prepare (`SKILL-HASHES.md`, copied next to the output):

- `SKILL.md` SHA256 `2b15feea48d7cfee1bce3948e6f4c48273b6f475d3fb0ec8c35a37afd5a1f209`
- Tree SHA256 `bfebe90313667e02c544f2bd904b904aee18d7ce1b5015041f824baaeaafdb80`

One `.cursor/skills/art-director` copy. No `.agents` duplicate.

Sources (no `node_modules`) copied to
[evals/outputs/shoot-board-0.9.1-clean](../../outputs/shoot-board-0.9.1-clean).
Producer screenshots copied unmodified to `producer-shots/`. Validator
captures are the `clean-*.png` files in this folder.

## Producer statement (from its report, not re-verified line by line)

- Read `brief.md`, the starter, then `.cursor/skills/art-director/SKILL.md`
  and eleven references (implementation, design-method, product-ui-system,
  react-web, completeness-and-states, visual-craft,
  typography-color-assets, responsive-interaction, polish-pass,
  content-and-composition, examples/themeless-react.md as method only).
- Mode DESIGN, web, starter / no system, job "product workspace".
- Left `package.json`, `SKILL-HASHES.md`, `.cursor/**`, `src/data.js`,
  `src/main.jsx`, `vite.config.js` untouched.
- Inspected its own renders with Playwright MCP and corrected four things
  before reporting (list column width, placeholder replaced with next
  delivery + timeline, redundant back link hidden on wide, focus ring
  removed from programmatically focused headings).
- Said it could not hold document focus in its headless window, so it
  checked the focus ring with programmatic focus only.

## C — discovery / use

| Claim | Result |
|---|---|
| File install + hash at prepare | Match; unchanged through the run |
| Skill found and read by the producer without a path hint | Yes (folder exploration, file-path subagent) |
| Natural selection in a new Cursor GUI chat | **Not run** |
| Explicit `/art-director` in a different chat | **Not run** |

## D — UI (validator, live)

React app, history router (`/`, `/projeler/:id`, `/projeler/:id/teslimat`,
`?durum=`). Same three frozen records. Session memory only, labelled in the
top bar and in the save notice.

| Check | Result |
|---|---|
| List + filter | Tümü 3 / Çekimde 1 / Düzenlemede 1 / Teslim edildi 1 as links with `aria-current`; `?durum=shooting` shows SH-118 only |
| Unknown filter | `/?durum=iptal` → "Bilinmeyen filtre." + "Tüm projeleri göster" |
| Unknown id | `/projeler/SH-999` → "Proje bulunamadı." + "Listeye dön" at 1280 and 390 |
| Overview before a selection | Next delivery (Harbor morning, 3 gün kaldı) + dated delivery order derived from the three records; today marker; nothing invented |
| Detail | ID · client kicker, title, status badge, shoot / delivery dates with weekday and days-left, note panel, **Teslimatı düzenle** |
| Validation | Date before shoot date stays on the form; `aria-invalid="true"`, error in `aria-describedby` with the hint, `role=alert`, focus moved to the field |
| Save | Detail shows 26 Eylül 2026 and the new note; list row reads "26 Eyl · 5 gün kaldı"; live-region notice "Teslimat bilgileri güncellendi. Bu değişiklik yalnızca bu oturumda tutulur." |
| Cancel | Vazgeç discards a changed date and returns to detail with saved values |
| Selected chip + hover | Label 15.66:1 at rest and on hover (the 0.9.0 defect class is absent) |
| Real Tab traversal | Tab from the product-name link lands on the selected chip; 2px ink ring, offset 2px, 13.67:1 against the canvas it is drawn over; row link ring the same |
| Narrow (390) | No horizontal overflow on list, detail, edit; chips scroll in one row; sticky action bar with 44px Save; Save disabled and labelled "Henüz değişiklik yok." until a value changes |
| Console | No runtime errors |

### Visual (opened the PNGs and the live page)

Warm neutral light-table canvas, paper panels, dark ink, one amber cue for
"what's next". Product name small, section title large, record title >
client/ID > delivery line. Status words with a dot in tinted badges, not
colour alone. Wide screen is list + detail side by side with the container
sized to three rows and one panel — the unused lower half is empty canvas,
not a stretched panel. Narrow screen re-orders to list → detail → edit.

Compared with the 0.9.0 arms: no first-render quality miss (two cards on
empty teal), no stretched primary action, no author patch needed. Closer
to the product-workspace still than either 0.9.0 render.

Weaknesses kept (not corrected; this is the producer's output):

- 13px muted text (row "Teslimat" label, panel hint) measures 4.05:1 on
  paper — under WCAG AA 4.5:1 for normal text.
- Filter chips are 38px tall on 390 (producer claimed 44px targets; the
  Save bar is 44px, chips are not).
- System sans by intent; no licensed job photographs; English titles vs
  Turkish chrome (frozen start data).
- Overview timeline uses the status badge twice (list row and timeline)
  on the same screen.

Physical phone: not run. Expo/native: out of scope (web brief).
