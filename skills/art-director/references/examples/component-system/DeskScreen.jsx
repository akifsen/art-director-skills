import { useState } from "react";
import { Button } from "./Button.jsx";
import { Field } from "./Field.jsx";
import { Dialog } from "./Dialog.jsx";

const ROWS = [
  { id: "N-441", name: "E. Kaplan", slot: "09:20", reason: "Dressing change" },
  { id: "N-442", name: "M. Öztürk", slot: "09:40", reason: "Suture review" },
  { id: "N-448", name: "S. Berg", slot: "10:10", reason: "New consult" }
];

export default function DeskScreen() {
  const [selected, setSelected] = useState("N-441");
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function save() {
    if (!note.trim()) {
      setError("A clinical note is required.");
      return;
    }
    setError("");
    setOpen(false);
  }

  return (
    <div className="nd-shell">
      <aside className="nd-side">
        <p>Nadir Desk</p>
        <a href="#/desk">Today</a>
      </aside>
      <main className="nd-main">
        <div className="nd-toolbar">
          <h1>Morning list</h1>
          <Button onClick={() => setOpen(true)}>Add note</Button>
        </div>
        <table className="nd-table">
          <thead>
            <tr><th>Id</th><th>Person</th><th>Slot</th><th>Reason</th></tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.id}
                data-selected={row.id === selected}
                tabIndex={0}
                onClick={() => setSelected(row.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setSelected(row.id);
                }}
              >
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.slot}</td>
                <td>{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog title={`Note · ${selected}`} open={open} onClose={() => setOpen(false)}>
          <Field label="Note" error={error}>
            {(control) => (
              <input value={note} onChange={(e) => setNote(e.target.value)} {...control} />
            )}
          </Field>
          <Button onClick={save}>Save note</Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
        </Dialog>
      </main>
    </div>
  );
}
