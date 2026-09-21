# Photographer clean trial — design-direction candidate (2026-09-21)

Same brief, same frozen start files, same model family and tools as the
[first 0.9.1 trial](../TRIAL.md). Only the skill text changed: the
"design direction" edits at commit `952f1df` (tools vs rules, six
direction decisions, finish level, problem-specific correction).

**Kind:** file-path subagent in the authoring chat, neutral prompt, no
coaching, no author patch. Not Cursor GUI discovery. Producer:
[Shoot board clean trial, direction candidate](1427b298-98e8-4d86-a568-63da6f05c3f7).

Workspace:
`C:\Users\lenovo\AppData\Local\Temp\art-director-cursor-trial-2026-09-20T23-59-11-444Z-lJey6U`

Skill copy at prepare (unchanged through the run; equals the worktree at
`952f1df`):

- `SKILL.md` SHA256 `70ddc24319dc94068b35b82796fe2c43e328b54cc3d17561b2e35d567200008c`
- Tree SHA256 `5db1b3bd9c99d13522c0c1710cfd9bebcc1d7c3641d38f83fe0c4c875ec4f4d0`

Sources in [evals/outputs/shoot-board-0.9.1-direction](../../../outputs/shoot-board-0.9.1-direction).
Producer PNGs unmodified in `producer-shots/`; validator captures are the
PNGs in this folder.

## Producer statement (its report, not re-verified line by line)

Read `brief.md`, then `SKILL.md` second, then the starter, then eleven
references. Mode DESIGN, web, starter, product workspace. Wrote a
direction whose lead decision is that the days-to-delivery figure is the
largest text in every row and in the detail panel; system sans with
tabular numerals; neutral gray canvas; one amber "soon", one red-orange
"late"; 6px radius family; no imagery because "a tracker's proof is the
record". Corrected six things after looking (list column width, idle pane,
duplicated client line, duplicated date on delivered rows, doubled ring
on invalid + focus, cramped mobile top bar). Said shots 03–08 predate the
last corrections.

## D — UI (validator, live at `127.0.0.1:5231`)

| Check | Result |
|---|---|
| List + filter | Tümü 3 / Çekim 1 / Kurgu 1 / Teslim edildi 1 as links; `?durum=kurgu` shows SH-104 only and the filter survives into detail |
| Unknown filter | `/?durum=yok` silently shows all records — no labelled state (the first 0.9.1 arm had one) |
| Unknown id | `/projeler/SH-999` → "Bu proje bulunamadı" + "Proje listesine dön", 1280 and 390 |
| Idle pane | Dashed frame "Bir proje seçin" — a placeholder, where the first arm derived a next-delivery timeline from the records |
| Detail | ID · status kicker, title, client, a raised "3 gün kaldı · 24 Eylül 2026 · Perşembe" block, shoot date, derived "Çekimden teslime 12 gün", note, **Teslimatı düzenle** |
| Validation | Date before shoot date: `aria-invalid`, `role=alert` with icon, focus moved to the field, stays on the form |
| Save | Detail shows 26 and the new note; live-region "Teslimat kaydedildi. Değişiklik bu oturumda geçerli…" |
| Cancel | Changed date discarded; saved value kept |
| Selected chip + hover | 17.34:1 rest and hover |
| Real Tab focus | Tab from the product name lands on the selected chip; 2px ring, 16.45:1 against the surface it is drawn over |
| Small text | Mono ID 12px 4.57:1; "gün kaldı" 11px 4.93:1; top-bar note 13px 5.86:1 — all above 4.5, but 11px is small |
| Narrow (390) | No horizontal overflow on list, detail, edit; chips wrap to two rows at 34px height; Save 40px in the form (not sticky); "Değişiklik yok" state before edits |
| Console | No runtime errors |

### Visual (opened the PNGs and the live page)

The direction is legible in the render: the countdown figure leads each
row and the detail block, name a step below, client and mono ID smaller,
status as word plus dot. Four type levels are deliberate. Controls are one
family. Error state is finished (icon, red border, message, focus).

Compared with the first 0.9.1 arm on the same brief: hierarchy is more
explicit (one distinctive decision, applied consistently), and every
measured text pair clears 4.5:1 where the first arm had 4.05:1. But the
material is a neutral gray canvas with white sheets and 6px corners — it
reads closer to a system default than the first arm's warm light table,
and the idle pane is a placeholder where the first arm found content. The
producer's own words for the gray were "the surround used to judge
colour"; that is a justification from the job, not a leftover, but the
result is less specific to this product than the first arm.

Net: better hierarchy and contrast, less material character, one lost
state. Not a clear win over the first arm; n = 1 per arm, author not blind.

Weaknesses kept (producer output, not patched):

- Unknown filter has no labelled state.
- 11px helper text; 34px chips on narrow (Save is 40px).
- Idle detail pane is a dashed placeholder.
- No imagery by decision (defensible for a tracker); English titles in
  Turkish chrome (frozen data).

Physical phone: not run.
