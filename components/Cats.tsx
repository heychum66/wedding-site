"use client";

import { useEffect, useRef } from "react";

type Cat = { key: string; fat: boolean; base: string; dark: string; muzzle: string; eye: string; head: string; body: string; earL: string; earR: string };

// Three cats in tiny black bow ties. The generators below are ported as-is from the prototype.
const CATS: Cat[]=[
  {key:"tabby",fat:true,base:"#8E8D93",dark:"#58575E",muzzle:"#CBCACE",eye:"#CFC24F",
    head:`<path d="M49 27 L53 42 M60 25 V42 M71 27 L67 42" stroke="#58575E" stroke-width="3.2" stroke-linecap="round"/><path d="M14 56 L34 59 M15 65 L33 65 M106 56 L86 59 M105 65 L87 65" stroke="#58575E" stroke-width="3" stroke-linecap="round"/>`,
    body:`<path d="M52 30 Q58 52 52 76 M68 27 Q74 52 68 78 M84 27 Q90 52 84 78 M100 30 Q106 52 100 74" stroke="#58575E" stroke-width="4.5" stroke-linecap="round" fill="none"/>`,
    earL:"#8E8D93",earR:"#8E8D93"},
  {key:"tortie1",fat:false,base:"#241C19",dark:"#120D0C",muzzle:"#3A2C26",eye:"#E2B53C",
    head:`<path d="M14 26 Q46 18 56 40 Q46 62 14 72 Z" fill="#B8622A"/><path d="M72 74 Q90 52 108 62 L108 104 L72 104 Z" fill="#D68B46"/><circle cx="82" cy="32" r="9" fill="#D68B46"/>`,
    body:`<ellipse cx="60" cy="40" rx="18" ry="12" fill="#B8622A"/><ellipse cx="96" cy="60" rx="16" ry="11" fill="#D68B46"/><ellipse cx="78" cy="34" rx="8" ry="6" fill="#D68B46"/>`,
    earL:"#B8622A",earR:"#241C19"},
  {key:"tortie2",fat:false,base:"#3A2A22",dark:"#1E1511",muzzle:"#E8C89C",eye:"#9DC25A",
    head:`<path d="M56 22 L64 22 L67 72 L53 72 Z" fill="#E8C89C"/><path d="M68 18 Q100 24 106 52 Q86 54 70 40 Z" fill="#C8763A"/><path d="M12 60 Q30 72 34 98 L12 98 Z" fill="#8E4A22"/>`,
    body:`<ellipse cx="54" cy="56" rx="16" ry="12" fill="#C8763A"/><ellipse cx="90" cy="38" rx="14" ry="9" fill="#8E4A22"/><ellipse cx="104" cy="62" rx="10" ry="8" fill="#E8C89C"/>`,
    earL:"#3A2A22",earR:"#C8763A"}
];
let uid=0;
function head(c: Cat){
  const id="ch"+(++uid),w=c.fat?47:40;
  return `<svg class="cathead" viewBox="0 0 120 112">
    <defs><clipPath id="${id}"><ellipse cx="60" cy="60" rx="${w}" ry="36"/></clipPath></defs>
    <g class="ears"><path d="M${60-w+6} 44 L${60-w+12} 8 L50 30 Z" fill="${c.earL}"/><path d="M${60-w+13} 36 L${60-w+15} 17 L45 31 Z" fill="#E7A6A3"/>
      <g class="ear-r"><path d="M${60+w-6} 44 L${60+w-12} 8 L70 30 Z" fill="${c.earR}"/><path d="M${60+w-13} 36 L${60+w-15} 17 L75 31 Z" fill="#E7A6A3"/></g></g>
    <ellipse cx="34" cy="100" rx="13" ry="8" fill="${c.base}"/><ellipse cx="86" cy="100" rx="13" ry="8" fill="${c.base}"/>
    <path d="M30 104 V98 M36 104 V98 M82 104 V98 M88 104 V98" stroke="${c.dark}" stroke-width="1"/>
    <ellipse cx="60" cy="60" rx="${w}" ry="36" fill="${c.base}"/>
    <g clip-path="url(#${id})">${c.head}</g>
    <ellipse cx="60" cy="76" rx="15" ry="9.5" fill="${c.muzzle}" opacity=".85"/>
    <g class="eyes"><ellipse cx="44" cy="56" rx="7.5" ry="8.5" fill="${c.eye}"/><ellipse cx="76" cy="56" rx="7.5" ry="8.5" fill="${c.eye}"/>
      <ellipse cx="44" cy="56" rx="2.2" ry="7" fill="#0B0A0C"/><ellipse cx="76" cy="56" rx="2.2" ry="7" fill="#0B0A0C"/>
      <circle cx="46.5" cy="52.5" r="1.6" fill="#fff"/><circle cx="78.5" cy="52.5" r="1.6" fill="#fff"/></g>
    <path d="M55.5 70 L64.5 70 L60 75.5 Z" fill="#D98C8C"/>
    <path d="M60 75.5 Q60 80.5 55 81.5 M60 75.5 Q60 80.5 65 81.5" stroke="#1a1a1a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M45 74 L8 69 M45 77.5 L10 81 M75 74 L112 69 M75 77.5 L110 81" stroke="#8D8A84" stroke-width=".8" opacity=".75"/>
    <path d="M47 91 L60 97.5 L47 104 Z M73 91 L60 97.5 L73 104 Z" fill="#0A090C" stroke="#CDAE6A" stroke-width=".8"/><circle cx="60" cy="97.5" r="3.2" fill="#0A090C" stroke="#CDAE6A" stroke-width=".8"/>
  </svg>`;
}
function runner(c: Cat){
  const id="cb"+(++uid),rx=c.fat?52:44,ry=c.fat?27:20,cy=54;
  return `<svg viewBox="0 0 170 104"><g class="bob">
    <path class="tail" d="M${78-rx+6} ${cy-6} Q14 ${cy-10} 12 ${cy-34}" stroke="${c.base}" stroke-width="${c.fat?9:7}" stroke-linecap="round" fill="none"/>
    <g class="lg2"><rect x="${78-rx+18}" y="${cy+6}" width="8" height="${c.fat?34:36}" rx="4" fill="${c.dark}"/><rect x="${78+rx-24}" y="${cy+6}" width="8" height="${c.fat?34:36}" rx="4" fill="${c.dark}"/></g>
    <defs><clipPath id="${id}"><ellipse cx="78" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath></defs>
    <ellipse cx="78" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c.base}"/>
    <g clip-path="url(#${id})">${c.body}</g>
    <g class="lg1"><rect x="${78-rx+8}" y="${cy+6}" width="8.5" height="${c.fat?34:36}" rx="4" fill="${c.base}"/><rect x="${78+rx-14}" y="${cy+6}" width="8.5" height="${c.fat?34:36}" rx="4" fill="${c.base}"/></g>
    <path d="M120 ${cy-24} L122 ${cy-42} L132 ${cy-30} Z M134 ${cy-30} L144 ${cy-44} L147 ${cy-25} Z" fill="${c.earR}"/>
    <circle cx="134" cy="${cy-16}" r="${c.fat?19:17}" fill="${c.base}"/>
    <ellipse cx="141" cy="${cy-18}" rx="2.6" ry="3.4" fill="${c.eye}"/><ellipse cx="141.3" cy="${cy-18}" rx=".9" ry="3" fill="#0B0A0C"/>
    <circle cx="${c.fat?152:150}" cy="${cy-11}" r="2" fill="#D98C8C"/>
    <path d="M146 ${cy-9} L166 ${cy-12} M146 ${cy-7} L165 ${cy-4}" stroke="#8D8A84" stroke-width=".7" opacity=".7"/>
    <path d="M120 ${cy+2} L128 ${cy-2} L128 ${cy+6} Z M136 ${cy+2} L128 ${cy-2} L128 ${cy+6} Z" fill="#0A090C" stroke="#CDAE6A" stroke-width=".7"/>
  </g></svg>`;
}

const FIRST_PEEK_MS = 6500;
const pickDelay = () => 15000 + Math.random() * 20000; // every 15–35s

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
      const a = el.animate([{ transform: off }, { transform: on, offset: 0.16 }, { transform: on, offset: 0.84 }, { transform: off }], {
        duration: 3400,
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
        duration: (c.fat ? 5200 : 3300) * Math.max(0.7, Math.min(1.4, vw / 1200)),
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
