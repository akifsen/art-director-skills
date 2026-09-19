import React, { useState } from "react";
import { cups } from "./data";
import { remainingLabel } from "./timing";

function useNow(active) {
  const [now, setNow] = useState(() => Date.now());
  React.useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

export default function App() {
  const [steeps, setSteeps] = useState({});
  const steeping = Object.values(steeps).some((s) => s.status === "steeping");
  const now = useNow(steeping);

  function start(id) {
    setSteeps((prev) => ({ ...prev, [id]: { status: "steeping", startedAt: Date.now() } }));
  }
  function ready(id) {
    setSteeps((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], status: "ready" } } : prev));
  }
  function undo(id) {
    setSteeps((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <div className="board">
      <header>
        <p className="mark">Pier Kettle</p>
        <p className="demo">Session demo · two cups</p>
      </header>
      <main>
        <h1>On the counter</h1>
        <ul className="cups">
          {cups.map((cup) => (
            <CupRow
              key={cup.id}
              cup={cup}
              steep={steeps[cup.id]}
              now={now}
              onStart={() => start(cup.id)}
              onReady={() => ready(cup.id)}
              onUndo={() => undo(cup.id)}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

function CupRow({ cup, steep, now, onStart, onReady, onUndo }) {
  const status = steep?.status || "idle";
  const remaining = status === "steeping" ? remainingLabel(steep.startedAt, now) : null;
  const vesselClass = cup.vessel.includes("glass") ? "glass" : "enamel";
  return (
    <li className={`cup ${vesselClass} ${status}`}>
      <div className="who">
        <p className="id">{cup.id}</p>
        <p className="meta">{cup.vessel} · {cup.tea}</p>
        <p className="state">
          {status === "steeping" && `Steeping · ${remaining}`}
          {status === "ready" && "Ready to serve"}
        </p>
      </div>
      <div className="acts">
        {status === "idle" && <button type="button" onClick={onStart} aria-label={`Start steep for ${cup.id}`}>Start steep</button>}
        {status === "steeping" && (
          <>
            <button type="button" className="primary" onClick={onReady} aria-label={`Mark ${cup.id} ready`}>Mark ready</button>
            <button type="button" className="quiet" onClick={onUndo} aria-label={`Undo start for ${cup.id}`}>Undo start</button>
          </>
        )}
        {status === "ready" && <button type="button" className="quiet" onClick={onUndo} aria-label={`Clear ${cup.id}`}>Clear cup</button>}
      </div>
    </li>
  );
}
