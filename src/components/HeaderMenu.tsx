type HeaderMenuProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  options: string[];
};

export default function HeaderMenu({ selectedCategory, setSelectedCategory, options }: HeaderMenuProps) {
  return (
    <div className="w-full sticky top-0">
      <div className="flex w-full bg-purple-800 justify-center py-5">
        <p className="text-white text-2xl sm:text-4xl uppercase font-extrabold text-center">The FNaF Lore Cards</p>
      </div>
      <div className="w-full bg-purple-950 py-2 flex justify-center items-center">
        <div className="flex items-center gap-2">
          <label className="text-white">View by:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-1 font-bold text-white hover:bg-purple-700"
          >
            {options.map((cat) => (
              <option key={cat} value={cat} className="text-black bg-white">
                {cat[0].toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
