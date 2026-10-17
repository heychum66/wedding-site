"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const TABS = [
  { href: "/", label: "Home" },
  { href: "/the-day", label: "The Day" },
  { href: "/attire", label: "Attire" },
  { href: "/travel", label: "Travel" },
  { href: "/registry", label: "Registry" },
  { href: "/faq", label: "FAQ" },
] as const;

/** The tab bar: one page per tab, RSVP always one tap away. On phones the tabs scroll sideways under the logo. */
export default function SiteNav() {
  const path = usePathname();
  const list = useRef<HTMLUListElement>(null);

  // On narrow phones the tab row can scroll; keep the current tab in view.
  useEffect(() => {
    const ul = list.current, a = ul?.querySelector<HTMLElement>('[aria-current="page"]');
    if (ul && a && ul.scrollWidth > ul.clientWidth) ul.scrollTo({ left: a.offsetLeft - (ul.clientWidth - a.offsetWidth) / 2 });
  }, [path]);

  return (
    <nav aria-label="Main">
      <div className="wrap">
        <Link className="mono" href="/" aria-label="Home">
          E<span>&amp;</span>R
        </Link>
        <ul className="tabs" ref={list}>
          {TABS.map((t) => (
            <li key={t.href}>
              <Link href={t.href} aria-current={path === t.href ? "page" : undefined}>
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="navcta" href="/rsvp" aria-current={path === "/rsvp" ? "page" : undefined}>
          RSVP
        </Link>
      </div>
    </nav>
  );
}
