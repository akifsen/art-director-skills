import { useEffect, useMemo, useRef, useState } from "react";
import "./tokens.css";
import { LOADS } from "./data.js";
import {
  applyHold,
  createSaveGate,
  filterLoads,
  finishHoldCommit,
  parseRoute,
  readFixture,
  readHoldDelay
} from "./kiln-store.js";
import { Badge, Button, Dialog, Empty, Field, PageHeader } from "./ui.jsx";

export default function App() {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const fixture = readFixture(search);
  const holdDelay = readHoldDelay(search);
  const [tick, setTick] = useState(0);
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState(() => {
    if (fixture === "loading") return "loading";
    if (fixture === "error") return "error";
    return fixture === "empty" ? "ready" : "loading";
  });
  const [loads, setLoads] = useState(() => (fixture === "empty" ? [] : LOADS.map((row) => ({ ...row }))));
  const [holdMinutes, setHoldMinutes] = useState("30");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedOpen, setSavedOpen] = useState(false);
  const saveGate = useRef(createSaveGate());
  const saveTimer = useRef(0);
  const holdRejectUsed = useRef(false);

  function cancelPendingSave() {
    saveGate.current.cancel();
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = 0;
    }
    setBusy(false);
  }

  useEffect(() => {
    document.body.classList.add("kq");
    const onHash = () => setTick((n) => n + 1);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      cancelPendingSave();
    };
  }, []);

  useEffect(() => {
    if (fixture === "loading" || fixture === "error" || fixture === "empty") return undefined;
    const timer = window.setTimeout(() => setPhase("ready"), 280);
    return () => window.clearTimeout(timer);
  }, [fixture]);

  const { screen, id: activeId } = parseRoute(typeof window === "undefined" ? "" : window.location.hash);
  const active = loads.find((row) => row.id === activeId) ?? null;
  const visible = useMemo(() => filterLoads(loads, query), [loads, query]);

  useEffect(() => {
    cancelPendingSave();
    setHoldMinutes("30");
    setReason("");
    setErrors({});
    setSaveError("");
    setSavedOpen(false);
  }, [activeId, screen]);

  function go(hash) {
    window.location.hash = hash;
    setTick((n) => n + 1);
  }

  function submitHold() {
    if (busy) return;
    const result = applyHold(loads, activeId, { minutes: holdMinutes, reason });
    if (!result.ok) {
      setErrors(result.errors);
      setSaveError("");
      return;
    }
    setErrors({});
    setSaveError("");
    const token = saveGate.current.begin();
    setBusy(true);
    saveTimer.current = window.setTimeout(() => {
      const finished = finishHoldCommit(saveGate.current, token, result, {
        reject: fixture === "hold-reject" && !holdRejectUsed.current
      });
      if (finished.aborted) return;
      setBusy(false);
      saveTimer.current = 0;
      if (finished.rejected) {
        holdRejectUsed.current = true;
        setSaveError(finished.message);
        return;
      }
      setLoads(finished.loads);
      setSavedOpen(true);
    }, holdDelay);
  }

  function onSubmitHold(event) {
    event.preventDefault();
    submitHold();
  }

  function onCancelHold() {
    cancelPendingSave();
    setHoldMinutes("30");
    setReason("");
    setErrors({});
    setSaveError("");
    go(`/loads/${active.id}`);
  }

  function retry() {
    setPhase("loading");
    window.setTimeout(() => {
      setLoads(LOADS.map((row) => ({ ...row })));
      setPhase("ready");
    }, 280);
  }

  function retryHold() {
    setSaveError("");
    submitHold();
  }

  return (
    <div className="kq-shell">
      <div className="kq-topbar">
        <span className="kq-brand">Kiln Queue</span>
        <Button variant="ghost" size="sm" onClick={() => go("/")}>All loads</Button>
      </div>
      <main className="kq-main">
        {phase === "error" ? (
          <Empty title="Kiln log unavailable" action={<Button onClick={retry}>Retry</Button>}>
            Demo error fixture. Nothing was sent to a controller.
          </Empty>
        ) : null}

        {phase === "loading" && screen === "list" ? (
          <Empty title="Reading the kiln log">Deterministic wait. Not a random timeout.</Empty>
        ) : null}

        {phase === "ready" && screen === "list" ? (
          <>
            <PageHeader
              kicker="Front load A · session demo"
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
            <ol className="kq-schedule" aria-label="Firing schedule">
              <li>Bisque in A is cool</li>
              <li className="is-now">Cone 6 glaze — this queue</li>
              <li>Gas 2 reduction after lunch</li>
            </ol>
            {visible.length === 0 ? (
              <Empty title={query.trim() ? "No loads match" : "No loads in this log"}>
                {query.trim()
                  ? "Try a cone number or clear the filter."
                  : "The empty fixture has no rows. This is not a crash."}
              </Empty>
            ) : (
              <ul className="kq-list">
                {visible.map((row) => (
                  <li key={row.id}>
                    <a className="kq-row" href={`#/loads/${row.id}`} onClick={() => setTick((n) => n + 1)}>
                      <span className="kq-id">{row.id}</span>
                      <span>
                        <strong>{row.clay}</strong>
                        <span className="kq-meta">{row.kiln}</span>
                      </span>
                      <span className="kq-cone">Cone {row.cone}</span>
                      <Badge tone={row.status}>{row.status}</Badge>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}

        {screen === "unknown" ? (
          <Empty title="Unknown place in the queue" action={<Button variant="secondary" onClick={() => go("/")}>Back to loads</Button>}>
            That path is not a load or a hold form.
          </Empty>
        ) : null}

        {screen === "detail" && !active ? (
          <Empty title="Unknown load" action={<Button variant="secondary" onClick={() => go("/")}>Back to loads</Button>}>
            {activeId} is not in this demo set. No form was opened.
          </Empty>
        ) : null}

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

        {screen === "hold" && !active ? (
          <Empty title="Unknown load" action={<Button variant="secondary" onClick={() => go("/")}>Back to loads</Button>}>
            Cannot log a hold for {activeId || "a missing id"}.
          </Empty>
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
              {saveError ? (
                <p className="field-error" role="alert">
                  {saveError}{" "}
                  <Button variant="secondary" size="sm" onClick={retryHold}>Retry</Button>
                </p>
              ) : null}
              <div className="action-bar">
                <Button type="submit" busy={busy}>{saveError ? "Save hold again" : "Save hold"}</Button>
                <Button variant="secondary" onClick={onCancelHold}>
                  {busy ? "Cancel write" : "Cancel"}
                </Button>
              </div>
              {busy ? <p role="status">Writing this session. Cancel stops the write because it has not committed yet.</p> : null}
            </form>
            <Dialog
              title="Hold recorded in this session"
              description="The queue row now shows the hold. Nothing was sent to a kiln controller."
              open={savedOpen}
              onClose={() => { setSavedOpen(false); go(`/loads/${active.id}`); }}
            >
              <Button autoFocus onClick={() => { setSavedOpen(false); go(`/loads/${active.id}`); }}>Back to {active.id}</Button>
            </Dialog>
          </>
        ) : null}
      </main>
      <span hidden>{tick}</span>
    </div>
  );
}
