# Evan & Remy · September 18, 2027

The wedding website: Next.js (App Router) + TypeScript on Vercel, with RSVPs stored in **Supabase** Postgres.
Guests don't log in. Evan & Remy see the guest list at `/admin`.

## Local development

You need Node 20+ and a Postgres database. Either point at your Supabase project, or run Postgres locally.

```bash
npm install
cp .env.example .env.local      # then fill in the three values
npm run migrate                 # creates the tables (safe to re-run)
npm run dev                     # http://localhost:3000
```

For a local Postgres, use `DATABASE_URL=postgres://postgres@127.0.0.1:5432/wedding` (SSL is turned off automatically for localhost).

Handy URLs while developing:

- `/#live-preview` opens the wedding-day "Happening now" panel with its scrubber
- `/admin` is the guest list (password is `ADMIN_PASSWORD`)
- `/api/calendar.ics` is the Apple / .ics calendar file

## Connecting Supabase

1. In [Supabase](https://supabase.com/dashboard), open your project (or create one; pick a region near Pittsburgh such as `us-east-1`).
2. Click **Connect** at the top of the project, choose **ORMs / Connection string**, and copy the **Transaction pooler** URL (port `6543`). Replace `[YOUR-PASSWORD]` with the database password.
   Lost the password? **Project Settings → Database → Reset database password**.
3. Put that URL in `.env.local` as `DATABASE_URL` and run `npm run migrate`.
   (Or paste `sql/schema.sql` into Supabase's **SQL Editor** and click **Run**. Same result.)
4. In Vercel, add the same `DATABASE_URL` under **Project → Settings → Environment Variables**.

What gets stored, in the `rsvps` table: name, attending, party size, dinner choice, phone, mailing address (street / city / state / ZIP), song request, note, and created/updated times. You can browse it in Supabase under **Table Editor → rsvps**, or download a CSV from `/admin`.

Privacy: the schema turns on **row level security** with no policies, so Supabase's public REST API (the "anon key") can't read guests' addresses or phone numbers. The site connects as the database owner over `DATABASE_URL`, which stays on the server. Never put `DATABASE_URL` in a `NEXT_PUBLIC_` variable.

## Deploying

1. Push this repo to GitHub, then in Vercel: **Add New → Project → import the repo**. Framework is detected automatically.
2. Under **Settings → Environment Variables**, add for Production (and Preview if you like):
   - `DATABASE_URL`: Supabase transaction-pooler URL
   - `ADMIN_PASSWORD`: what you'll type at `/admin`
   - `ADMIN_SECRET`: a long random string (`openssl rand -hex 32`)
   - `NEXT_PUBLIC_SITE_URL` (optional): e.g. `https://evanandremy.com`, used in link previews and the .ics file
3. Deploy. Every push to `main` redeploys.
4. Run `npm run migrate` once against the production `DATABASE_URL` if you haven't already.

## Invitations (guest list, text invites, email)

At `/admin`, under **Invitations**:

1. **Import CSV.** Export your guest spreadsheet as CSV. Columns: `Name` (required, or `First name` + `Last name`), `Phone`, `Email`, `Party size`. Header names are matched loosely ("Cell", "# of guests" work). One row per person or per household. Importing again updates matching names (blank cells never erase saved info), so keep editing the spreadsheet and re-import.
2. Each guest gets a private link (`/?i=<code>#rsvp`). It opens the site with "Dear <name>", fills in their name and phone, and limits the party to their seats. Their reply is tied to their row, so the list shows who has replied.
3. **Text invite** (on a phone) opens Messages with their number and the invite text filled in; tap send. It's marked as texted. Guests without a phone get **Copy message** instead. **Download with links** gives a CSV of everyone's link for a mail merge.
4. The text is `inviteText` in `content/site.ts` (`{name}` and `{link}` get filled in).

**Email me this invitation:** guests can type their email on their invite page and the site emails them the invitation (only to the address they type), sent from your own Gmail so replies come straight to you. To turn it on:

1. Your Google account needs 2-Step Verification on (myaccount.google.com/security).
2. Go to myaccount.google.com/apppasswords, name it "wedding site", and copy the 16-character password.
3. In Vercel, add `GMAIL_USER` (your Gmail address) and `GMAIL_APP_PASSWORD` (that password), then redeploy.

Gmail allows about 500 emails a day. To turn it off, delete the app password in your Google account.

## Custom domain

Vercel → your project → **Settings → Domains → Add**, type the domain, and follow the DNS instructions it shows (an `A` record for the apex domain, a `CNAME` for `www`). HTTPS is automatic. Then set `NEXT_PUBLIC_SITE_URL` to the new domain and redeploy so link previews use it.

## Where to edit things

| What | File |
| --- | --- |
| Names, date, venue + address, RSVP deadline, meal options, invite text message, hotel block, registry link, travel copy, FAQ, whether phone/address are required | `content/site.ts` |
| Wedding-day timeline for the live panel (times are placeholders) | `content/schedule.ts` |
| Seating chart: fill in tables, then flip `READY` to `true` the week of the wedding | `content/seating.ts` |
| The cats (drawn from photos of ours) | `components/Cats.tsx` |
| Colors, type, animation | `app/globals.css` (ported from the prototype; token names like `--sapphire`, `--gold` are unchanged) |

Commit and push; Vercel redeploys.

## How it fits together

- `app/page.tsx` is the one-page site. Interactive pieces are client components in `components/` (countdown, live panel, dress-up, seat finder, cats, RSVP form, hero bubbles/spotlight). The greenery sprays are generated on the server from a seeded RNG (`lib/greenery.ts`).
- `app/api/rsvp` handles `GET` (your own reply, from the cookie), `POST` (new reply) and `PUT` (edit).
- `app/api/admin/*` handles login/logout, CSV export and deletes. `proxy.ts` guards `/admin` and `/api/admin/*`.
- `app/api/calendar.ics` serves the Apple/.ics file. `app/opengraph-image.tsx`, `app/icon.tsx` and `app/apple-icon.tsx` draw the link preview and favicons.
- `sql/schema.sql` + `scripts/migrate.ts` hold the database.

## Decisions

Calls made while building, so nothing is a surprise:

- **Supabase instead of Neon.** The brief said Neon; you asked for Supabase partway through. The site talks to Supabase as plain Postgres with the [`postgres`](https://github.com/porsager/postgres) driver and hand-written SQL (no ORM, no supabase-js), through the transaction pooler with prepared statements off, which is what serverless functions need.
- **Phone and mailing address added to the RSVP form**, as you asked. They're optional by default so nobody bounces off the form; set `requireContact: true` in `content/site.ts` to make them required. They appear in the admin table and the CSV. Guests who decline see them too (handy for thank-you cards).
- **Row level security on**, with no policies, so personal details can't be read through Supabase's public API.
- **`proxy.ts`, not `middleware.ts`.** Next 16 renamed middleware to proxy; it does the same job. The admin route handlers and page check the signed cookie again on their own.
- **Admin cookie** is `expiry.HMAC-SHA256(expiry, ADMIN_SECRET)`, httpOnly, 30 days. Wrong passwords get a small per-instance slowdown after 8 tries.
- **Guest edit cookie** (`er_rsvp`) holds a random 192-bit `edit_token`, httpOnly, one year, refreshed on each edit. If a reply is deleted in admin, that guest's next save becomes a fresh reply.
- **Declines** are stored with `party_size = 1` and no meal (the column must be 1–5). "Coming" in admin sums party sizes of yes replies only.
- **Meal counts** in admin multiply a party's dinner choice by its party size, since the form asks for one dinner per party.
- **Rate limit**: 5 submissions per IP per 10 minutes, kept in the `rsvp_attempts` table so it works across serverless instances. Rows older than a day are cleaned up as new ones arrive. Invalid submissions are rejected before they count.
- **Honeypot**: a visually hidden "website" field. If it's filled, the API answers like a success but stores nothing.
- **RSVP deadline** is end of day Aug 1, 2027 Eastern. After it, the form becomes a "closed" note, and existing guests still see their reply but not "Change my reply". The server enforces it too.
- **Button label stays "Send RSVP"** when editing, matching the prototype's copy.
- **Apple / .ics** is a third button beside Google and Outlook. The event is 4:30pm–midnight Eastern, like the prototype's links. The .ics only includes the site URL once `NEXT_PUBLIC_SITE_URL` is set or the site is on Vercel.
- **`[hidden]` fix.** In the prototype, `hidden` lost to `display:grid/flex`, so the party/dinner fields and preview bar never actually hid. One global rule makes `hidden` win, which is the behavior the prototype intended.
- **Shimmer handoff.** The prototype swapped the letters for plain text when the shimmer started. Here the letters stay and switch to `display:inline`, which looks identical. The swap made browsers log a second, late "largest paint", which cost about 20 Lighthouse points.
- **Greenery is server-rendered** in its "waiting" state (identical output, since the RNG is seeded by preset, seed and position). One small client script starts each spray when it scrolls in. With reduced motion or no JavaScript, the leaves simply show.
- **Live timeline rail** is an `<li>` instead of a `<span>` inside the `<ol>`, so the HTML is valid. It looks the same.
- **Bodoni Moda** loads as the variable font (needed for the `opsz` axis); 400 is the only weight used.
- **Cats** appear every 15–35s as the brief says (the prototype used 14–36s). The first peek is still at 6.5s.
- **Lighthouse (mobile, local production build):** accessibility 96, best practices 100, SEO 100. Performance scored 90–91 on most runs and 88 on one. The main cost is that the names start hidden and rise in, which the design calls for. Contrast warnings are on small gold labels from the prototype palette, which was left unchanged.
