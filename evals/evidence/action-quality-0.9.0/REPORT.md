# 0.9.0 evidence — action quality

Worktree branch: `craft-finish`. Skill metadata `0.9.0`.
Observation date: 2026-09-20.

This development chat is not independent host use. The photographer re-run
is a file-path subagent plus inspection, not a new Cursor GUI chat.

Fragment rewrite of Palatino-on-cream stays in
[craft-finish-0.9.0](../craft-finish-0.9.0/REPORT.md). That report is not
rewritten here.

## What this record covers

1. Invisible Rail Still inquire action (CSS specificity) and a real-React
   Playwright contrast/hover/focus gate.
2. Style choice vs quality in the skill text.
3. Photographer brief re-run in a clean eval workspace, compared to the
   0.8.0 cream ledger and to the product-workspace craft still (list +
   inspector, filters, Edit delivery filling the viewport — match craft,
   not KPI tiles / extra nav / stock portraits). The marketing collage
   (Nadir / LUMA / Commons) is catalog craft; it is not a brief to turn
   the tracker into a landing.

## Rail Still inquire

Root cause on the Vite React preview: `.rs a { color: inherit }` beat
`.rs-mail`, so “Email the desk” painted ink on ink.

Fix in `skills/art-director/references/examples/media-portfolio/styles.css`
(and the matching finished HTML study):

- element-only `a { color: inherit; }` so `.rs-mail` wins
- focus outline `2px solid currentColor` (token `#1d4f7a` on ink was 2.15:1)

Regression: `tests/e2e/rail-flow.spec.js` on production preview port 5176.
WCAG 2 AA 4.5:1 for the filled label; 3:1 for the focus outline.

Live inspect: [rail-still-mail-live-1280.png](rail-still-mail-live-1280.png)
— white label on black fill. Hover and focus captures in this folder.

## Photographer re-run

Frozen brief and start: `evals/cursor-trial/`. Isolated temp workspace
prepared by `evals/cursor-trial/prepare.mjs`. Details in [TRIAL.md](TRIAL.md).
Sources (no `node_modules`) copied to
[evals/outputs/shoot-board-0.9.0](../../outputs/shoot-board-0.9.0).

| Arm | Look |
|---|---|
| 0.8.0 Cursor trial (kept, not edited) | Cream paper, display serif ledger, thin sheet on stone canvas. [ci-seefix web](../ci-seefix-0.8.0/web/shoot-board-list-1280.png) |
| 0.9.0 first producer render | Two white cards on empty teal. Quality miss. [shoot-board-list-1280.png](shoot-board-list-1280.png) |
| After focused revision | Full-bleed topbar + list/inspector. [shoot-board-list-1280-after.png](shoot-board-list-1280-after.png) |
| After author stretch patch | Primary action is a control, not a panel. [shoot-board-list-1280-final.png](shoot-board-list-1280-final.png) |
| Edit delivery 1280 | Full-bleed sheet; fields still left-weighted. [shoot-board-form-1280-final.png](shoot-board-form-1280-final.png) |
| Narrow list / detail | [shoot-board-list-390-after.png](shoot-board-list-390-after.png), [shoot-board-detail-390-after.png](shoot-board-detail-390-after.png) |

Author CSS patch in the eval app only:

```css
.sheet--preview {
  display: grid;
  align-content: start;
  align-items: start;
}
```

The skill now names that failure in `product-ui-system.md` and
`visual-review.md`. It is not claimed that an independent host would have
applied the patch.

## Still vs quality

Closer to the product-workspace still than 0.8.0: working surface fills
the viewport, filters sit in chrome, inspector sits beside the list, no
fake KPI tiles. Remaining gaps: leftover height under three honest rows;
form fields unused on the right; no job photos.

The marketing collage was not applied to this tracker.

## Not claimed

- Independent Cursor discovery / a second-chat `/art-director` run
- Native device / simulator
- Public `v0.9.0` tag (README still says use the tag after it exists)
- Pixel match to the attached stills
- That tests-passing equals visual quality (this record re-inspected anyway)
