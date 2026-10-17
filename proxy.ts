// Guards /admin and /api/admin/*. (Next 16 renamed middleware.ts to proxy.ts.)
// Route handlers check the cookie again themselves, so this is the first lock, not the only one.
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

const OPEN = ["/admin/login", "/api/admin/login"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (OPEN.includes(pathname)) return NextResponse.next();
  if (await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
