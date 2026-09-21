import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRouter } from "./router.jsx";
import { Button, Field, Meta, Notice, StatusBadge } from "./ui.jsx";
import {
  STATUS,
  STATUS_ORDER,
  deadline,
  fmtLong,
  fmtWeekday,
  parseDay,
  statusFromSlug
} from "./format.js";

const NOTE_MAX = 280;

/** Days between shoot and delivery — derived from the record, not invented. */
function turnaround(project) {
  const a = parseDay(project.shootDate);
  const b = parseDay(project.deliveryDate);
  if (!a || !b) return "—";
  const n = Math.round((b - a) / 86400000);
  return n === 0 ? "Aynı gün" : `${n} gün`;
}

/* ---------- Deadline figure (the row's lead) ---------- */

function Deadline({ project, size = "md" }) {
  const d = deadline(project);
  return (
    <div className={`deadline deadline--${d.tone} deadline--${size}`}>
      <span className="deadline__figure">{d.figure}</span>
      <span className="deadline__unit">{d.unit}</span>
    </div>
  );
}

/* ---------- List ---------- */

export function ListPane({ projects, filter, search, selectedId }) {
  const counts = useMemo(() => {
    const c = { all: projects.length };
    for (const k of STATUS_ORDER) c[k] = projects.filter((p) => p.status === k).length;
    return c;
  }, [projects]);

  const visible = useMemo(() => {
    const list = filter ? projects.filter((p) => p.status === filter) : projects.slice();
    return list.sort((a, b) => {
      const ad = a.status === "delivered";
      const bd = b.status === "delivered";
      if (ad !== bd) return ad ? 1 : -1;
      if (ad) return b.deliveryDate.localeCompare(a.deliveryDate);
      return a.deliveryDate.localeCompare(b.deliveryDate);
    });
  }, [projects, filter]);

  const chip = (key, label, count, to) => {
    const on = key === (filter || "all");
    return (
      <Link
        key={key}
        to={to}
        className={`chip ${on ? "chip--on" : ""}`.trim()}
        aria-current={on ? "true" : undefined}
      >
        {label}
        <span className="chip__count">{count}</span>
      </Link>
    );
  };

  return (
    <section className="list" aria-labelledby="list-title">
      <header className="list__head">
        <h2 id="list-title" className="list__title">
          Projeler
        </h2>
        <p className="list__sub">Teslim tarihine göre sıralı</p>
      </header>

      <nav className="filters" aria-label="Duruma göre filtrele">
        {chip("all", "Tümü", counts.all, "/")}
        {STATUS_ORDER.map((k) => chip(k, STATUS[k].label, counts[k], `/?durum=${STATUS[k].slug}`))}
      </nav>

      {visible.length === 0 ? (
        <div className="empty">
          <p className="empty__title">Bu durumda proje yok</p>
          <p className="empty__body">
            “{STATUS[filter]?.label}” filtresine uyan kayıt bulunmuyor.
          </p>
          <Button to="/" variant="secondary" size="sm">
            Tüm projeleri göster
          </Button>
        </div>
      ) : (
        <ul className="rows" role="list">
          {visible.map((p) => {
            const selected = p.id === selectedId;
            return (
              <li key={p.id}>
                <Link
                  to={`/projeler/${p.id}${search}`}
                  className={`row ${selected ? "row--on" : ""}`.trim()}
                  aria-current={selected ? "page" : undefined}
                >
                  <Deadline project={p} size="sm" />
                  <div className="row__body">
                    <div className="row__top">
                      <span className="row__title">{p.title}</span>
                    </div>
                    <div className="row__meta">
                      <span className="row__client">{p.client}</span>
                      <span className="row__id">{p.id}</span>
                    </div>
                    <div className="row__status">
                      <StatusBadge status={p.status} size="sm" />
                    </div>
                  </div>
                  <span className="row__chev" aria-hidden="true">
                    ›
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

/* ---------- Placeholder for the wide pane when nothing is selected ---------- */

export function IdlePane() {
  return (
    <div className="idle" aria-live="polite">
      <p className="idle__title">Bir proje seçin</p>
      <p className="idle__body">Detaylar ve teslimat düzenlemesi burada açılır.</p>
    </div>
  );
}

/* ---------- Detail ---------- */

export function DetailPane({ project, search, saved }) {
  const backTo = `/${search}`;
  return (
    <article className="detail" aria-labelledby="detail-title">
      <div className="pane__nav">
        <Link to={backTo} className="backlink">
          <span aria-hidden="true">‹</span> Projeler
        </Link>
      </div>

      <header className="detail__head">
        <div className="detail__ident">
          <span className="ident__id">{project.id}</span>
          <StatusBadge status={project.status} />
        </div>
        <h2 id="detail-title" className="detail__title">
          {project.title}
        </h2>
        <p className="detail__client">{project.client}</p>
      </header>

      {saved && (
        <Notice tone="success" role="status">
          <strong>Teslimat kaydedildi.</strong> Değişiklik bu oturumda geçerli; sayfa yenilenince örnek veri
          geri gelir.
        </Notice>
      )}

      <div className="detail__lead">
        <Deadline project={project} size="lg" />
        <div className="detail__lead-text">
          <span className="detail__lead-label">Teslim tarihi</span>
          <span className="detail__lead-date">{fmtLong(project.deliveryDate)}</span>
          <span className="detail__lead-weekday">{fmtWeekday(project.deliveryDate)}</span>
        </div>
      </div>

      <dl className="metas">
        <Meta term="Çekim tarihi">{fmtLong(project.shootDate)}</Meta>
        <Meta term="Çekimden teslime">{turnaround(project)}</Meta>
        <Meta term="Teslimat notu" wide>
          {project.note ? <p className="note">{project.note}</p> : <span className="muted">Not yok</span>}
        </Meta>
      </dl>

      <div className="actions">
        <Button to={`/projeler/${project.id}/duzenle${search}`} variant="primary">
          Teslimatı düzenle
        </Button>
      </div>
    </article>
  );
}

/* ---------- Edit ---------- */

export function EditPane({ project, search, onSave }) {
  const { navigate } = useRouter();
  const detailTo = `/projeler/${project.id}${search}`;

  const [date, setDate] = useState(project.deliveryDate);
  const [note, setNote] = useState(project.note);
  const [errors, setErrors] = useState({});
  const dateRef = useRef(null);
  const noteRef = useRef(null);

  // A different record must not keep the previous draft.
  useEffect(() => {
    setDate(project.deliveryDate);
    setNote(project.note);
    setErrors({});
  }, [project.id]);

  const validate = () => {
    const e = {};
    if (!date) e.date = "Teslim tarihi gerekli.";
    else if (!parseDay(date)) e.date = "Geçerli bir tarih girin (YYYY-AA-GG).";
    else if (date < project.shootDate)
      e.date = `Teslim tarihi çekim tarihinden (${fmtLong(project.shootDate)}) önce olamaz.`;
    if (note.length > NOTE_MAX) e.note = `Not en fazla ${NOTE_MAX} karakter olabilir.`;
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (e.date) {
      dateRef.current?.focus();
      return;
    }
    if (e.note) {
      noteRef.current?.focus();
      return;
    }
    onSave(project.id, { deliveryDate: date, note: note.trim() });
    navigate(detailTo);
  };

  const dirty = date !== project.deliveryDate || note !== project.note;

  return (
    <article className="edit" aria-labelledby="edit-title">
      <div className="pane__nav">
        <Link to={detailTo} className="backlink">
          <span aria-hidden="true">‹</span> {project.title}
        </Link>
      </div>

      <header className="edit__head">
        <div className="detail__ident">
          <span className="ident__id">{project.id}</span>
          <StatusBadge status={project.status} />
        </div>
        <h2 id="edit-title" className="edit__title">
          Teslimatı düzenle
        </h2>
        <p className="edit__sub">
          {project.title} · {project.client}
        </p>
      </header>

      <form className="form" onSubmit={submit} noValidate>
        <Field
          ref={dateRef}
          label="Teslim tarihi"
          type="date"
          name="deliveryDate"
          value={date}
          min={project.shootDate}
          onChange={(e) => setDate(e.target.value)}
          hint={`Çekim: ${fmtLong(project.shootDate)}`}
          error={errors.date}
          required
        />
        <Field
          ref={noteRef}
          as="textarea"
          label="Teslimat notu"
          name="note"
          rows={5}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          hint={`${note.length}/${NOTE_MAX}`}
          error={errors.note}
        />

        <div className="form__actions">
          <Button type="submit" variant="primary">
            Kaydet
          </Button>
          <Button to={detailTo} variant="ghost">
            Vazgeç
          </Button>
          <span className="form__state" aria-live="polite">
            {dirty ? "Kaydedilmemiş değişiklik" : "Değişiklik yok"}
          </span>
        </div>
      </form>
    </article>
  );
}

/* ---------- Unknown record / route ---------- */

export function NotFoundPane({ kind = "route", id, search = "" }) {
  return (
    <div className="notfound" role="region" aria-labelledby="nf-title">
      <span className="ident__id">{kind === "record" ? id : "404"}</span>
      <h2 id="nf-title" className="notfound__title">
        {kind === "record" ? "Bu proje bulunamadı" : "Böyle bir sayfa yok"}
      </h2>
      <p className="notfound__body">
        {kind === "record"
          ? "Bağlantı eski olabilir ya da kayıt bu örnek veride yok."
          : "Adres yanlış yazılmış olabilir."}
      </p>
      <Button to={`/${search}`} variant="secondary">
        Proje listesine dön
      </Button>
    </div>
  );
}

export { statusFromSlug };
