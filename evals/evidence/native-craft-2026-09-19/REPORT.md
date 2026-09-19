# Native craft and ordinary-brief validation

Started 2026-09-19; continued 2026-09-20 (Europe/Istanbul). The manually refined native tutorial and the independently generated applications are separate evidence. Opening Cursor and copying a skill did **not** verify normal Cursor use: input failed before submission. The explicit-path fallback is reported as such.

## Baseline and method

Clean starting HEAD and remote main were `be2a2cd4d49833b6d4b7dca79502db5a795fce5b`, skill 0.5.0, published tag v0.5.0. Main CI [35467216763](https://github.com/akifsen/art-director-skills/actions/runs/35467216763) passed. Existing Vite/Playwright, store behavior, Windows installation and web-dialog fixes were retained. Fetch declined a differing old local v0.1.0 tag; no old tag was overwritten.

Baseline was extracted from Git with line-ending conversion disabled. Its tree SHA256 is `301ed1e2c418d9cb65f8c22119f2c6c764e359079d7c82b534c530c2e6abbcd4`. The frozen candidate 0.6.0 working-tree hash is `4bd790a9253b6f75db073761d4495780955d4477a6243cfcb5658fab99b293c6`. Hashes include relative filenames and raw file bytes; different checkout line endings can change them. [Manifest](manifest.json) contains per-file, brief and starter hashes. Release hashes identify the published package separately.

Two small briefs were fixed before evaluation: [Fold weekend workshops](../../cases/15-weekend-workshops/brief.md), a responsive React selection/reservation flow, and [Daypack](../../cases/16-daypack/brief.md), a React Native outing/packing/completion flow. The brief text contains no skill procedure, screenshot mandate or design coaching. Data is fictional and identical between arms. The native brief's outputs were not inspected or used to tune the candidate before its snapshot was frozen.

Four fresh subagents received one ordinary brief plus an explicit path to their own installed skill copy, with identical execution boundaries: one attempt, at most two correction passes, same inherited GPT-6-family host model (exact serving revision unavailable), same dependencies and tools. Separate app/skill directories and fresh context prevent conversational carry-over; filesystem isolation remains instruction-based, not an OS sandbox. A generation agent's RUN file lists the references actually read and their hashes. The native generation arms both had device control reserved for a subsequent common validator; actual Android evidence comes from that validator, not from Expo export alone. No paid model campaign or new orchestration service was introduced.

## A. Existing native tutorial

[Current-device report and 20 captures](native/README.md) document actual before/after source execution on the same Pixel_9 emulator, Android 17/API 37, 1080×2424, font scales 1.0/1.5. Historical images were not substituted. The existing SDK 52/RN 0.76.5 development harness was reused, including its documented compatibility/version warnings.

The three-station content and session store stayed unchanged. Quiet Back/Cancel, filled Save, readable metadata, shared surfaces and a primary action adjacent to its content replace undifferentiated full-width yellow actions. A bounded native Modal shows the saved station, actual note and truthful persistence instead of a full yellow success screen. It keeps the existing acknowledgement step; inline feedback could be lighter for another task. Platform fonts remain intentional; no external asset or dependency was added.

Fresh device flows covered required validation, keyboard input, Save, success, Android Back, reopening, cancel-discard and per-station isolation. At 1.5 font scale, both form actions and the confirmation return action remained usable. One observed stale-error defect was corrected and rechecked: typing valid text now clears the required error while empty Save still blocks. The initial stale-error frame was not retained; the finding is recorded, not presented as a passing check.

The visual change improves the named problems without adding features. Remaining limits: acknowledgement adds a tap to a small edit; a three-row app still has unused canvas; some screenshots intermittently omit status icons after transitions, also seen in baseline, with cause unestablished. Stable frames show readable light icons, but full chrome stability is not claimed. No iOS, physical-device, screen-reader, landscape or standalone-APK acceptance is implied.

A separate fresh subagent reviewed eight anonymously named list/detail/form/success images without source or version mapping. [Its review](native/BLIND-REVIEW.md) preferred X (after) over Y (before) for differentiated actions and contextual confirmation, while noting redundant empty-state copy and heavier spacing/acknowledgement. The mapping was disclosed only after the review. This is a qualitative second reading of four pictured states, not runtime or accessibility acceptance. A subsequent read-only code review by that agent found no actionable Save/Cancel/Back/unknown-ID regression; it did not claim modal focus or device verification.

## B. Transfer to the skill

| Observed issue | Applied decision | General direction | Independent check |
| --- | --- | --- | --- |
| Back/Cancel competed with Save | Quiet alternatives, filled commit, full touch targets | `visual-craft.md`: shared shape does not mean equal emphasis; label/location/weight clarify roles | Inspect reservation, cancellation and packing actions |
| Success lost the changed object | Bounded contextual acknowledgement | `completeness-and-states.md`: choose toast/inline/sheet/screen by consequence and retained information | Inspect confirmation/completion alongside prior task |
| Native presentation differed by OS | Use actual native Modal and inspect device behavior | `native-mobile.md`: verify actual presentation, return target, bars and font scaling | Execute real Daypack outputs on Android |
| Catalogue gains can lengthen a form | Recheck related states after shared changes | `SKILL.md` and `polish-pass.md`: affected-screen acceptance; concrete tradeoff lives once in completeness guide | Inspect catalogue/detail/form at matching narrow width |

The entrypoint grows from 243 to 244 lines. Existing references carry the decisions; no new distributed guide or prescribed palette, font, layout or screen sequence was added. DESIGN/REFINE/REVIEW routing remains intact. Store logic is unchanged.

## C. Ordinary Cursor use

[IDE check and exact rerun steps](IDE-CHECK.md) distinguish installation, discovery, natural selection, explicit selection and content use. Cursor 3.20.17 opened an isolated workspace with the baseline copy. Input failed twice with `SendInput sent 0 of 1 events; GetLastError=87` after a refreshed observation. The normal request never reached the agent, so **natural selection was not tested**, rather than failed. Explicit Cursor invocation was not tested either. Existing user settings, other skills and projects were not changed.

Independent explicit-path subagent runs and the isolated `skills` CLI install are useful fallback evidence, not a substitute claim of Cursor discovery. This makes the overall normal-IDE objective a partial delivery even if application tests pass.

## D. Independent results and reproduction

Saved output sources and each generation RUN are under [outputs](../../outputs/native-craft-2026-09-19/). The parent does not manually redesign those outputs. Web production build, capture and flow assertions use the existing Vite/Playwright infrastructure, selected with `ART_DIRECTOR_CRAFT=1`; existing library evaluations remain under their original flag. Successful capture is not automatic aesthetic approval.

### Responsive React: Fold

Both independently generated applications built with the existing Vite production path. The common Chromium runner passed four linked flows (two arms × 1280×900 / 390×844), alongside all 17 existing example flows. Four further capture runs produced [matched screenshots and measured action positions](web-matched/). Checks cover filtering, required session/name, full-session blocking, one-seat capacity, one/two-place confirmation, cancellation, reload reset and unknown-ID recovery. The fixed crafts all have results, so a no-match filter state is not reachable; no extra search feature was invented to exercise one.

The parent visually inspected matched desktop catalogues and narrow error forms/confirmations. Both outputs have a coherent product language, clear filled reservation action, quiet navigation/cancellation and confirmation that retains the chosen workshop, time and person. The candidate adds available-session counts to browsing and stronger blue typography; baseline has a quieter, more compact desktop hierarchy and explicit bordered browse buttons. Neither catalogue is categorically superior. Both use original code-drawn craft illustrations, with no downloaded assets or new fonts.

The important weak result is retained: at 390px the empty-submit reservation action starts at y1162.5 in baseline and y1171.9 in candidate, below the 844px first viewport. Candidate's shorter metadata grouping is offset by its larger heading, demo banner and form spacing. Its confirmation also repeats the person's name and foregrounds a generic celebration heading. Baseline retains materials on the confirmation but is itself verbose about session persistence. This does **not** demonstrate improved mobile form efficiency from the new guidance. Passing flows do not settle these craft tradeoffs; a single pair cannot establish a general skill advantage.

A fresh, source/version-blind subagent inspected eight matching catalogue, error-form and confirmation PNGs. [Its independent review](web-matched/BLIND-REVIEW.md) found Q (candidate) more compact in mobile browsing with useful availability counts, while P (baseline) offered clearer catalogue buttons and richer confirmation details. It also noted Q's competing demo banner and P's tall, cropped mobile illustrations. The reviewer saw no source or prior reports and did not force an overall winner; mapping was withheld until completion.

Generation scripts and RUN records are preserved with each output; their initial screenshots used different desktop sizes and are not the matched comparison. The common reproducer is `ART_DIRECTOR_CRAFT=1 npm run test:examples:build`, then `npx playwright test --project=craft` and `npx playwright test --project=visual --grep "fold "` with that environment flag still set. These use saved React sources and invoke no model.

### Native holdout: Daypack

Both outputs exported real Android Hermes bundles, then ran through the same Pixel_9/API 37 Expo 52-compatible device harness. The common validator exercised incomplete-finish blocking, item check/undo, Android Back with preserved progress, another plan's independent empty state, complete inventory, summary and restart. Both passed these exercised flows without source correction. Device captures and the exact environment/recovery limits are in [the device report](daypack-device/README.md); generator RUN files retain their earlier, accurately pending device status.

All14 Android captures were visually inspected by the validator, including plans/checklists/reachable actions at font scale1.5. Both remained readable and scrollable in those tested states; enlarged completion summaries were not exercised. The existing SDK/client version warnings and bounded ADB/AVD restarts are documented rather than hidden. Font scale was restored and owned Metro/emulator processes stopped. iOS, physical devices, TalkBack, landscape and standalone APK builds remain untested.

The parent inspected plans, empty/partial checklists and both summaries. Candidate's checklist removes the large progress panel and repeated section header, bringing its completion action higher while retaining item names, count and undo guidance. But its much taller plan cards move the third outing below the first viewport; baseline presents all three. This is the same cross-screen tradeoff the guidance was intended to address, not proof it has been eliminated. The disabled candidate button already reads “Everything’s packed” at 0/4, with a separate instruction to pack every item: it functions as a guarded action, but the wording is less direct than baseline's “Finish packing.”

Both summaries name the outing and packed inventory. Baseline emphasizes starting the same pack again; candidate emphasizes another outing and gives reset a quieter role. These are different plausible action priorities, not a universal pattern. Native platform fonts and original code-drawn bag marks work without outside assets. No independent app was hand-polished after seeing the other output, and these held-out results were not used to retune the frozen skill.

A third fresh, source/version-blind reviewer inspected eight anonymous Android plans/checklist/partial/summary images. [Its review](daypack-device/BLIND-REVIEW.md) found N (baseline) clearer in outing density and finish wording, and M (candidate) more compact in packing progress with visible main summary actions. It noted baseline's partially clipped summary action and candidate's summary rows resembling interactive checkboxes. No version consistently won across screens. Mapping was withheld until completion; runtime acceptance comes from the separate device validator.

### Integrity and release checks

Local `npm test`, isolated `npm run test:install` and `npm run pack-skill` passed. The install comparison verified all 54 files against the frozen candidate tree, not only its version string. [Output integrity](output-integrity.json) checks the four separate installed skill copies, identical supplied data, saved generated sources, and native tutorial source/image hashes. A separate source review found no new functional regression in the tutorial diff.

The 0.6.0 release uses the existing portable-skill packaging path. Published-source installation and CI results belong to the actual release record; a successful local package alone is not evidence of publication or IDE discovery. Safe update instructions remain [backup, replace the whole directory, verify version and hashes, avoid duplicate discovery copies](../../../docs/installation.md).
