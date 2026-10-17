"use client";

import { useEffect, useState } from "react";

/** One name: letters rise in one by one, then it swaps to plain text with the sapphire→gold shimmer. */
function Word({ text, delay }: { text: string; delay: number }) {
  const [shine, setShine] = useState(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setShine(true), (delay + text.length * 0.07 + 1.2) * 1000);
    return () => clearTimeout(t);
  }, [delay, text]);

  // The prototype swapped the letters for plain text here. Keeping the same text nodes and
  // just adding .shine looks identical, and stops the browser counting a second, later
  // paint as the page's largest contentful paint.
  return (
    <span className={shine ? "w shine" : "w"}>
      {[...text].map((c, i) => (
        <span key={i} className="ch" style={{ animationDelay: `${delay + i * 0.07}s` }}>
          {c}
        </span>
      ))}
    </span>
  );
}

export default function Names({ first, second }: { first: string; second: string }) {
  return (
    <h1 className="names" aria-label={`${first} and ${second}`}>
      <Word text={first} delay={0.2} />
      <span className="amp">&amp;</span>
      <Word text={second} delay={0.75} />
    </h1>
  );
}
