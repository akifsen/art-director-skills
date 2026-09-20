export const STATUS_ORDER = ["shooting", "editing", "delivered"];

export const STATUS_LABELS = {
  shooting: "Çekim",
  editing: "Düzenleme",
  delivered: "Teslim edildi"
};

export function parseRoute(pathname, search) {
  const params = new URLSearchParams(search);
  const status = STATUS_ORDER.includes(params.get("status"))
    ? params.get("status")
    : "all";
  const saved = params.get("saved") === "1";
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);

  if (parts[0] === "shoots" && parts[1]) {
    const id = decodeURIComponent(parts[1]);
    if (parts[2] === "teslimat") {
      return { screen: "edit", id, status, saved: false };
    }
    return { screen: "detail", id, status, saved };
  }

  return { screen: "list", id: null, status, saved: false };
}

export function pathFor({ screen, id, status, saved = false }) {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (saved) params.set("saved", "1");
  const query = params.toString();
  const suffix = query ? `?${query}` : "";

  if (screen === "edit" && id) return `/shoots/${encodeURIComponent(id)}/teslimat${suffix}`;
  if ((screen === "detail" || screen === "edit") && id) {
    return `/shoots/${encodeURIComponent(id)}${suffix}`;
  }
  return `/${suffix}`;
}

export function filterProjects(projects, status) {
  if (!status || status === "all") return projects;
  return projects.filter((row) => row.status === status);
}

export function countByStatus(projects) {
  return STATUS_ORDER.reduce((acc, key) => {
    acc[key] = projects.filter((row) => row.status === key).length;
    return acc;
  }, {});
}

function parseIsoDate(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function formatDate(iso, style = "long") {
  const date = parseIsoDate(iso);
  if (!date) return iso || "—";
  const options =
    style === "short"
      ? { day: "numeric", month: "short" }
      : { day: "numeric", month: "long", year: "numeric" };
  return new Intl.DateTimeFormat("tr-TR", { ...options, timeZone: "UTC" }).format(date);
}

export function daysBetween(startIso, endIso) {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return null;
  return Math.round((end - start) / 86400000);
}

const NOTE_MAX = 400;

export function validateDelivery({ deliveryDate, note, shootDate }) {
  const errors = {};
  const date = parseIsoDate(deliveryDate);
  if (!deliveryDate) {
    errors.deliveryDate = "Teslimat tarihi gerekli.";
  } else if (!date) {
    errors.deliveryDate = "Geçerli bir tarih yazın.";
  } else {
    const shoot = parseIsoDate(shootDate);
    if (shoot && date < shoot) {
      errors.deliveryDate = "Teslimat, çekim gününden önce olamaz.";
    }
  }

  if (typeof note === "string" && note.length > NOTE_MAX) {
    errors.note = `Not en fazla ${NOTE_MAX} karakter olabilir.`;
  }

  return errors;
}

export function applyDelivery(projects, id, { deliveryDate, note }) {
  const current = projects.find((row) => row.id === id);
  if (!current) return { ok: false, errors: { form: "Bu çekim bulunamadı." } };

  const errors = validateDelivery({
    deliveryDate,
    note,
    shootDate: current.shootDate
  });
  if (Object.keys(errors).length) return { ok: false, errors };

  const next = projects.map((row) =>
    row.id === id
      ? { ...row, deliveryDate, note: note.trim() }
      : row
  );
  return { ok: true, projects: next };
}
