import type { LoreCardData } from "@/types/lore";

export default function LoreCard({ name, image, shortDescription, category }: LoreCardData) {
  return (
    <div className="w-[220px] h-[330px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl overflow-hidden shadow-xl border-4 border-purple-700 flex flex-col">
      {/* Image Section */}
      <div className="h-[55%] bg-zinc-700 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm italic">No image</span>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-grow px-3 py-2 justify-between">
        <h2 className="text-lg font-bold text-white leading-tight truncate">{name}</h2>
        <p className="text-xs italic text-purple-300 mb-2">{category.toUpperCase()}</p>
        <p className="text-sm text-gray-300 line-clamp-3">{shortDescription}</p>
      </div>
    </div>
  );
}
