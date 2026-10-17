import { faq, site } from "@/content/site";
import { googleCalendarUrl, outlookCalendarUrl } from "@/lib/calendar";
import Cats from "@/components/Cats";
import Countdown from "@/components/Countdown";
import DressUp from "@/components/DressUp";
import HeroShell from "@/components/HeroShell";
import LivePanel, { LiveOpenButton } from "@/components/LivePanel";
import Names from "@/components/Names";
import Rsvp from "@/components/Rsvp";
import SeatFinder from "@/components/SeatFinder";
import SectionHead from "@/components/SectionHead";
import Spray from "@/components/Spray";
import SprayAnimator from "@/components/SprayAnimator";

const { names, venue, travel, hotelBlock } = site;
const dateLong = new Date(`${site.date}T12:00:00`).toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});
const dateFull = new Date(`${site.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const weekday = new Date(`${site.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long" });
const dateShort = new Date(`${site.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" });

export default function Home() {
  return (
    <>
      <Cats />
      <SprayAnimator />

      <nav aria-label="Main">
        <div className="wrap">
          <div className="mono">
            E<span>&amp;</span>R
          </div>
          <ul>
            <li><a href="#details">The Day</a></li>
            <li><a href="#attire">Attire</a></li>
            <li><a href="#seat">Your seat</a></li>
            <li><a href="#travel">Travel</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
          <a className="navcta" href="#rsvp">RSVP</a>
        </div>
      </nav>

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
          <div className="attire">Black tie</div>
          <div className="cal">
            <a className="btn ghost" target="_blank" rel="noopener" href={googleCalendarUrl}>Add to Google Calendar</a>
            <a className="btn ghost" target="_blank" rel="noopener" href={outlookCalendarUrl}>Add to Outlook</a>
            <a className="btn ghost" href="/api/calendar.ics" download="evan-and-remy.ics">Apple / .ics</a>
          </div>
        </div>
      </HeroShell>

      <Countdown target={site.ceremonyStart} />

      <section className="s" id="details">
        <div className="wrap">
          <SectionHead num="I." eyebrow={dateLong}>The <em>day</em></SectionHead>
          <div className="details">
            <div className="venue">
              <Spray corner="tl" preset="card" index={4} />
              <Spray corner="tr" preset="card" seed={5} index={5} />
              <span className="eyebrow">Ceremony &amp; reception</span>
              <h3>{venue.name}</h3>
              <address>{venue.street}<br />{venue.city}, {venue.region} {venue.zip}</address>
              <p style={{ color: "var(--ink-soft)", maxWidth: "42ch" }}>Ceremony, dinner and dancing, all under one roof.</p>
              <div className="stamp">Black tie</div>
              <div className="acts" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <a className="btn" href={venue.mapsUrl} target="_blank" rel="noopener">Open in Maps</a>
                <a className="btn ghost" href="#rsvp">RSVP</a>
              </div>
            </div>
            <div className="sched">
              <div className="row"><div className="t">TBD</div><div><b>Ceremony</b><span>Times go out with the formal invitation.</span></div></div>
              <div className="row"><div className="t">TBD</div><div><b>Cocktail hour</b><span>Cocktails and hors d&apos;oeuvres.</span></div></div>
              <div className="row"><div className="t">TBD</div><div><b>Dinner &amp; dancing</b><span>An evening of dinner, champagne and dancing.</span></div></div>
              <div className="row"><div className="t">Late</div><div><b>Last call</b><span>We&apos;ll be on the dance floor.</span></div></div>
              <LiveOpenButton />
            </div>
          </div>
        </div>
      </section>

      <section className="s" id="attire">
        <div className="wrap">
          <SectionHead num="II." eyebrow="What to wear">Black <em>tie</em></SectionHead>
          <DressUp />
        </div>
      </section>

      <section className="s" id="seat" style={{ background: "var(--paper)", borderBlock: "1px solid var(--line)" }}>
        <div className="wrap">
          <SectionHead num="III." eyebrow="For the reception">Find your <em>seat</em></SectionHead>
          <SeatFinder />
        </div>
      </section>

      <section className="s" id="travel">
        <div className="wrap">
          <SectionHead num="IV." eyebrow="Getting to Pittsburgh">Travel <em>&amp; stays</em></SectionHead>
          <div className="travel">
            <div>
              <h3>{travel.flying.heading}</h3>
              <div className="dist">{travel.flying.big}<small>{travel.flying.small}</small></div>
              <p>{travel.flying.body}</p>
            </div>
            <div>
              <h3>{travel.driving.heading}</h3>
              <div className="dist">{travel.driving.big}<small>{travel.driving.small}</small></div>
              <p>{travel.driving.body}</p>
              {hotelBlock ? (
                <p>
                  <b>Hotel block:</b>{" "}
                  <a href={hotelBlock.url} target="_blank" rel="noopener">{hotelBlock.name}</a>
                  {hotelBlock.code ? <>, booking code <b>{hotelBlock.code}</b></> : null}
                  {hotelBlock.bookBy ? `. Book by ${hotelBlock.bookBy}.` : "."}
                </p>
              ) : (
                <p><b>Hotel block:</b> coming soon. We&apos;ll post the link and booking code here.</p>
              )}
            </div>
            <div>
              <h3>{travel.weekend.heading}</h3>
              <ul className="todo-list">
                {travel.weekend.items.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="s rsvp-sec" id="rsvp">
        <Spray corner="br" preset="band" tone="light" index={6} />
        <Spray corner="tl" preset="band" tone="light" seed={3} index={7} />
        <div className="wrap">
          <SectionHead num="V." eyebrow={site.rsvpDeadlineLabel}>Kindly <em>reply</em></SectionHead>
          <div className="rsvp">
            <div className="pitch">
              <p>Tell us you&apos;re coming, pick your dinner, and request the song that gets you on the dance floor.</p>
              <p className="fine">You can come back and update your reply anytime before the deadline.</p>
            </div>
            <div>
              <Rsvp
                meals={site.meals}
                maxParty={site.maxPartySize}
                deadline={site.rsvpDeadline}
                requireContact={site.requireContact}
                dateLabel={dateShort}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="s" id="faq">
        <div className="wrap">
          <SectionHead num="VI." eyebrow="Good to know">Questions</SectionHead>
          <div className="faq">
            {faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>
                  {item.a}
                  {item.link ? <> <a href={item.link.href} target="_blank" rel="noopener">{item.link.label}</a></> : null}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <Spray corner="bl" preset="hero-small" tone="light" index={8} />
        <Spray corner="br" preset="hero-small" tone="light" seed={9} index={9} />
        <div className="wrap">
          <div className="big">{names.first} <span>&amp;</span> {names.second}</div>
          <p>{names.first} &amp; {names.second} · 09.18.2027 · Pittsburgh, PA</p>
        </div>
      </footer>
    </>
  );
}
