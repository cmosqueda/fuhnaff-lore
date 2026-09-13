import { useEffect, useState } from "react";
import { Tv } from "lucide-react";

type HeaderMenuProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  options: string[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedGame: string;
  setSelectedGame: (value: string) => void;
  gameOptions: string[];
  crtEnabled: boolean;
  setCrtEnabled: (value: boolean) => void;
};

function useClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

const selectClasses =
  "appearance-none bg-panel-raised text-parchment font-mono text-xs tracking-wide uppercase px-3 py-2 pr-7 rounded-sm border border-hairline focus:outline-none focus:border-marquee cursor-pointer";

export default function HeaderMenu({
  selectedCategory,
  setSelectedCategory,
  options,
  searchQuery,
  setSearchQuery,
  selectedGame,
  setSelectedGame,
  gameOptions,
  crtEnabled,
  setCrtEnabled,
}: HeaderMenuProps) {
  const time = useClock();

  return (
    <div className="w-full sticky top-0 z-20">
      {/* monitor bezel */}
      <div className="bg-panel border-b border-hairline px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-signal animate-rec-pulse" />
          </span>
          <span className="font-mono text-[10px] text-signal tracking-widest shrink-0">REC</span>
          <h1 className="font-display text-2xl sm:text-4xl tracking-wide text-parchment truncate">
            THE FNAF LORE ARCHIVE
          </h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:block font-mono text-xs text-muted tabular-nums">{time}</span>
          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            aria-pressed={crtEnabled}
            aria-label="Toggle CRT display effect"
            title="Toggle CRT display effect"
            className={`p-1.5 rounded-sm border transition-colors ${
              crtEnabled
                ? "border-marquee text-marquee bg-marquee/10"
                : "border-hairline text-muted hover:text-parchment hover:border-marquee-dim"
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* camera-switcher controls */}
      <div className="w-full bg-panel-raised/60 border-b border-hairline py-2.5 px-4 sm:px-8 flex flex-wrap justify-center sm:justify-start items-center gap-3">
        <div className="relative flex items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={selectClasses}
          >
            {options.map((cat) => (
              <option key={cat} value={cat} className="bg-panel text-parchment normal-case">
                {cat}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 text-marquee text-[10px]">▾</span>
        </div>

        <div className="relative flex items-center">
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className={selectClasses}
          >
            <option value="" className="bg-panel text-parchment normal-case">
              all games
            </option>
            {gameOptions.map((game) => (
              <option key={game} value={game} className="bg-panel text-parchment normal-case">
                {game}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 text-marquee text-[10px]">▾</span>
        </div>

        <div className="relative flex items-center flex-1 min-w-[140px] max-w-xs">
          <span className="absolute left-3 font-mono text-xs text-muted">$</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search feed_"
            className="w-full bg-panel-raised text-parchment font-mono text-xs pl-6 pr-3 py-2 rounded-sm border border-hairline placeholder:text-muted focus:outline-none focus:border-marquee"
          />
        </div>
      </div>
    </div>
  );
}
