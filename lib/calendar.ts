import { ceremonyAddress, site } from "@/content/site";

// The calendar entry points people to the church first; the description names the reception.
const venueAddress = ceremonyAddress;

const { title, start, end, description } = site.event;

/** 2027-09-18T16:30:00-04:00 → 20270918T203000Z */
const utcStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export const googleCalendarUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
  encodeURIComponent(title) +
  `&dates=${utcStamp(start)}/${utcStamp(end)}&ctz=${site.timezone}&location=` +
  encodeURIComponent(venueAddress) +
  "&details=" +
  encodeURIComponent(description);

export const outlookCalendarUrl =
  "https://outlook.live.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&subject=" +
  encodeURIComponent(title) +
  "&startdt=" +
  encodeURIComponent(start) +
  "&enddt=" +
  encodeURIComponent(end) +
  "&location=" +
  encodeURIComponent(venueAddress) +
  "&body=" +
  encodeURIComponent(description);

/** RFC 5545 text escaping. */
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** Fold lines longer than 75 octets, as the spec asks. */
const fold = (line: string) => {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  out.push(rest);
  return out.join("\r\n");
};

export function buildIcs(siteUrl?: string) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Evan & Remy//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:evan-remy-wedding-${site.date}@evanandremy`,
    `DTSTAMP:${utcStamp(start)}`,
    `DTSTART:${utcStamp(start)}`,
    `DTEND:${utcStamp(end)}`,
    `SUMMARY:${icsText(title)}`,
    `LOCATION:${icsText(venueAddress)}`,
    `DESCRIPTION:${icsText(description + (siteUrl ? `\n${siteUrl}` : ""))}`,
    ...(siteUrl ? [`URL:${siteUrl}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
