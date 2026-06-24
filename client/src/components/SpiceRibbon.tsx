// =============================================================
// VISHVA FOODS — Spice Ribbon
// Infinite marquee of dish names. A loud, recurring brand motif.
// Content is duplicated so the -50% keyframe loops seamlessly.
// =============================================================

interface SpiceRibbonProps {
  items: string[];
  variant?: "turmeric" | "ink" | "chili" | "pista";
}

const STYLES: Record<NonNullable<SpiceRibbonProps["variant"]>, string> = {
  turmeric: "bg-[#E3A210] text-[#1F140D] border-y-2 border-[#1F140D]/12",
  ink: "bg-[#1F140D] text-[#FBF3E3] border-y border-[#E3A210]/25",
  chili: "bg-[#C5341B] text-[#FBF3E3] border-y border-[#FBF3E3]/20",
  pista: "bg-[#EAF1E2] text-[#2E7D46] border-y border-[#2E7D46]/15",
};

export default function SpiceRibbon({ items, variant = "turmeric" }: SpiceRibbonProps) {
  const loop = [...items, ...items];
  return (
    <div className={`marquee py-3.5 select-none ${STYLES[variant]}`} aria-hidden="true">
      <div className="marquee__track">
        {loop.map((item, i) => (
          <span key={i} className="marquee__item">
            {item}
            <span className="marquee__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
