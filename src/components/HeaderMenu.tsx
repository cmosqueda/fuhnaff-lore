type HeaderMenuProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  options: string[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedGame: string;
  setSelectedGame: (value: string) => void;
  gameOptions: string[];
};

export default function HeaderMenu({
  selectedCategory,
  setSelectedCategory,
  options,
  searchQuery,
  setSearchQuery,
  selectedGame,
  setSelectedGame,
  gameOptions,
}: HeaderMenuProps) {
  return (
    <div className="w-full sticky top-0 z-10">
      <div className="flex w-full bg-purple-800 justify-center py-5">
        <p className="text-white text-2xl sm:text-4xl uppercase font-extrabold text-center">The FNaF Lore Cards</p>
      </div>
      <div className="w-full bg-purple-950 py-2 flex flex-wrap justify-center items-center gap-4">
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

        <div className="flex items-center gap-2">
          <label className="text-white">Game:</label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="p-1 font-bold text-white hover:bg-purple-700"
          >
            <option value="" className="text-black bg-white">
              All
            </option>
            {gameOptions.map((game) => (
              <option key={game} value={game} className="text-black bg-white">
                {game}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="p-1 px-2 rounded font-bold text-white bg-purple-900 placeholder:text-purple-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  );
}
