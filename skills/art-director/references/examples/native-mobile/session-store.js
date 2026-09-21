/**
 * Closeout session notes. Layer: component-store (Node, no RN runtime).
 * Persistence is in-memory for the app session. Not device storage.
 */
export function createSession(stations) {
  return {
    stations: stations.map((row) => ({ ...row, note: row.note ?? "" }))
  };
}

export function getStation(session, id) {
  return session.stations.find((row) => row.id === id) ?? null;
}

export function saveNote(session, id, text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) {
    return { ok: false, error: "Write the closer note before saving.", session };
  }
  if (!getStation(session, id)) {
    return { ok: false, error: "Unknown station.", session };
  }
  return {
    ok: true,
    error: "",
    message: "Saved in this session. Demo data; not written to device storage.",
    session: {
      stations: session.stations.map((row) => (row.id === id ? { ...row, note: trimmed } : row))
    }
  };
}

export function cancelNote(session) {
  return session;
}
