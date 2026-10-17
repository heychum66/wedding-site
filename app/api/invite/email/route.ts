import { z } from "zod";
import { db } from "@/lib/db";
import { emailEnabled, guestByToken, inviteUrl, sendInviteEmail, siteUrl } from "@/lib/guests";
import { clientIp, rateLimited } from "@/lib/rsvp";

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const schema = z.object({
  invite: z.string().max(40),
  email: z.string().trim().toLowerCase().max(200).email("That email doesn't look right."),
});

/** A guest on their invite page asks for the invitation by email. It only ever goes to the address they type. */
export async function POST(req: Request) {
  if (!emailEnabled()) return json({ error: "Email isn't set up yet. Your text link works just the same." }, 503);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "That didn't go through. Try again." }, 400);
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Check the email and try again." }, 400);
  const guest = await guestByToken(parsed.data.invite);
  if (!guest) return json({ error: "That invite link doesn't look right." }, 404);
  if (guest.emailed_at && Date.now() - guest.emailed_at.getTime() < 60_000) {
    return json({ error: "We just sent one. Give it a minute, and check your spam folder." }, 429);
  }
  if (await rateLimited(clientIp(req))) return json({ error: "Too many tries. Give it a few minutes." }, 429);

  try {
    await sendInviteEmail(parsed.data.email, guest, inviteUrl(siteUrl(req), guest.invite_token));
  } catch (err) {
    console.error("invite email failed", err);
    return json({ error: "We couldn't send that just now. Try again in a bit." }, 502);
  }
  await db()`update guests set email = ${parsed.data.email}, emailed_at = now() where id = ${guest.id}`;
  return json({ ok: true });
}
