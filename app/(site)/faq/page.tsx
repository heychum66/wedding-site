import type { Metadata } from "next";
import { faq } from "@/content/site";
import NextTab from "@/components/NextTab";
import SectionHead from "@/components/SectionHead";

export const metadata: Metadata = { title: "FAQ · Evan & Remy" };

export default function Faq() {
  return (
    <>
      <section className="s" id="faq">
        <div className="wrap">
          <SectionHead eyebrow="Good to know">Questions</SectionHead>
          <div className="faq">
            {faq.map((item) => (
              <div className="qa" key={item.q}>
                <h3>{item.q}</h3>
                <p>
                  {item.a}
                  {item.link ? <> <a href={item.link.href} target="_blank" rel="noopener">{item.link.label}</a></> : null}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <NextTab href="/rsvp" label="Kindly reply" />
    </>
  );
}
