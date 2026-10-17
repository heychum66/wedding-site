import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { csvCell } from "@/lib/csv";
import { db, type GuestRow } from "@/lib/db";
import { inviteUrl, siteUrl } from "@/lib/guests";

type Row = GuestRow & { attending: boolean | null; replied_party: number | null; plus_one_name: string | null };

const yn = (v: boolean | null) => (v == null ? "" : v ? "Yes" : "No");

/** The invite list with everyone's personal link, for mail merges or texting from another app. */
export async function GET(req: Request) {
  if (!(await verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return new Response("Unauthorized", { status: 401 });
  }
  const rows = await db()<Row[]>`
    select g.*, r.attending, r.party_size as replied_party, r.plus_one_name
    from guests g left join rsvps r on r.guest_id = g.id
    order by g.name`;
  const base = siteUrl(req);
  const lines = [
    [
      "First name", "Last name", "Phone", "Email", "Plus-one allowed", "Bringing plus-one", "Plus-one name", "Side",
      "Seats", "Invite link", "Reply", "Coming", "Texted",
    ],
    ...rows.map((g) => [
      g.first_name ?? (g.last_name ? "" : g.name),
      g.last_name,
      g.phone,
      g.email,
      yn(g.plus_one_allowed),
      yn(g.plus_one),
      g.plus_one_name,
      g.side,
      g.party_size,
      inviteUrl(base, g.invite_token),
      g.attending == null ? "Not yet" : g.attending ? "Yes" : "No",
      g.attending ? g.replied_party : "",
      g.texted_at?.toISOString(),
    ]),
  ].map((row) => row.map(csvCell).join(","));

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="guests-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
