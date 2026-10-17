"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** The hero header: cursor spotlight + champagne-bubble canvas (paused off-screen). */
export default function HeroShell({ children }: { children: ReactNode }) {
  const hero = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const h = hero.current!,
      c = canvas.current!;
    const onMove = (e: PointerEvent) => {
      const r = h.getBoundingClientRect();
      h.style.setProperty("--mx", e.clientX - r.left + "px");
      h.style.setProperty("--my", e.clientY - r.top + "px");
    };
    h.addEventListener("pointermove", onMove);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => h.removeEventListener("pointermove", onMove);

    const x = c.getContext("2d")!;
    type B = { x: number; y: number; r: number; v: number; ph: number; a: number };
    let W = 0,
      H = 0,
      dpr = 1,
      on = true,
      raf: number | null = null;
    const bs: B[] = [];
    function size() {
      dpr = devicePixelRatio || 1;
      W = c.clientWidth;
      H = c.clientHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const mk = (init: boolean): B => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: 0.6 + Math.random() * 2.4, v: 0.25 + Math.random() * 0.8, ph: Math.random() * 6.28, a: 0.15 + Math.random() * 0.45 });
    size();
    const n = Math.round(Math.min(70, W / 18));
    for (let i = 0; i < n; i++) bs.push(mk(true));
    addEventListener("resize", size);
    function loop() {
      if (!on) {
        raf = null;
        return;
      }
      x.clearRect(0, 0, W, H);
      for (const b of bs) {
        b.y -= b.v;
        b.ph += 0.02;
        const bx = b.x + Math.sin(b.ph) * 6;
        const fade = Math.min(1, b.y / (H * 0.35));
        x.beginPath();
        x.arc(bx, b.y, b.r, 0, 6.283);
        x.strokeStyle = `rgba(176,141,62,${b.a * fade})`;
        x.lineWidth = 0.8;
        x.stroke();
        x.beginPath();
        x.arc(bx - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.3, 0, 6.283);
        x.fillStyle = `rgba(22,61,140,${b.a * fade * 0.5})`;
        x.fill();
        if (b.y < -10) Object.assign(b, mk(false));
      }
      raf = requestAnimationFrame(loop);
    }
    const io = new IntersectionObserver((es) => {
      on = es[0].isIntersecting;
      if (on && !raf) loop();
    });
    io.observe(h);
    loop();
    return () => {
      on = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("resize", size);
      h.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <header className="hero" id="hero" ref={hero}>
      <canvas className="bubbles" ref={canvas} aria-hidden="true" />
      {children}
    </header>
  );
}
