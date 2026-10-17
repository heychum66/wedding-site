import { cookies } from "next/headers";
import { site } from "@/content/site";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { normalizeSide } from "@/lib/csv";
import { db } from "@/lib/db";
import { guestInput, isDuplicateName, newInviteToken } from "@/lib/guests";

/** Add one guest by hand (the form at /admin), same fields as the CSV import. */
export async function POST(req: Request) {
  if (!(await verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = guestInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Check the form." }, { status: 400 });
  const g = parsed.data;
  const name = [g.first_name, g.last_name].filter(Boolean).join(" ");
  try {
    await db()`
      insert into guests (invite_token, name, first_name, last_name, party_size, phone, email,
                          plus_one_allowed, plus_one, side)
      values (${newInviteToken()}, ${name}, ${g.first_name}, ${g.last_name || null}, ${g.plus_one_allowed ? 2 : 1},
              ${g.phone || null}, ${g.email || null}, ${g.plus_one_allowed}, ${g.plus_one_allowed ? g.plus_one : null},
              ${normalizeSide(g.side, site.names.first, site.names.second)})`;
  } catch (err) {
    if (isDuplicateName(err)) return Response.json({ error: `${name} is already on the list.` }, { status: 409 });
    throw err;
  }
  return Response.json({ ok: true }, { status: 201 });
}
