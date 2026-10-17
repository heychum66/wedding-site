import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** The E&R monogram from the nav, as a square PNG for favicons. */
export async function monogram(px: number) {
  const italic = await readFile(join(process.cwd(), "assets/BodoniModa-Italic.ttf"));
  const regular = await readFile(join(process.cwd(), "assets/BodoniModa-Regular.ttf"));
  const ring = Math.max(1, Math.round(px / 32));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF6EC", borderRadius: "50%" }}>
        <div
          style={{
            width: px - ring * 2,
            height: px - ring * 2,
            borderRadius: "50%",
            border: `${ring}px solid #9A7628`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Bodoni Italic",
            fontSize: px * 0.4,
            color: "#13264F",
            lineHeight: 1,
          }}
        >
          E<span style={{ fontFamily: "Bodoni", color: "#9A7628", fontSize: px * 0.32, margin: `0 ${px * 0.01}px` }}>&amp;</span>R
        </div>
      </div>
    ),
    {
      width: px,
      height: px,
      fonts: [
        { name: "Bodoni Italic", data: italic, style: "italic", weight: 400 },
        { name: "Bodoni", data: regular, style: "normal", weight: 400 },
      ],
    },
  );
}
