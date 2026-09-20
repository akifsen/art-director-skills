import { useEffect, useMemo, useState } from "react";
import { patients as samplePatients } from "./data.js";
import NoteEditor from "./NoteEditor.jsx";
import { Button, DemoBanner, StatusWord } from "./ui.jsx";

function readUrlId() {
  return new URLSearchParams(window.location.search).get("id");
}

function writeUrlId(id) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("id", id);
  else url.searchParams.delete("id");
  window.history.replaceState(null, "", url);
}

function cloneRecords() {
  return samplePatients.map((row) => ({ ...row }));
}

function BayMark() {
  return (
    <svg className="bay-mark" viewBox="0 0 40 28" aria-hidden="true" focusable="false">
      <path d="M2 8h36M6 14h28M12 20h16" />
    </svg>
  );
}

export default function App() {
  const [records, setRecords] = useState(cloneRecords);
  const [selectedId, setSelectedId] = useState(() => readUrlId() || samplePatients[0].id);
  const [editorOpen, setEditorOpen] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    writeUrlId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    function onPop() {
      setSelectedId(readUrlId() || samplePatients[0].id);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const selected = records.find((row) => row.id === selectedId) ?? null;
  const needed = records.filter((row) => row.note.trim() === "").length;

  const summary = useMemo(() => {
    if (needed === 0) return "All three sample discharges have a note.";
    if (needed === 1) return "1 of 3 still needs a going-home note.";
    return `${needed} of 3 still need a going-home note.`;
  }, [needed]);

  function selectRecord(id) {
    setFlash("");
    setEditorOpen(false);
    setSelectedId(id);
  }

  function saveNote(text) {
    if (!selected) return;
    setRecords((rows) => rows.map((row) => (row.id === selected.id ? { ...row, note: text } : row)));
    setFlash(`Discharge note saved for ${selected.name} in this tab.`);
    setEditorOpen(false);
  }

  return (
    <div className="app">
      <a className="skip" href="#chart">
        Skip to selected chart
      </a>
      <header className="mast">
        <div className="mast__brand">
          <BayMark />
          <div>
            <p className="mast__kicker">Small-animal clinic</p>
            <h1 className="mast__title">Willow Bay</h1>
          </div>
        </div>
        <div className="mast__task">
          <p className="mast__lead">Afternoon discharges</p>
          <p className="mast__count">{summary}</p>
        </div>
        <DemoBanner />
      </header>

      <div className="board">
        <section className="queue" aria-labelledby="queue-title">
          <div className="queue__head">
            <h2 id="queue-title">Today’s pickups</h2>
            <p>Time order for this afternoon.</p>
          </div>
          <ul className="queue__list">
            {records.map((row) => {
              const ready = row.note.trim() !== "";
              const current = row.id === selectedId;
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    className={current ? "ticket ticket--current" : "ticket"}
                    aria-current={current ? "true" : undefined}
                    onClick={() => selectRecord(row.id)}
                  >
                    <span className="ticket__slot">{row.slot}</span>
                    <span className="ticket__body">
                      <span className="ticket__name">{row.name}</span>
                      <span className="ticket__meta">
                        {row.species} · {row.reason}
                      </span>
                    </span>
                    <StatusWord ready={ready} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="chart" className="chart" aria-labelledby="chart-title">
          {!selected ? (
            <div className="unknown">
              <h2 id="chart-title">No sample record {selectedId}</h2>
              <p>That id is not in this tab’s demo set.</p>
              <Button variant="solid" onClick={() => selectRecord(samplePatients[0].id)}>
                Back to today’s list
              </Button>
            </div>
          ) : (
            <>
              <header className="chart__head">
                <p className="chart__kicker">
                  {selected.slot} pickup · {selected.id}
                </p>
                <h2 id="chart-title" className="chart__name">
                  {selected.name}
                </h2>
                <p className="chart__species">
                  {selected.species} going home after {selected.reason.toLowerCase()}
                </p>
              </header>

              <dl className="facts">
                <div>
                  <dt>Owner</dt>
                  <dd>{selected.owner}</dd>
                </div>
                <div>
                  <dt>Pickup</dt>
                  <dd>{selected.slot}</dd>
                </div>
                <div>
                  <dt>Visit</dt>
                  <dd>{selected.reason}</dd>
                </div>
                <div>
                  <dt>Record</dt>
                  <dd>{selected.id}</dd>
                </div>
              </dl>

              <div className="slip">
                <div className="slip__head">
                  <h3>Tell the owner</h3>
                  <StatusWord ready={selected.note.trim() !== ""} />
                </div>
                {selected.note.trim() ? (
                  <p className="slip__note">{selected.note}</p>
                ) : (
                  <p className="slip__empty">No going-home note yet. Add one before this pickup.</p>
                )}
                {flash ? (
                  <p className="slip__flash" role="status">
                    {flash}
                  </p>
                ) : null}
                <div className="slip__actions">
                  <Button variant="solid" onClick={() => setEditorOpen(true)}>
                    {selected.note.trim() ? "Edit note" : "Add discharge note"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {editorOpen && selected ? (
        <NoteEditor record={selected} onSave={saveNote} onCancel={() => setEditorOpen(false)} />
      ) : null}
    </div>
  );
}
