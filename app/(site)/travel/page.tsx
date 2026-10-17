import type { Metadata } from "next";
import { site } from "@/content/site";
import NextTab from "@/components/NextTab";
import SectionHead from "@/components/SectionHead";

export const metadata: Metadata = { title: "Travel · Evan & Remy" };

const { travel, hotelBlock } = site;

export default function Travel() {
  return (
    <>
      <section className="s" id="travel">
        <div className="wrap">
          <SectionHead eyebrow="Getting to Pittsburgh">Travel <em>&amp; stays</em></SectionHead>
          <div className="travel">
            <div className="tcard">
              <h3>{travel.flying.heading}</h3>
              <div className="dist">{travel.flying.big}<small>{travel.flying.small}</small></div>
              <p>{travel.flying.body}</p>
            </div>
            <div className="tcard">
              <h3>{travel.driving.heading}</h3>
              <div className="dist">{travel.driving.big}<small>{travel.driving.small}</small></div>
              <p>{travel.driving.body}</p>
            </div>
            <div className="tcard">
              <h3>Parking</h3>
              <dl className="facts">
                <div>
                  <dt>At the church</dt>
                  <dd>{site.ceremony.parking}</dd>
                </div>
                <div>
                  <dt>At Edgewood</dt>
                  <dd>{site.reception.parking}</dd>
                </div>
              </dl>
            </div>
            <div className="tcard">
              <h3>Where to stay</h3>
              {hotelBlock ? (
                <p>
                  <b>Hotel block:</b>{" "}
                  <a href={hotelBlock.url} target="_blank" rel="noopener">{hotelBlock.name}</a>
                  {hotelBlock.code ? <>, booking code <b>{hotelBlock.code}</b></> : null}
                  {hotelBlock.bookBy ? `. Book by ${hotelBlock.bookBy}.` : "."}
                </p>
              ) : (
                <p>We&apos;re setting up a hotel block. The link and booking code will be posted here.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <NextTab href="/registry" label="Registry" />
    </>
  );
}
