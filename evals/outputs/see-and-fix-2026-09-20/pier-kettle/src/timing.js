export const STEEP_MS = 3 * 60 * 1000;
export function remainingMs(startedAt, now) {
  const elapsed = Math.max(0, now - startedAt);
  return Math.max(0, STEEP_MS - elapsed);
}
export function remainingLabel(startedAt, now) {
  const sec = Math.ceil(remainingMs(startedAt, now) / 1000);
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}
