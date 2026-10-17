import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, checkAdminPassword, createAdminToken } from "@/lib/admin-auth";
import { clientIp } from "@/lib/rsvp";

// Small brake on password guessing, per server instance.
const fails = new Map<string, { n: number; until: number }>();

export async function POST(req: Request) {
  const ip = clientIp(req);
  const f = fails.get(ip);
  if (f && f.n >= 8 && f.until > Date.now()) {
    return Response.json({ error: "Too many tries. Wait a few minutes." }, { status: 429 });
  }
  let password = "";
  try {
    password = String((await req.json()).password ?? "");
  } catch {}

  if (!(await checkAdminPassword(password))) {
    fails.set(ip, { n: (f && f.until > Date.now() ? f.n : 0) + 1, until: Date.now() + 10 * 60_000 });
    return Response.json({ error: "That's not it." }, { status: 401 });
  }
  fails.delete(ip);
  (await cookies()).set(ADMIN_COOKIE, await createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
  return Response.json({ ok: true });
}
