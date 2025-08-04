import type { LoreCardData } from "@/types/lore";

type Props = {
  card: LoreCardData;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export default function CardFullView({ card, onBack, onPrev, onNext, isFirst, isLast }: Props) {
  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-purple-800 py-4 px-6 flex justify-between items-center">
        <button onClick={onBack} className="bg-red-500 px-4 py-1 rounded font-bold">
          ← Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-center flex-1">{card.name}</h1>
        <div className="w-20" /> {/* spacer for symmetry */}
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center p-6 gap-4">
        {card.image && <img src={card.image} alt={card.name} className="w-full max-w-md h-72 object-cover rounded" />}
        <div className="text-center max-w-2xl">
          <p className="text-sm text-gray-300 mb-3">{card.shortDescription}</p>
          <p className="text-xs text-gray-400 italic">Category: {card.category}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-purple-950 py-4 px-6 flex justify-between items-center">
        <button onClick={onPrev} disabled={isFirst} className="bg-purple-700 px-4 py-2 rounded disabled:opacity-40">
          ← Previous
        </button>
        <button onClick={onNext} disabled={isLast} className="bg-purple-700 px-4 py-2 rounded disabled:opacity-40">
          Next →
        </button>
      </div>
    </div>
  );
}
