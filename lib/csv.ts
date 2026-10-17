// Small RFC 4180 CSV reader, plus the column matching for the guest-list import.

/** Quote for CSV, and defuse spreadsheet formulas (=, +, -, @) in guest-typed text. */
export function csvCell(v: unknown) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Splits CSV text into rows of cells. Handles quoted cells, "" escapes, and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const s = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"' && s[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim()));
}

export type ImportedGuest = { name: string; party_size: number | null; phone: string | null; email: string | null };

const COLUMNS = {
  name: ["name", "names", "guest", "guests", "guestname", "fullname", "household", "householdname", "partyname", "invitee", "addressedto"],
  first: ["first", "firstname", "givenname"],
  last: ["last", "lastname", "surname", "familyname"],
  phone: ["phone", "phonenumber", "mobile", "mobilephone", "cell", "cellphone", "tel", "telephone", "number"],
  email: ["email", "emailaddress", "mail"],
  party: ["party", "partysize", "size", "count", "headcount", "people", "seats", "numberofguests", "guestcount", "invited", "numinvited", "total"],
} as const;

/** Party-size headers come in many shapes ("# of guests", "Seats reserved", "Party count"). */
const PARTY_HINTS = ["party", "size", "count", "seat", "ofguests", "numguests", "numberguests", "attendees", "people"];

const norm = (h: string) => h.toLowerCase().replace(/[^a-z]/g, "");

/**
 * Turns parsed CSV rows into guests. The first row must be a header; column names are matched loosely
 * ("Phone Number", "phone", "Cell" all work). A row needs a name, or a first/last name pair.
 */
export function guestsFromCsv(rows: string[][], maxParty: number) {
  if (!rows.length) return { error: "That file is empty." } as const;
  const header = rows[0].map(norm);
  const find = (keys: readonly string[]) => header.findIndex((h) => keys.includes(h));
  const col = {
    name: find(COLUMNS.name),
    first: find(COLUMNS.first),
    last: find(COLUMNS.last),
    phone: find(COLUMNS.phone),
    email: find(COLUMNS.email),
    party: find(COLUMNS.party),
  };
  if (col.party < 0) col.party = header.findIndex((h) => h !== header[col.name] && PARTY_HINTS.some((k) => h.includes(k)));
  if (col.name < 0 && col.first < 0) {
    return { error: 'The first row needs column names, including one called "Name" (or "First name" and "Last name").' } as const;
  }

  const guests: ImportedGuest[] = [];
  const skipped: number[] = [];
  rows.slice(1).forEach((r, i) => {
    const get = (c: number) => (c >= 0 ? (r[c] ?? "").trim() : "");
    const name = (get(col.name) || [get(col.first), get(col.last)].filter(Boolean).join(" ")).slice(0, 200);
    if (!name) {
      skipped.push(i + 2);
      return;
    }
    const n = parseInt(get(col.party), 10);
    const email = get(col.email).toLowerCase();
    guests.push({
      name,
      party_size: Number.isFinite(n) && n > 0 ? Math.min(n, maxParty) : null,
      phone: get(col.phone).slice(0, 40) || null,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email.slice(0, 200) : null,
    });
  });
  return { guests, skipped } as const;
}
