/**
 * Nadir Desk per-record notes. Layer: component-store (Node).
 * Draft lives only while the dialog is open; Cancel discards it.
 */
export function createDesk(rows) {
  return {
    rows: rows.map((row) => ({ ...row, note: row.note ?? "" })),
    selected: rows[0]?.id ?? null,
    dialogOpen: false,
    draft: "",
    error: ""
  };
}

export function selectRow(state, id) {
  return { ...state, selected: id };
}

export function openNoteDialog(state) {
  const row = state.rows.find((item) => item.id === state.selected);
  return {
    ...state,
    dialogOpen: true,
    draft: row?.note ?? "",
    error: ""
  };
}

export function setDraft(state, draft) {
  return { ...state, draft };
}

export function commitNote(state) {
  const trimmed = String(state.draft ?? "").trim();
  if (!trimmed) {
    return { ...state, error: "A clinical note is required." };
  }
  return {
    ...state,
    error: "",
    dialogOpen: false,
    draft: "",
    rows: state.rows.map((row) => (row.id === state.selected ? { ...row, note: trimmed } : row))
  };
}

export function cancelNoteDialog(state) {
  return { ...state, dialogOpen: false, draft: "", error: "" };
}

export function noteFor(state, id) {
  return state.rows.find((row) => row.id === id)?.note ?? "";
}
