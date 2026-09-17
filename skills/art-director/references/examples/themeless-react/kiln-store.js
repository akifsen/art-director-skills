/**
 * Kiln Queue routes, fixtures, and hold writes. Layer: component-store (Node).
 * Demo data stays in memory. Query `?fixture=` is for tests, not production chaos.
 */
export function parseRoute(hash) {
  const raw = String(hash || "").replace(/^#/, "");
  const parts = raw.split("/").filter(Boolean);
  if (parts.length === 0) return { screen: "list", id: null };
  if (parts[0] !== "loads") return { screen: "unknown", id: null };
  if (parts.length === 1) return { screen: "list", id: null };
  if (parts.length === 2) return { screen: "detail", id: parts[1] };
  if (parts.length === 3 && parts[2] === "hold") return { screen: "hold", id: parts[1] };
  return { screen: "unknown", id: null };
}

export function readFixture(search) {
  const q = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  const value = q.get("fixture");
  if (value === "loading" || value === "error" || value === "empty") return value;
  return null;
}

export function filterLoads(loads, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return loads;
  return loads.filter((row) => `${row.id} ${row.clay} ${row.cone} ${row.status} ${row.kiln}`.toLowerCase().includes(q));
}

export function validateHold({ minutes, reason }) {
  const errors = {};
  const n = Number(minutes);
  if (!String(reason || "").trim()) errors.reason = "Say why the hold exists. Empty notes are not a hold.";
  if (!Number.isFinite(n) || n < 15 || n > 240) errors.minutes = "Use 15–240 minutes.";
  return errors;
}

export function applyHold(loads, id, { minutes, reason }) {
  const errors = validateHold({ minutes, reason });
  if (Object.keys(errors).length) return { ok: false, errors, loads };
  if (!loads.some((row) => row.id === id)) {
    return { ok: false, errors: { id: "Unknown load." }, loads };
  }
  const n = Number(minutes);
  const note = `${String(reason).trim()} (${n} min). Session demo; not sent to a kiln controller.`;
  return {
    ok: true,
    errors: {},
    loads: loads.map((row) => (row.id === id ? { ...row, status: "hold", note } : row))
  };
}
