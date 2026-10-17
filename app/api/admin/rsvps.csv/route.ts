import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { db, type RsvpRow } from "@/lib/db";

const HEADERS = [
  "Name",
  "Attending",
  "Party size",
  "Dinner",
  "Phone",
  "Street",
  "City",
  "State",
  "ZIP",
  "Song",
  "Note",
  "Replied",
  "Updated",
];

/** Quote for CSV, and defuse spreadsheet formulas (=, +, -, @) in guest-typed text. */
function cell(v: unknown) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  // proxy.ts guards this route too; checking here keeps it safe if the matcher ever changes.
  if (!(await verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return new Response("Unauthorized", { status: 401 });
  }
  const rows = await db()<RsvpRow[]>`select * from rsvps order by updated_at desc`;
  const lines = [HEADERS, ...rows.map((r) => [
    r.name,
    r.attending ? "Yes" : "No",
    r.attending ? r.party_size : "",
    r.meal,
    r.phone,
    r.address_street,
    r.address_city,
    r.address_state,
    r.address_zip,
    r.song,
    r.note,
    r.created_at.toISOString(),
    r.updated_at.toISOString(),
  ])].map((row) => row.map(cell).join(","));

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvps-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
