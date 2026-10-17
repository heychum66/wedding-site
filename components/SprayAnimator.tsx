"use client";

import { useEffect } from "react";

/** Starts each greenery spray's draw-in animation the first time it scrolls into view. */
export default function SprayAnimator() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-spray].wait");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.remove("wait"));
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("wait");
            e.target.classList.add("anim");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
