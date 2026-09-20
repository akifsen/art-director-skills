# 0.9.1 evidence — state craft

Worktree branch: `craft-finish`. Skill metadata `0.9.1`.
Observation dates: 2026-09-20 / 2026-09-21.

This development chat is not independent host use. The clean photographer
trial is a file-path subagent plus a separate live inspection, not a new
Cursor GUI chat.

## What this record covers

1. Rail Still keyboard focus ring: a paper ring on a paper surface
   measured 1.00:1 while the old Playwright check passed, because it
   compared the ring with the button fill.
2. Shoot board selected-filter hover: `.chip:hover` outranked `.chip--on`
   and put the light selected label on the light hover surface (1.09:1).
3. Skill text: state combinations as a design step; container decision
   from content instead of "fill the first viewport"; working-surface
   craft decisions.
4. A clean same-brief trial with the frozen 0.9.1 candidate and no
   coaching, compared with the 0.9.0 arms.

## Rail Still focus ring

`skills/art-director/references/examples/media-portfolio/styles.css`:

```css
--rs-focus: var(--rs-ink);
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--rs-focus);
  outline-offset: 3px;
}
```

The ring is drawn outside the control, so it must contrast with the
surface around the control, not with the control's own type. Same change
in `studies/wireframe-to-finish.finished.html`.

Gate: `tests/e2e/rail-flow.spec.js` with `surfaceAt` / `ringPoint` in
`tests/e2e/helpers.js`. The ring colour is compared with the composited
surface at a point on the ring itself. 3:1 bar (WCAG 2.2 SC 1.4.11), 1280
and 390. Captures: `rail-still-*` in this folder if present, otherwise in
`evals/artifacts/`.

## Shoot board selected + hover

Hand-corrected copy `evals/outputs/shoot-board-0.9.0-corrected` (eval
output, not the distributed skill; original 0.9.0 output kept):

```css
.chip--on { background: var(--brand); }
.chip--on:hover { background: var(--brand-strong); }
```

Gate: `tests/e2e/shoot-board-corrected.spec.js` in the `seefix` project:
rest / hover / selected / selected+hover / focus pairs measured against the
composited surface, then list → detail → edit → error → save → cancel.
Captures: `chip-*.png`, `shoot-board-corrected-list-390.png`.

## Clean trial, same brief, frozen candidate

Details, hashes and the validator table are in [TRIAL.md](TRIAL.md).
Sources in [evals/outputs/shoot-board-0.9.1-clean](../../outputs/shoot-board-0.9.1-clean).

| Arm | Look |
|---|---|
| 0.8.0 Cursor trial | Cream paper, display serif ledger, thin sheet on stone. [ci-seefix web](../ci-seefix-0.8.0/web/shoot-board-list-1280.png) |
| 0.9.0 first render | Two white cards on empty teal. Quality miss. [action-quality](../action-quality-0.9.0/shoot-board-list-1280.png) |
| 0.9.0 after coaching + author patch | Full-bleed list/inspector. [action-quality final](../action-quality-0.9.0/shoot-board-list-1280-final.png) |
| **0.9.1 clean, no coaching** | Warm light-table canvas, list + next-delivery overview, ranked rows, tinted status words. [clean-list-1280.png](clean-list-1280.png) |
| 0.9.1 detail / edit / error | [clean-detail-1280.png](clean-detail-1280.png), [clean-edit-1280.png](clean-edit-1280.png), [clean-edit-error-1280.png](clean-edit-error-1280.png) |
| 0.9.1 after save | List row and detail both updated; live-region notice. [clean-detail-saved-1280.png](clean-detail-saved-1280.png) |
| 0.9.1 states | Selected chip on hover 15.66:1 [clean-chip-selected-hover-1280.png](clean-chip-selected-hover-1280.png); real Tab focus ring 13.67:1 vs canvas [clean-chip-focus-1280.png](clean-chip-focus-1280.png), [clean-row-focus-1280.png](clean-row-focus-1280.png) |
| 0.9.1 narrow | [clean-list-390.png](clean-list-390.png), [clean-detail-390.png](clean-detail-390.png), [clean-edit-390.png](clean-edit-390.png), [clean-edit-error-390.png](clean-edit-error-390.png), [clean-empty-filter-390.png](clean-empty-filter-390.png), [clean-unknown-390.png](clean-unknown-390.png) |

What changed between the 0.9.0 and 0.9.1 arms is the skill text and the
absence of coaching; brief, start files, model family and tool access were
the same. n = 1 per arm. Author not blind.

### Gains seen

- The two failure classes this release names did not appear: selected +
  hover kept its own tone; the focus ring contrasts with the surface it is
  drawn over, measured with real Tab traversal.
- Container follows content: three rows and one panel, no stretched sheet
  and no invented rows to fill height; the empty half is canvas.
- Working surface has type levels, a row priority, a small control family
  and equal finish across list / detail / form.
- States are complete: unknown id, unknown filter, invalid date with
  focus moved, disabled Save until a change, session-only notice.

### Gaps kept

- 13px muted text at 4.05:1 (AA for normal text is 4.5:1).
- 38px filter chips on 390 against a claimed 44px.
- System sans stack, no job photographs, English titles in Turkish chrome.

These are the producer's output. They were not patched.

## Not claimed

- Independent Cursor GUI discovery or a second-chat `/art-director` run
- Native device / simulator
- Public `v0.9.1` tag
- Pixel match to the attached quality stills
- That the 0.9.1 trial generalises beyond this brief (n = 1)
- That tests passing equals visual quality (this record opened the PNGs)
