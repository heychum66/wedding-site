import { site } from "@/content/site";
import Cats from "@/components/Cats";
import SiteNav from "@/components/SiteNav";
import Spray from "@/components/Spray";
import SprayAnimator from "@/components/SprayAnimator";

const { names } = site;

/** Every guest-facing tab shares the nav, the cats and the footer; switching tabs swaps only the middle. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="site">
      <Cats />
      <SprayAnimator />
      <SiteNav />
      <main>{children}</main>
      <footer>
        <Spray corner="bl" preset="hero-small" tone="light" index={8} />
        <Spray corner="br" preset="hero-small" tone="light" seed={9} index={9} />
        <div className="wrap">
          <div className="big">{names.first} &amp; {names.second}</div>
          <p>09.18.2027 · Pittsburgh, PA</p>
        </div>
      </footer>
    </div>
  );
}
