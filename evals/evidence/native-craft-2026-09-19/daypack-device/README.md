# Independent Daypack outputs: Android device check

Completed 2026-09-20 (Europe/Istanbul). This is read-only verification of the two independently generated native apps, not a manual redesign. The validator knew which arm was baseline/candidate and previously improved the tutorial: visual review is **not blind**. The validator changed no independent app source. Final hashes were compared with recorded hashes; both apps retain identical fictional `data.js`.

## Runtime and bounds

Both actual React Native apps ran in Expo Go SDK52 on the same Pixel_9 AVD: Android17/API37, 1080×2424 physical pixels, density420, font1.0 and1.5. RN0.76.5/React18.3.1/safe-area-context4.14.0 dependencies were already installed. Metro bundled baseline664 and candidate666 modules; no web substitute or standalone APK is claimed. Same pre-existing toolchain warnings as the tutorial: expected RN0.76.9/safe-area4.12.0, New Architecture configuration, older client16KB compatibility mode.

The ADB server became unresponsive before baseline launch. Its identified process was restarted once. During candidate launch a second stall prompted one restart of the owned AVD; after Android finished booting, candidate loaded successfully. These are environment recoveries, not application failures or extra generated candidates. No image/model/dependency downloads or source fixes were made. Both Metro servers were stopped, font1.0 restored, and the owned emulator shut down after verification.

## Device flow results

Each arm passed this bounded manual flow on device at font1.0:

1. Open **A walk by the water** with zero checks; tap disabled finish: no completion.
2. Check Water bottle: progress1/4; tap it again: progress0/4 and unchecked native checkbox.
3. Check Water bottle again; Android Back to plans; open **An afternoon at the studio**: progress0/4, Water bottle unchecked.
4. Back and reopen walk: progress1/4 and Water bottle still checked.
5. Check jacket, keys, sketchbook; finish: summary names the walk and displays all four packed items.
6. Scroll to restart; restart returns to the same checklist at0/4.

Android UI hierarchy readings corroborated checked states,0/4 vs1/4 counts, other-plan isolation and reset. Screenshots show initial and partial checklist plus completed summary. At font1.5, each app was recreated (session checks reset as designed), the walk was reopened and list/checklist/control wrapping and scroll reachability inspected. Baseline finish required scrolling; candidate finish was visible near the viewport bottom and remained reachable after a small scroll. Font1.5 completion summary was not exercised. Neither app has a keyboard/text-input flow in this brief; keyboard verification would be invented scope.

## Actual visual review and mixed result

All14 PNGs in this directory were opened in the image viewer by the validator. They are actual same-device captures; capture production and visual inspection are recorded separately in metadata. Parent also inspected selected captures. Neither flow success nor a screenshot constitutes design approval.

- Both apps communicate choose → pack → finish, expose reversible checks, and have coherent surfaces/type. Both summary screens retain the outing and actual packed items instead of an unrelated full-screen color message.
- **Candidate checklist gain:** its narrow progress row replaces baseline's large progress block and repeated section heading. Item labels remain readable, four controls stay generous, and the primary action is higher. At1.5 the candidate finish fits near the first viewport bottom while baseline needs a scroll. This is a task-space improvement without dropping the actual items.
- **Candidate selection regression:** separate large numbered cards and expanded introduction show only two complete plans at1.0; baseline shows all three and the session note. At1.5 candidate shows one complete card and part of the second; baseline shows two complete rows and part of the third. Larger framing adds scroll before a three-choice decision. Lime rules under candidate card metadata resemble progress despite all being the same length regardless of packing state; they provide little task information.
- **Action hierarchy:** candidate summary makes choosing another outing primary and reset secondary, with explicit reset consequence. Baseline makes restart primary and continuation a lower text action. Candidate is the more plausible hierarchy for a finished pack, but neither behavior is broken. Both require scrolling to reach every summary action.
- **Remaining polish:** both use large celebratory titles and substantial top framing for a four-item task. Candidate's larger static checked rows keep the completion screen long. Blue/lime versus green is a different direction, not proof of better originality. Candidate enlarged navigation labels are dense but were readable on this device. Some native captures intermittently show missing portions of system icons; this was also seen in the tutorial, cause unresolved. Full system-chrome stability is not inferred from them.

The candidate improves checklist economy and post-completion action roles while worsening the initial selection screen's scan density. This one task does not establish general superiority. Weak images, including candidate plan-card expansion and baseline lengthy success, are retained.

## Provenance and reproduction

`metadata.json` records source SHA256, equal data, exact platform, screenshots/hashes, and explicit flow checks. Baseline skill commit is `be2a2cd4d49833b6d4b7dca79502db5a795fce5b`; candidate skill tree recorded by the parent is `4bd790a9253b6f75db073761d4495780955d4477a6243cfcb5658fab99b293c6`. Generation-session/brief/discovery provenance is in the parent evaluation report, not inferred from this device run.

From each saved independent app directory, use its existing lockfile and `node node_modules/expo/bin/cli start --localhost --port 8091` (baseline) or8092 (candidate). With an existing compatible emulator/client, `adb reverse tcp:8091 tcp:8091` (or8092) then open the matching `exp://127.0.0.1:8091` URL. Follow the same six-step fictional flow above. Record original font scale before changing it and restore afterward. No iOS, physical device, standalone release build, screen-reader, landscape or broader-device acceptance was tested.
