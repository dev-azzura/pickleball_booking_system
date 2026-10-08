type CourtArtworkProps = {
  variant: "indoor" | "outdoor" | "championship";
  className?: string;
};

const courtColors = {
  indoor: { base: "#24584c", surface: "#397d69", accent: "#c5f277" },
  outdoor: { base: "#32634d", surface: "#579267", accent: "#d6f58a" },
  championship: { base: "#173f39", surface: "#24665a", accent: "#c5f277" },
};

export default function CourtArtwork({ variant, className = "" }: CourtArtworkProps) {
  const colors = courtColors[variant];

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 78% 10%, ${colors.accent}55, transparent 34%), linear-gradient(135deg, ${colors.base}, ${colors.surface})`,
        }}
      />
      <div aria-hidden="true" className="absolute -right-10 -top-16 size-56 rounded-full border border-white/10 sm:size-72" />
      <div aria-hidden="true" className="absolute -bottom-28 -left-8 size-64 rounded-full border border-white/10 sm:size-80" />
      <svg
        role="img"
        aria-label="Illustration of a green pickleball court with white court lines"
        viewBox="0 0 960 560"
        className="relative h-full w-full drop-shadow-[0_24px_30px_rgba(0,0,0,0.2)]"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Illustrative pickleball court preview</title>
        <g transform="translate(480 280) rotate(-8) translate(-480 -280)">
          <rect x="112" y="82" width="736" height="396" rx="12" fill={colors.base} stroke="white" strokeOpacity=".88" strokeWidth="5" />
          <rect x="150" y="118" width="660" height="324" fill={colors.surface} stroke="white" strokeOpacity=".82" strokeWidth="4" />
          <path d="M480 118v324M150 280h660M332 118v324M628 118v324" fill="none" stroke="white" strokeOpacity=".78" strokeWidth="4" />
          <path d="M455 118h50M455 442h50" stroke={colors.accent} strokeWidth="6" strokeLinecap="round" />
          <path d="M480 118v324" stroke="white" strokeOpacity=".25" strokeWidth="10" />
          <circle cx="696" cy="346" r="20" fill={colors.accent} />
          <circle cx="689" cy="339" r="6" fill="white" fillOpacity=".6" />
        </g>
      </svg>
      <span className="absolute bottom-3 left-3 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur sm:bottom-4 sm:left-4">
        Illustrative preview
      </span>
    </div>
  );
}
