"use client";

import { useMemo, useState, type FormEvent } from "react";
import { READY, SEATING } from "@/content/seating";

type Match = { name: string; table: string; mates: string[] };

// Accent- and punctuation-insensitive words.
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const DEMO_MSG = 'The seating chart goes up the week of the wedding. Try "Evan" to see how it works.';

export default function SeatFinder() {
  const all = useMemo(() => {
    const out: Match[] = [];
    SEATING.forEach((t) => t.guests.forEach((g) => out.push({ name: g, table: t.table, mates: t.guests.filter((x) => x !== g) })));
    return out;
  }, []);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState({ text: READY ? "" : DEMO_MSG, err: false });
  const [picks, setPicks] = useState<Match[]>([]);
  const [found, setFound] = useState<Match | null>(null);
  const [nonce, setNonce] = useState(0);

  function reveal(m: Match) {
    setPicks([]);
    setMsg({ text: READY ? "Found you." : "This is a preview. The real chart goes up the week of the wedding.", err: false });
    setFound(m);
    setNonce((n) => n + 1);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const words = norm(q);
    setPicks([]);
    if (!words.length) return setMsg({ text: "Type your name to look up your table.", err: true });
    const hits = all.filter((p) => {
      const t = norm(p.name);
      return words.every((w) => t.some((x) => x.startsWith(w)));
    });
    if (hits.length === 1) return reveal(hits[0]);
    if (hits.length > 1) {
      setMsg({ text: "A few matches. Which one is you?", err: false });
      return setPicks(hits.slice(0, 8));
    }
    setMsg({
      text: READY
        ? "We couldn't find that name. Try your first and last name as they appear on your invitation."
        : 'The seating chart isn\'t up yet. Try "Evan" to see how it works.',
      err: true,
    });
  }

  const isNum = found ? /^\d+$/.test(found.table) : false;

  return (
    <div className="seat">
      <form onSubmit={submit} noValidate>
        <div className="row2">
          <div className="f">
            <label htmlFor="seat-q">Your name</label>
            <input id="seat-q" autoComplete="name" placeholder="First and last name" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <button className="btn" type="submit">
            Find my table
          </button>
        </div>
        <p className={"msg" + (msg.err ? " err" : "")} role="status">
          {msg.text}
        </p>
        <div className="picks">
          {picks.map((h) => (
            <button key={h.name + h.table} type="button" onClick={() => reveal(h)}>
              {h.name}
            </button>
          ))}
        </div>
      </form>
      <div>
        {/* key remounts the ring so the gold arc draws again on every reveal */}
        <div className={"ring" + (found ? " show" : "")} key={nonce}>
          <svg viewBox="0 0 220 220" aria-hidden="true">
            <circle className="track" cx="110" cy="110" r="100" />
            <circle className="arc" cx="110" cy="110" r="100" />
          </svg>
          <div className="in">
            <span className="k">{found ? (isNum ? "Table" : "You're at the") : "Your table"}</span>
            <span className="num" style={found && !isNum ? { fontSize: "clamp(2rem,6vw,2.8rem)" } : undefined}>
              {found ? found.table : "?"}
            </span>
            <span className="who">{found?.name}</span>
          </div>
        </div>
        <p className="mates">{found && found.mates.length ? "Sitting with " + found.mates.join(", ") : ""}</p>
      </div>
    </div>
  );
}
