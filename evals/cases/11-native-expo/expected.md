# Expected — 11-native-expo

## Scope

- DESIGN, React Native / Expo
- Keep R-14, R-09, R-03
- List, detail, edit + keyboard + safe area + sheet
- Isolated fixture

## Gate A

- Items remain; no invented owners
- Empty note is rejected
- Demo save labeled

## Gate B

- Station lost-and-found identity, not Closeout kitchen yellow unless that
  actually fits (it should not)
- Shared native theme object, not random per-screen colors

## Gate C

- Three screens navigate
- Stress: empty note, long Turkish string if you add one from the brief’s
  paperback item

## Gate D

- Source uses SafeArea / insets, KeyboardAvoidingView, native a11y props
- Device/simulator: run if present; otherwise **pending** — do not pass
  via Expo web
