import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { db, type GuestRow, type RsvpRow } from "@/lib/db";
import AdminDashboard, { type AdminRow } from "@/components/AdminDashboard";
import AdminGuests, { type GuestListRow } from "@/components/AdminGuests";

export const metadata: Metadata = { title: "Guest list · Evan & Remy", robots: { index: false, follow: false } };

async function GuestList() {
  // proxy.ts already guards /admin; checking again keeps the page safe on its own.
  if (!(await verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))) redirect("/admin/login");
  const sql = db();
  const [rows, guests] = await Promise.all([
    sql<RsvpRow[]>`select * from rsvps order by updated_at desc`,
    sql<(GuestRow & { attending: boolean | null; replied_party: number | null; plus_one_name: string | null })[]>`
      select g.*, r.attending, r.party_size as replied_party, r.plus_one_name
      from guests g left join rsvps r on r.guest_id = g.id
      order by g.name`,
  ]);
  const data: AdminRow[] = rows.map((r) => ({
    ...r,
    created_at: r.created_at.toISOString(),
    updated_at: r.updated_at.toISOString(),
  }));
  const invites: GuestListRow[] = guests.map((g) => ({
    id: g.id,
    invite_token: g.invite_token,
    name: g.name,
    first_name: g.first_name,
    last_name: g.last_name,
    party_size: g.party_size,
    phone: g.phone,
    email: g.email,
    plus_one_allowed: g.plus_one_allowed,
    plus_one: g.plus_one,
    plus_one_name: g.plus_one_name,
    side: g.side,
    texted_at: g.texted_at?.toISOString() ?? null,
    attending: g.attending,
    replied_party: g.replied_party,
  }));
  return (
    <>
      <AdminDashboard rows={data} meals={site.meals} />
      <AdminGuests guests={invites} inviteText={site.inviteText} couple={site.names} />
    </>
  );
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
