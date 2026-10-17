import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Evan & Remy · September 18, 2027 · Pittsburgh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [regular, italic, hanken] = await Promise.all([
    readFile(join(process.cwd(), "assets/BodoniModa-Regular.ttf")),
    readFile(join(process.cwd(), "assets/BodoniModa-Italic.ttf")),
    readFile(join(process.cwd(), "assets/HankenGrotesk-Medium.ttf")),
  ]);
  const gold = "#9A7628";
  const rule = (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 170, height: 2, background: gold, opacity: 0.8 }} />
      <div style={{ width: 12, height: 12, border: `2px solid ${gold}`, transform: "rotate(45deg)" }} />
      <div style={{ width: 170, height: 2, background: gold, opacity: 0.8 }} />
    </div>
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF6EC",
          border: `2px solid ${gold}`,
          outline: "none",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 18, border: "1px solid rgba(154,118,40,.4)", display: "flex" }} />
        <div style={{ fontFamily: "Hanken", fontSize: 22, letterSpacing: 8, color: gold, textTransform: "uppercase", marginBottom: 26 }}>
          Together with their families
        </div>
        {rule}
        <div style={{ display: "flex", alignItems: "baseline", gap: 28, fontFamily: "Bodoni", fontSize: 150, color: "#0F2A63", lineHeight: 1, margin: "26px 0" }}>
          <span>Evan</span>
          <span style={{ fontFamily: "Bodoni Italic", fontSize: 90, color: gold }}>&amp;</span>
          <span>Remy</span>
        </div>
        {rule}
        <div style={{ fontFamily: "Bodoni Italic", fontSize: 40, color: "#13264F", marginTop: 30 }}>September 18, 2027 · Pittsburgh</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bodoni", data: regular, style: "normal", weight: 400 },
        { name: "Bodoni Italic", data: italic, style: "italic", weight: 400 },
        { name: "Hanken", data: hanken, style: "normal", weight: 500 },
      ],
    },
  );
}
