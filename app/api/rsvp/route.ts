import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db, type GuestRow, type RsvpRow } from "@/lib/db";
import { emailEnabled, guestByToken, publicGuest } from "@/lib/guests";
import {
  RSVP_COOKIE,
  RSVP_COOKIE_MAX_AGE,
  clientIp,
  publicReply,
  rateLimited,
  rsvpClosed,
  rsvpSchema,
  type RsvpInput,
} from "@/lib/rsvp";

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

async function currentToken() {
  return (await cookies()).get(RSVP_COOKIE)?.value;
}

async function setToken(token: string) {
  (await cookies()).set(RSVP_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: RSVP_COOKIE_MAX_AGE,
  });
}

/**
 * The guest's own reply, if their browser has one. With ?i=<invite code> it also returns
 * the invitation, and the reply saved for it from any device.
 */
export async function GET(req: Request) {
  const guest = await guestByToken(new URL(req.url).searchParams.get("i"));
  if (guest) {
    const [row] = await db()<RsvpRow[]>`select * from rsvps where guest_id = ${guest.id}`;
    return json({
      reply: row ? publicReply(row) : null,
      closed: rsvpClosed(),
      guest: publicGuest(guest),
      email: emailEnabled(),
    });
  }
  const token = await currentToken();
  if (!token) return json({ reply: null, closed: rsvpClosed() });
  const [row] = await db()<RsvpRow[]>`select * from rsvps where edit_token = ${token}`;
  return json({ reply: row ? publicReply(row) : null, closed: rsvpClosed() });
}

async function parse(req: Request) {
  if (rsvpClosed()) return { error: json({ error: "RSVPs are closed. Reach out to us directly." }, 403) };
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { error: json({ error: "That didn't go through. Try again." }, 400) };
  }
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return { error: json({ error: parsed.error.issues[0]?.message ?? "Check the form and try again." }, 400) };
  }
  if (await rateLimited(clientIp(req))) {
    return { error: json({ error: "Too many tries. Give it a few minutes and try again." }, 429) };
  }
  let guest: GuestRow | null = null;
  if (parsed.data.invite) {
    guest = await guestByToken(parsed.data.invite);
    if (!guest) return { error: json({ error: "That invite link doesn't look right. Check the link we sent you." }, 404) };
    if (parsed.data.party_size > guest.party_size) {
      const seats = guest.party_size === 1 ? "1 seat" : `${guest.party_size} seats`;
      return { error: json({ error: `Your invitation has ${seats}. Reach out to us if that's not right.` }, 400) };
    }
  }
  return { data: parsed.data, guest };
}

/** Saves the one reply that belongs to an invitation: a new row the first time, the same row after. */
async function saveForGuest(guest: GuestRow, r: RsvpInput) {
  const token = randomBytes(24).toString("base64url");
  const [row] = await db()<(RsvpRow & { edit_token: string })[]>`
    insert into rsvps (edit_token, guest_id, name, attending, party_size, meal, song, note,
                       phone, address_street, address_city, address_state, address_zip)
    values (${token}, ${guest.id}, ${r.name}, ${r.attending}, ${r.party_size}, ${r.meal}, ${r.song}, ${r.note},
            ${r.phone}, ${r.address_street}, ${r.address_city}, ${r.address_state}, ${r.address_zip})
    on conflict (guest_id) do update set
      name = excluded.name, attending = excluded.attending, party_size = excluded.party_size,
      meal = excluded.meal, song = excluded.song, note = excluded.note, phone = excluded.phone,
      address_street = excluded.address_street, address_city = excluded.address_city,
      address_state = excluded.address_state, address_zip = excluded.address_zip,
      updated_at = now()
    returning *`;
  await setToken(row.edit_token);
  return row;
}

export async function POST(req: Request) {
  const { data, guest, error } = await parse(req);
  if (error) return error;
  // Bots fill in every field. Pretend it worked and store nothing.
  if (data.website) return json({ reply: publicReplyFrom(data) }, 201);
  if (guest) return json({ reply: publicReply(await saveForGuest(guest, data)) }, 201);

  const r = data;
  const token = randomBytes(24).toString("base64url");
  const [row] = await db()<RsvpRow[]>`
    insert into rsvps (edit_token, name, attending, party_size, meal, song, note,
                       phone, address_street, address_city, address_state, address_zip)
    values (${token}, ${r.name}, ${r.attending}, ${r.party_size}, ${r.meal}, ${r.song}, ${r.note},
            ${r.phone}, ${r.address_street}, ${r.address_city}, ${r.address_state}, ${r.address_zip})
    returning *`;
  await setToken(token);
  return json({ reply: publicReply(row), edit_token: token }, 201);
}

export async function PUT(req: Request) {
  const token = await currentToken();
  const { data, guest, error } = await parse(req);
  if (error) return error;
  if (data.website) return json({ reply: publicReplyFrom(data) });
  if (guest) return json({ reply: publicReply(await saveForGuest(guest, data)) });
  if (!token) return json({ error: "We couldn't find your earlier reply. Send a new one." }, 404);

  const r = data;
  const [row] = await db()<RsvpRow[]>`
    update rsvps set
      name = ${r.name}, attending = ${r.attending}, party_size = ${r.party_size}, meal = ${r.meal},
      song = ${r.song}, note = ${r.note}, phone = ${r.phone},
      address_street = ${r.address_street}, address_city = ${r.address_city},
      address_state = ${r.address_state}, address_zip = ${r.address_zip},
      updated_at = now()
    where edit_token = ${token}
    returning *`;
  if (!row) return json({ error: "We couldn't find your earlier reply. Send a new one." }, 404);
  await setToken(token); // refresh the one-year expiry
  return json({ reply: publicReply(row) });
}

function publicReplyFrom(r: RsvpInput) {
  return publicReply({ ...r, id: "", guest_id: null, created_at: new Date(), updated_at: new Date() });
}
