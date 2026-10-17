import { buildIcs } from "@/lib/calendar";

export function GET() {
  const prod = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = prod ? (prod.startsWith("http") ? prod : `https://${prod}`) : undefined;
  return new Response(buildIcs(siteUrl), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="evan-and-remy.ics"',
    },
  });
}
