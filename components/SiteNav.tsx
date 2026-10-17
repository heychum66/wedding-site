"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const TABS = [
  { href: "/", label: "Home" },
  { href: "/the-day", label: "The Day" },
  { href: "/attire", label: "Attire" },
  { href: "/travel", label: "Travel" },
  { href: "/faq", label: "FAQ" },
] as const;

/** The tab bar: one page per tab, RSVP always one tap away. On phones the tabs scroll sideways under the logo. */
export default function SiteNav() {
  const path = usePathname();
  return (
    <nav aria-label="Main">
      <div className="wrap">
        <Link className="mono" href="/" aria-label="Home">
          E<span>&amp;</span>R
        </Link>
        <ul className="tabs">
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
