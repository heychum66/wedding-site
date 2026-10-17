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
      <NextTab href="/faq" label="Questions" />
    </>
  );
}
