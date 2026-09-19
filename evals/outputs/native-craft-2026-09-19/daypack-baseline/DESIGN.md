# Daypack design notes
Mode: DESIGN. Platform: React Native / Expo 52. Foundation: starter with no reusable system; implemented local tokens, Button, Label, Progress and a native packing list.

## Thesis
1. The opening viewport leads with everyday outing choices, presented as a compact index, so the actual task is visible immediately.
2. The distinctive material is a short bag inventory: supplied outing names and essentials, a changing packed count, and a retained final packing receipt.
3. A native system face, forest ink, soft green checked surfaces and compact numerals evoke a dependable pocket packing card. White grouped rows separate interactive lists from the canvas; no remote imagery or custom font loading.
4. Small screens keep a single reading column and scroll all content and actions together. Checks remain in memory when navigating away. Long text may wrap rather than truncate.

Compared an illustrated destination selector with an inventory-first design. Chose the inventory: supplied data is packing content, with no real location imagery. Study used: minimal-vs-unfinished.md (method only). No live visual reference or device was available for this isolated attempt; extension from the representative packing screen is provisional.

| Screen | Task | Components / states | Navigation | Check |
|---|---|---|---|---|
| Outings | Choose supplied plan | Shared grouped rows, progress/ready labels | Open packing or completed receipt | Source, Android bundle; runtime pending |
| Packing | Check and undo | Checkbox rows, count, disabled/enabled finish | Back preserves per-plan checks | Source, Android bundle; runtime pending |
| Ready | See packed contents, start again | Receipt, shared buttons | Review; reset selected pack; choose another | Source, Android bundle; runtime pending |

No accounts, backend, notifications, storage, network assets, permissions, or fabricated outing data. Reset clears the selected plan only. Other outings retain their progress for this app session.
