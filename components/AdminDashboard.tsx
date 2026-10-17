"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type AdminRow = {
  id: string;
  name: string;
  attending: boolean;
  party_size: number;
  meal: string | null;
  song: string | null;
  note: string | null;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  created_at: string;
  updated_at: string;
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const dash = (v: string | null | undefined) => v || "–";

export default function AdminDashboard({ rows: initial, meals }: { rows: AdminRow[]; meals: string[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [desc, setDesc] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [error, setError] = useState("");

  const yes = rows.filter((r) => r.attending);
  const coming = yes.reduce((a, r) => a + (r.party_size || 0), 0);
  const declines = rows.length - yes.length;
  // The form asks for one dinner per party, so a party's choice counts once per person in it.
  const mealCounts = new Map<string, number>(meals.map((x) => [x, 0]));
  for (const r of yes) if (r.meal) mealCounts.set(r.meal, (mealCounts.get(r.meal) ?? 0) + (r.party_size || 1));

  const sorted = useMemo(
    () => [...rows].sort((a, b) => (desc ? b.updated_at.localeCompare(a.updated_at) : a.updated_at.localeCompare(b.updated_at))),
    [rows, desc],
  );

  async function remove(id: string) {
    setError("");
    const res = await fetch(`/api/admin/rsvps/${id}`, { method: "DELETE" });
    setConfirming(null);
    if (res.ok || res.status === 404) setRows((rs) => rs.filter((r) => r.id !== id));
    else setError("Couldn't delete that reply. Try again.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="owner">
      <div className="admin-bar">
        <span className="eyebrow" style={{ color: "var(--gold)" }}>Only you two can see this</span>
        <div className="admin-acts">
          <a className="btn" href="/api/admin/rsvps.csv">Download CSV</a>
          <Link className="btn ghost" href="/">View site</Link>
          <button className="btn ghost" type="button" onClick={logout}>Log out</button>
        </div>
      </div>
      <h3>Guest list so far</h3>
      <div className="totals">
        <div>{coming}<small>Coming</small></div>
        <div>{declines}<small>Can&apos;t make it</small></div>
        <div>{rows.length}<small>Replies</small></div>
      </div>
      <div className="meals" aria-label="Meal counts">
        {[...mealCounts].map(([m, n]) => (
          <span key={m}><b>{n}</b>{m}</span>
        ))}
      </div>
      <p className="status err" role="status">{error}</p>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Reply</th>
              <th>Party</th>
              <th>Dinner</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Song</th>
              <th>Note</th>
              <th aria-sort={desc ? "descending" : "ascending"}>
                <button className="sortbtn" type="button" onClick={() => setDesc((d) => !d)}>
                  Updated {desc ? "↓" : "↑"}
                </button>
              </th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {!sorted.length && (
              <tr><td colSpan={10} style={{ opacity: 0.7 }}>No replies yet. Share the link and they&apos;ll show up here.</td></tr>
            )}
            {sorted.map((r) => (
              <tr key={r.id}>
                <td><b>{r.name}</b></td>
                <td><span className={"pill " + (r.attending ? "y" : "n")}>{r.attending ? "Yes" : "No"}</span></td>
                <td>{r.attending ? r.party_size : "–"}</td>
                <td>{dash(r.meal)}</td>
                <td>{r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : "–"}</td>
                <td>
                  {r.address_street || r.address_city ? (
                    <>
                      {r.address_street}
                      <small>{[r.address_city, [r.address_state, r.address_zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")}</small>
                    </>
                  ) : "–"}
                </td>
                <td>{dash(r.song)}</td>
                <td>{dash(r.note)}</td>
                <td style={{ whiteSpace: "nowrap" }}>{when(r.updated_at)}</td>
                <td>
                  {confirming === r.id ? (
                    <span className="confirm">
                      <button className="del sure" type="button" onClick={() => remove(r.id)}>Yes, delete</button>
                      <button className="del" type="button" onClick={() => setConfirming(null)}>Keep</button>
                    </span>
                  ) : (
                    <button className="del" type="button" onClick={() => setConfirming(r.id)} aria-label={`Delete reply from ${r.name}`}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
