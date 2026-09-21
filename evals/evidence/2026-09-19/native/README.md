# Native tutorial device evaluation — 2026-09-19

Run: `native-2026-09-19`. This is a **manually corrected existing tutorial**,
not a fresh independent skill output or baseline/candidate comparison.
Reviewer: Codex image-capable agent (GPT-6 family; exact serving build not exposed).
One initial device pass and one bounded correction pass. Sources were manually
read from `skills/art-director`; IDE skill discovery was not exercised.

## Environment and provenance

- Starting HEAD: `9e2e4bcf5d266ef5bea5503f0bf4121257c348c8`, with in-progress candidate guide edits.
- Skill metadata observed: 0.5.0. File hashes are in `metadata.json`.
- Existing Pixel_9 AVD, Android 17, API 37, 1080 × 2424 pixels; font scales 1.0 and 1.5.
- Expo SDK 52.0.0 client with React Native 0.76.5 JS dependencies; Metro bundled 666 modules.
- No emulator image was downloaded. Expo Go and local harness dependencies were installed.
- Android showed a 16 KB compatibility notice for this older Expo Go client; it ran in compatibility mode.
- CLI recommended RN 0.76.9 and safe-area-context 4.12.0 instead of fixture versions 0.76.5/4.14.0.
- npm reported dependency vulnerabilities in this historical evaluation harness. Dependencies are excluded from the skill archive; this is not a production app/toolchain recommendation.
- No iOS, release APK build, screen reader, or long Turkish content verification was performed.

## Four separate evidence claims

1. **Artifacts produced:** the PNG files here are real adb screenshots, not web substitutes.
2. **Application ran:** Expo Go loaded the actual RN source through Metro on the Android emulator. No standalone APK was built.
3. **User flow exercised:** list → Pass detail → edit → keyboard → Save → confirmation Modal → Android Back → saved detail. After correction, edit suffix → Cancel preserved the prior saved note. At 1.5 font scale, Save and two Android Back presses returned to the list with the saved-note indicator.
4. **Visual review performed:** this agent opened list, detail, keyboard, confirmation, saved detail, Cancel result, and large-text screenshots. Screenshot production alone was not approval.

## Initial weak result and correction

`keyboard.png` shows Cancel below the keyboard and dark status icons disappearing on the black system bar. `sheet.png` shows the same bar issue. These are preserved failures.

The correction keeps both actions inside the scrollable form, with a visible gap, and uses light Android system-bar icons. `keyboard-after.png` shows both Save and Cancel above the keyboard. `cancel-after.png` shows `Counted spare trays` retained after discarding the appended word. `large-text-keyboard.png` shows the corrected form at 1.5 font scale. `large-text-sheet-after.png` shows wrapped confirmation text and readable system icons. `back-list-after.png` records return to the list with the saved-note indicator; its capture during modal/system-chrome transition has no visible status icons, so stable post-modal chrome is not approved from that frame.

The source lesson was added to `references/native-mobile.md`: inspect secondary as well as primary actions with the keyboard open, allow the action group to scroll, and inspect actual system-bar contrast. Node example checks passed before and after the correction (21 checks, including four native store behaviors).

## Visual judgment and limits

The title, three station rows, and note task are understandable. Form actions are now reachable and safe-area spacing avoids the gesture bar in the inspected states. Large text wraps without clipped form controls on this device. The yellow/dark palette is internally consistent, but detail has excessive empty space, weak muted copy, and equally emphasized Save/Cancel. Android renders the `pageSheet` Modal as full-screen confirmation, not a bottom sheet. This demonstrates a bounded flow and correction, **not a finished visual-quality benchmark**. Gate B remains incomplete because known visual weaknesses remain; untested iOS/accessibility combinations remain unverified. Neither is full approval.

## Reproduce

From the repository root in PowerShell, using the existing Android SDK and AVD:

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA/Android/Sdk"
& "$env:ANDROID_HOME/emulator/emulator.exe" -avd Pixel_9 -no-snapshot-save -no-boot-anim
Set-Location evals/outputs/2026-09-19/native-harness
npm ci --no-audit --no-fund
npx expo start --android --localhost --port 8089
```

This uses the committed harness snapshot and lockfile. If the SDK lives elsewhere,
set `ANDROID_HOME` to that installation. Expo CLI can install the compatible Expo Go
client. Navigate through the documented fictional test flow above. For large text,
record the prior `adb shell settings get system font_scale`, set 1.5, then restore
the original value. The evaluation restored 1.0. No personal device contents were
queried or captured. All screenshots contain only the fictional tutorial and
emulator system chrome.
