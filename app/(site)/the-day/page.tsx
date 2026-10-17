import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { dateLong } from "@/lib/dates";
import { LiveOpenButton } from "@/components/LivePanel";
import NextTab from "@/components/NextTab";
import SeatFinder from "@/components/SeatFinder";
import SectionHead from "@/components/SectionHead";
import Spray from "@/components/Spray";

export const metadata: Metadata = { title: "The Day · Evan & Remy" };

const { venue } = site;

export default function TheDay() {
  return (
    <>
      <section className="s" id="details">
        <div className="wrap">
          <SectionHead eyebrow={dateLong}>The <em>day</em></SectionHead>
          <div className="details">
            <div className="venue">
              <Spray corner="tl" preset="card" index={4} />
              <Spray corner="tr" preset="card" seed={5} index={5} />
              <span className="eyebrow">Ceremony &amp; reception</span>
              <h3>{venue.name}</h3>
              <address>{venue.street}<br />{venue.city}, {venue.region} {venue.zip}</address>
              <p style={{ color: "var(--ink-soft)", maxWidth: "42ch" }}>Ceremony, dinner and dancing, all under one roof.</p>
              <div className="stamp">Formal attire</div>
              <div className="acts" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <a className="btn" href={venue.mapsUrl} target="_blank" rel="noopener">Open in Maps</a>
                <Link className="btn ghost" href="/rsvp">RSVP</Link>
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

      <section className="s" id="seat" style={{ background: "var(--paper)", borderBlock: "1px solid var(--line)" }}>
        <div className="wrap">
          <SectionHead eyebrow="For the reception">Find your <em>seat</em></SectionHead>
          <SeatFinder />
        </div>
      </section>

      <NextTab href="/attire" label="What to wear" />
    </>
  );
}
