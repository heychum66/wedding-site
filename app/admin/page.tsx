import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { db, type RsvpRow } from "@/lib/db";
import AdminDashboard, { type AdminRow } from "@/components/AdminDashboard";

export const metadata: Metadata = { title: "Guest list · Evan & Remy", robots: { index: false, follow: false } };

async function GuestList() {
  // proxy.ts already guards /admin; checking again keeps the page safe on its own.
  if (!(await verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) redirect("/admin/login");
  const rows = await db()<RsvpRow[]>`select * from rsvps order by updated_at desc`;
  const data: AdminRow[] = rows.map((r) => ({
    ...r,
    created_at: r.created_at.toISOString(),
    updated_at: r.updated_at.toISOString(),
  }));
  return <AdminDashboard rows={data} meals={site.meals} />;
}

export default function AdminPage() {
  return (
    <main className="s rsvp-sec admin">
      <div className="wrap">
        <Suspense fallback={<p style={{ color: "var(--ink-soft)" }}>Loading the guest list…</p>}>
          <GuestList />
        </Suspense>
      </div>
    </main>
  );
}
