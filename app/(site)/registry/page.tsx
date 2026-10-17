import type { Metadata } from "next";
import { site } from "@/content/site";
import NextTab from "@/components/NextTab";
import SectionHead from "@/components/SectionHead";

export const metadata: Metadata = { title: "Registry · Evan & Remy" };

export default function Registry() {
  const { registries } = site;
  return (
    <>
      <section className="s" id="registry">
        <div className="wrap">
          <SectionHead eyebrow="If you'd like">The <em>registry</em></SectionHead>
          <p className="registry-intro">
            Your being there is the best gift we could ask for. If you&apos;d like to celebrate with something more, here&apos;s
            where to find us.
          </p>
          {registries.length ? (
            <ul className="registries">
              {registries.map((r) => (
                <li key={r.url} className="tcard">
                  <h3>{r.name}</h3>
                  {r.note && <p>{r.note}</p>}
                  <a className="btn" href={r.url} target="_blank" rel="noopener">
                    View registry
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="registries-soon tcard">
              <h3>Coming soon</h3>
              <p>We&apos;re still putting it together. Check back here for the link.</p>
            </div>
          )}
        </div>
      </section>
      <NextTab href="/faq" label="Questions" />
    </>
  );
}
