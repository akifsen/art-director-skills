# Example — native list / detail / edit (Closeout)

**When:** React Native or Expo, a small ops flow, keyboard + safe area +
sheet. **Not:** a web CSS page, and not Expo-web-as-iOS.

Kitchen Closeout uses a high-contrast yellow field and condensed labels.
Do not carry that onto a ceramics queue or a clinic desk.

These modules expect:

- `react-native`
- `react-native-safe-area-context` (`SafeAreaProvider` at the root)

They use state-based stack navigation so the example does not invent a
router import. In a real app, keep Expo Router or React Navigation if
they are already there.

Device/simulator run is required before calling Gate D passed. This folder
is source, not a device log.

## Files

- [native-mobile/theme.js](native-mobile/theme.js)
- [native-mobile/screens.js](native-mobile/screens.js)
- [native-mobile/App.jsx](native-mobile/App.jsx)
