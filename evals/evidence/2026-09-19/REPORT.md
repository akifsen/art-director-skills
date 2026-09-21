# Visual quality validation — 2026-09-19

The revised skill supports a more explicit render/correct/extend loop and produced useful task-specific improvements in this bounded evaluation. It did **not** demonstrate general visual superiority. The first candidate made the catalogue less efficient; the second recovered collection coverage but lengthened the mobile form. These weak results are retained alongside the improvements. Android interaction defects were corrected in a tutorial, but its visual polish remains incomplete.

## Provenance and comparison limits

The initial local checkout was `e1e59710fb842c2dd20b185c9695186cd8693119`. It was clean and fast-forwarded to fetched main `9e2e4bcf5d266ef5bea5503f0bf4121257c348c8` before comparison. Historical tags were not changed. The baseline is that main skill, **not** the older v0.4 tag. Raw loaded skill tree SHA256: `0b29a8c841e8d32f287f926cf4f27f3b6819a57fb7b410e7777f545c970c494c`.

[Manifest](manifest.json) records brief/starter/output hashes, snapshots, environment and limits. [Snapshot records](snapshots/) include file hashes and changed file contents against baseline, preserving intermediate instructions. Raw hashes are newline-sensitive. A Git checkout with different line-ending conversion can differ from the Windows run bytes.

Each library arm had one fresh independent agent context, the same fictional six-book brief, data, starter, tools and instructed budget: initial implementation plus at most two correction passes, approximately 8,000 output tokens (instruction, not a metered cap). Same inherited host model, GPT-6 family; exact serving revision unavailable. Isolation was by instructions in a shared filesystem, not an OS sandbox. Agents received explicit snapshot paths, not audit conclusions or another arm's outputs. The common brief itself required a representative rendered slice, so compliance with that procedure cannot be attributed solely to the revised skill. No statistical or causal generalization is supported by one sample per arm. Candidate 2 reused development feedback and is not a holdout.

## Independent generated outputs

Source and agent run notes are preserved under [outputs](../../outputs/2026-09-19/). The primary agent did not manually redesign these apps. All arms preserve the same book data. Baseline and candidate 1 additionally implemented editing a saved reservation; candidate 2 meets the shared required flow without that extra feature.

| Arm | Observed strength | Weakness / regression |
| --- | --- | --- |
| Baseline | Six books in the desktop first viewport; strong selected-book context and repeated tinted panels | Uneven availability positions; mobile confirmation around y=934 after repeated headings |
| Candidate 1 | Compact mobile error form: confirmation around y=749, both actions within the 844px viewport; consistent typography | Large mats shrink the actual covers; only three books in the desktop first viewport, second row around y=940 |
| Candidate 2 | Six books visible, aligned availability, larger actual covers and explicit pickup alternatives | Mobile confirmation around y=1014; repeated context plus radio choices increases scrolling; boxed form is stronger than catalogue surfaces |

All three converge on a cream/green editorial serif language. This is not evidence of broader stylistic originality. Small metadata remains a weakness. Long-title detail screens are readable without clipping, but their mobile reservation action also requires scrolling. Success screens preserve book/day/reader context and offer cancellation. Empty/error states offer recovery; retained collection counts in baseline and candidate 2 error views can still be misleading.

An independent reviewer inspected six anonymized production screenshots without source or arm names: A=candidate 2, B=candidate 1, C=baseline. [Blind review](blind-review.md) favors A narrowly for availability scanning, B for mobile form efficiency, and C for selected-book context/panel consistency. It explicitly declines an overall winner and makes no functionality inference.

The unseen existing-system case preserved Nadir's navy/cream identity, primitives and session store. Its agent improved table/selected-record hierarchy and multiline editing. Desktop hierarchy is clearer; mobile retains a horizontally scrollable table and puts the inspector below it, so inspection costs extra scrolling. The bounded scope was appropriate, not a brand redesign. This run used the intermediate `final-skill` snapshot (name retained for provenance), **not** the later release snapshot.

The final `release-skill` snapshot received a short fresh-context REFINE/REVIEW check: mobile menu patch remained scoped; branded homepage REVIEW returned findings without modifying source. [Scope report](scope/RUN.md) records actual renders, keyboard/focus checks and limits. REFINE is partial delivery because broader checks were outside the bounded pass; REVIEW is complete within its findings-only scope.

## Render and flow evidence

Saved evaluation outputs use the existing Vite build/production-preview and Playwright infrastructure, not a second screenshot framework. Run with PowerShell `$env:ART_DIRECTOR_EVAL='1'`, then `npm run test:examples:build`, `npx playwright test --project=quality`, and `npm run test:e2e:visual`. Unset the variable afterward. This rebuilds six apps and captures all three library arms at 1440×900 and 390×844 through catalogue, empty, error, long-title detail, invalid form and success states. PNGs are full-page captures; their height does not imply content was visible without scrolling.

Eight quality tests passed: shared search/filter/detail/required validation/draft cancellation/reservation/release/error retry flows at both widths for all library arms, plus existing-system note isolation/save/cancel/focus/dismissal at both widths. Seventeen tutorial flow tests passed, including the two new narrow-flow regressions. Nine visual-capture tests passed; passing capture is evidence of capture execution, not aesthetic approval.

The primary reviewer actually opened production mobile catalogues, desktop forms, mobile success screens, desktop and mobile long-title detail screens, mobile empty and desktop error screens for all three arms, plus existing-system desktop/mobile main and mobile dialog. The blind reviewer opened all three desktop catalogues and mobile invalid forms. Other produced PNGs remain available for inspection and are not silently counted as independent visual approval. Agents also inspected their own run images as documented in their RUN files. [Web evidence](web/) is separate from [tutorial evidence](tutorial/) and [native evidence](native/).

## Tutorial corrections and native limits

The shipped web tutorial had a reproduced 390px layout that expanded to 462px and clipped its dialog. Grid-child `min-width: 0` and dialog border-box sizing corrected it; before/after images are retained. This is a manual tutorial correction, not an independently generated skill result.

Actual React Native execution used the existing Pixel_9 emulator, Android 17/API 37, Expo Go SDK 52, React Native 0.76.5, at 1080×2424 and font scales 1.0/1.5. List/detail/edit, keyboard-open save, modal/back/cancel discard and saved-note persistence were exercised. A hidden Cancel action and dark status icons were reproduced and fixed; save/cancel remain reachable in the scrollable editor after correction. Font scale was restored and owned emulator/Expo processes stopped. [Native report](native/README.md) and [metadata](native/metadata.json) preserve source hashes, screenshots and environment limitations. The retained [harness](../../outputs/2026-09-19/native-harness/) permits reproduction.

Native visual Gate B remains **incomplete**: sparse detail composition and equally prominent Save/Cancel actions still need polish. No iOS, screen-reader, physical-device, release-APK or independent native baseline/candidate claim is made. Android Modal rendered full-screen; it is not proof of bottom-sheet behavior. Expo's older SDK compatibility notice and harness dependency warnings remain recorded. CI native source/store checks are not device execution. IDE automatic discovery was not tested; explicit file-path attachment and isolated CLI installation were tested.

## Changes supported by the observations

- `SKILL.md`, `polish-pass.md`, `visual-review.md`: representative render before extension; final cross-screen check; incomplete known defects separated from blocked verification.
- `visual-craft.md`, `content-and-composition.md`: compare actual content visibility, not card area; account for viewport scrolling and repeated form identity; inspect overflow at the target viewport.
- `design-method.md`, `existing-ui-system.md`, `product-ui-system.md`: task-equivalent alternatives, preserve existing primitives, avoid turning REFINE into redesign.
- `typography-color-assets.md`, `native-mobile.md`: deliberate system-font exceptions, actual rendered-font evidence, keyboard-open Save **and** Cancel, platform-specific system bars and presentation.
- `visual-research.md`: bounded first-party Penpot workspace and Apple Sheets screenshot observations, with source/type/date/transfer limits; documentation imagery is not a claim of live product interaction.

## Distribution and verification

Release metadata is 0.5.0. Packaging contains only `skills/art-director`; evaluation source, screenshots, browser dependencies and native harness do not enter user runtime. Windows packaging uses the built-in .NET ZIP API without lowering execution policy. The packer emits a per-file SHA256 manifest, tree/archive hashes and source commit; the isolated CLI install checks every installed file against source. Installation docs include backup-first commands for existing user copies.

This report records the evaluation separately from historical results. Release commit, CI and published-source installation outcomes are recorded in the release/PR and final delivery; no general quality guarantee or native visual completion is implied by version publication.
