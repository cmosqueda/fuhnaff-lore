import { X, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import type { LoreCardData } from "@/types/lore";

type Props = {
  card: LoreCardData;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export default function CardFullView({ card, onClose, onPrev, onNext, isFirst, isLast }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-900 text-white overflow-y-auto">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-10 text-white bg-red-500 hover:bg-red-400 p-2 rounded cursor-pointer"
      >
        <X />
      </button>

      <div className="min-h-screen w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 lg:gap-10 p-6 pt-16 lg:p-12">
        {/* picture */}
        <div className="w-full lg:w-1/2 aspect-square bg-zinc-800 border-4 border-purple-700 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
          {card.image ? (
            <img src={card.image} alt={card.name} className="w-full h-full object-contain" />
          ) : (
            <span className="text-gray-400 text-sm italic">No image</span>
          )}
        </div>

        {/* details */}
        <div className="w-full lg:w-1/2 flex flex-col gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold">{card.name}</h1>
          <p className="text-xs text-gray-400 italic">Category: {card.category}</p>

          {card.category === "character" && (
            <p className="text-sm text-gray-400">
              Debut: {card.game} &middot; Type: {card.type}
            </p>
          )}
          {card.category === "place" && <p className="text-sm text-gray-400">Location: {card.location}</p>}
          {(card.category === "movie" || card.category === "game") && (
            <p className="text-sm text-gray-400">Release: {card.releaseDate}</p>
          )}
          {card.category === "book" && <p className="text-sm text-gray-400">Author: {card.author}</p>}

          {!!card.appearsIn?.length && (
            <div className="flex flex-wrap gap-1">
              {card.appearsIn.map((game) => (
                <span key={game} className="text-[10px] bg-purple-800 text-white px-2 py-0.5 rounded-full">
                  {game}
                </span>
              ))}
            </div>
          )}

          <p className="text-sm sm:text-base text-gray-300">{card.shortDescription}</p>

          {/* navigation */}
          <div className="flex gap-4 mt-auto pt-6">
            <button
              onClick={onPrev}
              disabled={isFirst}
              className="bg-purple-700 hover:bg-purple-500 px-4 py-2 rounded disabled:opacity-40"
            >
              <ArrowBigLeft />
            </button>
            <button
              onClick={onNext}
              disabled={isLast}
              className="bg-purple-700 hover:bg-purple-500 px-4 py-2 rounded disabled:opacity-40"
            >
              <ArrowBigRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
