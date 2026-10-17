import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { dateLong } from "@/lib/dates";
import { LiveOpenButton } from "@/components/LivePanel";
import MapLinks from "@/components/MapLinks";
import NextTab from "@/components/NextTab";
import SeatFinder from "@/components/SeatFinder";
import SectionHead from "@/components/SectionHead";
import Spray from "@/components/Spray";

export const metadata: Metadata = { title: "The Day · Evan & Remy" };

const { ceremony, reception } = site;

export default function TheDay() {
  return (
    <>
      <section className="s" id="details">
        <div className="wrap">
          <SectionHead eyebrow={dateLong}>The day</SectionHead>
          <ol className="stops">
            <li className="venue">
              <Spray corner="tl" preset="card" index={4} />
              <Spray corner="tr" preset="card" seed={5} index={5} />
              <span className="eyebrow">First · {ceremony.label}</span>
              <h3>{ceremony.name}</h3>
              <address>{ceremony.street}<br />{ceremony.city}, {ceremony.region} {ceremony.zip}</address>
              <p className="area">{ceremony.area}</p>
              <div className="when"><span>Time</span>{ceremony.time}</div>
              <p className="parking"><b>Parking</b>{ceremony.parking}</p>
              <MapLinks place={ceremony} />
            </li>
            <li className="between" aria-label="Getting there">
              <span className="dot" aria-hidden="true" />
              <p>{site.between}</p>
            </li>
            <li className="venue">
              <Spray corner="tl" preset="card" seed={2} index={10} />
              <Spray corner="tr" preset="card" seed={13} index={11} />
              <span className="eyebrow">Then · {reception.label}</span>
              <h3>{reception.name}</h3>
              <address>{reception.street}<br />{reception.city}, {reception.region} {reception.zip}</address>
              <p className="area">{reception.area}</p>
              <div className="sched">
                {reception.schedule.map((r) => (
                  <div className="row" key={r.what}>
                    <div className="t">{r.t}</div>
                    <div><b>{r.what}</b><span>{r.note}</span></div>
                  </div>
                ))}
              </div>
              <p className="parking"><b>Parking</b>{reception.parking}</p>
              <MapLinks place={reception} />
            </li>
          </ol>
          <div className="day-foot">
            <Link className="btn ghost" href="/rsvp">RSVP</Link>
            <LiveOpenButton />
          </div>
        </div>
      </section>

      <section className="s" id="seat" style={{ background: "var(--paper)", borderBlock: "1px solid var(--line)" }}>
        <div className="wrap">
          <SectionHead eyebrow="For the reception">Find your seat</SectionHead>
          <SeatFinder />
        </div>
      </section>

      <NextTab href="/attire" label="What to wear" />
    </>
  );
}
