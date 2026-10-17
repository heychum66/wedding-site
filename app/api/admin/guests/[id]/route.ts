import { cookies } from "next/headers";
import { site } from "@/content/site";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { normalizeSide } from "@/lib/csv";
import { db } from "@/lib/db";
import { guestInput, isDuplicateName } from "@/lib/guests";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Removes the invitation. A reply they already sent stays on the list, just no longer linked. */
export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/guests/[id]">) {
  if (!(await verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!UUID.test(id)) return Response.json({ error: "Not found" }, { status: 404 });
  const rows = await db()`delete from guests where id = ${id} returning id`;
  if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}

/** Edit one guest's details. Their invite link stays the same. */
export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/guests/[id]">) {
  if (!(await verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!UUID.test(id)) return Response.json({ error: "Not found" }, { status: 404 });
  const parsed = guestInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Check the form." }, { status: 400 });
  const g = parsed.data;
  const name = [g.first_name, g.last_name].filter(Boolean).join(" ");
  try {
    // Seats only change when the plus-one setting does, so a bigger party set by import is kept.
    const rows = await db()`
      update guests set
        name = ${name}, first_name = ${g.first_name}, last_name = ${g.last_name || null},
        phone = ${g.phone || null}, email = ${g.email || null},
        party_size = case when plus_one_allowed = ${g.plus_one_allowed} then party_size
                          else ${g.plus_one_allowed ? 2 : 1} end,
        plus_one_allowed = ${g.plus_one_allowed},
        plus_one = ${g.plus_one_allowed ? g.plus_one : null},
        side = ${normalizeSide(g.side, site.names.first, site.names.second)}
      where id = ${id}
      returning id`;
    if (!rows.length) return Response.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    if (isDuplicateName(err)) return Response.json({ error: `${name} is already on the list.` }, { status: 409 });
    throw err;
  }
  return Response.json({ ok: true });
}
