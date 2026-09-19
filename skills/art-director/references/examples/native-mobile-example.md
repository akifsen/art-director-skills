# Example — native list / detail / edit (Closeout)

**When:** React Native or Expo. **Not:** Expo web as iOS/Android.

Notes live in **session state** (`session-store.js`). Restarting the app
clears them. The success copy says that.

The filled commit action, quiet Cancel/back actions and shared status treatment
demonstrate roles, not a required palette. The bounded native Modal keeps the
saved station and note visible while preserving the original acknowledgement
step; its content can scroll at large font sizes. A different task may be better
served by inline feedback rather than a blocking confirmation.

## Run

This folder is source for a host React Native/Expo app. It is not a skill
runtime.

Required peer packages (host project): `react`, `react-native`,
`react-native-safe-area-context`.

Device/simulator is required for Gate D. If none is available, leave native
run-verification **pending**. Do not treat Expo web as the proof.

Layer that always runs in this repository: Node tests on `session-store.js`
(`npm test` / `npm run test:examples`).

## Files

- [native-mobile/session-store.js](native-mobile/session-store.js)
- [native-mobile/theme.js](native-mobile/theme.js)
- [native-mobile/screens.js](native-mobile/screens.js)
- [native-mobile/App.jsx](native-mobile/App.jsx)
