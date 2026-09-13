import type { LoreCardData } from "@/types/lore";

export default function LoreCard({ name, image, shortDescription, category }: LoreCardData) {
  return (
    <div className="glitch-hover w-[150px] h-[230px] sm:w-[220px] sm:h-[340px] bg-panel rounded-sm overflow-hidden border border-hairline hover:border-marquee-dim transition-colors flex flex-col">
      {/* Image Section */}
      <div className="glitch-target relative viewfinder h-[55%] bg-panel-raised flex items-center justify-center overflow-hidden shrink-0">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-contain p-2" />
        ) : (
          <span className="font-mono text-muted text-[10px] uppercase tracking-wide">no signal</span>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-grow px-3 py-2.5 justify-between min-h-0">
        <div>
          <p className="font-mono text-[9px] text-marquee tracking-widest uppercase">{category}</p>
          <h2 className="glitch-text-target font-display text-lg sm:text-xl leading-tight text-parchment truncate mt-0.5">
            {name}
          </h2>
        </div>
        <p className="font-sans text-xs sm:text-sm text-muted line-clamp-3 mt-1">{shortDescription}</p>
      </div>
    </div>
  );
}
