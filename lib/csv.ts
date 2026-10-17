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

export type ImportedGuest = {
  name: string;
  first_name: string | null;
  last_name: string | null;
  party_size: number | null;
  phone: string | null;
  email: string | null;
  /** null = the cell was blank, so leave whatever is saved alone. */
  plus_one_allowed: boolean | null;
  plus_one: boolean | null;
  side: string | null;
};

const COLUMNS = {
  name: ["name", "names", "guest", "guests", "guestname", "fullname", "household", "householdname", "partyname", "invitee", "addressedto"],
  first: ["first", "firstname", "givenname"],
  last: ["last", "lastname", "surname", "familyname"],
  phone: ["phone", "phonenumber", "mobile", "mobilephone", "cell", "cellphone", "tel", "telephone", "number"],
  email: ["email", "emailaddress", "mail"],
  party: ["party", "partysize", "size", "count", "headcount", "people", "seats", "numberofguests", "guestcount", "invited", "numinvited", "total"],
  side: ["side", "whosside", "whoseside", "guestof", "whoseguest", "invitedby"],
} as const;

/** Party-size headers come in many shapes ("# of guests", "Seats reserved", "Party count"). */
const PARTY_HINTS = ["party", "size", "count", "seat", "ofguests", "numguests", "numberguests", "attendees", "people"];
/** "Plus-one allowed", "Can bring +1", "Right to invite a plus one"… */
const PLUS_ALLOWED = /allow|can|right|eligible|may|permit|offer|invite|get/;
/** "Bringing plus-one", "Plus one confirmed", "+1 coming"… */
const PLUS_BRINGING = /bring|confirm|coming|attend|rsvp/;

// "+1" and "plus 1" both become "plusone" so the hints above can find them.
const norm = (h: string) =>
  h.toLowerCase().replace(/\+\s*1/g, "plusone").replace(/plus\s*1/g, "plusone").replace(/[^a-z]/g, "");

const YES = /^(y|yes|true|1|x|✓|✔|allowed|ok|sure|confirmed|bringing)$/i;
const NO = /^(n|no|false|0|none|not|nope|-|not allowed|not bringing)$/i;
const yesNo = (v: string) => (YES.test(v) ? true : NO.test(v) ? false : null);

/** "Evan's side", "evan", "E" → Evan; "both"/"mutual" → Both; anything else is kept as typed. */
export function normalizeSide(v: string, first: string, second: string) {
  const t = v.trim();
  if (!t) return null;
  const l = t.toLowerCase();
  if (/both|mutual|shared|either/.test(l)) return "Both";
  if (l.includes(first.toLowerCase()) || l === first[0].toLowerCase()) return first;
  if (l.includes(second.toLowerCase()) || l === second[0].toLowerCase()) return second;
  return t.slice(0, 40);
}

/**
 * Turns parsed CSV rows into guests. The first row must be a header; column names are matched loosely
 * ("Phone Number", "phone", "Cell" all work). A row needs a name, or a first/last name pair.
 */
export function guestsFromCsv(rows: string[][], maxParty: number, couple: { first: string; second: string }) {
  if (!rows.length) return { error: "That file is empty." } as const;
  const header = rows[0].map(norm);
  const find = (keys: readonly string[]) => header.findIndex((h) => keys.includes(h));
  const plusCols = header.map((h, i) => (h.includes("plusone") || h.includes("guestallowed") ? i : -1)).filter((i) => i >= 0);
  // "Can bring" is about permission, so permission words rule a column out of "bringing".
  const bringing = plusCols.find((i) => PLUS_BRINGING.test(header[i]) && !PLUS_ALLOWED.test(header[i])) ?? -1;
  // A bare "Plus one" column (no other hint) means "allowed one".
  const allowed =
    plusCols.find((i) => i !== bringing && PLUS_ALLOWED.test(header[i])) ?? plusCols.find((i) => i !== bringing) ?? -1;
  const col = {
    name: find(COLUMNS.name),
    first: find(COLUMNS.first),
    last: find(COLUMNS.last),
    phone: find(COLUMNS.phone),
    email: find(COLUMNS.email),
    party: find(COLUMNS.party),
    side: find(COLUMNS.side),
    bringing,
    allowed,
  };
  if (col.side < 0) col.side = header.findIndex((h) => h.includes("side"));
  if (col.party < 0) {
    col.party = header.findIndex((h, i) => i !== col.name && !plusCols.includes(i) && PARTY_HINTS.some((k) => h.includes(k)));
  }
  if (col.name < 0 && col.first < 0) {
    return { error: 'The first row needs column names, including "First name" and "Last name" (or one called "Name").' } as const;
  }

  const guests: ImportedGuest[] = [];
  const skipped: number[] = [];
  rows.slice(1).forEach((r, i) => {
    const get = (c: number) => (c >= 0 ? (r[c] ?? "").trim() : "");
    const first = get(col.first).slice(0, 100), last = get(col.last).slice(0, 100);
    const name = (get(col.name) || [first, last].filter(Boolean).join(" ")).slice(0, 200);
    if (!name) {
      skipped.push(i + 2);
      return;
    }
    const n = parseInt(get(col.party), 10);
    const email = get(col.email).toLowerCase();
    const allowed = yesNo(get(col.allowed));
    guests.push({
      name,
      first_name: first || null,
      last_name: last || null,
      // An explicit party size wins; otherwise a plus-one means two seats.
      party_size: Number.isFinite(n) && n > 0 ? Math.min(n, maxParty) : allowed == null ? null : allowed ? 2 : 1,
      phone: get(col.phone).slice(0, 40) || null,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email.slice(0, 200) : null,
      plus_one_allowed: allowed,
      plus_one: yesNo(get(col.bringing)),
      side: normalizeSide(get(col.side), couple.first, couple.second),
    });
  });
  return { guests, skipped } as const;
}
