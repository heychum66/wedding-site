import { spraySvg, type SprayPreset } from "@/lib/greenery";

type Props = {
  corner: "tl" | "tr" | "bl" | "br";
  preset: SprayPreset;
  index: number;
  seed?: number;
  tone?: "green" | "light";
};

/**
 * Server-rendered greenery spray. It starts in the "wait" state; <SprayAnimator/> draws the
 * stems and pops the leaves when it scrolls into view. Generating the SVG on the server keeps
 * the generator out of the browser bundle.
 */
export default function Spray({ corner, preset, index, seed = 1, tone = "green" }: Props) {
  return (
    <div
      className={`spray sp-${corner} wait`}
      data-spray={preset}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: spraySvg(preset, tone, seed, index) }}
    />
  );
}
