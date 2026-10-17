import Link from "next/link";

/** "Next: Attire →" at the foot of each tab, so the site still reads in order. */
export default function NextTab({ href, label }: { href: string; label: string }) {
  return (
    <div className="wrap next-tab">
      <Link href={href}>
        <small>Next</small>
        {label} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
