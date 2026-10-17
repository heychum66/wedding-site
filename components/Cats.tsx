"use client";

import { useEffect, useRef } from "react";

type Cat = {
  key: string; fat: boolean; base: string; dark: string; muzzle: string; eye: string; nose: string;
  head: string; body: string; earL: string; earR: string;
  /** Long fur: a ruff around the face, ear tufts, a bushy tail. */
  fluffy?: boolean;
  /** Front paw colors, left then right, when they differ from the coat. */
  paws?: [string, string];
};

// Evan & Remy's three cats, drawn from photos, in tiny black bow ties.
const CATS: Cat[]=[
  // Grey mackerel tabby: slim, short coat, white chin, green-gold eyes, pink nose.
  {key:"tabby",fat:false,base:"#8C8984",dark:"#4F4C48",muzzle:"#E4E0DA",eye:"#B7B04E",nose:"#D48F88",
    head:`<path d="M52 26 L55 40 M60 24 V40 M68 26 L65 40" stroke="#4F4C48" stroke-width="2.6" stroke-linecap="round"/><path d="M44 47 Q38 43 32 45 M76 47 Q82 43 88 45" stroke="#4F4C48" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M18 58 L34 61 M19 66 L33 66 M102 58 L86 61 M101 66 L87 66" stroke="#4F4C48" stroke-width="2.4" stroke-linecap="round"/>`,
    body:`<path d="M50 32 Q56 52 50 74 M62 30 Q68 52 62 76 M74 30 Q80 52 74 76 M86 30 Q92 52 86 76 M98 32 Q104 52 98 72" stroke="#4F4C48" stroke-width="3.4" stroke-linecap="round" fill="none"/><ellipse cx="108" cy="64" rx="12" ry="9" fill="#E4E0DA"/>`,
    earL:"#8C8984",earR:"#8C8984"},
  // Tortoiseshell: dark brown-black mottled with ginger, face split ginger / dark down the middle, green eyes.
  {key:"tortie",fat:false,base:"#2F2420",dark:"#17110F",muzzle:"#4A3528",eye:"#A9B47E",nose:"#2A1D19",
    head:`<path d="M10 20 L58 20 Q56 50 61 100 L10 100 Z" fill="#B27848"/><path d="M14 30 Q30 38 40 30 M22 70 Q34 64 44 72" stroke="#7E4E2C" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/><ellipse cx="88" cy="80" rx="12" ry="7" fill="#6E4A31" opacity=".8"/><ellipse cx="96" cy="40" rx="6" ry="4" fill="#8E5E38" opacity=".7"/>`,
    body:`<ellipse cx="58" cy="44" rx="17" ry="11" fill="#B27848"/><ellipse cx="94" cy="62" rx="14" ry="10" fill="#9A6440"/><ellipse cx="80" cy="34" rx="9" ry="6" fill="#C4895A"/><ellipse cx="42" cy="66" rx="9" ry="7" fill="#7E4E2C"/><ellipse cx="112" cy="44" rx="8" ry="6" fill="#B27848"/>`,
    earL:"#9A6440",earR:"#2F2420"},
  // Long-haired dilute tortie: fluffy blue-grey with cream patches, big ruff, gold eyes, one cream front paw.
  {key:"fluffy",fat:true,base:"#8D8B90",dark:"#626066",muzzle:"#E8E1D6",eye:"#C9A23C",nose:"#D98C8C",fluffy:true,
    paws:["#E3CBA6","#8D8B90"],
    head:`<path d="M44 22 Q60 34 76 22 Q70 40 60 44 Q50 40 44 22 Z" fill="#D9BE96" opacity=".75"/><ellipse cx="26" cy="64" rx="12" ry="9" fill="#C8B08C" opacity=".55"/><ellipse cx="98" cy="58" rx="10" ry="8" fill="#B8A486" opacity=".45"/>`,
    body:`<ellipse cx="62" cy="46" rx="16" ry="10" fill="#D9BE96" opacity=".7"/><ellipse cx="96" cy="62" rx="12" ry="8" fill="#C8B08C" opacity=".6"/><ellipse cx="116" cy="60" rx="14" ry="12" fill="#D8D0C4"/>`,
    earL:"#8D8B90",earR:"#8D8B90"}
];

/** A scalloped outline around an ellipse: soft tufts of long fur. */
function fur(cx: number, cy: number, rx: number, ry: number, n: number, amp: number) {
  const pt = (t: number, k: number) => (cx + Math.cos(t) * rx * k).toFixed(1) + " " + (cy + Math.sin(t) * ry * k).toFixed(1);
  let d = "M" + pt(0, 1);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, b = ((i + 1) / n) * Math.PI * 2;
    d += ` Q${pt((a + b) / 2, 1 + amp)} ${pt(b, 1)}`;
  }
  return d + " Z";
}

let uid=0;
function head(c: Cat){
  const id="ch"+(++uid),w=c.fat?47:40;
  return `<svg class="cathead" viewBox="0 0 120 112">
    <defs><clipPath id="${id}"><ellipse cx="60" cy="60" rx="${w}" ry="36"/></clipPath></defs>
    ${c.fluffy?`<path d="${fur(60,62,w+3,39,20,.16)}" fill="${c.base}"/><path d="${fur(60,90,22,13,9,.3)}" fill="${c.muzzle}" opacity=".9"/>`:""}
    <g class="ears"><path d="M${60-w+6} 44 L${60-w+12} 8 L50 30 Z" fill="${c.earL}"/><path d="M${60-w+13} 36 L${60-w+15} 17 L45 31 Z" fill="#E7A6A3"/>${c.fluffy?`<path d="M${60-w+14} 34 L${60-w+12} 10 L${60-w+17} 28" stroke="${c.muzzle}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`:""}
      <g class="ear-r"><path d="M${60+w-6} 44 L${60+w-12} 8 L70 30 Z" fill="${c.earR}"/><path d="M${60+w-13} 36 L${60+w-15} 17 L75 31 Z" fill="#E7A6A3"/>${c.fluffy?`<path d="M${60+w-14} 34 L${60+w-12} 10 L${60+w-17} 28" stroke="${c.muzzle}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`:""}</g></g>
    <ellipse cx="34" cy="100" rx="13" ry="8" fill="${c.paws?.[0] ?? c.base}"/><ellipse cx="86" cy="100" rx="13" ry="8" fill="${c.paws?.[1] ?? c.base}"/>
    <path d="M30 104 V98 M36 104 V98 M82 104 V98 M88 104 V98" stroke="${c.dark}" stroke-width="1"/>
    <ellipse cx="60" cy="60" rx="${w}" ry="36" fill="${c.base}"/>
    <g clip-path="url(#${id})">${c.head}</g>
    <ellipse cx="60" cy="76" rx="15" ry="9.5" fill="${c.muzzle}" opacity=".85"/>
    <g class="eyes"><ellipse cx="44" cy="56" rx="7.5" ry="8.5" fill="${c.eye}"/><ellipse cx="76" cy="56" rx="7.5" ry="8.5" fill="${c.eye}"/>
      <ellipse cx="44" cy="56" rx="2.2" ry="7" fill="#0B0A0C"/><ellipse cx="76" cy="56" rx="2.2" ry="7" fill="#0B0A0C"/>
      <circle cx="46.5" cy="52.5" r="1.6" fill="#fff"/><circle cx="78.5" cy="52.5" r="1.6" fill="#fff"/></g>
    <path d="M55.5 70 L64.5 70 L60 75.5 Z" fill="${c.nose}"/>
    <path d="M60 75.5 Q60 80.5 55 81.5 M60 75.5 Q60 80.5 65 81.5" stroke="#1a1a1a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M45 74 L8 69 M45 77.5 L10 81 M75 74 L112 69 M75 77.5 L110 81" stroke="#8D8A84" stroke-width=".8" opacity=".75"/>
    <path d="M47 91 L60 97.5 L47 104 Z M73 91 L60 97.5 L73 104 Z" fill="#0A090C" stroke="#CDAE6A" stroke-width=".8"/><circle cx="60" cy="97.5" r="3.2" fill="#0A090C" stroke="#CDAE6A" stroke-width=".8"/>
  </svg>`;
}
function runner(c: Cat){
  const id="cb"+(++uid),rx=c.fat?52:44,ry=c.fat?27:20,cy=54;
  return `<svg viewBox="0 0 170 104"><g class="bob">
    <path class="tail" d="M${78-rx+6} ${cy-6} Q14 ${cy-10} 12 ${cy-34}" stroke="${c.base}" stroke-width="${c.fluffy?16:c.fat?9:7}" stroke-linecap="round" fill="none"/>
    <g class="lg2"><rect x="${78-rx+18}" y="${cy+6}" width="8" height="${c.fat?34:36}" rx="4" fill="${c.dark}"/><rect x="${78+rx-24}" y="${cy+6}" width="8" height="${c.fat?34:36}" rx="4" fill="${c.dark}"/></g>
    <defs><clipPath id="${id}"><ellipse cx="78" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath></defs>
    ${c.fluffy?`<path d="${fur(78,cy,rx,ry+1,16,.14)}" fill="${c.base}"/>`:""}
    <ellipse cx="78" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c.base}"/>
    <g clip-path="url(#${id})">${c.body}</g>
    <g class="lg1"><rect x="${78-rx+8}" y="${cy+6}" width="8.5" height="${c.fat?34:36}" rx="4" fill="${c.base}"/><rect x="${78+rx-14}" y="${cy+6}" width="8.5" height="${c.fat?34:36}" rx="4" fill="${c.paws?.[0] ?? c.base}"/></g>
    <path d="M120 ${cy-24} L122 ${cy-42} L132 ${cy-30} Z M134 ${cy-30} L144 ${cy-44} L147 ${cy-25} Z" fill="${c.earR}"/>
    ${c.fluffy?`<path d="${fur(134,cy-15,19,19,11,.18)}" fill="${c.base}"/>`:""}
    <circle cx="134" cy="${cy-16}" r="${c.fat?19:17}" fill="${c.base}"/>
    <ellipse cx="141" cy="${cy-18}" rx="2.6" ry="3.4" fill="${c.eye}"/><ellipse cx="141.3" cy="${cy-18}" rx=".9" ry="3" fill="#0B0A0C"/>
    <circle cx="${c.fat?152:150}" cy="${cy-11}" r="2" fill="${c.nose}"/>
    <path d="M146 ${cy-9} L166 ${cy-12} M146 ${cy-7} L165 ${cy-4}" stroke="#8D8A84" stroke-width=".7" opacity=".7"/>
    <path d="M120 ${cy+2} L128 ${cy-2} L128 ${cy+6} Z M136 ${cy+2} L128 ${cy-2} L128 ${cy+6} Z" fill="#0A090C" stroke="#CDAE6A" stroke-width=".7"/>
  </g></svg>`;
}

const FIRST_PEEK_MS = 6500;
const pickDelay = () => 10000 + Math.random() * 15000; // every 10–25s

/** Every so often one cat peeks in from an edge or runs across the bottom. Tap to hurry it along. */
export default function Cats() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = stageRef.current!;
    let timer: ReturnType<typeof setTimeout>;

    function peek(c: Cat) {
      const side = ["l", "r", "b"][Math.floor(Math.random() * 3)];
      const el = document.createElement("div");
      el.className = "cat peek " + side;
      el.innerHTML = head(c);
      const vh = innerHeight, vw = innerWidth;
      let off: string, on: string;
      if (side === "b") {
        el.style.left = Math.round(vw * (0.15 + Math.random() * 0.7)) - 55 + "px";
        off = "translateY(110%)";
        on = "translateY(38%)";
      } else {
        el.style.top = Math.round(vh * (0.22 + Math.random() * 0.5)) + "px";
        const sgn = side === "l" ? -1 : 1, rot = side === "l" ? 22 : -22;
        off = `translateX(${sgn * 115}%) rotate(${rot}deg)`;
        on = `translateX(${sgn * 34}%) rotate(${rot}deg)`;
      }
      stage.appendChild(el);
      const a = el.animate([{ transform: off }, { transform: on, offset: 0.07 }, { transform: on, offset: 0.93 }, { transform: off }], {
        duration: 9000,
        easing: "cubic-bezier(.3,1.2,.5,1)",
        fill: "forwards",
      });
      el.addEventListener("click", () => a.updatePlaybackRate(3), { once: true });
      a.onfinish = () => el.remove();
    }

    function run(c: Cat) {
      const el = document.createElement("div");
      el.className = "cat run" + (c.fat ? " fat" : "");
      el.innerHTML = runner(c);
      stage.appendChild(el);
      const ltr = Math.random() < 0.5, w = el.getBoundingClientRect().width || 160, vw = innerWidth;
      if (!ltr) el.querySelector("svg")!.style.transform = "scaleX(-1)";
      const from = ltr ? -w - 20 : vw + 20, to = ltr ? vw + 20 : -w - 20;
      const a = el.animate([{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }], {
        duration: (c.fat ? 10000 : 7000) * Math.max(0.7, Math.min(1.4, vw / 1200)),
        easing: "linear",
        fill: "forwards",
      });
      el.addEventListener("click", () => a.updatePlaybackRate(2.5), { once: true });
      a.onfinish = () => el.remove();
    }

    function next() {
      timer = setTimeout(() => {
        // Only one cat on screen at a time, and none while the tab is hidden.
        if (!document.hidden && !stage.childElementCount) {
          const c = CATS[Math.floor(Math.random() * CATS.length)];
          (Math.random() < 0.62 ? peek : run)(c);
        }
        next();
      }, pickDelay());
    }

    timer = setTimeout(() => {
      peek(CATS[0]);
      next();
    }, FIRST_PEEK_MS);
    return () => {
      clearTimeout(timer);
      stage.replaceChildren();
    };
  }, []);

  return <div id="cats" ref={stageRef} aria-hidden="true" />;
}
