import { cookies } from "next/headers";
import { site } from "@/content/site";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { guestsFromCsv, parseCsv } from "@/lib/csv";
import { db } from "@/lib/db";
import { newInviteToken } from "@/lib/guests";

/**
 * Body: the CSV file's text. Guests are matched on name (ignoring case), so importing an updated
 * spreadsheet fills in new phones/emails/party sizes instead of making duplicates. Blank cells never
 * erase what's already saved.
 */
export async function POST(req: Request) {
  if (!(await verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const text = await req.text();
  if (text.length > 2_000_000) return Response.json({ error: "That file is too big. Is it the right one?" }, { status: 413 });

  const result = guestsFromCsv(parseCsv(text), site.maxPartySize, site.names);
  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });

  // Same name twice in one file: the later row wins.
  const unique = [...new Map(result.guests.map((g) => [g.name.toLowerCase(), g])).values()];
  let added = 0;
  await db().begin(async (sql) => {
    for (const g of unique) {
      const [r] = await sql<{ inserted: boolean }[]>`
        insert into guests (invite_token, name, first_name, last_name, party_size, phone, email,
                            plus_one_allowed, plus_one, side)
        values (${newInviteToken()}, ${g.name}, ${g.first_name}, ${g.last_name}, ${g.party_size ?? 1}, ${g.phone},
                ${g.email}, ${g.plus_one_allowed ?? false}, ${g.plus_one}, ${g.side})
        on conflict ((lower(name))) do update set
          first_name = coalesce(excluded.first_name, guests.first_name),
          last_name = coalesce(excluded.last_name, guests.last_name),
          party_size = coalesce(${g.party_size}, guests.party_size),
          phone = coalesce(excluded.phone, guests.phone),
          email = coalesce(excluded.email, guests.email),
          plus_one_allowed = coalesce(${g.plus_one_allowed}, guests.plus_one_allowed),
          plus_one = coalesce(excluded.plus_one, guests.plus_one),
          side = coalesce(excluded.side, guests.side)
        returning (xmax = 0) as inserted`;
      if (r.inserted) added++;
    }
  });
  return Response.json({ added, updated: unique.length - added, skipped: result.skipped });
}
