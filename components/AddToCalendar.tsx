"use client";

import { useEffect, useRef, useState } from "react";

type Option = { label: string; href: string; download?: string };

/** One "Add to calendar" button; tapping it lists the calendar apps to choose from. */
export default function AddToCalendar({ options }: { options: Option[] }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Close on a tap elsewhere or Escape.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("pointerdown", away);
    addEventListener("keydown", esc);
    return () => {
      removeEventListener("pointerdown", away);
      removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className="cal" ref={box}>
      <button className="btn ghost" type="button" aria-expanded={open} aria-controls="cal-menu" onClick={() => setOpen((o) => !o)}>
        Add to calendar <span className="caret" aria-hidden="true">▾</span>
      </button>
      <ul id="cal-menu" className="cal-menu" hidden={!open}>
        {options.map((o) => (
          <li key={o.label}>
            <a
              href={o.href}
              {...(o.download ? { download: o.download } : { target: "_blank", rel: "noopener" })}
              onClick={() => setOpen(false)}
            >
              {o.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
