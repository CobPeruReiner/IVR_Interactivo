import moment from "moment";

export const normalizarFechaBackend = (fecha) => {
  if (!fecha) return "";

  const limpia = String(fecha).trim().replace(/^'+/, "");

  if (moment(limpia, "YYYY-MM-DD", true).isValid()) {
    return limpia;
  }

  const match = limpia.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (match) {
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  return limpia;
};
