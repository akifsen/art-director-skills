/** Status vocabulary, date helpers and the session store for the board. */

export const STATUS = {
  shooting: { label: "Çekimde", tone: "shooting", order: 0 },
  editing: { label: "Düzenlemede", tone: "editing", order: 1 },
  delivered: { label: "Teslim edildi", tone: "delivered", order: 2 }
};

export const FILTERS = [
  { key: "all", label: "Tümü" },
  { key: "shooting", label: STATUS.shooting.label },
  { key: "editing", label: STATUS.editing.label },
  { key: "delivered", label: STATUS.delivered.label }
];

export function isKnownFilter(key) {
  return FILTERS.some((f) => f.key === key);
}

/* ---------- dates ---------- */

const longDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const shortDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" });
const weekday = new Intl.DateTimeFormat("tr-TR", { weekday: "long" });

export function parseDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

export function formatLong(iso) {
  const d = parseDate(iso);
  return d ? longDate.format(d) : "—";
}

export function formatShort(iso) {
  const d = parseDate(iso);
  return d ? shortDate.format(d) : "—";
}

export function formatWeekday(iso) {
  const d = parseDate(iso);
  return d ? weekday.format(d) : "";
}

/** Whole days from today (local midnight) to the given date. */
export function daysUntil(iso, now = new Date()) {
  const d = parseDate(iso);
  if (!d) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((d - today) / 86400000);
}

/** Human countdown for an open delivery; null for delivered records. */
export function deliveryCue(project, now = new Date()) {
  if (project.status === "delivered") return null;
  const days = daysUntil(project.deliveryDate, now);
  if (days === null) return null;
  if (days < 0) return { text: `${Math.abs(days)} gün gecikti`, tone: "late" };
  if (days === 0) return { text: "Bugün teslim", tone: "soon" };
  if (days === 1) return { text: "Yarın teslim", tone: "soon" };
  if (days <= 5) return { text: `${days} gün kaldı`, tone: "soon" };
  return { text: `${days} gün kaldı`, tone: "open" };
}

/* ---------- list logic ---------- */

export function filterProjects(list, filter) {
  return filter === "all" ? list : list.filter((p) => p.status === filter);
}

/** Open work first, soonest delivery first; delivered records last. */
export function sortProjects(list) {
  return [...list].sort((a, b) => {
    const aDone = a.status === "delivered" ? 1 : 0;
    const bDone = b.status === "delivered" ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    return a.deliveryDate.localeCompare(b.deliveryDate);
  });
}

export function countByStatus(list) {
  const counts = { all: list.length };
  for (const p of list) counts[p.status] = (counts[p.status] || 0) + 1;
  return counts;
}

/* ---------- validation ---------- */

export const NOTE_MAX = 400;

export function validateDelivery(project, values) {
  const errors = {};
  const date = parseDate(values.deliveryDate);
  if (!values.deliveryDate) errors.deliveryDate = "Teslimat tarihi gerekli.";
  else if (!date) errors.deliveryDate = "Geçerli bir tarih girin.";
  else if (values.deliveryDate < project.shootDate)
    errors.deliveryDate = `Teslimat tarihi çekim tarihinden (${formatLong(project.shootDate)}) önce olamaz.`;
  if (values.note.length > NOTE_MAX) errors.note = `Not en fazla ${NOTE_MAX} karakter olabilir.`;
  return errors;
}

/* ---------- session store (in-memory demo state) ---------- */

export function boardReducer(state, action) {
  switch (action.type) {
    case "saveDelivery": {
      const { id, deliveryDate, note } = action;
      let changed = false;
      const projects = state.projects.map((p) => {
        if (p.id !== id) return p;
        if (p.deliveryDate === deliveryDate && p.note === note) return p;
        changed = true;
        return { ...p, deliveryDate, note };
      });
      if (!changed) return state;
      return { projects, lastSaved: { id, at: Date.now() } };
    }
    case "clearSaved":
      return state.lastSaved ? { ...state, lastSaved: null } : state;
    default:
      return state;
  }
}
