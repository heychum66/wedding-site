"use client";

import { useEffect, useRef, useState } from "react";
import { HER_SVG, HIM_SVG } from "./dress-figures";

type Who = "him" | "her";
type Piece = { k: string; b: string; small: string };

const PIECES: Record<Who, Piece[]> = {
  him: [
    { k: "shirt", b: "Shirt & tie", small: "A pressed dress shirt with a necktie or bow tie." },
    { k: "suit", b: "Suit", small: "Navy, charcoal, black, or another dark tone." },
    { k: "shoes", b: "Dress shoes", small: "Polished leather, please. No sneakers." },
  ],
  her: [
    { k: "dress", b: "Dress", small: "Below the knee: midi, tea-length or floor-length. An elegant jumpsuit or dressy separates work too." },
    { k: "heels", b: "Dress shoes", small: "Heels, block heels or elegant flats." },
    { k: "jewelry", b: "Jewelry", small: "Bring out the good stuff. It's the night for it." },
  ],
};
const WHO: Who[] = ["him", "her"];
const allOn = (): Record<Who, Record<string, boolean>> => ({
  him: Object.fromEntries(PIECES.him.map((p) => [p.k, true])),
  her: Object.fromEntries(PIECES.her.map((p) => [p.k, true])),
});
const dressedMarkup = (s: string) => s.replace(/ off"/g, '"');

/** Formal attire guide: two figures dress piece by piece when the section scrolls in. */
export default function DressUp() {
  const [on, setOn] = useState(allOn);
  const figs = { him: useRef<SVGSVGElement>(null), her: useRef<SVGSVGElement>(null) };
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const prev = useRef(on);

  // Mirror state onto the SVG pieces, and replay the sparkle whenever a figure is complete.
  useEffect(() => {
    for (const w of WHO) {
      const f = figs[w].current;
      if (!f) continue;
      // First run counts as a change, like the prototype's initial "dress everything" pass.
      const changed = prev.current === on || PIECES[w].some((p) => prev.current[w][p.k] !== on[w][p.k]);
      for (const p of PIECES[w])
        f.querySelectorAll(`.pc[data-k="${p.k}"]`).forEach((el) => el.classList.toggle("off", !on[w][p.k]));
      if (!changed) continue;
      f.classList.remove("dressed");
      if (PIECES[w].every((p) => on[w][p.k])) {
        void f.getBoundingClientRect();
        f.classList.add("dressed");
      }
    }
    prev.current = on;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  const setPiece = (w: Who, k: string, v: boolean) => setOn((s) => ({ ...s, [w]: { ...s[w], [k]: v } }));

  function dress() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const none = {
      him: Object.fromEntries(PIECES.him.map((p) => [p.k, false])),
      her: Object.fromEntries(PIECES.her.map((p) => [p.k, false])),
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(allOn());
      return;
    }
    setOn(none);
    for (const w of WHO)
      PIECES[w].forEach((p, i) => timers.current.push(setTimeout(() => setPiece(w, p.k, true), 350 + i * 520 + (w === "her" ? 260 : 0))));
  }

  // The sequence plays when the section first comes into view.
  useEffect(() => {
    const sec = document.getElementById("attire");
    if (!sec) return;
    const io = new IntersectionObserver(
      (es, ob) => {
        if (es[0].isIntersecting) {
          ob.disconnect();
          dress();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(sec);
    const t = timers.current;
    return () => {
      io.disconnect();
      t.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const card = (w: Who, svg: string, label: string, title: string, sub: string) => (
    <div className="dcard">
      <svg
        viewBox="0 0 200 420"
        className="fig"
        id={`fig-${w}`}
        ref={figs[w]}
        role="img"
        aria-label={label}
        dangerouslySetInnerHTML={{ __html: dressedMarkup(svg) }}
      />
      <div>
        <h3>{title}</h3>
        <span className="sub">{sub}</span>
        <ul className="plist">
          {PIECES[w].map((p) => (
            <li key={p.k}>
              <button type="button" aria-pressed={on[w][p.k]} onClick={() => setPiece(w, p.k, !on[w][p.k])}>
                <span className="ck" />
                <span>
                  <b>{p.b}</b>
                  <small>{p.small}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <div className="dress">
        {card("him", HIM_SVG, "A figure being dressed in a suit and tie", "For him", "Suit and tie")}
        {card("her", HER_SVG, "A figure being dressed in a below-the-knee dress", "For her", "Below-the-knee dress")}
      </div>
      <div className="dress-foot">
        <p>Tap any piece to take it on or off. And please, do not wear white&hellip; <em>or else</em>.</p>
        <button className="btn ghost" type="button" onClick={dress}>
          Dress them again
        </button>
      </div>
    </>
  );
}
