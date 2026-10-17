import type { Metadata } from "next";
import { site } from "@/content/site";
import { dateShort } from "@/lib/dates";
import Rsvp from "@/components/Rsvp";
import SectionHead from "@/components/SectionHead";
import Spray from "@/components/Spray";

export const metadata: Metadata = { title: "RSVP · Evan & Remy" };

export default function RsvpPage() {
  return (
    <section className="s rsvp-sec" id="rsvp">
      <Spray corner="br" preset="band" tone="light" index={6} />
      <Spray corner="tl" preset="band" tone="light" seed={3} index={7} />
      <div className="wrap">
        <SectionHead eyebrow={site.rsvpDeadlineLabel}>Kindly <em>reply</em></SectionHead>
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
  );
}
