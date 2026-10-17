"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Reply = {
  name: string;
  attending: boolean;
  party_size: number;
  meal: string | null;
  song: string | null;
  note: string | null;
  plus_one_name?: string | null;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
};

type Guest = { name: string; party_size: number; phone: string | null; plus_one_allowed?: boolean; plus_one?: boolean | null };

type Props = {
  meals: string[];
  maxParty: number;
  deadline: string;
  requireContact: boolean;
  dateLabel: string;
};

const blank = (meals: string[]) => ({
  name: "",
  att: "yes" as "yes" | "no",
  party: "2",
  meal: meals[0] ?? "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  song: "",
  note: "",
  plusName: "",
  website: "",
});

export default function Rsvp({ meals, maxParty, deadline, requireContact, dateLabel }: Props) {
  const [f, setF] = useState(() => blank(meals));
  const [saved, setSaved] = useState<Reply | null>(null);
  const [editing, setEditing] = useState(false);
  const [hasReply, setHasReply] = useState(false);
  const [closed, setClosed] = useState(false);
  const [status, setStatus] = useState({ text: "", err: false });
  const [busy, setBusy] = useState(false);
  const [invite, setInvite] = useState<string | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [canEmail, setCanEmail] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  // Personal invite links carry ?i=<code>. Otherwise the httpOnly cookie finds an earlier reply.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("i");
    fetch(code ? `/api/rsvp?i=${encodeURIComponent(code)}` : "/api/rsvp", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { reply: Reply | null; closed?: boolean; guest?: Guest; email?: boolean } | null) => {
        setClosed(d?.closed ?? Date.now() > new Date(deadline).getTime());
        if (d?.guest) {
          const g = d.guest;
          setInvite(code);
          setGuest(g);
          setCanEmail(Boolean(d.email));
          // Plus-one invites start at "Just me" unless you've already marked them as bringing someone.
          const party = g.plus_one_allowed && g.party_size === 2 ? (g.plus_one ? "2" : "1") : String(g.party_size);
          setF((s) => ({ ...s, name: g.name, party, phone: g.phone ?? "" }));
        }
        if (!d?.reply) return;
        const r = d.reply;
        setHasReply(true);
        setSaved(r);
        setF((s) => ({
          ...s,
          name: r.name,
          att: r.attending ? "yes" : "no",
          party: String(r.party_size || 2),
          meal: r.meal || s.meal,
          phone: r.phone ?? "",
          street: r.address_street ?? "",
          city: r.address_city ?? "",
          state: r.address_state ?? "",
          zip: r.address_zip ?? "",
          song: r.song ?? "",
          note: r.note ?? "",
          plusName: r.plus_one_name ?? "",
        }));
      })
      .catch(() => {});
  }, [deadline]);

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const name = f.name.trim();
    if (!name) {
      setStatus({ text: "Add your name so we know who's coming.", err: true });
      nameRef.current?.focus();
      return;
    }
    const yes = f.att === "yes";
    const body = {
      name,
      attending: yes,
      party_size: yes ? Number(f.party) : 1,
      meal: yes ? f.meal : null,
      phone: f.phone.trim(),
      address_street: f.street.trim(),
      address_city: f.city.trim(),
      address_state: f.state.trim(),
      address_zip: f.zip.trim(),
      song: f.song.trim().slice(0, 140),
      note: f.note.trim().slice(0, 600),
      plus_one_name: yes && Number(f.party) > 1 ? f.plusName.trim().slice(0, 120) : "",
      website: f.website,
      ...(invite ? { invite } : {}),
    };
    setBusy(true);
    setStatus({ text: "Sending…", err: false });
    try {
      const res = await fetch("/api/rsvp", {
        // An invite's reply is found by its code, so it can always be sent as new.
        method: hasReply && !invite ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json().catch(() => ({}));
      if (res.status === 404 && hasReply) {
        // Cookie went stale (reply deleted). Send it as a new one.
        setHasReply(false);
        setStatus({ text: d.error ?? "Send it again to save a fresh reply.", err: true });
        return;
      }
      if (res.status === 403) setClosed(true);
      if (!res.ok) {
        setStatus({ text: d.error ?? "That didn't go through. Check your connection and try again.", err: true });
        return;
      }
      setStatus({ text: "", err: false });
      setHasReply(true);
      setSaved(d.reply);
      setEditing(false);
    } catch {
      setStatus({ text: "That didn't go through. Check your connection and try again.", err: true });
    } finally {
      setBusy(false);
    }
  }

  const seats = guest ? Math.min(guest.party_size, maxParty) : maxParty;
  // A one-person invite with a plus-one gets a yes/no instead of a party count; a solo invite gets neither.
  const plusMode = Boolean(guest?.plus_one_allowed) && seats === 2;
  const solo = Boolean(guest) && seats === 1;
  const greeting = guest && (
    <div className="invite-hi">
      <span className="eyebrow">Your invitation</span>
      <h3>Dear {guest.name}</h3>
      <p>
        {guest.party_size === 1 ? "We've saved a seat for you." : `We've saved ${guest.party_size} seats for your party.`}
      </p>
    </div>
  );
  const emailBox = invite && canEmail ? <EmailMe invite={invite} /> : null;

  if (saved && !editing) {
    return (
      <>
      {greeting}
      <div className="done">
        <h3>{saved.attending ? "You're on the list" : "We'll miss you"}</h3>
        <p style={{ margin: 0 }}>
          {saved.attending
            ? `${saved.plus_one_name ? `You and ${saved.plus_one_name}` : `Party of ${saved.party_size}`}, ${(saved.meal ?? "").toLowerCase()} for dinner. See you ${dateLabel}.`
            : "Thanks for letting us know. We'll raise a glass for you."}
        </p>
        {!closed && (
          <button className="btn ghost" style={{ justifySelf: "start" }} type="button" onClick={() => setEditing(true)}>
            Change my reply
          </button>
        )}
      </div>
      {emailBox}
      </>
    );
  }

  if (closed) {
    return (
      <div className="done">
        <h3>RSVPs are closed</h3>
        <p style={{ margin: 0 }}>The reply deadline has passed. If you still need to reach us, get in touch with Evan or Remy directly.</p>
      </div>
    );
  }

  const req = requireContact;
  const opt = req ? "" : " (optional)";
  return (
    <>
    {greeting}
    <form onSubmit={submit} noValidate>
      <div className="f">
        <label htmlFor="r-name">Your name(s)</label>
        <input id="r-name" ref={nameRef} autoComplete="name" placeholder="First and last" required value={f.name} onChange={set("name")} maxLength={200} />
      </div>
      <fieldset className="f">
        <legend>Will you be there?</legend>
        <div className="choice">
          <input type="radio" name="att" id="att-y" value="yes" checked={f.att === "yes"} onChange={set("att")} />
          <label htmlFor="att-y">Wouldn&apos;t miss it</label>
          <input type="radio" name="att" id="att-n" value="no" checked={f.att === "no"} onChange={set("att")} />
          <label htmlFor="att-n">Celebrating from afar</label>
        </div>
      </fieldset>
      <div className="two" hidden={f.att !== "yes"}>
        {plusMode ? (
          <div className="f">
            <label htmlFor="r-count">Bringing a plus-one?</label>
            <select id="r-count" value={f.party === "2" ? "2" : "1"} onChange={set("party")}>
              <option value="1">Just me</option>
              <option value="2">Yes, me + one</option>
            </select>
          </div>
        ) : solo ? null : (
          <div className="f">
            <label htmlFor="r-count">Number in your party</label>
            <select id="r-count" value={f.party} onChange={set("party")}>
              {Array.from({ length: seats }, (_, i) => (
                <option key={i}>{i + 1}</option>
              ))}
            </select>
          </div>
        )}
        <div className="f">
          <label htmlFor="r-meal">Dinner</label>
          <select id="r-meal" value={f.meal} onChange={set("meal")}>
            {meals.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      {plusMode && f.att === "yes" && f.party === "2" && (
        <div className="f">
          <label htmlFor="r-plus">Your plus-one&apos;s name (optional)</label>
          <input id="r-plus" placeholder="So we can save them a place card" value={f.plusName} onChange={set("plusName")} maxLength={120} />
        </div>
      )}
      <div className="f">
        <label htmlFor="r-phone">Phone{opt}</label>
        <input id="r-phone" type="tel" autoComplete="tel" placeholder="For day-of updates" value={f.phone} onChange={set("phone")} maxLength={40} required={req} />
      </div>
      <fieldset className="f">
        <legend>Mailing address{opt}</legend>
        <div className="addr">
          <div className="f">
            <label htmlFor="r-street" className="sr-only">Street address</label>
            <input id="r-street" autoComplete="street-address" placeholder="Street address" value={f.street} onChange={set("street")} maxLength={200} required={req} />
          </div>
          <div className="addr-row">
            <div className="f">
              <label htmlFor="r-city" className="sr-only">City</label>
              <input id="r-city" autoComplete="address-level2" placeholder="City" value={f.city} onChange={set("city")} maxLength={100} required={req} />
            </div>
            <div className="f">
              <label htmlFor="r-state" className="sr-only">State</label>
              <input id="r-state" autoComplete="address-level1" placeholder="State" value={f.state} onChange={set("state")} maxLength={60} required={req} />
            </div>
            <div className="f">
              <label htmlFor="r-zip" className="sr-only">ZIP code</label>
              <input id="r-zip" autoComplete="postal-code" inputMode="numeric" placeholder="ZIP" value={f.zip} onChange={set("zip")} maxLength={20} required={req} />
            </div>
          </div>
        </div>
      </fieldset>
      <div className="f">
        <label htmlFor="r-song">Song request</label>
        <input id="r-song" placeholder="The one that gets you dancing" value={f.song} onChange={set("song")} maxLength={140} />
      </div>
      <div className="f">
        <label htmlFor="r-note">Note for Evan &amp; Remy</label>
        <textarea id="r-note" rows={2} placeholder="Allergies, well wishes, bad jokes" value={f.note} onChange={set("note")} maxLength={600} />
      </div>
      {/* Honeypot: hidden from people and screen readers, irresistible to bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="r-website">Website</label>
        <input id="r-website" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} />
      </div>
      <button className="btn" type="submit" disabled={busy}>
        Send RSVP
      </button>
      <div className={"status" + (status.err ? " err" : "")} role="status">
        {status.text}
      </div>
    </form>
    {emailBox}
    </>
  );
}

/** "Email me this invitation": sends the guest's own link to the address they type, nowhere else. */
function EmailMe({ invite }: { invite: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ text: "", err: false });
  const [busy, setBusy] = useState(false);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus({ text: "That email doesn't look right.", err: true });
      return;
    }
    setBusy(true);
    setStatus({ text: "Sending…", err: false });
    try {
      const res = await fetch("/api/invite/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite, email: email.trim() }),
      });
      const d = await res.json().catch(() => ({}));
      setStatus(res.ok ? { text: `Sent to ${email.trim()}. Check your inbox.`, err: false } : { text: d.error ?? "That didn't go through. Try again.", err: true });
    } catch {
      setStatus({ text: "That didn't go through. Check your connection and try again.", err: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="email-me" onSubmit={send} noValidate>
      <div className="f">
        <label htmlFor="r-email">Want this invitation by email too?</label>
        <input id="r-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} />
      </div>
      <button className="btn ghost" type="submit" disabled={busy}>Email it to me</button>
      <div className={"status" + (status.err ? " err" : "")} role="status">{status.text}</div>
    </form>
  );
}
