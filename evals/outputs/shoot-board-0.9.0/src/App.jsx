import React, { useEffect, useMemo, useState } from "react";
import { projects as seed } from "./data.js";
import {
  STATUS_LABELS,
  STATUS_ORDER,
  applyDelivery,
  countByStatus,
  daysBetween,
  filterProjects,
  formatDate,
  parseRoute,
  pathFor
} from "./board.js";
import { Button, Field, Link, Mark, StatusWord } from "./ui.jsx";

function useWide() {
  const [wide, setWide] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 880px)").matches : true
  );
  useEffect(() => {
    const media = window.matchMedia("(min-width: 880px)");
    const onChange = () => setWide(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return wide;
}

function useRoute() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const onPop = () => setTick((n) => n + 1);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return parseRoute(window.location.pathname, window.location.search);
}

function go(to, { replace = false } = {}) {
  if (replace) window.history.replaceState({}, "", to);
  else window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function App() {
  const route = useRoute();
  const wide = useWide();
  const [records, setRecords] = useState(() => seed.map((row) => ({ ...row })));
  const [draft, setDraft] = useState({ deliveryDate: "", note: "" });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  const counts = useMemo(() => countByStatus(records), [records]);
  const visible = useMemo(
    () => filterProjects(records, route.status),
    [records, route.status]
  );
  const active = records.find((row) => row.id === route.id) ?? null;
  const preview = active ?? (route.screen === "list" ? visible[0] ?? null : null);

  useEffect(() => {
    if (route.saved) {
      go(pathFor({ ...route, saved: false }), { replace: true });
    }
  }, [route.saved, route.screen, route.id, route.status]);

  useEffect(() => {
    if (route.screen !== "edit" || !active) return;
    setDraft({ deliveryDate: active.deliveryDate, note: active.note });
    setErrors({});
  }, [route.screen, route.id, active]);

  function onFilter(status) {
    go(pathFor({ screen: "list", id: null, status }));
    setNotice("");
  }

  function onSave(event) {
    event.preventDefault();
    const result = applyDelivery(records, route.id, draft);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setRecords(result.projects);
    setErrors({});
    setNotice("Teslimat bu oturumda güncellendi. Sayfa yenilenince örnek veri geri gelir.");
    go(pathFor({ screen: "detail", id: route.id, status: route.status, saved: true }));
  }

  function onCancel() {
    if (active) {
      setDraft({ deliveryDate: active.deliveryDate, note: active.note });
    }
    setErrors({});
    go(pathFor({ screen: "detail", id: route.id, status: route.status }));
  }

  const unknown = route.id && !active;

  return (
    <div className="app">
      <a className="skip" href="#board">
        Listeye geç
      </a>
      <header className="mast">
        <div className="mast__brand">
          <Mark />
          <div>
            <p className="mast__kicker">Örnek veri · bu oturum · üç çekim</p>
            <Link className="mast__name" to={pathFor({ screen: "list", status: route.status })}>
              Shoot board
            </Link>
          </div>
        </div>
        <FilterBar
          status={route.status}
          total={records.length}
          counts={counts}
          onFilter={onFilter}
        />
      </header>

      <div className={`board board--${route.screen}`} id="board">
        {route.screen === "edit" ? (
          unknown ? (
            <UnknownCard id={route.id} status={route.status} />
          ) : (
            <EditPane
              project={active}
              status={route.status}
              draft={draft}
              errors={errors}
              onChange={setDraft}
              onSave={onSave}
              onCancel={onCancel}
            />
          )
        ) : (
          <>
            <ListPane
              rows={visible}
              total={records.length}
              filter={route.status}
              selectedId={preview?.id ?? null}
              highlight={wide || route.screen === "detail"}
              routed={route.screen === "detail"}
              routeStatus={route.status}
              onClear={() => onFilter("all")}
            />
            {route.screen === "detail" && unknown ? (
              <UnknownCard id={route.id} status={route.status} />
            ) : preview ? (
              <DetailPane
                project={preview}
                status={route.status}
                notice={notice && preview.id === active?.id ? notice : ""}
                stackedOnly={route.screen === "list"}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function FilterBar({ status, total, counts, onFilter }) {
  const options = [
    { key: "all", label: "Tümü", count: total },
    ...STATUS_ORDER.map((key) => ({
      key,
      label: STATUS_LABELS[key],
      count: counts[key]
    }))
  ];

  return (
    <div className="filters" role="group" aria-label="Duruma göre süz">
      {options.map((option) => {
        const pressed = status === option.key;
        return (
          <button
            key={option.key}
            type="button"
            className={pressed ? "chip chip--on" : "chip"}
            aria-pressed={pressed}
            onClick={() => onFilter(option.key)}
          >
            <span>{option.label}</span>
            <span className="chip__count">{option.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function ListPane({ rows, total, filter, selectedId, highlight, routed, routeStatus, onClear }) {
  const title =
    filter === "all"
      ? `${rows.length} çekim`
      : `${STATUS_LABELS[filter]} · ${rows.length} / ${total}`;

  return (
    <section className="sheet sheet--list" aria-labelledby="list-title">
      <header className="sheet__head">
        <h1 id="list-title">Teslimatlar</h1>
        <p>{title}</p>
      </header>
      {rows.length === 0 ? (
        <div className="empty">
          <p>Bu durumda örnek çekim yok.</p>
          <Button variant="ghost" onClick={onClear}>
            Tümünü göster
          </Button>
        </div>
      ) : (
        <ul className="docket">
          {rows.map((row) => {
            const href = pathFor({ screen: "detail", id: row.id, status: routeStatus });
            const current = highlight && row.id === selectedId;
            return (
              <li key={row.id}>
                <Link
                  to={href}
                  className={current ? "row row--on" : "row"}
                  aria-current={routed && current ? "page" : undefined}
                >
                  <span className="row__id">{row.id}</span>
                  <span className="row__body">
                    <span className="row__title">{row.title}</span>
                    <span className="row__meta">
                      {row.client}
                      <span aria-hidden="true"> · </span>
                      <StatusWord status={row.status} />
                    </span>
                  </span>
                  <span className="row__due">
                    <span className="row__due-label">Teslim</span>
                    <time dateTime={row.deliveryDate}>{formatDate(row.deliveryDate, "short")}</time>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function DetailPane({ project, status, notice, stackedOnly }) {
  const span = daysBetween(project.shootDate, project.deliveryDate);
  const editHref = pathFor({ screen: "edit", id: project.id, status });

  return (
    <section
      className={stackedOnly ? "sheet sheet--detail sheet--preview" : "sheet sheet--detail"}
      aria-labelledby="detail-title"
    >
      <header className="detail__head">
        <p className="detail__id">{project.id}</p>
        <h2 id="detail-title">{project.title}</h2>
        <p className="detail__client">{project.client}</p>
        <StatusWord status={project.status} />
      </header>

      {notice ? (
        <p className="banner" role="status">
          {notice}
        </p>
      ) : null}

      <dl className="facts">
        <div>
          <dt>Çekim</dt>
          <dd>
            <time dateTime={project.shootDate}>{formatDate(project.shootDate)}</time>
          </dd>
        </div>
        <div>
          <dt>Teslim</dt>
          <dd>
            <time dateTime={project.deliveryDate}>{formatDate(project.deliveryDate)}</time>
          </dd>
        </div>
      </dl>

      <div className="actions">
        <Link className="btn btn--solid" to={editHref}>
          Teslimatı düzenle
        </Link>
        <Link className="btn btn--ghost detail__back" to={pathFor({ screen: "list", status })}>
          Listeye dön
        </Link>
      </div>

      <div className="note">
        <h3>Teslimat notu</h3>
        <p>{project.note || "Bu çekimde not yok."}</p>
      </div>

      {span !== null ? (
        <figure className="span">
          <div
            className="span__track"
            role="img"
            aria-label={`Çekim ${formatDate(project.shootDate)} ile teslim ${formatDate(project.deliveryDate)} arasında ${span} gün`}
          >
            <span>Çekim</span>
            <span className="span__bar" />
            <span>Teslim</span>
          </div>
          <figcaption>
            {span} gün — çekim–teslim aralığı (diyagram, fotoğraf değil).
          </figcaption>
        </figure>
      ) : null}
    </section>
  );
}

function EditPane({ project, status, draft, errors, onChange, onSave, onCancel }) {
  return (
    <section className="sheet sheet--edit" aria-labelledby="edit-title">
      <header className="edit__head">
        <p className="detail__id">{project.id}</p>
        <h1 id="edit-title">Teslimatı düzenle</h1>
        <p className="edit__who">
          {project.title}
          <span aria-hidden="true"> · </span>
          {project.client}
        </p>
      </header>

      <form className="form" onSubmit={onSave} noValidate>
        {errors.form ? (
          <p className="banner banner--bad" role="alert">
            {errors.form}
          </p>
        ) : null}

        <Field
          id="deliveryDate"
          label="Teslimat tarihi"
          hint={`Çekim ${formatDate(project.shootDate)}; teslimat bu günden önce olamaz.`}
          error={errors.deliveryDate}
        >
          <input
            type="date"
            value={draft.deliveryDate}
            onChange={(event) => onChange({ ...draft, deliveryDate: event.target.value })}
            required
          />
        </Field>

        <Field
          id="note"
          label="Teslimat notu"
          hint="En fazla 400 karakter. Boş bırakılabilir."
          error={errors.note}
        >
          <textarea
            rows={4}
            maxLength={400}
            value={draft.note}
            onChange={(event) => onChange({ ...draft, note: event.target.value })}
          />
        </Field>

        <div className="actions">
          <Button type="submit" variant="solid">
            Kaydet
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Vazgeç
          </Button>
        </div>
        <p className="form__foot">Kayıt bu oturumun belleğinde kalır; sunucuya yazılmaz.</p>
      </form>

      <p className="edit__back">
        <Link to={pathFor({ screen: "detail", id: project.id, status })}>Kayıt özetine dön</Link>
      </p>
    </section>
  );
}

function UnknownCard({ id, status }) {
  return (
    <section className="sheet sheet--missing" aria-labelledby="missing-title">
      <h1 id="missing-title">Bu çekim yok</h1>
      <p>
        <code>{id}</code> örnek listede bulunamadı.
      </p>
      <Link className="btn btn--solid" to={pathFor({ screen: "list", status })}>
        Teslimatlara dön
      </Link>
    </section>
  );
}
