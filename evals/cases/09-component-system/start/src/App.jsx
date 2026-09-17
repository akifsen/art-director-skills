import { useState } from "react";
import { MATTERS } from "./data.js";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Dialog } from "./ui/dialog.jsx";

export default function App() {
  const [selected, setSelected] = useState("P-301");
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function save() {
    if (!note.trim()) {
      setError("A note is required.");
      return;
    }
    setError("");
    setOpen(false);
  }

  return (
    <div className="shell">
      <aside className="side">
        <p>Plica</p>
        <p>Intake</p>
      </aside>
      <main className="main">
        <div className="toolbar">
          <h1>Open matters</h1>
          <Button onClick={() => setOpen(true)}>Add note</Button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Id</th><th>Party</th><th>Kind</th><th>Opened</th></tr>
          </thead>
          <tbody>
            {MATTERS.map((row) => (
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
                <td>{row.party}</td>
                <td>{row.kind}</td>
                <td>{row.opened}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog title={`Note · ${selected}`} open={open} onClose={() => setOpen(false)}>
          <label className="field" data-invalid={error ? "true" : "false"}>
            Note
            <Input value={note} onChange={(e) => setNote(e.target.value)} aria-invalid={Boolean(error)} />
            {error ? <span className="err">{error}</span> : null}
          </label>
          <Button onClick={save}>Save</Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
        </Dialog>
      </main>
    </div>
  );
}
