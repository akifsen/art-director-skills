# Daypack corrected (hand pass)

Label: **hand-corrected demo**, not an independent skill run.

Source copy of `evals/outputs/native-craft-2026-09-19/daypack-candidate`,
then a narrow pass:

- Tighter plan cards so three outings can be compared without clipping
  the third option as the main cost of prestige height.
- Pending primary action says `Finish packing`; only a complete list
  offers `Complete packing list`.
- Packed summary uses text semantics, not checkbox chrome.
- Checklist rows remain real checkboxes with 56px minimum height.

Reducer checks: `node verify-state.mjs`. Device/emulator visual inspection
of this copy is recorded separately if a device image actually reached
the producing agent; source checks alone are not Gate B.
