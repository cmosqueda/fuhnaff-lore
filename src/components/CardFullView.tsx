import { useEffect, useRef, useState } from "react";
import { X, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import type { LoreCardData } from "@/types/lore";

type Props = {
  card: LoreCardData;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  crtEnabled: boolean;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[10px] text-muted tracking-widest uppercase shrink-0">{label}</span>
      <span className="font-mono text-xs text-parchment truncate">{value}</span>
    </div>
  );
}

const SWIPE_THRESHOLD = 50;
const CLOSE_ANIMATION_MS = 280;

export default function CardFullView({ card, onClose, onPrev, onNext, isFirst, isLast, crtEnabled }: Props) {
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [closing, setClosing] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goPrev = () => {
    if (isFirst || closing) return;
    setDirection("prev");
    onPrev();
  };
  const goNext = () => {
    if (isLast || closing) return;
    setDirection("next");
    onNext();
  };
  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, CLOSE_ANIMATION_MS);
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirst, isLast, closing]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta <= -SWIPE_THRESHOLD) goNext();
    else if (delta >= SWIPE_THRESHOLD) goPrev();
  }

  return (
    <div
      className={`fixed isolate inset-0 z-50 bg-void scanlines text-parchment overflow-y-auto [perspective:1000px] ${
        crtEnabled ? "crt-mode" : ""
      }`}
    >
      <button
        onClick={handleClose}
        aria-label="Close"
        className="glitch-self fixed top-4 right-4 z-10 text-parchment bg-signal hover:brightness-110 p-2 rounded-sm cursor-pointer"
      >
        <X />
      </button>

      <div
        key={card.name}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`min-h-screen w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 p-6 pt-16 lg:p-14 ${
          closing ? "animate-feed-out" : direction === "next" ? "animate-feed-in-next" : "animate-feed-in-prev"
        }`}
      >
        {/* picture */}
        <div className="relative viewfinder w-full lg:w-1/2 aspect-square bg-panel border border-hairline rounded-sm flex items-center justify-center overflow-hidden shrink-0">
          {card.image ? (
            <img src={card.image} alt={card.name} className="w-full h-full object-contain p-4" />
          ) : (
            <span className="font-mono text-muted text-xs uppercase tracking-wide">no signal</span>
          )}
        </div>

        {/* details */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div>
            <p className="font-mono text-[10px] text-marquee tracking-widest uppercase">{card.category}</p>
            <h1 className="font-display text-4xl sm:text-5xl leading-none text-parchment mt-1">{card.name}</h1>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-hairline pt-4">
            {card.category === "character" && (
              <>
                <Field label="Debut" value={card.game} />
                <Field label="Type" value={card.type} />
              </>
            )}
            {card.category === "place" && <Field label="Location" value={card.location} />}
            {(card.category === "movie" || card.category === "game") && (
              <Field label="Release" value={card.releaseDate} />
            )}
            {card.category === "book" && <Field label="Author" value={card.author} />}
          </div>

          {!!card.appearsIn?.length && (
            <div className="flex flex-wrap gap-1.5">
              {card.appearsIn.map((game) => (
                <span
                  key={game}
                  className="font-mono text-[10px] uppercase tracking-wide bg-static/20 text-static border border-static/40 px-2 py-0.5 rounded-sm"
                >
                  {game}
                </span>
              ))}
            </div>
          )}

          <p className="font-sans text-sm sm:text-base text-muted leading-relaxed">{card.shortDescription}</p>

          {/* navigation */}
          <div className="flex gap-3 mt-auto pt-6">
            <button
              onClick={goPrev}
              disabled={isFirst}
              aria-label="Previous (or press Left Arrow)"
              className="glitch-self bg-panel-raised border border-hairline hover:border-marquee px-4 py-2 rounded-sm disabled:opacity-30"
            >
              <ArrowBigLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              disabled={isLast}
              aria-label="Next (or press Right Arrow)"
              className="glitch-self bg-panel-raised border border-hairline hover:border-marquee px-4 py-2 rounded-sm disabled:opacity-30"
            >
              <ArrowBigRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
