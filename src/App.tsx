import { useState, useEffect, useMemo } from "react";
import { characters as fallbackCharacters } from "./data/characters";
import { places as fallbackPlaces } from "./data/places";
import { movies as fallbackMovies } from "./data/movies";
import { books as fallbackBooks } from "./data/books";
import { games as fallbackGames } from "./data/games";
import type { BookData, CharacterData, GameData, LoreCardData, MovieData, PlaceData } from "./types/lore";
import HeaderMenu from "./components/HeaderMenu";
import CardGrid from "./components/CardGrid";
import CardFullView from "./components/CardFullView";
import Pagination from "./components/Pagination";
import Footer from "./components/Footer";

const categoryOptions = ["characters", "places", "movies", "books", "games"];

type LoreResponse = {
  characters: CharacterData[];
  places: PlaceData[];
  movies: MovieData[];
  books: BookData[];
  games: GameData[];
};

function App() {
  // Bundled data (from src/data) is the fallback: it's what `vite dev` shows
  // without `vercel dev`, and what stays on screen if /api/lore ever fails.
  const [characters, setCharacters] = useState<CharacterData[]>(fallbackCharacters);
  const [places, setPlaces] = useState<PlaceData[]>(fallbackPlaces);
  const [movies, setMovies] = useState<MovieData[]>(fallbackMovies);
  const [books, setBooks] = useState<BookData[]>(fallbackBooks);
  const [games, setGames] = useState<GameData[]>(fallbackGames);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/lore")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: LoreResponse) => {
        if (cancelled) return;
        setCharacters(data.characters);
        setPlaces(data.places);
        setMovies(data.movies);
        setBooks(data.books);
        setGames(data.games);
      })
      .catch((err) => {
        console.warn("Falling back to bundled lore data:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryMap: Record<string, LoreCardData[]> = useMemo(
    () => ({ characters, places, movies, books, games }),
    [characters, places, movies, books, games]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return localStorage.getItem("selectedCategory") || "characters";
  });

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState("");

  const categoryCards = useMemo(() => categoryMap[selectedCategory] || [], [categoryMap, selectedCategory]);

  // Which games show up as filter options depends on what's actually tagged
  // in the currently viewed category (movies/books/games don't carry
  // appearsIn today, so that dropdown naturally stays empty for them).
  const gameOptions = useMemo(() => {
    const set = new Set<string>();
    for (const card of categoryCards) {
      for (const game of card.appearsIn ?? []) set.add(game);
    }
    return [...set].sort();
  }, [categoryCards]);

  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return categoryCards.filter((card) => {
      const matchesQuery =
        !query || card.name.toLowerCase().includes(query) || card.shortDescription.toLowerCase().includes(query);
      const matchesGame = !selectedGame || (card.appearsIn ?? []).includes(selectedGame);
      return matchesQuery && matchesGame;
    });
  }, [categoryCards, searchQuery, selectedGame]);

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => setCurrentPage(1), [selectedCategory, searchQuery, selectedGame]);

  const itemsPerPage = 16;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const isModalOpen = selectedCardIndex !== null;

  return (
    <div className="w-full h-full bg-zinc-900">
      {/* header menu */}
      <HeaderMenu
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        options={categoryOptions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        gameOptions={gameOptions}
      />

      {/* card grid */}
      <CardGrid cards={paginatedCards} onCardClick={(index) => setSelectedCardIndex(startIndex + index)} />

      {isModalOpen && selectedCardIndex !== null && (
        <CardFullView
          card={filteredCards[selectedCardIndex]}
          onClose={() => setSelectedCardIndex(null)}
          onPrev={() => setSelectedCardIndex((i) => (i !== null ? i - 1 : i))}
          onNext={() => setSelectedCardIndex((i) => (i !== null ? i + 1 : i))}
          isFirst={selectedCardIndex === 0}
          isLast={selectedCardIndex === filteredCards.length - 1}
        />
      )}

      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      />

      {/* footer */}
      <Footer />
    </div>
  );
}

export default App;
