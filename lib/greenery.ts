// Procedural eucalyptus / olive / fern sprays, ported as-is from the prototype.
// Seeded RNG, so the same (preset, seed, index) always draws the same spray. That lets
// the server render the SVG and the client only has to start the animation.

const PAL = {
  green: { leaf: ["#0E5A43", "#1F6E52", "#2F8566", "#5E9A7E", "#8DB8A2"], stem: "#2F5E49", berry: "#B08D3E", rib: "rgba(255,255,255,.35)", op: 0.95 },
  light: { leaf: ["#D9BC74", "#BFD9C9", "#E8E1CF", "#9CC5B0", "#F3EEE4"], stem: "#D9BC74", berry: "#F3EEE4", rib: "rgba(10,68,51,.25)", op: 0.9 },
};
type Pal = (typeof PAL)["green"];
type Kind = "euc" | "olive" | "fern";
type Sprig = { a: number; len: number; curve: number; kind: Kind; n: number; size: number };

const PRESET: Record<string, { w: number; h: number; ox: number; oy: number; sprigs: Sprig[] }> = {
  "hero-big": { w: 400, h: 400, ox: 14, oy: 14, sprigs: [{ a: 100, len: 340, curve: -40, kind: "euc", n: 15, size: 32 }, { a: 126, len: 310, curve: 30, kind: "olive", n: 16, size: 36 }, { a: 152, len: 260, curve: -26, kind: "euc", n: 11, size: 26 }, { a: 170, len: 170, curve: 16, kind: "olive", n: 8, size: 24 }, { a: 118, len: 200, curve: 18, kind: "fern", n: 9, size: 22 }] },
  "hero-small": { w: 260, h: 260, ox: 10, oy: 10, sprigs: [{ a: 110, len: 210, curve: -24, kind: "olive", n: 8, size: 24 }, { a: 145, len: 180, curve: 20, kind: "euc", n: 7, size: 20 }] },
  card: { w: 150, h: 150, ox: 6, oy: 6, sprigs: [{ a: 112, len: 120, curve: -14, kind: "olive", n: 6, size: 16 }, { a: 150, len: 100, curve: 12, kind: "euc", n: 5, size: 13 }] },
  band: { w: 440, h: 440, ox: 16, oy: 16, sprigs: [{ a: 105, len: 380, curve: -50, kind: "olive", n: 13, size: 40 }, { a: 135, len: 330, curve: 36, kind: "euc", n: 10, size: 32 }, { a: 160, len: 270, curve: -20, kind: "fern", n: 11, size: 28 }] },
};
export type SprayPreset = keyof typeof PRESET;

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const leafPath: Record<Kind, (s: number) => string> = {
  euc: (s) => `M0 0 C ${s * 0.55} ${-s * 0.1} ${s * 0.55} ${-s * 0.95} 0 ${-s} C ${-s * 0.55} ${-s * 0.95} ${-s * 0.55} ${-s * 0.1} 0 0 Z`,
  olive: (s) => `M0 0 Q ${s * 0.24} ${-s * 0.5} 0 ${-s} Q ${-s * 0.24} ${-s * 0.5} 0 0 Z`,
  fern: (s) => `M0 0 Q ${s * 0.16} ${-s * 0.55} 0 ${-s} Q ${-s * 0.16} ${-s * 0.55} 0 0 Z`,
};

function sprig(sp: Sprig, pal: Pal, R: () => number, base: number) {
  const L = sp.len,
    cx = sp.curve,
    P = (t: number) => {
      const u = 1 - t;
      return [2 * u * t * cx, -(2 * u * t * (L * 0.5) + t * t * L)];
    },
    T = (t: number) => {
      const dx = 2 * (1 - t) * cx + 2 * t * (0 - cx),
        dy = -(2 * (1 - t) * (L * 0.5) + 2 * t * (L - L * 0.5));
      return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    };
  let s = `<path class="stem" pathLength="1" d="M0 0 Q ${cx} ${-L * 0.5} 0 ${-L}" fill="none" stroke="${pal.stem}" stroke-width="${sp.kind === "fern" ? 1 : 1.4}" stroke-linecap="round" style="--sdel:${base}s"/>`;
  for (let i = 0; i < sp.n; i++) {
    const t = 0.12 + 0.86 * (i / (sp.n - 1 || 1)),
      [x, y] = P(t),
      tan = T(t),
      side = i % 2 ? 1 : -1,
      spread = sp.kind === "fern" ? 62 : sp.kind === "olive" ? 40 : 55,
      ang = tan + side * (spread + R() * 14 - 7),
      sz = sp.size * (1 - 0.38 * t) * (0.85 + R() * 0.3),
      col = pal.leaf[Math.floor(R() * pal.leaf.length)],
      d = (base + 0.25 + t * 1.1 + R() * 0.15).toFixed(2);
    s +=
      `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})"><path class="lf" style="--d:${d}s" d="${leafPath[sp.kind](sz)}" fill="${col}" fill-opacity="${pal.op}"/>` +
      (sp.kind !== "fern" ? `<path class="lf" style="--d:${d}s" d="M0 0 L0 ${(-sz * 0.82).toFixed(1)}" stroke="${pal.rib}" stroke-width=".7"/>` : "") +
      `</g>`;
  }
  // tip leaf + a few berries
  s += `<g transform="translate(0 ${-L}) rotate(${T(1).toFixed(1)})"><path class="lf" style="--d:${(base + 1.45).toFixed(2)}s" d="${leafPath[sp.kind](sp.size * 0.6)}" fill="${pal.leaf[1]}" fill-opacity="${pal.op}"/></g>`;
  if (sp.kind === "olive") {
    for (let b = 0; b < 3; b++) {
      const t = 0.35 + b * 0.2,
        [x, y] = P(t);
      s += `<circle class="bry" style="--d:${(base + 0.6 + t).toFixed(2)}s" cx="${(x + (b % 2 ? 7 : -7)).toFixed(1)}" cy="${(y - 4).toFixed(1)}" r="${(sp.size * 0.11).toFixed(1)}" fill="${pal.berry}"/>`;
    }
  }
  return `<g transform="rotate(${sp.a})"><g class="sw" style="--sd:${(7 + R() * 4).toFixed(1)}s;--sdl:${(-R() * 6).toFixed(1)}s">${s}</g></g>`;
}

/**
 * `index` is the spray's position among all sprays on the page, matching the prototype's
 * document-order counter, so every spray comes out identical to the prototype.
 */
export function spraySvg(preset: SprayPreset, tone: "green" | "light", seed: number, index: number) {
  const p = PRESET[preset];
  const pal = PAL[tone];
  const R = rng(seed * 97 + index);
  const inner = p.sprigs.map((sp, i) => sprig(sp, pal, R, i * 0.18)).join("");
  return `<svg viewBox="0 0 ${p.w} ${p.h}"><g transform="translate(${p.ox} ${p.oy})">${inner}</g></svg>`;
}
