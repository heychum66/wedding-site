import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hanken",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const title = "Evan & Remy · September 18, 2027";
const description = "Evan and Remy are getting married at Edgewood Country Club in Pittsburgh. Formal attire. Kindly reply by August 1.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Evan & Remy" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#FAF6EC",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${hanken.variable}`}>
      <body>
        <noscript>
          <style>{`.spray.wait .lf,.spray.wait .bry{transform:none}.spray.wait .stem{stroke-dashoffset:0}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
