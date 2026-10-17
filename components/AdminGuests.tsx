"use client";

import { useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export type GuestListRow = {
  id: string;
  invite_token: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  party_size: number;
  phone: string | null;
  email: string | null;
  plus_one_allowed: boolean;
  plus_one: boolean | null;
  plus_one_name: string | null;
  side: string | null;
  texted_at: string | null;
  attending: boolean | null;
  replied_party: number | null;
};

/** A blank spreadsheet with the columns the import understands. */
const TEMPLATE = "data:text/csv;charset=utf-8," + encodeURIComponent(
  "First name,Last name,Phone,Email,Plus-one allowed,Bringing plus-one,Side\r\n",
);

type Draft = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  plus_one_allowed: boolean;
  plus_one: boolean | null;
  side: string;
};
const blankDraft: Draft = { first_name: "", last_name: "", phone: "", email: "", plus_one_allowed: false, plus_one: null, side: "" };

type Filter = "all" | "unsent" | "waiting" | "replied";

const noSubscribe = () => () => {};
const browserOrigin = () => process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

const when = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** Digits for the sms: link. Ten-digit numbers are assumed to be US. */
function smsNumber(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (/^\d{10}$/.test(digits)) return "+1" + digits;
  if (/^1\d{10}$/.test(digits)) return "+" + digits;
  return digits;
}

export default function AdminGuests({
  guests,
  inviteText,
  couple,
}: {
  guests: GuestListRow[];
  inviteText: string;
  couple: { first: string; second: string };
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState(guests);
  const [prev, setPrev] = useState(guests);
  const [filter, setFilter] = useState<Filter>("all");
  const [side, setSide] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState({ text: "", err: false });
  const [busy, setBusy] = useState(false);
  // "new", a guest id, or null when the form is closed.
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const formRef = useRef<HTMLFormElement>(null);

  // Fresh server data after an import replaces local edits.
  if (guests !== prev) {
    setPrev(guests);
    setRows(guests);
  }

  // Links use the address you're on (the server render has none, so they fill in after load).
  const origin = useSyncExternalStore(noSubscribe, browserOrigin, () => "");
  const link = (g: GuestListRow) => `${origin}/rsvp?i=${g.invite_token}`;
  const message = (g: GuestListRow) =>
    inviteText.replaceAll("{first}", g.first_name || g.name).replaceAll("{name}", g.name).replaceAll("{link}", link(g));

  const replied = rows.filter((g) => g.attending != null);
  const seats = rows.reduce((a, g) => a + g.party_size, 0);
  const sides = [...new Set(rows.map((g) => g.side).filter((x): x is string => Boolean(x)))].sort();
  const bringing = rows.filter((g) => g.plus_one).length;
  const shown = rows.filter((g) => !side || g.side === side).filter((g) =>
    filter === "unsent" ? !g.texted_at : filter === "waiting" ? g.attending == null : filter === "replied" ? g.attending != null : true,
  );

  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setStatus({ text: `Importing ${file.name}…`, err: false });
    try {
      const res = await fetch("/api/admin/guests/import", { method: "POST", body: await file.text() });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ text: d.error ?? "That import didn't work. Try again.", err: true });
        return;
      }
      const skipped = d.skipped?.length ? ` Skipped row${d.skipped.length > 1 ? "s" : ""} ${d.skipped.join(", ")} (no name).` : "";
      setStatus({ text: `Added ${d.added}, updated ${d.updated}.${skipped}`, err: false });
      router.refresh();
    } catch {
      setStatus({ text: "That import didn't work. Check your connection and try again.", err: true });
    } finally {
      setBusy(false);
    }
  }

  function openForm(g?: GuestListRow) {
    setStatus({ text: "", err: false });
    setEditing(g ? g.id : "new");
    setDraft(
      g
        ? {
            // Guests imported with a single Name column have no first/last split yet.
            first_name: g.first_name ?? (g.last_name ? "" : g.name),
            last_name: g.last_name ?? "",
            phone: g.phone ?? "",
            email: g.email ?? "",
            plus_one_allowed: g.plus_one_allowed,
            plus_one: g.plus_one,
            side: g.side ?? "",
          }
        : blankDraft,
    );
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft.first_name.trim()) {
      setStatus({ text: "Add a first name.", err: true });
      return;
    }
    setBusy(true);
    try {
      const isNew = editing === "new";
      const res = await fetch(isNew ? "/api/admin/guests" : `/api/admin/guests/${editing}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ text: d.error ?? "That didn't save. Try again.", err: true });
        return;
      }
      const who = [draft.first_name, draft.last_name].map((x) => x.trim()).filter(Boolean).join(" ");
      setStatus({ text: isNew ? `Added ${who}.` : `Saved ${who}.`, err: false });
      // Adding keeps the form open (blank) for the next person; editing closes it.
      if (isNew) setDraft(blankDraft);
      else setEditing(null);
      router.refresh();
    } catch {
      setStatus({ text: "That didn't save. Check your connection and try again.", err: true });
    } finally {
      setBusy(false);
    }
  }

  const field = (k: "first_name" | "last_name" | "phone" | "email") => ({
    value: draft[k],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setDraft((d) => ({ ...d, [k]: e.target.value })),
  });

  function markTexted(g: GuestListRow) {
    const now = new Date().toISOString();
    setRows((rs) => rs.map((r) => (r.id === g.id ? { ...r, texted_at: now } : r)));
    fetch(`/api/admin/guests/${g.id}/texted`, { method: "POST", keepalive: true }).catch(() => {});
  }

  async function copy(g: GuestListRow, what: "link" | "text") {
    try {
      await navigator.clipboard.writeText(what === "link" ? link(g) : message(g));
      setCopied(g.id + what);
      setTimeout(() => setCopied((c) => (c === g.id + what ? null : c)), 1600);
      if (what === "text") markTexted(g);
    } catch {
      setStatus({ text: "Couldn't copy. Your browser blocked it.", err: true });
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
    setConfirming(null);
    if (res.ok || res.status === 404) setRows((rs) => rs.filter((r) => r.id !== id));
    else setStatus({ text: "Couldn't remove that guest. Try again.", err: true });
  }

  return (
    <div className="owner invites">
      <div className="admin-bar">
        <h3>Invitations</h3>
        <div className="admin-acts">
          <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={upload} />
          <button className="btn" type="button" onClick={() => openForm()}>
            Add guest
          </button>
          <button className="btn ghost" type="button" disabled={busy} onClick={() => fileRef.current?.click()}>
            Import CSV
          </button>
          <a className="btn ghost" href={TEMPLATE} download="guest-list-template.csv">Download template</a>
          {rows.length > 0 &&<a className="btn ghost" href="/api/admin/guests.csv">Download with links</a>}
        </div>
      </div>
      <p className="hint">
        One row per guest: <b>First name</b>, <b>Last name</b>, <b>Phone</b>, <b>Email</b>, <b>Plus-one allowed</b> (yes/no),{" "}
        <b>Bringing plus-one</b> (yes/no, or leave blank and their RSVP fills it in), <b>Side</b> (Evan, Remy or Both). Only the
        name is required. Importing again updates matching names instead of adding duplicates.
      </p>
      <p className={"status" + (status.err ? " err" : "")} role="status">{status.text}</p>

      {editing && (
        <form className="gform" ref={formRef} onSubmit={save} noValidate>
          <h4>{editing === "new" ? "Add a guest" : "Edit guest"}</h4>
          <div className="f">
            <label htmlFor="g-first">First name</label>
            <input id="g-first" autoFocus required maxLength={100} {...field("first_name")} />
          </div>
          <div className="f">
            <label htmlFor="g-last">Last name</label>
            <input id="g-last" maxLength={100} {...field("last_name")} />
          </div>
          <div className="f">
            <label htmlFor="g-phone">Phone</label>
            <input id="g-phone" type="tel" maxLength={40} {...field("phone")} />
          </div>
          <div className="f">
            <label htmlFor="g-email">Email</label>
            <input id="g-email" type="email" maxLength={200} {...field("email")} />
          </div>
          <div className="f">
            <label htmlFor="g-plus">Plus-one allowed</label>
            <select
              id="g-plus"
              value={draft.plus_one_allowed ? "yes" : "no"}
              onChange={(e) => setDraft((d) => ({ ...d, plus_one_allowed: e.target.value === "yes", plus_one: e.target.value === "yes" ? d.plus_one : null }))}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="f">
            <label htmlFor="g-bring">Bringing plus-one</label>
            <select
              id="g-bring"
              disabled={!draft.plus_one_allowed}
              value={draft.plus_one == null ? "" : draft.plus_one ? "yes" : "no"}
              onChange={(e) => setDraft((d) => ({ ...d, plus_one: e.target.value === "" ? null : e.target.value === "yes" }))}
            >
              <option value="">Not known yet</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="f">
            <label htmlFor="g-side">Side</label>
            <select id="g-side" value={draft.side} onChange={(e) => setDraft((d) => ({ ...d, side: e.target.value }))}>
              <option value="">–</option>
              <option value={couple.first}>{couple.first}</option>
              <option value={couple.second}>{couple.second}</option>
              <option value="Both">Both</option>
              {draft.side && ![couple.first, couple.second, "Both"].includes(draft.side) && <option value={draft.side}>{draft.side}</option>}
            </select>
          </div>
          <div className="gform-acts">
            <button className="btn" type="submit" disabled={busy}>{editing === "new" ? "Add" : "Save"}</button>
            <button className="btn ghost" type="button" onClick={() => setEditing(null)}>
              {editing === "new" ? "Done" : "Cancel"}
            </button>
          </div>
        </form>
      )}

      {rows.length > 0 && (
        <>
          <div className="totals">
            <div>{rows.length}<small>Guests</small></div>
            <div>{bringing}<small>Bringing a plus-one</small></div>
            <div>{seats}<small>Seats offered</small></div>
            <div>{rows.filter((g) => g.texted_at).length}<small>Texted</small></div>
            <div>{replied.length}<small>Replied</small></div>
          </div>
          <div className="filters" role="group" aria-label="Show">
            {([
              ["all", "Everyone"],
              ["unsent", "Not texted"],
              ["waiting", "No reply yet"],
              ["replied", "Replied"],
            ] as const).map(([k, label]) => (
              <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{label}</button>
            ))}
          </div>
          {sides.length > 0 && (
            <div className="filters" role="group" aria-label="Side">
              <button type="button" aria-pressed={!side} onClick={() => setSide(null)}>All sides</button>
              {sides.map((x) => (
                <button key={x} type="button" aria-pressed={side === x} onClick={() => setSide(x)}>
                  {x === "Both" ? "Both" : `${x}'s side`} · {rows.filter((g) => g.side === x).length}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Side</th>
              <th>Phone</th>
              <th>Plus-one</th>
              <th>Reply</th>
              <th>Texted</th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {!rows.length && (
              <tr><td colSpan={7} style={{ opacity: 0.7 }}>No one here yet. Add guests one at a time, or import your spreadsheet.</td></tr>
            )}
            {rows.length > 0 && !shown.length && (
              <tr><td colSpan={7} style={{ opacity: 0.7 }}>Nobody in this group.</td></tr>
            )}
            {shown.map((g) => (
              <tr key={g.id}>
                <td><b>{g.name}</b>{g.email && <small>{g.email}</small>}</td>
                <td>{g.side || "–"}</td>
                <td>{g.phone || "–"}</td>
                <td>
                  {!g.plus_one_allowed ? (
                    "–"
                  ) : g.plus_one == null ? (
                    <span className="pill w">Allowed</span>
                  ) : g.plus_one ? (
                    <span className="pill y">Bringing</span>
                  ) : (
                    <span className="pill n">Not bringing</span>
                  )}
                  {g.plus_one_name && <small>{g.plus_one_name}</small>}
                </td>
                <td>
                  {g.attending == null ? (
                    <span className="pill w">Waiting</span>
                  ) : (
                    <span className={"pill " + (g.attending ? "y" : "n")}>{g.attending ? `Yes · ${g.replied_party}` : "No"}</span>
                  )}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>{g.texted_at ? when(g.texted_at) : "–"}</td>
                <td>
                  <span className="acts">
                    {g.phone ? (
                      <a
                        className="del go"
                        href={`sms:${smsNumber(g.phone)}?&body=${encodeURIComponent(message(g))}`}
                        onClick={() => markTexted(g)}
                      >
                        Text invite
                      </a>
                    ) : (
                      <button className="del go" type="button" onClick={() => copy(g, "text")}>
                        {copied === g.id + "text" ? "Copied" : "Copy message"}
                      </button>
                    )}
                    <button className="del" type="button" onClick={() => copy(g, "link")}>
                      {copied === g.id + "link" ? "Copied" : "Copy link"}
                    </button>
                    <button className="del" type="button" onClick={() => openForm(g)} aria-label={`Edit ${g.name}`}>
                      Edit
                    </button>
                    {confirming === g.id ? (
                      <>
                        <button className="del sure" type="button" onClick={() => remove(g.id)}>Yes, remove</button>
                        <button className="del" type="button" onClick={() => setConfirming(null)}>Keep</button>
                      </>
                    ) : (
                      <button className="del" type="button" onClick={() => setConfirming(g.id)} aria-label={`Remove ${g.name}`}>
                        Remove
                      </button>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
