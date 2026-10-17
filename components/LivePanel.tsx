"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/content/site";
import { LIVE_WINDOW, PREVIEW, SCHEDULE } from "@/content/schedule";

export const LIVE_OPEN_EVENT = "live:open";

// Eastern daylight time on the wedding date. "26:00" rolls past midnight on purpose.
const at = (hm: string) => {
  const [H, M] = hm.split(":").map(Number);
  return new Date(`${site.date}T00:00:00-04:00`).getTime() + (H * 60 + M) * 6e4;
};
const fmt = (ms: number) =>
  new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: site.timezone }).toLowerCase().replace(" ", " ");

const starts = SCHEDULE.map((s) => at(s.t));
const dayStart = at(LIVE_WINDOW.start),
  dayEnd = at(LIVE_WINDOW.end);

/** "Happening now" panel: shows itself on the wedding day, or when the preview scrubber is open. */
export default function LivePanel() {
  const [now, setNow] = useState<number | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const sec = useRef<HTMLElement>(null);
  const lis = useRef<(HTMLLIElement | null)[]>([]);
  const fill = useRef<HTMLLIElement>(null);

  useEffect(() => {
    // Clock starts after hydration so the server render never depends on the time.
    const first = requestAnimationFrame(() => {
      setNow(Date.now());
      if (location.hash === "#live-preview") setPreview(at(PREVIEW.openAt));
    });
    const id = setInterval(() => setNow(Date.now()), 30000);
    const open = () => {
      setPreview(at(PREVIEW.openAt));
      requestAnimationFrame(() => sec.current?.scrollIntoView({ behavior: "smooth" }));
    };
    addEventListener(LIVE_OPEN_EVENT, open);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(id);
      removeEventListener(LIVE_OPEN_EVENT, open);
    };
  }, []);

  const t = preview ?? now ?? 0;
  const active = preview != null || (now != null && t >= dayStart && t <= dayEnd);
  let i = -1;
  starts.forEach((s, k) => {
    if (t >= s) i = k;
  });

  // progress along the rail
  useLayoutEffect(() => {
    if (!active || !fill.current) return;
    let p = 0;
    const L = lis.current;
    if (i >= 0 && L[i]) {
      const a = L[i]!.offsetTop,
        b = i < L.length - 1 ? L[i + 1]!.offsetTop : a,
        seg = i < L.length - 1 ? (t - starts[i]) / (starts[i + 1] - starts[i]) : 0;
      p = a + (b - a) * Math.min(1, seg) + 8;
    }
    fill.current.style.height = p + "px";
  }, [active, i, t]);

  const close = useCallback(() => {
    setPreview(null);
    document.getElementById("details")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  let tag = "Happening now",
    title: ReactNode = SCHEDULE[Math.max(0, i)].title,
    note = SCHEDULE[Math.max(0, i)].note;
  if (i < 0) {
    tag = "Today's the day";
    title = (
      <>
        Starting <em>soon</em>
      </>
    );
    note = `Guests arrive at ${fmt(starts[0])}.`;
  } else if (i === SCHEDULE.length - 1) tag = "That's a wrap";

  const nx = SCHEDULE[i + 1];
  let nextIn = "";
  if (nx) {
    const mins = Math.max(0, Math.round((starts[i + 1] - t) / 6e4));
    nextIn = mins >= 60 ? `at ${fmt(starts[i + 1])}` : mins <= 1 ? "any minute" : `in ${mins} min`;
  }

  return (
    <section className="live" id="live" ref={sec} aria-live="polite" hidden={!active}>
      <div className="wrap">
        <div>
          <span className="tag">
            <span className="dot" />
            <span>{tag}</span>
          </span>
          <h2>{title}</h2>
          <p className="now-note">{note}</p>
          <div className="next" hidden={!nx}>
            <span className="k">Up next</span>
            <b>{nx?.title}</b>
            <span className="in">{nextIn}</span>
          </div>
        </div>
        <ol className="tl">
          <li className="fill" ref={fill} role="presentation" />
          {SCHEDULE.map((s, k) => (
            <li key={s.t} ref={(el) => void (lis.current[k] = el)} className={k < i ? "past" : k === i ? "cur" : undefined}>
              <span className="tt">{fmt(starts[k])}</span>
              <span className="ti">{s.title}</span>
            </li>
          ))}
        </ol>
        <div className="preview-bar" hidden={preview == null}>
          <label htmlFor="live-scrub">Preview the night</label>
          <input
            type="range"
            id="live-scrub"
            step={300000}
            min={at(PREVIEW.min)}
            max={at(PREVIEW.max)}
            value={preview ?? at(PREVIEW.openAt)}
            onChange={(e) => setPreview(Number(e.target.value))}
            aria-valuetext={preview != null ? fmt(preview) : undefined}
          />
          <output htmlFor="live-scrub">{preview != null ? fmt(preview) : ""}</output>
          <button className="x" type="button" onClick={close}>
            Close preview
          </button>
        </div>
      </div>
    </section>
  );
}

export function LiveOpenButton() {
  return (
    <button className="linkish" type="button" onClick={() => dispatchEvent(new Event(LIVE_OPEN_EVENT))}>
      Preview the wedding-day view
    </button>
  );
}
