import type { Metadata } from "next";
import DressUp from "@/components/DressUp";
import NextTab from "@/components/NextTab";
import SectionHead from "@/components/SectionHead";

export const metadata: Metadata = { title: "Attire · Evan & Remy" };

export default function Attire() {
  return (
    <>
      <section className="s" id="attire">
        <div className="wrap">
          <SectionHead eyebrow="What to wear">Formal attire</SectionHead>
          <DressUp />
        </div>
      </section>
      <NextTab href="/travel" label="Getting to Pittsburgh" />
    </>
  );
}
