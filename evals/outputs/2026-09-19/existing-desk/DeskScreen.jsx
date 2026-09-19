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
          <span className="nd-demo">Demo workspace · session only</span>
        </div>
        <div className="nd-workspace">
        <section className="nd-list" aria-labelledby="list-title">
        <div className="nd-section-heading"><h2 id="list-title">Appointments</h2><span>{state.rows.length} records</span></div>
        <p className="nd-list-help">Select a person to review their details and note.</p>
        <p className="nd-scroll-help">Swipe the table to see reason and note status.</p>
        <div className="nd-table-wrap" role="region" aria-label="Appointment table, scroll for more columns" tabIndex={0}>
          <table className="nd-table">
            <thead>
              <tr><th>Person / ID</th><th>Slot</th><th>Bay</th><th>Reason</th><th>Note</th></tr>
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
                  <td><strong>{row.name}</strong><small>{row.id}{row.id === state.selected ? " · Selected" : ""}</small></td>
                  <td className="nd-time">{row.slot}</td>
                  <td>{row.bay}</td>
                  <td>{row.reason}</td>
                  <td><span className="nd-note-status" data-file={Boolean(row.note)}>{row.note ? "On file" : "No note"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </section>
        <section className="nd-selected" aria-live="polite" aria-label="Selected record">
          <div className="nd-record-top"><p className="nd-kicker">Selected record</p><span>{selected?.id}</span></div>
          <h2>{selected?.name || "No row"}</h2>
          <dl className="nd-facts"><div><dt>Slot</dt><dd>{selected?.slot}</dd></div><div><dt>Location</dt><dd>{selected?.bay}</dd></div><div><dt>Reason</dt><dd>{selected?.reason}</dd></div></dl>
          <div className="nd-note-heading"><h3>Clinical note</h3><Button size="sm" onClick={() => setState((current) => openNoteDialog(current))}>{selected?.note ? "Edit note" : "Add note"}</Button></div>
          <p className={selected?.note ? "nd-note-copy" : "nd-note-empty"}>{selected ? noteFor(state, selected.id) || "No clinical note yet." : ""}</p>
          <p className="nd-session-note">Notes stay in this tab for this session. Reloading clears them.</p>
        </section>
        </div>
        <Dialog
          title={`Note · ${selected?.name}`}
          description="Saved on this row in this tab only. Cancel leaves the last committed note."
          open={state.dialogOpen}
          onClose={() => setState((current) => cancelNoteDialog(current))}
        >
          <p className="nd-editor-context">{state.selected} · {selected?.slot} · {selected?.bay}<br />{selected?.reason}</p>
          <Field label="Clinical note" error={state.error}>
            {(control) => (
              <textarea
                rows={8}
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
