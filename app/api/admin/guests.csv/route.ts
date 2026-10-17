import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { csvCell } from "@/lib/csv";
import { db, type GuestRow } from "@/lib/db";
import { inviteUrl, siteUrl } from "@/lib/guests";

type Row = GuestRow & { attending: boolean | null; replied_party: number | null };

/** The invite list with everyone's personal link, for mail merges or texting from another app. */
export async function GET(req: Request) {
  if (!(await verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return new Response("Unauthorized", { status: 401 });
  }
  const rows = await db()<Row[]>`
    select g.*, r.attending, r.party_size as replied_party
    from guests g left join rsvps r on r.guest_id = g.id
    order by g.name`;
  const base = siteUrl(req);
  const lines = [
    ["Name", "Party size", "Phone", "Email", "Invite link", "Reply", "Coming", "Texted"],
    ...rows.map((g) => [
      g.name,
      g.party_size,
      g.phone,
      g.email,
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
