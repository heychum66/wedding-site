"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const d = await res.json().catch(() => ({}));
      setStatus(d.error ?? "That didn't work. Try again.");
    } catch {
      setStatus("That didn't go through. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="f">
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
      </div>
      <button className="btn" type="submit" disabled={busy} style={{ justifySelf: "start" }}>
        Sign in
      </button>
      <div className="status err" role="status">{status}</div>
    </form>
  );
}
