import { useEffect, useState } from "react";
import { Button } from "./Button.jsx";
import { Field } from "./Field.jsx";
import { Dialog } from "./Dialog.jsx";
import {
  cancelNoteDialog,
  commitNote,
  createDesk,
  noteFor,
  openNoteDialog,
  selectRow,
  setDraft
} from "./notes-store.js";

const SEED = [
  { id: "N-441", name: "E. Kaplan", slot: "09:20", bay: "Bay 2", reason: "Dressing change" },
  { id: "N-442", name: "M. Öztürk", slot: "09:40", bay: "Bay 1", reason: "Suture review" },
  { id: "N-448", name: "S. Berg", slot: "10:10", bay: "Consult", reason: "New consult" }
];

export default function DeskScreen() {
  const [state, setState] = useState(() => createDesk(SEED));
  const selected = state.rows.find((row) => row.id === state.selected);

  useEffect(() => {
    document.body.classList.add("nadir");
  }, []);

  function save() {
    setState((current) => commitNote(current));
  }

  return (
    <div className="nd-shell">
      <aside className="nd-side">
        <p>Nadir Desk</p>
        <p className="nd-side-meta">Morning clinic · demo notes in this tab</p>
        <p className="nd-nav-current" aria-current="page">Today</p>
      </aside>
      <main className="nd-main">
        <div className="nd-toolbar">
          <div>
            <p className="nd-kicker">Intake</p>
            <h1>Morning list</h1>
          </div>
          <Button onClick={() => setState((current) => openNoteDialog(current))}>
            {selected?.note ? "Edit note" : "Add note"}
          </Button>
        </div>
        <section className="nd-selected" aria-live="polite">
          <strong>{selected ? `${selected.id} · ${selected.name}` : "No row"}</strong>
          <p>{selected ? noteFor(state, selected.id) || "No clinical note yet." : ""}</p>
        </section>
        <div className="nd-table-wrap">
          <table className="nd-table">
            <thead>
              <tr><th>Id</th><th>Person</th><th>Slot</th><th>Bay</th><th>Reason</th><th>Note</th></tr>
            </thead>
            <tbody>
              {state.rows.map((row) => (
                <tr
                  key={row.id}
                  data-selected={row.id === state.selected}
                  tabIndex={0}
                  onClick={() => setState((current) => selectRow(current, row.id))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setState((current) => selectRow(current, row.id));
                    }
                  }}
                >
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.slot}</td>
                  <td>{row.bay}</td>
                  <td>{row.reason}</td>
                  <td>{row.note ? "On file" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Dialog
          title={`Note · ${state.selected}`}
          description="Saved on this row in this tab only. Cancel leaves the last committed note."
          open={state.dialogOpen}
          onClose={() => setState((current) => cancelNoteDialog(current))}
        >
          <Field label="Note" error={state.error}>
            {(control) => (
              <input
                autoFocus
                value={state.draft}
                onChange={(e) => setState((current) => setDraft(current, e.target.value))}
                {...control}
              />
            )}
          </Field>
          <div className="nd-dialog-actions">
            <Button onClick={save}>Save note</Button>
            <Button variant="secondary" onClick={() => setState((current) => cancelNoteDialog(current))}>Cancel</Button>
          </div>
        </Dialog>
      </main>
    </div>
  );
}
