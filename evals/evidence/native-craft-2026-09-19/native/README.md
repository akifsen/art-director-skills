# Native tutorial craft: current-device before / after

Run began 2026-09-19 and completed 2026-09-20 (Europe/Istanbul). Baseline commit: `be2a2cd4d49833b6d4b7dca79502db5a795fce5b`. This is a manually improved existing tutorial, not an independent skill-generation comparison. Reviewer/implementer: Codex image-capable agent, GPT-6 family (exact serving build not exposed); parent agent also reviewed selected before/after images. Review was not blind.

## Current runtime and evidence

The existing Pixel_9 AVD was checked and booted for this run: Android 17/API 37, 1080×2424 physical pixels, density 420; font scale 1.0 and 1.5. Current baseline files were loaded before any UI edits. Every PNG in this directory was produced by Android `adb screencap` during this run and opened with the image tool. Historical screenshots were not substituted. The emulator clock uses its own timezone.

Existing Expo SDK52 harness and installed dependencies were reused: React18.3.1, RN0.76.5, safe-area-context4.14.0. Final Metro bundle succeeded (665 modules). No dependency, font, external asset, backend, permission or store was added. Expo Go displayed its existing 16KB compatibility notice; it ran in compatibility mode. CLI still recommends RN0.76.9 and safe-area-context4.12.0; it warns about New Architecture configuration. This is development-client validation, not a standalone APK or production-toolchain recommendation.

## Observations and decisions

- Current baseline list used dim status/helper text with little navigation affordance. Shared native type, readable muted text, grouped station rows and a restrained chevron establish list/detail/form continuity. The same fictional station data remains.
- Baseline Back, Save and Cancel had the same strong yellow surface. Navigation and cancellation now use quiet text actions with the same minimum48dp touch height; the filled primary action follows the relevant content. No action is made smaller to create hierarchy.
- Baseline confirmation was a full yellow screen unrelated to the saved object. The bounded native Modal now shows station, saved note, truthful session-only persistence and one return action. The existing explicit acknowledgement flow is retained, with scrollable content and no animation. A transient toast could be even lighter, but would remove the persistent acknowledgement present in this tutorial; this modest dialog retains that behavior without a full-screen color field.
- Detail's action used to sit at the bottom of an otherwise empty screen; it now follows the note card. The remaining empty area is unused canvas, not invented content. The form remains concise; its station identifier is a small context label, not a second full heading.
- One correction pass cleared stale required-note feedback as soon as nonempty input was entered. Empty Save still blocks and announces the error. Before that correction, the error remained after typing; this observed weakness is recorded rather than counted as successful behavior. Its first-pass keyboard frame was replaced during matching-state capture before preservation was requested; it is not available as a committed image. Final enlarged keyboard confirms the correction.

## Behavior actually exercised

At font1.0: list → Pass detail → blank form; empty Save blocked with field error; keyboard input `Counted spare trays`; Save → contextual success; Android Back → saved detail. Edit appended ` discard`; Cancel with keyboard open retained only `Counted spare trays`. Reopening showed the saved value; hardware Back dismissed the keyboard, then returned through detail to list. Only Pass showed the saved indicator.

At font1.5: app recreation correctly cleared in-memory data; list/detail remained readable; empty Save blocked; typing the same note cleared the error; Save and Cancel were both visible above the keyboard; Save opened bounded readable confirmation and Android Back returned to detail. Font scale restored1.0. The emulator was intentionally handed to the parent task for subsequent native comparisons; this run's Metro was stopped.

Existing Node store checks were passed by the parent during this change. No fake loading/network-error state was added to a synchronous in-memory save. `session-store.js` remains unchanged.

## Capture inventory and visual judgment

Matching before/after pairs: `list`, `detail`, `form`, `keyboard`, `success`, `large-keyboard`. All use Pass and the same note where applicable. Additional after captures show required validation, saved detail/list, Cancel result, enlarged list/detail/validation/success. Baseline equal-action form and full-screen yellow success are preserved weak results.

The revised surfaces visibly distinguish action roles, improve metadata legibility, connect success to the actual note and use a consistent native product language. The enlarged form and confirmation preserve readable controls without clipping in the tested device. Remaining tradeoffs: the confirmation still requires a tap for a small edit; the small three-row app remains sparse; this is bounded craft improvement, not evidence of broad skill superiority. Some captures after transitions intermittently omit portions of status icons, also observed in the baseline. Stable saved-detail and enlarged-keyboard captures show complete light system icons. The cause was not established, so full system-chrome stability is not claimed from the affected frames.

No iOS, physical device, screen reader, landscape, standalone APK, or extreme note-length acceptance is claimed. Accessibility announcement calls were exercised by the flow but not verified with a screen reader.

## Reproduce

The final source/harness snapshot is `evals/outputs/native-craft-2026-09-19/native-harness`; package lock and source hashes are committed. With an existing Android SDK/AVD and compatible Expo client:

```powershell
Set-Location evals/outputs/native-craft-2026-09-19/native-harness
npm ci --no-audit --no-fund
npx expo start --localhost --port 8089
```

Boot the test emulator, run `adb reverse tcp:8089 tcp:8089`, then open `exp://127.0.0.1:8089` in Expo Go. Follow the fictional flow above. Record prior `adb shell settings get system font_scale`, set1.5 for enlarged checks, restore the prior value afterward. Changing Android font scale may recreate the app and clear this deliberately session-only store. `metadata.json` lists exact source and image hashes; image generation and actual visual review are distinct fields.
