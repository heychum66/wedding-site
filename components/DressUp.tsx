"use client";

import { useEffect, useRef, useState } from "react";
import { HER_SVG, HIM_SVG } from "./dress-figures";

type Who = "him" | "her";
type Piece = { k: string; b: string; small: string };

const PIECES: Record<Who, Piece[]> = {
  him: [
    { k: "trousers", b: "Tuxedo trousers", small: "Match the jacket, with a satin stripe down the side." },
    { k: "shirt", b: "Dress shirt", small: "Crisp white, turndown or wing collar." },
    { k: "jacket", b: "Tuxedo jacket", small: "Black or midnight navy, satin lapels." },
    { k: "bowtie", b: "Bow tie", small: "Black silk. Self-tie if you're feeling brave." },
    { k: "square", b: "Pocket square", small: "White linen, or a touch of gold." },
    { k: "shoes", b: "Shoes", small: "Black patent leather or high-polish oxfords." },
  ],
  her: [
    { k: "gown", b: "Evening gown", small: "Floor-length is classic. An elegant formal dress works too." },
    { k: "jewelry", b: "Jewelry", small: "Bring out the good stuff. It's the night for it." },
    { k: "wrap", b: "A wrap", small: "September nights in Pittsburgh can dip into the 50s." },
    { k: "clutch", b: "Clutch", small: "Small, evening-ready, room for lipstick and a phone." },
  ],
};
const WHO: Who[] = ["him", "her"];
const allOn = (): Record<Who, Record<string, boolean>> => ({
  him: Object.fromEntries(PIECES.him.map((p) => [p.k, true])),
  her: Object.fromEntries(PIECES.her.map((p) => [p.k, true])),
});
const dressedMarkup = (s: string) => s.replace(/ off"/g, '"');

/** Black tie guide: two figures dress piece by piece when the section scrolls in. */
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
      for (const p of PIECES[w]) f.querySelector(`.pc[data-k="${p.k}"]`)?.classList.toggle("off", !on[w][p.k]);
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
      PIECES[w].forEach((p, i) => timers.current.push(setTimeout(() => setPiece(w, p.k, true), 500 + i * 650 + (w === "her" ? 250 : 0))));
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
        {card("him", HIM_SVG, "A figure being dressed in a tuxedo", "For him", "Tuxedo, please")}
        {card("her", HER_SVG, "A figure being dressed in an evening gown", "For her", "Gown or formal dress")}
      </div>
      <div className="dress-foot">
        <p>Tap any piece to take it on or off. Please skip white and ivory. That one&apos;s spoken for.</p>
        <button className="btn ghost" type="button" onClick={dress}>
          Dress them again
        </button>
      </div>
    </>
  );
}
