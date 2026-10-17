import "server-only";
import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { site } from "@/content/site";
import { db, type GuestRow } from "@/lib/db";

export const newInviteToken = () => randomBytes(9).toString("base64url");

/** Invite codes are 12 url-safe characters; anything else is not worth a query. */
export async function guestByToken(token: unknown) {
  if (typeof token !== "string" || !/^[\w-]{8,32}$/.test(token)) return null;
  const [g] = await db()<GuestRow[]>`select * from guests where invite_token = ${token}`;
  return g ?? null;
}

/** What a guest's own invite page gets back about their invitation. */
export const publicGuest = (g: GuestRow) => ({ name: g.name, party_size: g.party_size, phone: g.phone });

/** NEXT_PUBLIC_SITE_URL when set; otherwise the address the visitor actually used, so links match it. */
export function siteUrl(req?: Request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (req) return new URL(req.url).origin;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const inviteUrl = (base: string, token: string) => `${base}/?i=${token}#rsvp`;

/**
 * Email goes out from your own Gmail, using a Google "app password" (not your normal password).
 * Both settings must be present or the feature stays hidden.
 */
export const emailEnabled = () => Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function sendInviteEmail(to: string, guest: GuestRow, link: string) {
  const { names } = site;
  const couple = `${names.first} & ${names.second}`;
  const dateLong = new Date(`${site.date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const where = `${site.venue.name} · ${site.venue.city}, ${site.venue.region}`;
  const text = [
    `Dear ${guest.name},`,
    "",
    `${couple} request the pleasure of your company at their wedding.`,
    "",
    dateLong,
    where,
    "Black tie",
    "",
    `Kindly reply ${site.rsvpDeadlineLabel.toLowerCase()}:`,
    link,
  ].join("\n");
  const html = `<!doctype html><html><body style="margin:0;background:#FAF6EC;font-family:Georgia,serif;color:#13264F">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table role="presentation" width="100%" style="max-width:520px;border:1px solid #9A7628;background:#fff" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:44px 28px">
<p style="margin:0 0 18px;font:12px/1.4 Arial,sans-serif;letter-spacing:4px;text-transform:uppercase;color:#9A7628">Dear ${esc(guest.name)}</p>
<h1 style="margin:0;font-weight:400;font-size:40px;line-height:1.1">${esc(names.first)} <i style="color:#9A7628">&amp;</i> ${esc(names.second)}</h1>
<p style="margin:18px 0 26px;font-style:italic;font-size:18px;color:#5A6278">request the pleasure of your company at their wedding</p>
<p style="margin:0;font-size:20px">${esc(dateLong)}</p>
<p style="margin:6px 0 0;font-size:16px;color:#5A6278">${esc(where)} · Black tie</p>
<p style="margin:32px 0 0"><a href="${esc(link)}" style="display:inline-block;background:#163D8C;color:#FFFFFF;text-decoration:none;padding:14px 30px;font:bold 12px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase">RSVP</a></p>
<p style="margin:18px 0 0;font:13px/1.5 Arial,sans-serif;color:#5A6278">Kindly reply ${esc(site.rsvpDeadlineLabel.toLowerCase())}.</p>
</td></tr></table></td></tr></table></body></html>`;

  const user = process.env.GMAIL_USER!;
  const mail = nodemailer.createTransport({
    service: "gmail",
    // Google shows app passwords with spaces ("abcd efgh ijkl mnop"); either form works.
    auth: { user, pass: process.env.GMAIL_APP_PASSWORD!.replace(/\s/g, "") },
  });
  await mail.sendMail({ from: { name: couple, address: user }, to, subject: `You're invited: ${couple}`, text, html });
}
