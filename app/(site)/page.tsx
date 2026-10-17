import Link from "next/link";
import { site } from "@/content/site";
import { googleCalendarUrl, outlookCalendarUrl } from "@/lib/calendar";
import { dateFull, weekday } from "@/lib/dates";
import Countdown from "@/components/Countdown";
import HeroShell from "@/components/HeroShell";
import InviteRedirect from "@/components/InviteRedirect";
import LivePanel from "@/components/LivePanel";
import Names from "@/components/Names";
import Spray from "@/components/Spray";

const { names, venue } = site;

const TILES = [
  { href: "/the-day", eyebrow: "Venue & schedule", title: "The day" },
  { href: "/attire", eyebrow: "What to wear", title: "Attire" },
  { href: "/travel", eyebrow: "Getting to Pittsburgh", title: "Travel" },
  { href: "/faq", eyebrow: "Good to know", title: "Questions" },
  { href: "/rsvp", eyebrow: site.rsvpDeadlineLabel, title: "RSVP" },
];

export default function Home() {
  return (
    <>
      <InviteRedirect />
      <LivePanel />

      <HeroShell>
        <Spray corner="tl" preset="hero-big" index={0} />
        <Spray corner="tr" preset="hero-big" seed={7} index={1} />
        <Spray corner="bl" preset="hero-small" index={2} />
        <Spray corner="br" preset="hero-small" seed={11} index={3} />
        <div className="wrap">
          <div className="meta"><span className="eyebrow">Together with their families</span></div>
          <div className="rule"><i /></div>
          <Names first={names.first} second={names.second} />
          <div className="rule"><i /></div>
          <p className="lead">request the pleasure of your company at their wedding</p>
          <div className="datebox">
            {dateFull}<small><span>{weekday}</span><i> · </i><span>{venue.name}</span><i> · </i><span>{venue.city}</span></small>
          </div>
          <div className="attire">Formal attire</div>
          <div className="cal">
            <a className="btn ghost" target="_blank" rel="noopener" href={googleCalendarUrl}>Add to Google Calendar</a>
            <a className="btn ghost" target="_blank" rel="noopener" href={outlookCalendarUrl}>Add to Outlook</a>
            <a className="btn ghost" href="/api/calendar.ics" download="evan-and-remy.ics">Apple / .ics</a>
          </div>
        </div>
      </HeroShell>

      <Countdown target={site.ceremonyStart} />

      <section className="s tiles-sec">
        <div className="wrap">
          <ul className="tiles">
            {TILES.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className={t.href === "/rsvp" ? "tile rsvp-tile" : "tile"}>
                  <span className="eyebrow">{t.eyebrow}</span>
                  <b>{t.title}</b>
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
