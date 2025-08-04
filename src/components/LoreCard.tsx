// src/components/LoreCard.tsx
import type { LoreCardData } from "../types/lore";

export default function LoreCard({ name, image, description }: LoreCardData) {
  return (
    <div className="bg-purple-950 text-white rounded-lg p-3 gap-3 shadow-lg max-w-xs flex flex-row sm:flex-col">
      {image && (
        <img src={image} alt={name} className="rounded-md w-[100px] h-full sm:w-auto sm:h-[200px] object-cover mb-3" />
      )}
      <div>
        <h2 className="text-lg sm:text-xl font-bold">{name}</h2>
        <p className="text-sm mt-2 text-gray-300">{description}</p>
      </div>
    </div>
  );
}
