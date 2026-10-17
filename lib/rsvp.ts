import "server-only";
import { z } from "zod";
import { site } from "@/content/site";
import { db, type RsvpRow } from "@/lib/db";

export const RSVP_COOKIE = "er_rsvp";
export const RSVP_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const trimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

const required = (max: number, msg: string) => z.string().trim().min(1, msg).max(max);
const contact = (max: number, msg: string) => (site.requireContact ? required(max, msg) : trimmed(max));

export const rsvpSchema = z
  .object({
    name: required(200, "Add your name so we know who's coming."),
    attending: z.boolean(),
    party_size: z.coerce.number().int().min(1).max(site.maxPartySize).default(1),
    meal: z.string().trim().max(60).optional().nullable(),
    song: trimmed(140),
    note: trimmed(600),
    /** Only asked on invites that include a plus-one. */
    plus_one_name: trimmed(120),
    phone: contact(40, "Add a phone number."),
    address_street: contact(200, "Add your mailing address."),
    address_city: contact(100, "Add your city."),
    address_state: contact(60, "Add your state."),
    address_zip: contact(20, "Add your ZIP code."),
    /** The code from a personal invite link (/?i=…), when the guest came from one. */
    invite: z.string().max(40).optional(),
    /** Honeypot. Real people never see this field. */
    website: z.string().optional(),
  })
  .transform((r) => ({
    ...r,
    party_size: r.attending ? r.party_size : 1,
    meal: r.attending ? r.meal || null : null,
    plus_one_name: r.attending && r.party_size > 1 ? r.plus_one_name : null,
  }))
  .refine((r) => !r.attending || (r.meal && site.meals.includes(r.meal)), {
    message: "Pick a dinner option.",
    path: ["meal"],
  });

export type RsvpInput = z.infer<typeof rsvpSchema>;

/** What the guest's own browser gets back. No ids, no tokens. */
export function publicReply(r: RsvpRow) {
  return {
    name: r.name,
    attending: r.attending,
    party_size: r.party_size,
    meal: r.meal,
    song: r.song,
    note: r.note,
    plus_one_name: r.plus_one_name,
    phone: r.phone,
    address_street: r.address_street,
    address_city: r.address_city,
    address_state: r.address_state,
    address_zip: r.address_zip,
  };
}

export const rsvpClosed = () => Date.now() > new Date(site.rsvpDeadline).getTime();

export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : req.headers.get("x-real-ip"))?.trim() || "unknown";
}

const LIMIT = 5;
const WINDOW_MINUTES = 10;

/** Records this attempt and says whether the IP is over 5 submissions in 10 minutes. */
export async function rateLimited(ip: string) {
  const sql = db();
  const [{ n }] = await sql<{ n: number }[]>`
    select count(*)::int as n from rsvp_attempts
    where ip = ${ip} and created_at > now() - make_interval(mins => ${WINDOW_MINUTES})`;
  if (n >= LIMIT) return true;
  await sql`insert into rsvp_attempts (ip) values (${ip})`;
  // Housekeeping: keep the table small.
  await sql`delete from rsvp_attempts where created_at < now() - interval '1 day'`;
  return false;
}
