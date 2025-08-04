import LoreCard from "./LoreCard";
import type { LoreCardData } from "@/types/lore";

type CardGridProps = {
  cards: LoreCardData[];
  onCardClick: (index: number) => void;
};

export default function CardGrid({ cards, onCardClick }: CardGridProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-10 justify-center">
        {cards.map((card, idx) => (
          <div key={card.name + idx} onClick={() => onCardClick(idx)} className="cursor-pointer flex">
            <LoreCard {...card} />
          </div>
        ))}
      </div>
    </div>
  );
}
