# 0.8.0 evidence — CI seefix, skill/eval split, Cursor prep

Date: 2026-09-20 (Europe/Istanbul).
Starting published tree: `origin/main` = tag `v0.7.0` = `abc24ba`.
Worktree branch: `ci-seefix-and-skill-split`. Skill metadata `0.8.0`.

`skills/art-director/SKILL.md` SHA256
`dbbd435d49263cd1e3925da188bc93f6c0fc18282e1d4804570d1036dc2375a8`
Installed trial tree SHA256
`fafe460c3f5e732f1eeb0b399e7840b7404c49ac69a10629daba6d7078f10415`
(one `.cursor/skills/art-director` copy; no `.agents` duplicate).

Inspector: producing agent in this repository session (Cursor Grok 4.6).
Opened the new Pier Kettle Chromium viewports. This chat is not independent
Cursor host use.

## Findings from the 0.7.0 review, rechecked

| Claim | Status | Evidence |
|---|---|---|
| Normal CI ran kiln/desk Playwright; seefix not in that job | **Reproduced** on `abc24ba`; **fixed** here | `examples-web` builds with `ART_DIRECTOR_SEEFIX=1` and runs `npm run test:e2e:seefix` |
| Fold-corrected skipped unless env set; CI never set it | **Reproduced**; **fixed** | `beforeAll` throws if env ≠ `1`. Local: env `1` → 4 passed; env `wrong` → exit 1 (1 failed, 3 did not run). Not a skip-pass |
| Daypack corrected source-only, no current device | **Reproduced** | `adb devices` empty. Command: [DAYPACK-DEVICE.md](../see-and-fix-2026-09-20/DAYPACK-DEVICE.md) |
| Pier Kettle from this authoring session; 1280 PNG cropped | **Reproduced**; **new capture** | Old `pier-kettle-idle-1280.png` is a panel crop. New full viewports: `web/pier-kettle-idle-1280-viewport.png`, `web/pier-kettle-idle-390-viewport.png`. Live DOM: one `header`, one `.mark` at y=14 |
| SKILL.md required independent host / authoring chat | **Reproduced** on v0.7.0; **fixed** in 0.8.0 | Protocol is in [HOST-TRIAL.md](../../HOST-TRIAL.md) |
| Natural `/art-director` Cursor use unverified | **Still pending** | Isolated workspace prepared; no tool opened a new Cursor GUI chat |

No new Vite / Windows install / Save-Cancel / dialog / publish regression.
Those paths were not rewritten. Local `npm run test:e2e` (flows): 17 passed.

## Local commands and counts

Platform: Windows, Node maintainer path, Playwright bundled Chromium (installed
this turn with `npx playwright install chromium`).

```text
npm test
# all structure/source checks passed (including version 0.8.0 and HOST-TRIAL)

$env:ART_DIRECTOR_SEEFIX='1'
npm run test:examples:build
# kiln, desk, fold-corrected production builds

npm run test:e2e
# project=flows  discovered 17  passed 17  failed 0  skipped 0

npm run test:e2e:seefix
# project=seefix  discovered 4  passed 4  failed 0  skipped 0

$env:ART_DIRECTOR_SEEFIX='wrong'
npx playwright test --project=seefix
# exit 1; 1 failed (missing env), 3 did not run; 0 skipped-as-pass
```

Seefix assertions covered: catalogue (4 workshops), linked reserve flow at
1280 and 390 (required fields, validation, save, cancel, return), compact
narrow form (`titleY < 220`, lead hidden, reserve reachable). Capture PNGs
are under gitignored `evals/artifacts/` when `foldFlow(..., true)` runs.

Remote GitHub Actions on **this commit** `7c92b34`:
[push run 35477978929](https://github.com/akifsen/art-director-skills/actions/runs/35477978929)
green. `examples-web` step “Hand-corrected Fold flows” ran
`npm run test:e2e:seefix` with `ART_DIRECTOR_SEEFIX: 1`, **Running 4 tests**,
**4 passed (4.0s)**. Flows step: **17 passed**. Visual-capture steps stayed
skipped (dispatch-only; not the seefix gate).

## A–D (this turn)

| Gate | Result |
|---|---|
| A. New test path actually ran | **Yes.** Local 4/4; remote `examples-web` on `7c92b34` 4/4 passed with env `1`. Missing env fails the job |
| B. Distributed skill split from eval load | **Yes.** `SKILL.md` 0.8.0 has no host-trial protocol. Method is in `evals/HOST-TRIAL.md` |
| C. Correct skill discovered and used in Cursor | **Yes, natural selection** in the isolated photographer workspace. `/art-director` followed in the **same** chat. See [TRIAL.md](TRIAL.md) |
| D. UI from that Cursor use | **Shoot board** at `127.0.0.1:5220`. List/filter/detail/edit/save/cancel/390 inspected live. Empty filter not reachable with this sample. Next-due strip ignores the active filter |

## Pier Kettle (authoring-session app, not Cursor trial)

Full 1280×900 viewport: header (Pier Kettle + session demo), two cup rows,
Start steep on both. Main column is max 720px; side canvas is empty by CSS,
not by IDE crop. Narrow 390 stacks actions full width. Live DOM has a single
wordmark; do not treat a faint screenshot ghost as a second header.

This does not make Pier Kettle an independent host result.

## Cursor trial

Ran in an isolated temp workspace. Natural selection on the first brief;
`/art-director` in the same chat. Outcome: [TRIAL.md](TRIAL.md).
