import type { ReactNode } from "react";

/** Section title block with the leafy flourish underneath (the prototype injected it into every .shead). */
export default function SectionHead({ num, eyebrow, children }: { num?: string; eyebrow: ReactNode; children: ReactNode }) {
  return (
    <div className="shead">
      {num && <span className="span">{num}</span>}
      <span className="eyebrow">{eyebrow}</span>
      <h2>{children}</h2>
      <LeafRule />
    </div>
  );
}

const LEAF_RULE = `<g class="lr-l"><path d="M8 11 Q36 9 64 11" stroke="currentColor" stroke-width=".8" fill="none"/><g fill="currentColor" opacity=".9"><path d="M0 0 Q2.5600000000000005 -3.6 0 -7.2 Q-2.5600000000000005 -3.6 0 0Z" transform="translate(18 11) rotate(-62)"/><path d="M0 0 Q2.72 -3.8249999999999997 0 -7.6499999999999995 Q-2.72 -3.8249999999999997 0 0Z" transform="translate(26 11) rotate(-118)"/><path d="M0 0 Q3.04 -4.2749999999999995 0 -8.549999999999999 Q-3.04 -4.2749999999999995 0 0Z" transform="translate(36 11) rotate(-60)"/><path d="M0 0 Q3.2 -4.5 0 -9 Q-3.2 -4.5 0 0Z" transform="translate(45 11) rotate(-120)"/><path d="M0 0 Q3.3600000000000003 -4.7250000000000005 0 -9.450000000000001 Q-3.3600000000000003 -4.7250000000000005 0 0Z" transform="translate(55 11) rotate(-64)"/></g></g>
      <path d="M75 6.5 L79.5 11 L75 15.5 L70.5 11 Z" fill="none" stroke="currentColor" stroke-width=".9"/>
      <g class="lr-r"><path d="M142 11 Q114 9 86 11" stroke="currentColor" stroke-width=".8" fill="none"/><g fill="currentColor" opacity=".9"><path d="M0 0 Q2.5600000000000005 -3.6 0 -7.2 Q-2.5600000000000005 -3.6 0 0Z" transform="translate(132 11) rotate(62)"/><path d="M0 0 Q2.72 -3.8249999999999997 0 -7.6499999999999995 Q-2.72 -3.8249999999999997 0 0Z" transform="translate(124 11) rotate(118)"/><path d="M0 0 Q3.04 -4.2749999999999995 0 -8.549999999999999 Q-3.04 -4.2749999999999995 0 0Z" transform="translate(114 11) rotate(60)"/><path d="M0 0 Q3.2 -4.5 0 -9 Q-3.2 -4.5 0 0Z" transform="translate(105 11) rotate(120)"/><path d="M0 0 Q3.3600000000000003 -4.7250000000000005 0 -9.450000000000001 Q-3.3600000000000003 -4.7250000000000005 0 0Z" transform="translate(95 11) rotate(64)"/></g></g>`;

export function LeafRule() {
  return <svg className="leafrule" viewBox="0 0 150 22" aria-hidden="true" dangerouslySetInnerHTML={{ __html: LEAF_RULE }} />;
}
