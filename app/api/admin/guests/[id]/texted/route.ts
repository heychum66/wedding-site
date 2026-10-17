import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { db } from "@/lib/db";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Records that the invite text was opened for sending, so the list shows who's been reached. */
export async function POST(_req: Request, ctx: RouteContext<"/api/admin/guests/[id]/texted">) {
  if (!(await verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!UUID.test(id)) return Response.json({ error: "Not found" }, { status: 404 });
  const [row] = await db()<{ texted_at: Date }[]>`update guests set texted_at = now() where id = ${id} returning texted_at`;
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ texted_at: row.texted_at.toISOString() });
}
