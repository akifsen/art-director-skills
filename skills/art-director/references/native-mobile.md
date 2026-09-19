# Native mobile (React Native / Expo)

Read this when the user asked for a **mobile app**, **native UI**,
**React Native**, or **Expo**, or the repo is already a native project.

Do **not** use [responsive-interaction.md](responsive-interaction.md) as
the recipe book here. That guide is web viewports and website menus.

Keep the current native framework. Do not migrate Flutter, SwiftUI, or
Compose unless the user asked. Those stacks are **not tested** with this
skill; if you must work in them, follow that project’s own navigation and
a11y APIs and say the native RN/Expo examples were not the verification.

Same product identity across platforms is allowed. Pixel-identical chrome
is not required.

HTML in a device frame is not native proof. Expo web is not iOS or Android
verification. If you cannot run a simulator, emulator, or device, leave
platform run-verification **pending**.

## Navigation

Use the project’s navigator (Expo Router, React Navigation, or existing).

- Stack: titles, back, and the gesture/hardware back the platform already
  provides. On Android, `BackHandler` (or the navigator’s default) must pop
  the in-app stack. Do not invent a web-style “home link” that drops history.
- Tabs: selected state, labels, and a reachable first screen per tab.
- Deep links / state restore: preserve them if they already exist; do not
  add new schemes without a request.

## Safe area and system chrome

Use `react-native-safe-area-context` in Expo/RN (Expo docs: wrap with
`SafeAreaProvider`; `SafeAreaView` or `useSafeAreaInsets`).

Account for notch, status bar, home indicator, and edge-to-edge. Bottom
actions must remain tappable inside the inset, not under the home bar.

Do not treat the platform UI font as a “starter leftover” to replace by
default. System UI fonts are native. Replace them only when the product
already has a loaded face and a reason.

## Keyboard

Forms, sheets, and submit actions must remain usable while the keyboard is
open.

React Native `KeyboardAvoidingView`: set `behavior` on **both** iOS and
Android (`padding`, `height`, or `position` — platforms differ; verify on
the device you have). Use `keyboardVerticalOffset` when a header sits
above the view. Pair with a `ScrollView`/`KeyboardAware` pattern so fields
can move into view.

Do not copy CSS `100vh` tricks.

Inspect both Save and Cancel with the keyboard open: a visible primary action
does not prove the secondary action is reachable. Keep the action group in the
scrollable form when a fixed footer cannot fit with large text and the keyboard.
Check status-bar icon contrast on the actual system-bar surface in each state.

## Touch and state

- Hit targets large enough for fingers (follow current platform HIG /
  Material guidance; do not import web `44px` as a slogan without
  checking the running OS).
- Pressed, disabled, busy — not hover-only affordances.
- Sheets, modals, pickers: platform-typical presentation; Cancel / back
  must dismiss without trapping.

Choose feedback by consequence using [completeness-and-states.md](completeness-and-states.md).
On a device, inspect the actual presentation: a requested sheet may become a
full-screen modal on another OS. For a small local save, retain the edited
record's identity and readable result instead of expanding an accent surface
to fill the screen. If keeping a modal, verify its return target, system bars
and large-text scrolling as well as the editor beneath it.

## Copy and layout

Long Turkish strings, Dynamic Type / font scaling, and short vs tall
screens are part of the design. Tablet layout only if the brief or the
existing app includes it.

Card height is not craft. On a choice screen, the user should be able to
compare the offered options without losing titles, status, or a finger-sized
target. Prefer tighter padding and a shorter supporting line over a taller
tile that clips the third option. Do not shrink type or hit areas until
they are unusable just to show more rows.

Progress copy helps; it should not push the actual work below a decorative
intro. Disabled or pending actions name the work still required
(`Finish packing`), not a completed outcome (`Everything’s packed`) while
items remain. After success, a read-only packed list is a summary: use text
semantics, not checkbox chrome or `accessibilityRole="checkbox"`. Keep the
role, the look, and whether the row still toggles aligned.

For the same list/detail/edit task, a full-screen editor suits long notes,
keyboard work and large text; a sheet suits a short contextual choice while
retaining the parent record. Choose by content and dismissal semantics,
not visual novelty. Keep existing navigator and sheet behavior. Review the
first real device screen before extending and again with keyboard/sheet
open. Reflow labels and actions under font scaling instead of shrinking text.

Shared craft principles (hierarchy, density, surfaces, state clarity) apply;
web font stacks, CSS grids and DOM focus recipes do not. Use restrained
transition feedback only when it explains the action; honor reduced-motion
settings through the project's native facilities. Animation is optional.

## Accessibility (native APIs)

Follow React Native accessibility props, not ARIA:

- `accessibilityLabel`, `accessibilityHint`, `accessibilityRole`
- `accessibilityState` (`disabled`, `selected`, `busy`, `expanded`,
  `checked`)
- `accessibilityLabelledBy` / `nativeID` for fields
- `accessibilityLiveRegion` (Android) for status that appears after an action
- `AccessibilityInfo.announceForAccessibility(message)` after a save or
  error the user cannot see on the focused control
  (https://reactnative.dev/docs/accessibilityinfo)

There is no announcement *prop* on the view. Call the `AccessibilityInfo`
module method above.

VoiceOver and TalkBack read native semantics. Do not sprinkle
`aria-*` on RN components and call that done.

Official references to re-check for the installed RN version:

- https://reactnative.dev/docs/accessibility
- https://reactnative.dev/docs/keyboardavoidingview
- https://reactnative.dev/docs/flatlist
- https://docs.expo.dev/develop/user-interface/safe-areas/

## Lists and motion

`FlatList`/`SectionList` for long data (windowing, keys). Remote images:
size, placeholder, failure. Keyboard and navigation transitions should not
jank the list you just shipped. Motion that the runtime cannot hold is a
defect.

## States in scope

Loading, empty, error + retry, offline or permission denied — only where
the feature needs them. Do not add new device permissions, data collection,
or mandatory haptics.

Worked files: [examples/native-mobile-example.md](examples/native-mobile-example.md).
