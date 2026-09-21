import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { projects as sampleProjects } from "./data";
import { Link, navigate, useLocation, withFilter } from "./router";
import {
  FILTERS,
  NOTE_MAX,
  boardReducer,
  countByStatus,
  deliveryCue,
  filterProjects,
  formatLong,
  formatShort,
  formatWeekday,
  isKnownFilter,
  sortProjects,
  validateDelivery
} from "./board";
import { Button, Cue, EmptyPanel, Field, Notice, StatusBadge } from "./ui";

const NARROW = "(max-width: 899px)";

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia(NARROW).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

export default function App() {
  const loc = useLocation();
  const narrow = useNarrow();
  const [state, dispatch] = useReducer(boardReducer, { projects: sampleProjects, lastSaved: null });

  const filter = loc.filter;
  const counts = useMemo(() => countByStatus(state.projects), [state.projects]);
  const visible = useMemo(
    () => sortProjects(filterProjects(state.projects, filter)),
    [state.projects, filter]
  );
  const selected = loc.id ? state.projects.find((p) => p.id === loc.id) : null;
  const nextUp = useMemo(
    () => sortProjects(state.projects).find((p) => p.status !== "delivered") || null,
    [state.projects]
  );

  // Forget the "saved" acknowledgement once the user leaves that record.
  useEffect(() => {
    if (state.lastSaved && state.lastSaved.id !== loc.id) dispatch({ type: "clearSaved" });
  }, [loc.id, state.lastSaved]);

  const listPath = withFilter("/", filter);

  return (
    <div className="shell" data-view={loc.view}>
      <header className="topbar">
        <h1 className="topbar__name">
          <Link href={listPath} className="topbar__link">
            Çekim Panosu
          </Link>
        </h1>
        <p className="topbar__meta">
          Örnek veri · değişiklikler yalnızca bu oturumda tutulur
        </p>
      </header>

      <div className="work">
        <section className="col col--list" aria-labelledby="list-heading">
          <div className="list-head">
            <h2 id="list-heading" className="list-head__title">
              Projeler <span className="list-head__count">{counts.all}</span>
            </h2>
            <nav className="chips" aria-label="Duruma göre filtrele">
              {FILTERS.map((f) => {
                const on = f.key === filter;
                return (
                  <Link
                    key={f.key}
                    href={withFilter(loc.view === "list" ? "/" : loc.pathname, f.key)}
                    className={`chip ${on ? "chip--on" : ""}`}
                    aria-current={on ? "true" : undefined}
                  >
                    {f.label}
                    <span className="chip__count">{counts[f.key] || 0}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <ProjectList projects={visible} filter={filter} selectedId={loc.id} listPath={listPath} />
        </section>

        <section className="col col--detail" aria-label="Proje detayı">
          {loc.view === "list" ? (
            <NextUp project={nextUp} projects={state.projects} filter={filter} />
          ) : !selected ? (
            <UnknownProject id={loc.id} listPath={listPath} narrow={narrow} />
          ) : loc.view === "edit" ? (
            <DeliveryForm
              key={selected.id}
              project={selected}
              filter={filter}
              narrow={narrow}
              onSave={(values) => {
                dispatch({ type: "saveDelivery", id: selected.id, ...values });
                navigate(withFilter(`/projeler/${selected.id}`, filter));
              }}
            />
          ) : (
            <ProjectDetail
              key={selected.id}
              project={selected}
              filter={filter}
              narrow={narrow}
              saved={state.lastSaved && state.lastSaved.id === selected.id}
              listPath={listPath}
            />
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------------- list ---------------- */

function ProjectList({ projects, filter, selectedId, listPath }) {
  if (projects.length === 0) {
    return (
      <EmptyPanel
        title={isKnownFilter(filter) ? "Bu durumda proje yok." : "Bilinmeyen filtre."}
        action={
          <Button as="link" href="/" variant="secondary" size="sm">
            Tüm projeleri göster
          </Button>
        }
      >
        {isKnownFilter(filter)
          ? "Filtreyi değiştirin veya tüm projelere dönün."
          : `“${filter}” adlı bir durum tanımlı değil.`}
      </EmptyPanel>
    );
  }
  return (
    <ul className="rows" aria-label="Proje listesi">
      {projects.map((p) => {
        const on = p.id === selectedId;
        const cue = deliveryCue(p);
        return (
          <li key={p.id}>
            <Link
              href={withFilter(`/projeler/${p.id}`, filter)}
              className={`row ${on ? "row--on" : ""}`}
              aria-current={on ? "page" : undefined}
            >
              <span className="row__top">
                <span className="row__title">{p.title}</span>
                <StatusBadge status={p.status} size="sm" />
              </span>
              <span className="row__client">
                {p.client} <span className="row__id">{p.id}</span>
              </span>
              <span className="row__delivery">
                <span className="row__label">Teslimat</span>
                <time dateTime={p.deliveryDate}>{formatShort(p.deliveryDate)}</time>
                <Cue cue={cue} />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------- detail column: no selection ---------------- */

function NextUp({ project, projects, filter }) {
  const cue = project ? deliveryCue(project) : null;
  return (
    <div className="panel overview">
      {project ? (
        <>
          <p className="kicker">Sıradaki teslimat</p>
          <h3 className="panel__title">
            <Link href={withFilter(`/projeler/${project.id}`, filter)} className="panel__title-link">
              {project.title}
            </Link>
          </h3>
          <p className="panel__line">
            {project.client} · <time dateTime={project.deliveryDate}>{formatLong(project.deliveryDate)}</time>
            {cue ? (
              <>
                {" "}
                · <Cue cue={cue} />
              </>
            ) : null}
          </p>
        </>
      ) : (
        <>
          <p className="kicker">Sıradaki teslimat</p>
          <h3 className="panel__title">Açık teslimat yok</h3>
          <p className="panel__line">Tüm projeler teslim edilmiş görünüyor.</p>
        </>
      )}

      <DeliveryTimeline projects={projects} filter={filter} />

      <p className="panel__hint">Detay ve düzenleme için soldaki listeden bir proje seçin.</p>
    </div>
  );
}

/** All deliveries in date order with a "today" marker — derived from the records, nothing invented. */
function DeliveryTimeline({ projects, filter }) {
  const today = new Date();
  const todayIso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");
  const ordered = [...projects].sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));
  const items = [];
  let todayPlaced = false;
  for (const p of ordered) {
    if (!todayPlaced && p.deliveryDate >= todayIso) {
      items.push({ kind: "today" });
      todayPlaced = true;
    }
    items.push({ kind: "project", project: p });
  }
  if (!todayPlaced) items.push({ kind: "today" });

  return (
    <section className="timeline" aria-labelledby="timeline-heading">
      <h4 id="timeline-heading" className="timeline__heading">
        Teslimat sırası
      </h4>
      <ol className="timeline__list">
        {items.map((item, i) =>
          item.kind === "today" ? (
            <li key="today" className="timeline__today" aria-label={`Bugün, ${formatLong(todayIso)}`}>
              <span className="timeline__today-label">Bugün · {formatShort(todayIso)}</span>
            </li>
          ) : (
            <li key={item.project.id} className={`timeline__item timeline__item--${item.project.status}`}>
              <time className="timeline__date" dateTime={item.project.deliveryDate}>
                {formatShort(item.project.deliveryDate)}
              </time>
              <span className="timeline__body">
                <Link href={withFilter(`/projeler/${item.project.id}`, filter)} className="timeline__link">
                  {item.project.title}
                </Link>
                <span className="timeline__meta">
                  {item.project.client} · <StatusBadge status={item.project.status} size="sm" />
                </span>
              </span>
            </li>
          )
        )}
      </ol>
    </section>
  );
}

/* ---------------- detail ---------------- */

function useFocusOnNarrow(ref, narrow, deps) {
  useEffect(() => {
    if (narrow && ref.current) ref.current.focus({ preventScroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function ProjectDetail({ project, filter, narrow, saved, listPath }) {
  const headingRef = useRef(null);
  useFocusOnNarrow(headingRef, narrow, [project.id]);
  const cue = deliveryCue(project);

  return (
    <article className="panel detail" aria-labelledby={`title-${project.id}`}>
      <nav className="back" aria-label="Geri">
        <Link href={listPath} className="back__link">
          <span aria-hidden="true">←</span> Projeler
        </Link>
      </nav>

      <header className="detail__head">
        <p className="kicker">
          <span className="mono">{project.id}</span> · {project.client}
        </p>
        <div className="detail__title-row">
          <h2 id={`title-${project.id}`} className="detail__title" tabIndex={-1} ref={headingRef}>
            {project.title}
          </h2>
          <StatusBadge status={project.status} />
        </div>
      </header>

      {saved ? (
        <Notice tone="success" role="status">
          Teslimat bilgileri güncellendi. Bu değişiklik yalnızca bu oturumda tutulur.
        </Notice>
      ) : null}

      <dl className="facts">
        <div className="facts__item">
          <dt>Çekim tarihi</dt>
          <dd>
            <time dateTime={project.shootDate}>{formatLong(project.shootDate)}</time>
            <span className="facts__sub">{formatWeekday(project.shootDate)}</span>
          </dd>
        </div>
        <div className="facts__item facts__item--delivery">
          <dt>Teslimat tarihi</dt>
          <dd>
            <time dateTime={project.deliveryDate}>{formatLong(project.deliveryDate)}</time>
            <span className="facts__sub">
              {formatWeekday(project.deliveryDate)}
              {cue ? (
                <>
                  {" · "}
                  <Cue cue={cue} />
                </>
              ) : null}
            </span>
          </dd>
        </div>
        <div className="facts__item facts__item--note">
          <dt>Teslimat notu</dt>
          <dd className="facts__note">{project.note ? project.note : <span className="muted">Not yok.</span>}</dd>
        </div>
      </dl>

      <div className="actions">
        <Button as="link" href={withFilter(`/projeler/${project.id}/teslimat`, filter)} variant="primary">
          Teslimatı düzenle
        </Button>
      </div>
    </article>
  );
}

/* ---------------- edit ---------------- */

function DeliveryForm({ project, filter, narrow, onSave }) {
  const headingRef = useRef(null);
  useFocusOnNarrow(headingRef, narrow, [project.id]);

  const [values, setValues] = useState({ deliveryDate: project.deliveryDate, note: project.note });
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const dateRef = useRef(null);
  const noteRef = useRef(null);

  const dirty = values.deliveryDate !== project.deliveryDate || values.note !== project.note;
  const detailPath = withFilter(`/projeler/${project.id}`, filter);

  function update(patch) {
    const next = { ...values, ...patch };
    setValues(next);
    if (attempted) setErrors(validateDelivery(project, next));
  }

  function submit(event) {
    event.preventDefault();
    const found = validateDelivery(project, values);
    setAttempted(true);
    setErrors(found);
    if (found.deliveryDate) return dateRef.current && dateRef.current.focus();
    if (found.note) return noteRef.current && noteRef.current.focus();
    if (!dirty) return;
    onSave({ deliveryDate: values.deliveryDate, note: values.note.trim() });
  }

  return (
    <form className="panel editor" onSubmit={submit} noValidate aria-labelledby="edit-heading">
      <nav className="back" aria-label="Geri">
        <Link href={detailPath} className="back__link">
          <span aria-hidden="true">←</span> {project.title}
        </Link>
      </nav>

      <header className="editor__head">
        <h2 id="edit-heading" className="editor__title" tabIndex={-1} ref={headingRef}>
          Teslimatı düzenle
        </h2>
        <p className="editor__record">
          <span className="mono">{project.id}</span> · {project.client} · Çekim{" "}
          <time dateTime={project.shootDate}>{formatLong(project.shootDate)}</time>
        </p>
      </header>

      <div className="editor__fields">
        <Field
          label="Teslimat tarihi"
          required
          error={errors.deliveryDate}
          hint={`Çekim tarihinden (${formatShort(project.shootDate)}) sonra olmalı.`}
        >
          {(a11y) => (
            <input
              {...a11y}
              ref={dateRef}
              className="control control--date"
              type="date"
              value={values.deliveryDate}
              min={project.shootDate}
              onChange={(e) => update({ deliveryDate: e.target.value })}
            />
          )}
        </Field>

        <Field
          label="Teslimat notu"
          error={errors.note}
          hint={`${values.note.length} / ${NOTE_MAX} karakter`}
        >
          {(a11y) => (
            <textarea
              {...a11y}
              ref={noteRef}
              className="control control--note"
              rows={5}
              value={values.note}
              onChange={(e) => update({ note: e.target.value })}
            />
          )}
        </Field>
      </div>

      <div className="actions actions--form">
        <Button type="submit" variant="primary" disabled={!dirty} aria-describedby={!dirty ? "save-hint" : undefined}>
          Kaydet
        </Button>
        <Button as="link" href={detailPath} variant="ghost">
          Vazgeç
        </Button>
        {!dirty ? (
          <span id="save-hint" className="actions__hint">
            Henüz değişiklik yok.
          </span>
        ) : null}
      </div>
    </form>
  );
}

/* ---------------- unknown record ---------------- */

function UnknownProject({ id, listPath, narrow }) {
  const headingRef = useRef(null);
  useFocusOnNarrow(headingRef, narrow, [id]);
  return (
    <div className="panel">
      <nav className="back" aria-label="Geri">
        <Link href={listPath} className="back__link">
          <span aria-hidden="true">←</span> Projeler
        </Link>
      </nav>
      <EmptyPanel
        title={
          <span ref={headingRef} tabIndex={-1}>
            Proje bulunamadı.
          </span>
        }
        action={
          <Button as="link" href={listPath} variant="secondary" size="sm">
            Listeye dön
          </Button>
        }
      >
        <span className="mono">{id}</span> numaralı bir proje bu panoda yok.
      </EmptyPanel>
    </div>
  );
}
