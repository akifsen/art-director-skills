/** Status vocabulary: data keys stay English, UI speaks Turkish. */
export const STATUS = {
  shooting: { label: "Çekim", slug: "cekim", tone: "shooting" },
  editing: { label: "Kurgu", slug: "kurgu", tone: "editing" },
  delivered: { label: "Teslim edildi", slug: "teslim", tone: "delivered" }
};

export const STATUS_ORDER = ["shooting", "editing", "delivered"];

export function statusFromSlug(slug) {
  return STATUS_ORDER.find((k) => STATUS[k].slug === slug) || null;
}

const DAY = 86400000;

/** Parse "YYYY-MM-DD" as a local calendar day (no timezone drift). */
export function parseDay(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

export function today() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

/** Whole days from today to the given day; negative = in the past. */
export function daysUntil(iso) {
  const d = parseDay(iso);
  if (!d) return null;
  return Math.round((d - today()) / DAY);
}

const longFmt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const shortFmt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" });
const weekdayFmt = new Intl.DateTimeFormat("tr-TR", { weekday: "long" });

export function fmtLong(iso) {
  const d = parseDay(iso);
  return d ? longFmt.format(d) : "—";
}
export function fmtShort(iso) {
  const d = parseDay(iso);
  return d ? shortFmt.format(d) : "—";
}
export function fmtWeekday(iso) {
  const d = parseDay(iso);
  return d ? weekdayFmt.format(d) : "";
}

/**
 * The row's lead figure: how the delivery date relates to today.
 * Returns { figure, unit, tone } for the countdown block.
 */
export function deadline(project) {
  const n = daysUntil(project.deliveryDate);
  if (project.status === "delivered") {
    if (n === null) return { figure: "—", unit: "teslim edildi", tone: "done" };
    if (n === 0) return { figure: "Bugün", unit: "teslim edildi", tone: "done" };
    if (n > 0) return { figure: String(n), unit: "gün sonra", tone: "done" };
    return { figure: String(-n), unit: "gün önce", tone: "done" };
  }
  if (n === null) return { figure: "—", unit: "tarih yok", tone: "neutral" };
  if (n === 0) return { figure: "Bugün", unit: "teslim", tone: "soon" };
  if (n < 0) return { figure: String(-n), unit: -n === 1 ? "gün gecikti" : "gün gecikti", tone: "late" };
  return { figure: String(n), unit: "gün kaldı", tone: n <= 3 ? "soon" : "neutral" };
}
