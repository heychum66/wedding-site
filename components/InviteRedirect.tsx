"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Invite links used to be /?i=<code>#rsvp. Anyone holding one lands on the RSVP tab instead. */
export default function InviteRedirect() {
  const router = useRouter();
  useEffect(() => {
    const code = new URLSearchParams(location.search).get("i");
    if (code) router.replace(`/rsvp?i=${encodeURIComponent(code)}`);
  }, [router]);
  return null;
}
