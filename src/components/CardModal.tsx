import type { LoreCardData } from "@/types/lore";

type Props = {
  isOpen: boolean;
  card: LoreCardData;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export default function CardModal({ isOpen, card, onClose, onPrev, onNext, isFirst, isLast }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 text-white p-5 mx-4 rounded-lg max-w-lg w-full relative shadow-xl border-2 border-purple-700 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-800">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-4 text-white bg-red-500 px-2 py-1 rounded cursor-pointer"
        >
          Close
        </button>

        <div className="flex flex-col w-full h-[400px] overflow-y-scroll ">
          <img src={card.image} alt={card.name} className="w-full h-60 object-cover rounded my-10" />
          {/* texts */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{card.name}</h2>
            <p className="text-xs text-gray-400 italic">Category: {card.category}</p>
            <p className="text-sm text-gray-300 ">{card.shortDescription}</p>
          </div>
        </div>

        {/* pagination buttons */}
        <div className="flex justify-between mt-5">
          <button onClick={onPrev} disabled={isFirst} className="bg-purple-700 px-4 py-2 rounded disabled:opacity-40">
            Previous
          </button>
          <button onClick={onNext} disabled={isLast} className="bg-purple-700 px-4 py-2 rounded disabled:opacity-40">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
