import type { Metadata } from "next";
import AdminLogin from "@/components/AdminLogin";
import { LeafRule } from "@/components/SectionHead";

export const metadata: Metadata = { title: "Sign in · Evan & Remy", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="s rsvp-sec admin">
      <div className="wrap login">
        <div className="shead" style={{ marginBottom: 0 }}>
          <span className="eyebrow">For Evan &amp; Remy</span>
          <h2>Guest <em>list</em></h2>
          <LeafRule />
        </div>
        <AdminLogin />
      </div>
    </main>
  );
}
