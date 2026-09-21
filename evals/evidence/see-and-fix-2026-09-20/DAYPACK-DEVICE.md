# Daypack corrected — device command (not yet run)

The hand-corrected copy is
`evals/outputs/see-and-fix-2026-09-20/daypack-corrected/`.

Source/state checks: `node evals/outputs/see-and-fix-2026-09-20/daypack-corrected/verify-state.mjs`
and `tests/see-and-fix.mjs`. Those are **not** device proof.

Expo web is not an Android/iOS pass. Previous Pixel_9 captures belong to
the 0.6.0 candidate/baseline apps, not this corrected copy.

## Required environment

- Android emulator or device with `adb devices` showing `device`
- Expo Go SDK 52, or `npx expo run:android` from the corrected folder
- Same snapshot as the skill under test (do not mix node_modules from
  another arm)

## Command

From a **copy** of `daypack-corrected` that still has its lockfile (run
`npm ci` there if dependencies are missing):

```powershell
adb devices
cd evals\outputs\see-and-fix-2026-09-20\daypack-corrected
npx expo start --localhost --port 8093
# other terminal:
adb reverse tcp:8093 tcp:8093
```

Open the matching `exp://127.0.0.1:8093` URL in Expo Go. Walk:

1. Open a plan at 0 items packed; confirm the primary action still names
   remaining work (`Finish packing`), not a completed state.
2. Toggle some items; confirm the action still does not say packed.
3. Complete the list; confirm `Complete packing list`, then the read-only
   summary (not checkbox chrome).
4. Back to the editable list.

Record new device screenshots of **this** copy. Do not reuse 0.6.0 PNGs.
