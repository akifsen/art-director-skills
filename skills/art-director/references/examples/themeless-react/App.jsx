import { useEffect, useMemo, useState } from "react";
import "./tokens.css";
import { LOADS } from "./data.js";
import { Badge, Button, Dialog, Empty, Field, PageHeader } from "./ui.jsx";

function pathParts() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  return hash.split("/").filter(Boolean);
}

export default function App() {
  const [tick, setTick] = useState(0);
  const [query, setQuery] = useState("");
  const [loading] = useState(false);
  const [loads, setLoads] = useState(LOADS);
  const [holdMinutes, setHoldMinutes] = useState("30");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("kq");
    const onHash = () => setTick((n) => n + 1);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const parts = pathParts();
  const screen = !parts.length ? "list" : parts[0] === "loads" && parts[2] === "hold" ? "hold" : parts[0] === "loads" ? "detail" : "list";
  const activeId = parts[1];
  const active = loads.find((row) => row.id === activeId);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return loads;
    return loads.filter((row) => `${row.id} ${row.clay} ${row.cone} ${row.status}`.toLowerCase().includes(q));
  }, [loads, query]);

  function go(hash) {
    window.location.hash = hash;
    setTick((n) => n + 1);
  }

  function onSubmitHold(event) {
    event.preventDefault();
    const next = {};
    const minutes = Number(holdMinutes);
    if (!reason.trim()) next.reason = "Say why the hold exists. Empty notes are not a hold.";
    if (!Number.isFinite(minutes) || minutes < 15 || minutes > 240) next.minutes = "Use 15–240 minutes.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    window.setTimeout(() => {
      setLoads((rows) => rows.map((row) => (row.id === activeId ? { ...row, status: "hold", note: `${reason.trim()} (${minutes} min). Demo data; nothing was saved to a server.` } : row)));
      setBusy(false);
      setSavedOpen(true);
    }, 400);
  }

  return (
    <div className="kq-shell">
      <div className="kq-topbar">
        <span className="kq-brand">Kiln Queue</span>
        <Button variant="ghost" size="sm" onClick={() => go("/")}>All loads</Button>
      </div>
      <main className="kq-main">
        {screen === "list" ? (
          <>
            <PageHeader
              kicker="Front load A · demo"
              title="Loads in fire"
              actions={
                <input
                  className="field-control kq-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by id, clay, cone"
                  aria-label="Filter loads"
                />
              }
            />
            {loading ? <Empty title="Reading the kiln log">This is a short wait state.</Empty> : null}
            {!loading && visible.length === 0 ? (
              <Empty title="No loads match">Try a cone number or clear the filter. This empty state is intentional.</Empty>
            ) : (
              <ul className="kq-list">
                {visible.map((row) => (
                  <li key={row.id}>
                    <a className="kq-row" href={`#/loads/${row.id}`} onClick={() => setTick((n) => n + 1)}>
                      <span className="kq-id">{row.id}</span>
                      <span>{row.clay} · cone {row.cone}</span>
                      <Badge tone={row.status}>{row.status}</Badge>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}

        {screen === "detail" && !active ? <Empty title="Unknown load">That id is not in the demo set.</Empty> : null}
        {screen === "detail" && active ? (
          <>
            <PageHeader kicker={active.kiln} title={active.id} actions={<Badge tone={active.status}>{active.status}</Badge>} />
            <article className="summary">
              <p>{active.clay}</p>
              <p>Cone {active.cone}. {active.note}</p>
            </article>
            <div className="action-bar">
              <Button onClick={() => go(`/loads/${active.id}/hold`)}>Log a hold</Button>
              <Button variant="secondary" onClick={() => go("/")}>Back to queue</Button>
            </div>
          </>
        ) : null}

        {screen === "hold" && active ? (
          <>
            <PageHeader kicker={active.id} title="Log a temperature hold" />
            <form onSubmit={onSubmitHold}>
              <Field label="Minutes" error={errors.minutes} hint="15–240">
                {(control) => (
                  <input className="field-control" {...control} value={holdMinutes} onChange={(e) => setHoldMinutes(e.target.value)} inputMode="numeric" />
                )}
              </Field>
              <Field label="Reason" error={errors.reason}>
                {(control) => (
                  <input className="field-control" {...control} value={reason} onChange={(e) => setReason(e.target.value)} />
                )}
              </Field>
              <div className="action-bar">
                <Button type="submit" busy={busy}>Save hold</Button>
                <Button variant="secondary" onClick={() => go(`/loads/${active.id}`)}>Cancel</Button>
              </div>
            </form>
            <Dialog title="Hold recorded (demo)" open={savedOpen} onClose={() => { setSavedOpen(false); go(`/loads/${active.id}`); }}>
              <p>Local state only. No kiln controller was updated.</p>
              <Button onClick={() => { setSavedOpen(false); go(`/loads/${active.id}`); }}>Back to {active.id}</Button>
            </Dialog>
          </>
        ) : null}
      </main>
      <span hidden>{tick}</span>
    </div>
  );
}
