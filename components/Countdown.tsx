"use client";

import { useEffect, useRef } from "react";

const UNITS = [
  ["d", "Days"],
  ["h", "Hours"],
  ["m", "Minutes"],
  ["s", "Seconds"],
] as const;

/** Counts to the ceremony. Changed digits roll in. */
export default function Countdown({ target }: { target: string }) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const t = new Date(target).getTime();
    function set(k: string, v: string) {
      const n = refs.current[k];
      if (!n) return;
      const prev = n.dataset.v || "";
      if (prev === v) return;
      n.dataset.v = v;
      n.textContent = "";
      [...v].forEach((ch, i) => {
        const s = document.createElement("span");
        s.textContent = ch;
        if (prev && prev[i] !== ch) s.className = "roll";
        n.appendChild(s);
      });
    }
    function tick() {
      let d = Math.max(0, t - Date.now());
      const D = Math.floor(d / 864e5);
      d -= D * 864e5;
      const h = Math.floor(d / 36e5);
      d -= h * 36e5;
      const m = Math.floor(d / 6e4);
      d -= m * 6e4;
      const s = Math.floor(d / 1e3);
      set("d", String(D));
      set("h", String(h).padStart(2, "0"));
      set("m", String(m).padStart(2, "0"));
      set("s", String(s).padStart(2, "0"));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="count" aria-live="polite">
      <div className="wrap">
        <div className="label">
          Until we say I do
        </div>
        <div className="ticks">
          {UNITS.map(([k, u]) => (
            <div className="tick" key={k}>
              <div className="n" ref={(el) => void (refs.current[k] = el)}>
                —
              </div>
              <div className="u">{u}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
