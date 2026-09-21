# Fold run

Delivery: complete implemented user flow; tested in Chromium only. One independent attempt, one correction pass, no subagents or external assets. Mode DESIGN; web React; starter foundation evolved into shared tokens and primitives. Thesis and scope matrix: DESIGN.md.

Implemented: supplied four workshops, craft filtering, URL-addressable details and unknown-ID recovery, session selection, sold-out blocking, one/two places, name and capacity validation, in-memory reservation, confirmation and cancellation. Supplied data and skill files unchanged. No accounts, payments, backend or persistent storage.

Actions: read assigned skill and references below; checked installed React 18.3.1, Vite 5.4.21, Playwright 1.63.0. Added App.jsx, ui.jsx and styles.css; design notes and browser verification scripts. Vite initial sandbox build failed on config-loader filesystem access; scoped escalated build succeeded. Preview ran on 127.0.0.1:5202. Final build: 33 modules, success. No commit or push.

Run-verified A/C: verify.mjs passes filtering, missing session, capacity error, one-place and two-place reservations, cancellation, full session disabled, reload reset, unknown-ID recovery; no page errors. evidence/checks.json. Missing-name error implemented; initial submit displays it, but script only explicitly waits for session error. Rendered Arial Black heading face confirmed via CDP in evidence/fonts.json.

Visually inspected B: actual screenshots examined at 1440px desktop and 390px mobile: programme, detail/form, capacity validation, desktop and mobile confirmations. Correction pass reduced phone heading to two lines, fit filters into one row, repaired inline copy spacing and singular capacity label. Final mobile screenshot re-inspected. Main desktop displays actual comparison rows in first viewport; mobile has usable full-width form, no horizontal overflow.

D: native web form controls, labels, radio disabled states, URL navigation, focus treatment and heading focus implemented. Chromium keyboard focus outline and 390px overflow checked. Screen reader and physical touch device not verified. No external visual research conducted; used supplied original study. Workflow limit: implemented the full flow before first screenshot inspection, rather than staging a separate representative slice.

Evidence: evidence/desktop.png, mobile.png, mobile-detail.png, validation.png, confirmation.png, mobile-confirmation.png, checks.json, fonts.json. verify.mjs and inspect.mjs reproduce checks while preview is running.

## Actual loaded skill/reference hashes
| Relative path | SHA256 |
|---|---|
| .cursor/skills/art-director/SKILL.md | D8B3E9F156E5C8FB2ACCBEA9118C43A75CDE48FA7FC72A9E0E8ED93CA9A085CC |
| .cursor/skills/art-director/references/implementation.md | 30C19146BA448FEDAAE1E3AE5CC6D29F3EA414529410CF473068F6833C708759 |
| .cursor/skills/art-director/references/design-method.md | 8D91932C0C91B4CE9433ECBDFB883CCF65C33EDF3CD067A1323B9B590FC29E07 |
| .cursor/skills/art-director/references/content-and-composition.md | 50BBFAA0EB8CC8F4702D247314EC41A4AF96930064DE7F86E370AFDE476D9B6B |
| .cursor/skills/art-director/references/typography-color-assets.md | FB2B06C15AA03C8059484384D86ACA19208882B92CD62C35EE9DC8C7A951499E |
| .cursor/skills/art-director/references/visual-craft.md | 288A747465E76832606E927BFB37B0F2ACDB0388E21DCC94A46A6FFF96283B7E |
| .cursor/skills/art-director/references/react-web.md | 5D54A90E0F460FBCE3860033F480711845C927BF836AB8B0D7141AF1F0C89673 |
| .cursor/skills/art-director/references/product-ui-system.md | 101379E6A7524443447B55EF856B2D42BAAEBA489BA440A8E74F1910346497DC |
| .cursor/skills/art-director/references/responsive-interaction.md | 40B43AC93915D6113681DB71EECB561F1ECE9CD202BED8AFF5FFDEEB842E4714 |
| .cursor/skills/art-director/references/completeness-and-states.md | E46B55E400638488AF63ADBD87E4074FA521B2B8FD944360E5988B99F15FA422 |
| .cursor/skills/art-director/references/polish-pass.md | 7E84D3D8B72993A747E02B52E6CF441244E26DE8E30642EF56E8E774E03B3B5C |
| .cursor/skills/art-director/references/studies/two-readings.md | D4892913819AF664117B833F6671296C35025D567BB8D683752F4AE4D86F1168 |

