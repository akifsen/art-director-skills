# Cursor trial — Shoot board (2026-09-20)

Inspector: this repository session (Cursor Grok 4.6), Playwright Chromium on
`http://127.0.0.1:5220/` at 1280×900 and 390×844. Producer in the isolated
workspace also opened live renders (Bodoni / Source Sans 3 / IBM Plex Mono
computed families confirmed here).

Skill snapshot: `SKILL.md` SHA256
`dbbd435d49263cd1e3925da188bc93f6c0fc18282e1d4804570d1036dc2375a8`
(0.8.0). One `.cursor/skills/art-director` copy.

## C — discovery / use

Isolated temp workspace, Vite React starter, frozen photographer brief.

| Claim | Result |
|---|---|
| File install + hash | Match |
| Natural selection | **Yes.** First message was only the brief (no slash). Agent read `.cursor/skills/art-director/SKILL.md` and references immediately |
| Explicit `/art-director` | Same chat, three minutes later, with the same brief. Not a second isolated chat |
| Method used | DESIGN notes, Magnum visual note, tokens, list then inspect, detail/form, 390 pass |

Natural success is not the same as a clean second-chat explicit trial.

## D — UI (validator, live)

React app (not a static landing). Sample data labeled. Session memory only.

| Check | Result |
|---|---|
| List + filter | Tümü / Çekimde / Düzenlemede / Teslim edildi. Çekimde shows only SH-118 |
| Empty filter | Implemented in source; **not reachable** with three statuses each having one row |
| Detail | Title, status, shoot/due, note, **Teslimatı düzenle** in first viewport at 1280 and 390 |
| Validation | Empty date stays on form; `Teslimat tarihi gerekli.`; `aria-invalid` |
| Cancel | Date `2026-10-09` discarded; detail still 2 Eki 2026 |
| Save | In-session: status `Studio portraits teslimatı bu oturumda güncellendi.` and new note. Reload resets (honest) |
| Missing id | `/projects/SH-999` → “Bu çekim bulunamadı” |
| Mobile | Chips wrap; tickets stack; edit in first 390 viewport; form actions visible |

### Visual (opened the PNGs and the live page)

Main task is the delivery ledger, not a studio slogan. Primary action on the
list is the ticket itself; next-due strip names Harbor morning. Detail and
form share rebate header, Bodoni captions, mono IDs, fibre paper, safelight
button. This is a finished product surface, not a starter skeleton.

Weaknesses kept:

- Next-due strip still shows Harbor morning while the list is filtered to
  Çekimde (global next job, not the visible set).
- English shoot titles vs Turkish chrome (frozen start data).
- Desktop sheet leaves a large stone field below; that is the booth canvas,
  not missing content.
- Console: `/favicon.ico` 404 only.

Physical phone: not run. Expo/native: out of scope (web brief).

PNGs under `web/shoot-board-*.png` in this folder.
